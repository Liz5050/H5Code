/**
 * 五色石
 * @author zhh
 * @time 2018-10-16 15:58:53
 */
class ColorStonePanel extends BaseTabView{
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private loaderIco:GLoader;
    private txtLv:fairygui.GRichTextField;
    private txtFight:fairygui.GTextField;
    private txtOpenTip:fairygui.GTextField;
    private txtAttr1:fairygui.GRichTextField;
    private txtAttr2:fairygui.GRichTextField;
    private txtAttr3:fairygui.GRichTextField;
    private btnUp:fairygui.GButton; //升级按钮
    private btnOneKey:fairygui.GButton;
    private btnAct:fairygui.GButton;
    private btnStage:fairygui.GButton;
    private listChoose:List;
    private listDrug:List;
    private listSkill:List;
    private progressBar:ProgressBar1;

    private _roleIndex: number = RoleIndexEnum.Role_index0;
    private strengthenType: EStrengthenExType = EStrengthenExType.EStrengthenExTypeColorStone;
    private curInfo:any;
    private curCfg:any;
    private drupItems:ItemData[];
    private chooseItems:ItemData[];
    private isMax:boolean;
    private isAuto:boolean = false;
    private t0:fairygui.Transition;
    private cnt:fairygui.GComponent;
    private mcSuccess:UIMovieClip;

	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.t0 = this.getTransition('t0');
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtLv = this.getGObject("txt_lv").asRichTextField;
        this.txtAttr1 = this.getGObject("txt_attr1").asRichTextField;
        this.txtAttr2 = this.getGObject("txt_attr2").asRichTextField;
        this.txtAttr3 = this.getGObject("txt_attr3").asRichTextField;
        let fightPanel:fairygui.GComponent = this.getGObject("panel_fight").asCom;
        this.txtFight = fightPanel.getChild("txt_fight").asTextField; 
        this.txtOpenTip = this.getChild("txt_openTip").asTextField; 
        this.btnUp = this.getGObject("btn_up").asButton;
        this.btnAct = this.getGObject("btn_act").asButton;
        this.btnStage = this.getGObject("btn_stage").asButton;
        this.cnt = this.getGObject("cnt").asCom;
        this.btnOneKey = this.getGObject("btn_one_key").asButton;
        this.listChoose = new List(this.getGObject("list_choose").asList);
        this.listDrug = new List(this.getGObject("list_drug").asList);
        this.listSkill = new List(this.getGObject("list_skill").asList);
        this.progressBar = <ProgressBar1>this.getGObject("progressBar");
        this.btnUp.addClickListener(this.onGUIBtnClick, this);
        this.btnOneKey.addClickListener(this.onGUIBtnClick, this);
        this.btnStage.addClickListener(this.onGUIBtnClick, this);
        this.btnAct.addClickListener(this.onGUIBtnClick, this);
        /*
        this.listChoose.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listDrug.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listSkill.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        */
        //---- script make end ----

        this.loaderIco.load(URLManager.getModuleImgUrl("color_stone.png",PackNameEnum.MagicWare));
        this.drupItems = ConfigManager.strengthenExDrug.getDrugs(this.strengthenType);

        this.chooseItems = ConfigManager.mgStrengthenEx.getChooseItems(this.strengthenType,0);
        
