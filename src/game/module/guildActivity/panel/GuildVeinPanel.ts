/**
 * 心法
 */
class GuildVeinPanel extends BaseTabView {
    private bgLoader: GLoader;
    private roleItemPanel: RoleItemPanel;
    private c1: fairygui.Controller;
    private veinItems: Array<GuildVeinItem>;
    private currentVeinItem: GuildVeinItem;
    private nameTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private attrTxt: fairygui.GTextField;
    private nextAttrTxt: fairygui.GTextField;
    private contributionTxt: fairygui.GTextField;
    private costCoinTxt: fairygui.GTextField;
    private studyBtn: fairygui.GButton;
    private oneKeyMc: UIMovieClip;

    private veinType: EGuildVeinType;
    private level: number = 1;
    private cfg: any;
    private nextCfg: any;
    private isMax: boolean;
    private isContributionEnough: boolean;
    private isCoinEnough: boolean;
    private fightPanel : FightPanel;

    public constructor() {
        super();
        this.veinItems = [];
    }

    protected initOptUI(): void {
        this.bgLoader = this.getGObject("loader_bg") as GLoader;
        this.roleItemPanel = <RoleItemPanel>this.getGObject("panel_roleItem");
        this.roleItemPanel.setSelectChangedFun(this.onRoleSelectChanged, this);
        this.c1 = this.getController("c1");
        let veinItem: GuildVeinItem;
        for (let i: number = 1; i <= 3; i++) {
            veinItem = <GuildVeinItem>this.getGObject("item_" + i);
            veinItem.type = i;
            this.veinItems.push(veinItem);

            veinItem.addClickListener(this.clickVeinItem, this);
        }
        this.currentVeinItem = <GuildVeinItem>this.getGObject("item_current");
        this.currentVeinItem.touchable = false;

        this.nameTxt = this.getGObject("txt_name").asTextField;
        this.levelTxt = this.getGObject("txt_level").asTextField;
        this.attrTxt = this.getGObject("txt_attr").asTextField;
        this.nextAttrTxt = this.getGObject("txt_nextAttr").asTextField;
        this.contributionTxt = this.getGObject("txt_contribution").asTextField;
        this.costCoinTxt = this.getGObject("txt_costCoin").asTextField;
        this.studyBtn = this.getGObject("btn_study").asButton;
        this.studyBtn.addClickListener(this.clickStudyBtn, this);

        this.getGObject("btn_link").addClickListener(this.clickLink, this);

        this.bgLoader.load(URLManager.getModuleImgUrl("vein_bg.jpg", PackNameEnum.GuildActivity));
        this.fightPanel = <FightPanel>this.getGObject("fight_panel");
    }

    public updateAll(data: any = null): void {
        this.roleItemPanel.updateRoles();
        //默认选中第一个
        this.clickVeinItem({"target": this.veinItems[0]});
        this.checkRoleItemRedTip();
        this.checkVeinItemRedTip();
        this.updateFight();
    }

    public updateCurrent(): void {
        this.updateCurrentItem(this.veinType);
        this.checkRoleItemRedTip();
        this.checkVeinItemRedTip();
        this.updateFight();
    }

    public get roleIndex(): number {
        return this.roleItemPanel.selectedIndex;
    }

    /**
     * 检测角色头像红点
     */
    public checkRoleItemRedTip(): void {
        for (let i: number = 0; i < CacheManager.role.roles.length; i++) {
            this.roleItemPanel.setRoleRedTip(i, CacheManager.guildActivity.isRoleVeinRedTip(i));
        }
    }

    private onRoleSelectChanged(index: number, data: any): void {
        this.updateCurrent();
    }

    private clickVeinItem(e: any): void {
        let veinItem: GuildVeinItem = e.target;
        for (let item of this.veinItems) {
            item.selected = item.type == veinItem.type;
        }
        this.currentVeinItem.type = veinItem.type;
        this.currentVeinItem.icon = veinItem.icon;
        this.updateCurrentItem(veinItem.type);
    }

