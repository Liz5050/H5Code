/**
 * 法器升星界面
*/

class MagicStrengthenPanel extends BaseTabView
{
    private activeBtn : fairygui.GButton;
    private skillBtn : fairygui.GButton;
    private btnDetail : fairygui.GButton;
    private changeBtn: fairygui.GButton;
    private starList : fairygui.GList;
    private fightPanel : FightPanel;
    private levelTxt : fairygui.GTextField;
    private costTxt : fairygui.GRichTextField;
    private currentAttrText : fairygui.GRichTextField;
    private nextAttrText : fairygui.GRichTextField;
    private nextSkillText : fairygui.GTextField;
    private maxAttrText : fairygui.GRichTextField;

    private fullImg : fairygui.GImage;
    private cost_loader : GLoader;
    private modelContainer: fairygui.GComponent;
    private modelBody : egret.DisplayObjectContainer;
    private model : ModelShow;
    private c1 : fairygui.Controller;

    private level : number;
    private starNum : number;

    private mcUpStar: UIMovieClip;
	private mcSuccess: UIMovieClip;

    private costCode : number;
    private costNum : number;
    private itemNum : number;

    private title : string[] = ["攻击", "破甲", "生命", "防御"];

    private green : Color = 0xf2e1c0;
    private white : Color = 0x0df14b;

    private onekey : boolean;

    public constructor() {
        super();
    }

    public initOptUI() : void {
        this.c1 = this.getController("c1");
        this.activeBtn = this.getGObject("btn_active").asButton;
        this.btnDetail = this.getGObject("btn_attr").asButton;
        this.changeBtn = this.getGObject("btn_change").asButton;
        this.skillBtn = this.getGObject("btn_skillshow").asButton;
        this.skillBtn.addClickListener(this.OnClickInfo, this);
        this.starList = this.getGObject("starList").asList;
        this.fightPanel = <FightPanel>this.getGObject("fight_panel");
        this.levelTxt = this.getGObject("txt_lvl").asTextField;
        this.costTxt = this.getGObject("txt_cost").asRichTextField;
        this.currentAttrText = this.getGObject("txt_attr").asRichTextField;
        this.nextAttrText = this.getGObject("txt_attrNext").asRichTextField;
        this.maxAttrText = this.getGObject("txt_attr2").asRichTextField;
        this.nextSkillText = this.getGObject("txt_nextskill").asTextField;
        this.fullImg = this.getGObject("full_img").asImage;
        this.cost_loader =<GLoader>this.getGObject("cost_loader");
        this.modelContainer = this.getGObject("weaponmodel").asCom;
        this.model = new ModelShow(EShape.EMagicweapon);
        this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
        this.modelBody.addChild(this.model);
        (this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);
		this.modelContainer.setScale(1.4, 1.4);
        this.starListAddItem();
        this.level = 1;
        this.starNum = 0;
        this.activeBtn.addClickListener(this.clickStrengthen, this);
        this.btnDetail.addClickListener(this.OnClickDetail, this);
        this.changeBtn.addClickListener(this.clickChangeBtn, this);
        this.cost_loader.addClickListener(this.onLoaderClick , this);
        this.model.setData(6);
        this.onekey = false;
    }

