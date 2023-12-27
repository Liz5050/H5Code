/**
 * 技能面板技能列表项
 */
class SkillListItem extends ListRenderer {
	private skillIconLoader: GLoader;
    private skillNameTxt: fairygui.GTextField;
    private skillOpenTxt: fairygui.GTextField;
    private skillDescTxt: fairygui.GRichTextField;
    private controller1: fairygui.Controller;
    private controller2: fairygui.Controller;
    private skillCostTxt: fairygui.GRichTextField;
    private skillLevelTxt: fairygui.GRichTextField;
    private coinImg: fairygui.GImage;
    private onekeyBtn: fairygui.GButton;
    private successMc:UIMovieClip;

    private _skillData: SkillData;
    private _skillCfg: any;//技能配置
    private _skillId:number;
    private _isOpen:boolean;
    private _roleIndex:number;

    private _enough: boolean;
    private _isLevelMatch: boolean;
    private _isMaxLevel: boolean;

    public constructor() {
		super();
	}

    protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);

        this.controller1 = this.getController("c1");
        this.controller2 = this.getController("c2");
        this.skillIconLoader = this.getChild("loader_skillDisplay") as GLoader;
        this.skillNameTxt = this.getChild("txt_skillName").asTextField;
        this.skillOpenTxt = this.getChild("txt_open").asTextField;
        this.skillDescTxt = this.getChild("txt_desc").asRichTextField;
        this.skillLevelTxt = this.getChild("txt_skillLevel").asRichTextField;
        this.skillCostTxt = this.getChild("txt_skillCost").asRichTextField;
        this.coinImg = this.getChild("img_coin").asImage;
        this.onekeyBtn = this.getChild("btn_levelUp").asButton;
        this.onekeyBtn.addClickListener(this.onClick, this);
    }

	public setData(data: any): void {
        this._roleIndex = data.index;
        let skillCfg:any = data.data;
		this._skillCfg = skillCfg;
		this._skillId = skillCfg.skillId;
		this._skillData = CacheManager.skill.getSkill(skillCfg.skillId, data.index);
		let skillLevel:number = this._skillData ? this._skillData.level : 0;
        this.skillLevelTxt.text = "Lv." + skillLevel;

		let iconUrl:string = URLManager.getIconUrl(skillCfg.skillIcon, URLManager.SKIL_ICON);
		this.skillIconLoader.load(iconUrl);
        this.isOpen = this._skillData != null;
        this.skillCostTxt.visible = this.coinImg.visible = this.onekeyBtn.visible = this.skillLevelTxt.visible = this.isOpen;
		this.skillNameTxt.text = skillCfg.skillName;
		this.skillOpenTxt.text = skillCfg.openDesc;
		let upgradeData:any = ConfigManager.skill.getSkillUpgrade(this._skillId, skillLevel);
        if (!upgradeData) {//0级的情况
            upgradeData = ConfigManager.skill.getSkillUpgrade(this._skillId, skillLevel+1);
        }
        if (upgradeData)
            this.skillDescTxt.text = App.StringUtils.substitude(skillCfg.skillDescription
                , upgradeData.skillEffect1 + "%"
                , upgradeData.skillEffect2
                , upgradeData.skillEffect3
                , (upgradeData.skillEffect4 / 10) + "%");
	}

	public updateCostAndStatus(myCoin:number, myLv:number, myRoleState:number):void {
        this._isMaxLevel = this._isOpen && this.skillData.isMaxLevel;
        let upgradeData:any = this._isOpen && this.skillData.skillUpgrade;
        this._isLevelMatch = this._isOpen && upgradeData && (upgradeData.playerLevel < 10000 && upgradeData.skillLevel <= myLv || upgradeData.playerLevel / 10000 <= myRoleState);
        let cost:number = upgradeData ? upgradeData.needCoin : 0;
        let nextLv:number = this.skillData && this.skillData.skillUpgrade ? this.skillData.level + 2 : 0;
        let nextUpgradeData:any = ConfigManager.skill.getSkillUpgrade(this._skillId, nextLv);
        if (this._isOpen)
            while (nextUpgradeData && myCoin > cost && SkillConfig.upgradeLevelMatch(nextUpgradeData.playerLevel, nextUpgradeData.skillLevel, myLv, myRoleState)) {//等级判断做转生的时候要加上处理
                if (myCoin > cost + nextUpgradeData.needCoin) {
                    cost += nextUpgradeData.needCoin;
                } else {
                    break;
                }
                nextLv++;
                nextUpgradeData = ConfigManager.skill.getSkillUpgrade(this._skillId, nextLv);
            }
        this._enough = upgradeData && cost <= myCoin;
        let color:any = this._enough ? "#0df14b" : "#df140f";
        this.skillCostTxt.text = !this._isMaxLevel ? HtmlUtil.html(cost+"", color): "";
        let btnEnable:boolean = !this._isMaxLevel && this._isLevelMatch && this._enough;
        // this.coinImg.visible = !isMaxLevel;
        App.DisplayUtils.grayButton(this.onekeyBtn, !btnEnable, !btnEnable);
        if (!this._isLevelMatch && upgradeData) {
            let desc:string = upgradeData.playerLevel > 9999
                ? App.StringUtils.substitude(LangSkill.LANG3, upgradeData.playerLevel / 10000)
                : App.StringUtils.substitude(LangSkill.LANG2, upgradeData.playerLevel);
            this.onekeyBtn.text = desc;
        } else {
            this.onekeyBtn.text = LangSkill.LANG1;
        }
	}

	public upgradeSucc(oldSkillLevel:number, newSkillLevel:number):void {
        if (oldSkillLevel > 0) {
            if (this.successMc == null) {
                this.successMc = UIMovieManager.get(PackNameEnum.MCStrengthen);
                this.successMc.x = -192;
                this.successMc.y = -192;
            }
            if (this.successMc.parent == null)
                this.addChild(this.successMc);
            this.successMc.setPlaySettings(0, -1, 1, -1, function (): void {
                this.successMc.removeFromParent();
                this.successMc.playing = false;
            }, this);
            this.successMc.playing = true;

            let oldUpgradeData:any = ConfigManager.skill.getSkillUpgrade(this._skillId, oldSkillLevel);
            let newUpgradeData:any = ConfigManager.skill.getSkillUpgrade(this._skillId, newSkillLevel);
            if (oldUpgradeData && newUpgradeData) {
                let baseTips:string = ConfigManager.skill.getSkillUpgradeTips(this._skillId);
                let tips:string = App.StringUtils.substitude(baseTips
                    , newUpgradeData.skillEffect1 > 0 ? (newUpgradeData.skillEffect1 - (oldUpgradeData.skillEffect1 || 0)) + "%" : 0
                    , newUpgradeData.skillEffect2 > 0 ? newUpgradeData.skillEffect2 - (oldUpgradeData.skillEffect2 || 0) : 0
                    , newUpgradeData.skillEffect3 > 0 ? newUpgradeData.skillEffect3 - (oldUpgradeData.skillEffect3 || 0) : 0
                    , newUpgradeData.skillEffect4 > 0 ? (newUpgradeData.skillEffect4 - (oldUpgradeData.skillEffect4 || 0))/10 + "%" : 0
                );
                this.flyTips(tips);
            }
        }
    }

    private flyTips(tips:string):void {
        let tipText: fairygui.GTextField = ObjectPool.pop("fairygui.GRichTextField");
        tipText.align = fairygui.AlignType.Center;
        tipText.text = HtmlUtil.html(tips, "#0df14b", false, 22);

        let pos:egret.Point = this.localToGlobal((this.width - tipText.width) >> 1, 0);
        tipText.displayObject.x = pos.x;
        tipText.displayObject.y = pos.y;
        LayerManager.UI_Tips.addChild(tipText);

        egret.Tween.get(tipText.displayObject).to({y:pos.y-50}, 800, egret.Ease.sineOut).call(()=>{
            egret.Tween.removeTweens(tipText.displayObject);
            if (tipText.parent) {
                tipText.parent.removeChild(tipText);
                ObjectPool.push(tipText);
            }
        }, this);
    }

	private onClick():void {
        App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
		EventManager.dispatch(LocalEventEnum.SkillUpgradeOneKey, this._skillId, this._roleIndex);
    }

	public get skillData():SkillData{
		return this._skillData;
	}

	public get skillId():number{
		return this._skillId;
	}

	public get skillLevel():number{
		return this._skillData ? this._skillData.level : 0;
	}

	public set isOpen(isOpen: boolean) {
		this.controller1.setSelectedIndex(isOpen ? 1 : 0);
		this._isOpen = isOpen;
	}

	public get isOpen():boolean {
		return this._isOpen;
	}

	public get canUpgrade():boolean {
        return this.onekeyBtn.touchable;
    }

    public setSelect(isSelect: boolean) {
        this._isOpen && this.controller2.setSelectedIndex(isSelect ? 1 : 0);
    }

    public get enough(): boolean{
        return this._enough;
    }

    public get isLevelMatch(): boolean{
        return this._isLevelMatch;
    }

    public get isMaxLevel(): boolean{
        return this._isMaxLevel;
    }
}