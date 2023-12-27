/**
 * 爵位界面
 * @author zhh
 * @time 2018-07-03 11:48:48
 */
class TrainNobilityPanel extends BaseTabView{
    

    private baseItem:BaseItem;
    
    private loaderIco:GLoader;
    private loaderName:GLoader;
    private loaderCur:GLoader;
    private loaderNext:GLoader;
    private loaderNameFix:GLoader;
    private loaderBg:GLoader;
    private loaderEff:GLoader;
    private txtAttr1:fairygui.GRichTextField;
    private txtAttr2:fairygui.GRichTextField;
    private txtLevel1:fairygui.GRichTextField;
    private txtLevel2:fairygui.GRichTextField;
    private txtFight:fairygui.GTextField;

    //private trainCom0:TrainExpRewardCom;
    //private trainCom1:TrainExpRewardCom;
    //private trainCom2:TrainExpRewardCom;

    //private mcUpgrade:UIMovieClip;
    private mcGetStage:UIMovieClip;
    private stageMcCnt:fairygui.GComponent;

    private btnUpgrade:fairygui.GButton;
    private btnGetReward:fairygui.GButton;
    private listReward:List;
    //private listMission:List;
    private progressBar:ProgressBar1;
    private progressBarExp:UIProgressBar;
    private c1:fairygui.Controller;

    private curStrengthInfo:any;
    private curLevel:number = 0;

    private proRewardView:TrainExpProgressView;

    
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.loaderName = <GLoader>this.getGObject("loader_name");
        this.loaderNameFix = <GLoader>this.getGObject("loader_name_fix");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderEff = <GLoader>this.getGObject("loader_eff");
        this.loaderCur = <GLoader>this.getGObject("loader_cur");
        this.loaderNext = <GLoader>this.getGObject("loader_next");
      
        this.txtAttr1 = this.getGObject("txt_attr1").asRichTextField;
        this.txtAttr2 = this.getGObject("txt_attr2").asRichTextField;
        this.txtLevel1 = this.getGObject("txt_level1").asRichTextField;
        this.txtLevel2 = this.getGObject("txt_level2").asRichTextField;
        let fightCom:fairygui.GComponent = this.getGObject("panel_fight").asCom;
        this.txtFight = fightCom.getChild("txt_fight").asTextField;

        this.stageMcCnt = this.getGObject("cnt").asCom;

        this.proRewardView = new TrainExpProgressView(this.getGObject("pro_reward_com").asCom);
        
        this.btnUpgrade = this.getGObject("btn_upgrade").asButton;
        this.btnGetReward = this.getGObject("btn_getReward").asButton;
        this.c1 = this.getController("c1");
        this.listReward = new List(this.getGObject("list_reward").asList);
        //this.listMission = new List(this.getGObject("list_mission").asList);
        this.progressBar = <ProgressBar1>this.getGObject("progressBar");

        this.loaderBg.load(URLManager.getModuleImgUrl("nobility/bg.jpg",PackNameEnum.Train));
        this.loaderEff.load(URLManager.getModuleImgUrl("nobility/eff_ligth.png",PackNameEnum.Train));
      
        this.btnUpgrade.addClickListener(this.onGUIBtnClick, this);
        this.btnGetReward.addClickListener(this.onGUIBtnClick, this);
        
        this.listReward.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //this.listMission.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
      