        let cfg: any = ConfigManager.mgOpen.getByOpenKey(PanelTabType[PanelTabType.ColorStone]);
        if(cfg){
            this.txtOpenTip.text = cfg.openCondDesc;
        }        
        this.t0.stop();
	}

	public updateAll(data?:any):void{        
        this.t0.play(null,null,null,-1);
        this.curInfo = CacheManager.role.getPlayerStrengthenExtInfo(this.strengthenType, this._roleIndex);       
        let curLv:number = CacheManager.role.getPlayerStrengthenExLevel(this.strengthenType, this._roleIndex); 
        let oldStage:number = -1;
        if(this.curCfg){
            oldStage = this.curCfg.stage;
        }
        this.curCfg = ConfigManager.mgStrengthenEx.getByTypeAndLevel(this.strengthenType, curLv);
        if(!this.curCfg){
            Log.trace(Log.TEST,`无五色石配置数据,当前等级是:${curLv} 最大等级是:${ConfigManager.mgStrengthenEx.getMaxLevel(this.strengthenType)}`);
            return;
        }        
       if(oldStage>-1 && this.curCfg.stage>oldStage){ //升阶了
            App.TimerManager.doDelay(750,this.playEff,this);
        }
        this.c2.setSelectedIndex((this.curCfg.stageUpFlag?1:0));

        let isMax:boolean = curLv>=ConfigManager.mgStrengthenEx.getMaxLevel(this.strengthenType);
        let nextCfg:any;
        let cIdx1:number = 0;
        this.isMax = isMax;
        nextCfg = ConfigManager.mgStrengthenEx.getByTypeAndLevel(this.strengthenType, curLv+1); 
        if(isMax){
            nextCfg = this.curCfg;
            cIdx1 = 1;
        }else if(!CacheManager.role.isStrengthenExActive(this.strengthenType,this._roleIndex)){
            cIdx1 = 2;            
        }
        this.c1.setSelectedIndex(cIdx1);
        

        let lucky:number = this.curInfo?this.curInfo.lucky:0;
        this.progressBar.setValue(lucky,this.curCfg.luckyNeed);
        let star:number = this.curCfg.star?this.curCfg.star:0;
        this.txtLv.text = FuiUtil.getStageStr(this.curCfg.stage)+"阶"+FuiUtil.getStageStr(star)+"级";
        let warfare:number = this.curInfo?this.curInfo.warfare:0;
        this.txtFight.text =  warfare + "";
        this.txtAttr1.text = WeaponUtil.getAttrText(WeaponUtil.getAttrArray(this.curCfg.attrList),false,null,null,true,false);
        this.txtAttr2.text = WeaponUtil.getAttrText(WeaponUtil.getAttrArray(nextCfg.attrList),false,null,null,true,false);
        this.txtAttr3.text = WeaponUtil.getAttrText(WeaponUtil.getAttrArray(nextCfg.attrList),false,null,null,true,false);
        
        let skills:any[] = ConfigManager.mgStrengthenEx.getHadOpenSkills(this.strengthenType);
        !skills?skills = []:null;
        let skillInfos:any[] = [];
        for(let i:number = 0;i<skills.length;i++){
            /*
            let skillId:number = skills[i].openSkill;
            let isOpen:boolean = CacheManager.role.getPlayerStrengthenExLevel(this.strengthenType,this._roleIndex)>=skills[i].strengthenLevel;
            let inf:any = { "skillData": new SkillData(skillId), "openDesc": "", "enabled": isOpen };
            */
            skillInfos.push({roleIndex:this._roleIndex,cfg:skills[i]});
        }
        this.listSkill.setVirtual(skillInfos);        
        this.updateProp();
        
	}

    public set roleIndex(value:number){
        this._roleIndex = value;
        this.curCfg = null;
        this.updateAll();
    }

    public updateProp():void{
        let drupInfos:any[] = [];
        for(let i:number=0;i<this.drupItems.length;i++){
            drupInfos.push({roleIndex:this._roleIndex,item:this.drupItems[i]});
        }
        this.listDrug.setVirtual(drupInfos); //药品
        if(this.chooseItems){
            this.listChoose.setVirtual(this.chooseItems); //消耗品
        }
        this.setChooseItemSel();
        if(!CacheManager.magicWare.isHasColorStoneMat()){
            this.isAuto = false;
        }
    }

    public onUpgrade(info:any):void{
        //在线升级成功，
        //是否处于一键升级状态,记录旧的阶数,对比新的阶数 升阶 停止一键状态 否则继续执行升级操作        
        this.updateAll();
        let newStage:number = this.curCfg.stage;
        if(this.curCfg.stageUpFlag){
            this.isAuto = false;
        }        
        if(this.isAuto){
            this.dealUpgrade();
        }
       
    }

    private dealUpgrade():void{
        if(this.isMax){
            Tip.showLeftTip("已满级，无法升级");
            this.isAuto = false;
            return;
        }
        let chooseItem:ItemData = <ItemData>this.listChoose.selectedData;
        let c:number = CacheManager.pack.getItemCount(chooseItem.getCode());
        if(!this.curCfg.stageUpFlag && c<chooseItem.getItemAmount()){
            this.setChooseItemSel();
            // HomeUtil.open(ModuleEnum.PropGet,false,{itemCode:chooseItem.getCode()});   
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": chooseItem.getCode() });
            let itemCfg: any = ConfigManager.item.getByPk(chooseItem.getCode());
            Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
            this.isAuto = false; //终止自动升级
            return;
        }
        this.clearMc();
        EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade,this.strengthenType, this._roleIndex,false,chooseItem.getCode());
    }
    private playEff():void{
        if (this.mcSuccess == null) {
			this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
		}
        this.cnt.addChild(this.mcSuccess);
        this.mcSuccess.playing = true;
        this.mcSuccess.setPlaySettings(0,-1,1,-1,()=>{
            egret.Tween.get(this.mcSuccess).to({alpha:0},2000).call(this.clearMc,this);
        },this);
    }

    private clearMc():void{
        App.TimerManager.remove(this.playEff,this);
        if(this.mcSuccess){
            this.mcSuccess.destroy();
            UIMovieManager.push(this.mcSuccess);
            this.mcSuccess = null;
        }
        
    }

    private setChooseItemSel():boolean{
        let flag:boolean = false;
        let idx:number = 0;
        let item:ItemData = this.listChoose.selectedData;
        if(item && CacheManager.pack.getItemCount(item.getCode())>0){ //不需要改变选择
            return false;
        }
        for(let i:number = 0;i<this.listChoose.data.length;i++){
            item = this.listChoose.data[i];
            let c:number = CacheManager.pack.getItemCount(item.getCode());
            if(c>=item.getItemAmount()){
                idx = i;
                flag = true;
                break;
            }
        }
        this.listChoose.selectedIndex = idx;
        return flag;
    }


    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnUp:
                break;
            case this.btnOneKey:
                this.isAuto = true;
                break;
            case this.btnStage:
                break;
            case this.btnAct:
                EventManager.dispatch(LocalEventEnum.PlayerStrengthExActive,this.strengthenType, this._roleIndex);
                return;
        }
        this.dealUpgrade();
    }

    /*
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listChoose.list:
                break;
            case this.listDrug.list:
                break;
            case this.listSkill.list:
                break;

        }
               
    }
    */
	public hide():void {
		super.hide();
        this.curCfg = null;
        this.t0.stop();
        this.isAuto = false;
	}
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}