    /**
     * 更新当前心法
     * @param {EGuildVeinType} type
     */
    private updateCurrentItem(type: EGuildVeinType): void {
        this.veinType = type;
        this.level = CacheManager.guildActivity.getVeinLevel(this.roleIndex, this.veinType);
        this.isMax = ConfigManager.guildVein.isMaxLevel(this.level);
        this.cfg = ConfigManager.guildVein.getByPKParams(type, this.level);
        if (this.isMax) {
            this.c1.selectedIndex = 2;
        } else {
            this.c1.selectedIndex = CacheManager.guildActivity.isUpgradeLimited(this.roleIndex, this.veinType) ? 0 : 1;
        }

        let costContribution: number = 0;
        if (this.level == 0) {//未学习
            this.nextCfg = ConfigManager.guildVein.getByPKParams(type, this.level + 1);
            this.attrTxt.text = "未学习";
            this.nextAttrTxt.text = WeaponUtil.getAttrDictStr(this.nextCfg.newAttrList, false);
            costContribution = this.cfg.costContribution;
            this.costCoinTxt.text = this.cfg.costCoin.toString();
        } else {
            this.attrTxt.text = WeaponUtil.getAttrDictStr(this.cfg.newAttrList, false);
            if (this.isMax) {
                costContribution = 0;
                this.costCoinTxt.text = "0";
                this.nextAttrTxt.text = "已满级";
            } else {
                this.nextCfg = ConfigManager.guildVein.getByPKParams(type, this.level + 1);
                costContribution = this.cfg.costContribution;
                this.costCoinTxt.text = this.cfg.costCoin.toString();
                this.nextAttrTxt.text = WeaponUtil.getAttrDictStr(this.nextCfg.newAttrList, false);
            }
        }
        this.nameTxt.text = ConfigManager.guildVein.getVeinName(this.veinType);
        this.levelTxt.text = `等级 ${this.level}`;
        if (this.isMax) {
            this.isContributionEnough = true;
            this.isCoinEnough = true;
        } else {
            this.isContributionEnough = CacheManager.guildNew.playerGuildInfo.contribution_I >= this.cfg.costContribution;
            this.isCoinEnough = MoneyUtil.checkEnough(EPriceUnit.EPriceUnitCoinBind, this.cfg.costCoin, false);
        }
        this.contributionTxt.text = MoneyUtil.getResourceText(CacheManager.guildNew.playerGuildInfo.contribution_I, costContribution);
        this.costCoinTxt.color = this.isCoinEnough ? 0xf2e1c0 : Color.Red2;
        this.showCanUpgradeEffect(this.isContributionEnough && this.isCoinEnough);
    }

    private clickStudyBtn(): void {
        if (!this.isContributionEnough) {
            Tip.showTip("贡献不足");
            return;
        }
        if (!this.isCoinEnough) {
            Tip.showTip("铜钱不足");
            return;
        }
        EventManager.dispatch(LocalEventEnum.GuildVeinUpgrade, {
            "veinType": this.veinType,
            "level": this.level, "roleIndex": this.roleIndex
        });
    }

    /**
     * 前往
     */
    private clickLink(): void {
        HomeUtil.open(ModuleEnum.GuildNew, false, {"tabType": PanelTabType.GuildNewManager}, ViewIndex.Two);
    }

    private showCanUpgradeEffect(isShow: boolean): void {
        // if (isShow) {
        //     if (this.oneKeyMc == null) {
        //         this.oneKeyMc = UIMovieManager.get(PackNameEnum.MCOneKey);
        //         this.oneKeyMc.x = -164;
        //         this.oneKeyMc.y = -222;
        //     }
        //     this.studyBtn.addChild(this.oneKeyMc);
        // } else {
        //     if (this.oneKeyMc != null) {
        //         this.oneKeyMc.removeFromParent();
        //     }
        // }
        App.DisplayUtils.addBtnEffect(this.studyBtn, isShow);
    }

    /**
     * 检测心法项红点
     */
    private checkVeinItemRedTip(): void {
        for (let item of this.veinItems) {
            CommonUtils.setBtnTips(item, CacheManager.guildActivity.isRoleVeinTypeRedTip(this.roleIndex, item.type));
        }
    }

    private updateFight() : void  {
        var fight = this.getFightByType(EGuildVeinType.EGuildVeinTypeGuBen) + this.getFightByType(EGuildVeinType.EGuildVeinTypeJianYi) + this.getFightByType(EGuildVeinType.EGuildVeinTypeTieBi);
        this.fightPanel.updateValue(fight);
    }

    private getFightByType(type: EGuildVeinType) : number {
        let level = CacheManager.guildActivity.getVeinLevel(this.roleIndex, type);
        let cfg = ConfigManager.guildVein.getByPKParams(type, level);
        if (level == 0) {//未学习
            return 0;
        }
        if(cfg) {
            return WeaponUtil.getCombat(WeaponUtil.getAttrDict(cfg.newAttrList));
        }

    }
}