       GuideTargetManager.reg(GuideTargetName.TrainNobilityPanelUpgradeBtn, this.btnUpgrade);

	}

    public updateAll(data?:any):void{
        this.curLevel = CacheManager.nobility.curLevel;        
        this.curStrengthInfo = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,this.curLevel);
        this.txtFight.text = CacheManager.nobility.warfare+"";//WeaponUtil.getCombat(WeaponUtil.getAttrDict(this.curStrengthInfo.attrList)) + "";
        let curAttrStr:string = WeaponUtil.getAttrText(WeaponUtil.getAttrArray(this.curStrengthInfo.attrList),false,null,null,true,false);
        this.txtAttr1.text = curAttrStr;
        let curStar:number = ObjectUtil.getConfigVal(this.curStrengthInfo,"star",0);
        this.txtLevel1.text = curStar + "等";
        let idx:number = 0;
        let icoStage:number = CacheManager.nobility.getStageIcoId(this.curStrengthInfo.stage);
        this.loaderIco.load(URLManager.getNobilityIco(icoStage));
        let nameUrl:string = URLManager.getNobilityName(icoStage,false);
        this.loaderName.load(nameUrl);
        this.loaderCur.load(nameUrl);
        if(CacheManager.nobility.isHasFixName(this.curStrengthInfo.stage)){
            this.loaderNameFix.load(URLManager.getNobilityName(this.curStrengthInfo.stage%NoBilityCache.MAX_NAME_STAGE,true));
        }else{
            this.loaderNameFix.clear();
        }
        let myMoney:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitTrainScore);
        
        let isHas:boolean = this.updateRewards();

        if(!CacheManager.nobility.isMax){
            let curInfo:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,this.curLevel);
            this.progressBar.setValue(myMoney,curInfo.useMoneyNum);
            let nextInfo:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,this.curLevel+1);
            let nextStar:number = ObjectUtil.getConfigVal(nextInfo,"star",0);
            this.txtLevel2.text = nextStar + "等";
            let nextAttrStr:string = WeaponUtil.getAttrText(WeaponUtil.getAttrArray(nextInfo.attrList),false,null,null,true,false,false);
            this.txtAttr2.text = nextAttrStr;
            let nameNextUrl:string = URLManager.getNobilityName(CacheManager.nobility.getStageIcoId(nextInfo.stage),false);
            this.loaderNext.load(nameNextUrl);
        }else{
            this.progressBar.setValue(100,100);
            idx = isHas?2:1;
        }          
        let isCanUpgrade:boolean = CacheManager.nobility.isCanUpgrade();
        App.DisplayUtils.addBtnEffect(this.btnUpgrade,isCanUpgrade); 
        CommonUtils.setBtnTips(this.btnUpgrade,isCanUpgrade);
        
        this.c1.setSelectedIndex(idx);
        
    }

    private updateRewards():boolean{        
        let rewardItems:ItemData[] = RewardUtil.getStandeRewards(this.curStrengthInfo.autoReward);
        this.listReward.data = rewardItems;
        
        //this.listMission.setVirtual(dailyEvents);        

        let unGetLv:number = CacheManager.nobility.getMinUnGetLevel();
        let isHasStageReward:boolean = unGetLv>0;	
        this.btnGetReward.visible = isHasStageReward;    
        let getRewardInfo:any;    
        let cfgInfo:any = ConfigManager.mgStrengthenEx.getStageRewardInfo(EStrengthenExType.EStrengthenExTypeLord,this.curLevel);
        let itemNameText:string = "";
        if(isHasStageReward){
            getRewardInfo = ConfigManager.mgStrengthenEx.getByTypeAndLevel(EStrengthenExType.EStrengthenExTypeLord,unGetLv);
        }else{             
            getRewardInfo = cfgInfo.info;
            let clr:string = "#f2f232";
            itemNameText = HtmlUtil.html("再提升",clr)+HtmlUtil.html(""+cfgInfo.count,"#4afe7d")+HtmlUtil.html("等",clr,true)+ HtmlUtil.html("可领取",clr)
        }

        if(getRewardInfo && getRewardInfo.getReward){
            this.baseItem.visible = true;
            let item:ItemData = RewardUtil.getReward(getRewardInfo.getReward);
            this.baseItem.itemData = item; 
        }else{
            this.baseItem.visible = false;
        }
        this.baseItem.setNameText(itemNameText);        
        CommonUtils.setBtnTips(this.baseItem,isHasStageReward);
        this.addEffect(isHasStageReward);
        this.proRewardView.updateAll();
        return isHasStageReward;
    }
    
    private addEffect(isAdd:Boolean):void{
        if(isAdd){
            if(!this.mcGetStage){
                this.mcGetStage = UIMovieManager.get(PackNameEnum.MCOneKey,0,0);
            }        
            this.mcGetStage.playing = true; 
            this.mcGetStage.visible = true;
            this.stageMcCnt.addChild(this.mcGetStage);
        }else if(this.mcGetStage){
            this.mcGetStage.destroy();
            this.mcGetStage = null;
        }        
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {                 
            case this.btnUpgrade:
                let flyInfo:any[] = [];
                if(CacheManager.nobility.isCanUpgrade(true)){
                    for(let itemObj of this.listReward.list._children){
                        let itemRender:BaseItem = <BaseItem>itemObj;
                        if(itemRender){
                            let gp:egret.Point = itemRender.getIcoPos();//itemRender.localToGlobal(itemRender.x,itemRender.y);
                            flyInfo.push({itemCode:itemRender.itemData.getCode(),x:gp.x,y:gp.y});                            
                        }
                    }

                    App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
                    EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade,EStrengthenExType.EStrengthenExTypeLord, -1);
                    if(flyInfo.length>0){
                        Tip.addTip(flyInfo,TipType.PropIcon);
                    }
                }                        
                break;
            case this.btnGetReward:
                //发送领取奖励 ECmdGameStrengthenExGetReward		= 100309;	//领取升级奖励 C2S_SStrengthenExGetReward
                if(!ItemsUtil.checkSmeltTips()){
                    let miniLv:number = CacheManager.nobility.getMinUnGetLevel();
                    if(miniLv==0){
                        miniLv = CacheManager.nobility.curLevel;
                    }
                    EventManager.dispatch(LocalEventEnum.TrainGetStageReward,EStrengthenExType.EStrengthenExTypeLord,miniLv);
                    this.flyItem();
                }
                break;            
                
        }
    }

    private flyItem():void{
        let gp:egret.Point = this.baseItem.getIcoPos();//this.localToGlobal(this.baseItem.x,this.baseItem.y);
        Tip.addTip({x:gp.x,y:gp.y,itemCode:this.baseItem.itemData.getCode()},TipType.PropIcon);
    }

    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }
        var list: any = e.target;
        switch (list) {
            case this.listReward.list:
                break;
            

        }
               
    }
 
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}