    public addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.MagicWeaponUpdate , this.starUpDeal,this);
    }

    public UpdateCostTxt() : void {

        this.costCode =  CacheManager.magicWeaponStrengthen.cfg.useItemCode;
        this.level = CacheManager.magicWeaponStrengthen.cfg.stage;
        this.starNum = CacheManager.magicWeaponStrengthen.cfg.star;
        let itemCfg: any = ConfigManager.item.getByPk(this.costCode);
        this.cost_loader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
        this.costNum = CacheManager.magicWeaponStrengthen.cfg.useItemNum;
        if(!this.costNum) {
            this.costNum = 0;
        }
        let costitems:ItemData = CacheManager.pack.propCache.getItemByCode(this.costCode);
        if(costitems){
            this.itemNum = costitems.getItemAmount();
        }
        else{
            this.itemNum = 0;
        }
        
        this.costTxt.text = this.itemNum + "/" + this.costNum  ;

        if(this.itemNum >= this.costNum) {
            this.costTxt.color = Color.Green2;

        }
        else
        {
            this.costTxt.color = Color.Red2;
            this.onekey = false;
        }

    }

    public updateWarFare() : void {
        this.fightPanel.updateValue(CacheManager.magicWeaponStrengthen.shapeInfo.warfare_L64);
    }

    public updateStarAndStage() : void {
        let cfg = CacheManager.magicWeaponStrengthen.cfg;
        this.setLvlTxt(cfg.stage)
    }

    public SetAttr() : void {
        if(CacheManager.magicWeaponStrengthen.isMax) {
            this.setCurAttr(CacheManager.magicWeaponStrengthen.cfg.attrList);
            this.setNextAttr(CacheManager.magicWeaponStrengthen.cfg.attrList);
        }
        else {
            this.setCurAttr(CacheManager.magicWeaponStrengthen.cfg.attrList);
            this.setNextAttr(CacheManager.magicWeaponStrengthen.nextCfg.attrList);
        }
    }
    
    public updateFull() : void {
        this.fullImg.visible = CacheManager.magicWeaponStrengthen.isMax;
        if(this.fullImg.visible) {
            this.c1.setSelectedIndex(1);
        }
        else{
            this.c1.setSelectedIndex(0);
        }
    }

    public updateAll() : void {
        this.updateNextSkill();
        this.UpdateCostTxt();
        this.SetAttr();
        this.updateStarAndStage();
        this.updateWarFare();
        this.updateFull();
        this.setStarListNum(this.starNum);
        this.setBtnTips();
        this.oneKeyUp();
    }

    public updateAfterStarUp() : void {
        this.updateStarAndStage();
        this.setStarListNum(this.starNum);
        this.setBtnTips();
    }

    private starListAddItem() : void {
		this.starList.removeChildrenToPool();
		for (let i = 0; i < 10; i++) {
			let item: fairygui.GComponent = this.starList.addItemFromPool().asCom;
		}
    }

    private setStarListNum( num : number ) : void {
        for(let i = 0; i < 10; i++) {
            let item: fairygui.GComponent = this.starList.getChildAt(i).asCom;
            let controller: fairygui.Controller = item.getController("c1");
			controller.selectedIndex = i < num ? 1 : 0;
        }
        if(num == 10) {
            this.activeBtn.title = "升  阶";
            this.onekey = false;
        }
        else{
            if(this.onekey) {
                this.activeBtn.title = "停  止";
            }
            else{
                this.activeBtn.title = "一键升星";
            }
        }
    }

    private setLvlTxt( num : number ) : void {
        this.levelTxt.text = FuiUtil.getStageStr(num) + "阶";


    }

    private clickStrengthen() : void {
        if(CacheManager.magicWeaponStrengthen.checkItemUseEnough()) {
            if(this.starNum < 10 || !this.starNum) {
                this.onekey = true;
            }
            EventManager.dispatch(LocalEventEnum.UpLevelMgaicWeapon);
        }
        else {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.costCode });
            let itemCfg: any = ConfigManager.item.getByPk(this.costCode);
            Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
        }
    }

    private playerUpStar(isUpLevel : boolean): void {
        this.starNum = CacheManager.magicWeaponStrengthen.cfg.star;
        this.model.setData(6);
        if (this.mcUpStar == null) {
			this.mcUpStar = UIMovieManager.get(PackNameEnum.MCStar);//FuiUtil.createMc("MCStar", PackNameEnum.MovieClip);
			this.mcUpStar.x = -232;
			this.mcUpStar.y = -232;
		}
        this.setStarListNum(this.starNum);
        this.updateWarFare();
        this.updateNextSkill();
        this.UpdateCostTxt();
        this.updateFull();
        this.SetAttr();

        if(this.starNum) {
            let starItem: fairygui.GComponent = this.starList.getChildAt(this.starNum - 1).asCom;
            starItem.addChild(this.mcUpStar);
            this.mcUpStar.setPlaySettings(0, -1, 1, -1, function (): void {
			    this.mcUpStar.removeFromParent();
			    this.mcUpStar.playing = false;
		    	if (isUpLevel) {
	    			this.playerSuccessMc();
                  this.updateAfterStarUp()
	    		} else {
	    			this.updateAfterStarUp()
	    		}
		    }, this);
	    	this.mcUpStar.playing = true;
        }
        else{
            if (isUpLevel) {
	    		this.playerSuccessMc();
                this.updateAfterStarUp()
	    	} else {
	    		this.updateAfterStarUp()
			}
        }
    }



    private playerSuccessMc(): void {
		if (this.mcSuccess == null) {
			this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
		}
        this.mcSuccess.x = this.modelContainer.x  - 280;
		this.mcSuccess.y = this.modelContainer.y ;
		this.addChild(this.mcSuccess);
		this.mcSuccess.alpha = 1;
		egret.Tween.removeTweens(this.mcSuccess);
		this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
			egret.Tween.get(this.mcSuccess).to({ alpha: 0 }, 2000).call(() => {
                console.log("升阶成功--------------------------");
				this.mcSuccess.removeFromParent();
				this.mcSuccess.playing = false;
			})
		}, this);
		this.mcSuccess.playing = true;
	}

    private OnClickInfo() : void {
        EventManager.dispatch(UIEventEnum.SkillInfoOpen);
    }

    private OnClickDetail() : void {
        EventManager.dispatch(UIEventEnum.MagicWeaponDetailOpen);
    }

    private setCurAttr(attr : any) : void {
        this.currentAttrText.text = "";
        let str : string = "";
        let arr =  WeaponUtil.getAttrArray(attr);
        for(let i=0; i<arr.length; i++) {
            let name = GameDef.EJewelName[arr[i][0]][0];
            str += name +": "+ arr[i][1] + "\n";
        }
        this.currentAttrText.text = str;
        this.maxAttrText.text = str;
    }
    
    private setNextAttr(attr : any) : void {
        this.nextAttrText.text = "";
        let str : string = "";
        let arr =  WeaponUtil.getAttrArray(attr);
        for(let i=0; i<arr.length; i++) {
            let name = GameDef.EJewelName[arr[i][0]][0];
            str += name +": "+ arr[i][1] + "\n";
        }
        this.nextAttrText.text = str;
    }

    private starUpDeal() : void {
        if(CacheManager.magicWeaponStrengthen.cfg.stage > this.level) {
            this.playerUpStar(true);
        }
        else{
            this.playerUpStar(false);
        }
    }

    private updateNextSkill() : void {
        if(CacheManager.magicWeaponStrengthen.cfg.stage < 5 ) {
            this.nextSkillText.text = "";
        }
        else {
            let nextSkill = ConfigManager.mgShapeOpen.getNextSkillByShapeLevel(EShape.EShapeSpirit , CacheManager.magicWeaponStrengthen.shapeInfo.level_I);
            if(nextSkill == 0){
                this.nextSkillText.text = "";
            }
            else{
                let cfgskill = ConfigManager.skill.getSkill(nextSkill);
                let levelneed = ConfigManager.mgShapeOpen.getOpenLevel(EShape.EShapeSpirit , nextSkill);
                let cfgShape = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeSpirit ,levelneed);
                this.nextSkillText.text = cfgShape.stage + "阶解锁" + cfgskill.skillName;
            }
        }
    }

    public setBtnTips():void{
        CommonUtils.setBtnTips(this.activeBtn,CacheManager.magicWeaponStrengthen.checkItemUseEnough() && !this.onekey); 
        CommonUtils.setBtnTips(this.changeBtn,CacheManager.magicWeaponChange.checkTips());
    }

    public hide():void {
		super.hide();
        if(this.mcSuccess) {
            this.mcSuccess.alpha = 0;
        }
        EventManager.dispatch(LocalEventEnum.MagicUIClose);
	}

    public onLoaderClick() : void{
        let rewardItem:ItemData = ConfigManager.const.getSpiritCopyReward();
        ToolTipManager.showByCode(rewardItem.getCode());
    }

    private clickChangeBtn(): void{
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWeaponChange);
    }

    private oneKeyUp() : void {
        if(this.onekey) {
            if(CacheManager.magicWeaponStrengthen.checkItemUseEnough()) {
                EventManager.dispatch(LocalEventEnum.UpLevelMgaicWeapon);
            }
        }
    }

    public onHide(): void {
		super.onHide();
        this.onekey = false;
	}

}