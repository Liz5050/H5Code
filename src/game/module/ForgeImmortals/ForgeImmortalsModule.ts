/**
 * 神兵信息
 * @author zhh
 * @time 2018-08-20 10:47:19
 */
class ForgeImmortalsModule extends BaseModule {
    private c1:fairygui.Controller;
    private baseItem:BaseItem;
    private loaderBg:GLoader;
    private loaderShow:GLoader;
    private txtDesc:fairygui.GTextField;
    private txtTitle:fairygui.GTextField;
    private txtFight:fairygui.GTextField;
    private btnAction:fairygui.GButton;
    private listAttr:List;
    private modelShow:ModelShow;
    private model:fairygui.GComponent;
    private c2:fairygui.Controller;
    //private item4Com:ForgeImmortalsItemView;
    //private item6Com:ForgeImmortalsItemView;

    private itemViewDict:{[itemNum:number]:ForgeImmortalsItemView};
    private itemCounts:number[];
    private roleIndex:number = 0;
    private cmdType:EImmortalCmd;
    private _data:any;
	public constructor() {
		super(ModuleEnum.ForgeImmortals,PackNameEnum.ForgeImmortals,"MainInfo");
		
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderShow = <GLoader>this.getGObject("loader_show");
        this.txtDesc = this.getGObject("txt_desc").asTextField;
        this.txtTitle = this.getGObject("txt_title").asTextField;
        let fightPanel:fairygui.GComponent = this.getGObject("fightPanel").asCom;
        this.txtFight = fightPanel.getChild("txt_fight").asTextField;
        this.btnAction = this.getGObject("btn_action").asButton;
        this.listAttr = new List(this.getGObject("list_attr").asList);

        this.btnAction.addClickListener(this.onGUIBtnClick, this);
        this.modelShow = new ModelShow(EShape.EShapeMagic);
        this.modelShow.scaleX = this.modelShow.scaleY = 1.2;
        let comModel:fairygui.GComponent = this.getGObject("com_model").asCom;
        this.c2 = comModel.getController("c2");
        this.model = comModel.getChild("model").asCom;
		(<egret.DisplayObjectContainer>this.model.displayObject).addChild(this.modelShow);

        this.baseItem.addClickListener(this.onGUIBtnClick,this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("imm_bg.jpg",PackNameEnum.Forge));
        //this.loaderShow.load(URLManager.getModuleImgUrl("bg_show.png",PackNameEnum.Forge));

        this.itemViewDict = {};
        this.itemCounts = [4,6,8];
        for(let i:number = 0;i<this.itemCounts.length;i++){
            let key:string = `item_com${this.itemCounts[i]}`;
            this.itemViewDict[this.itemCounts[i]] = new ForgeImmortalsItemView(this.getGObject(key).asCom);
        }
        //this.item4Com = new ForgeImmortalsItemView(this.getGObject("item_com4").asCom);
        //this.item6Com = new ForgeImmortalsItemView(this.getGObject("item_com6").asCom);

	}
    protected changeTitle():void {
		this.title = "Forge_0";
	}
	public updateAll(data?:any):void{
        if(data){
            this._data = data;
        }         
        let subType:number = data.subType;
        this.roleIndex = data.roleIndex;        

        let suitLv:number = CacheManager.forgeImmortals.getSuitLevel(this.roleIndex,subType,false); //套装等级
        let suitInfo:any = CacheManager.forgeImmortals.getSuitInfo(this.roleIndex,subType,suitLv); //套装信息 获取套装效果 然后获取技能id
        let isAct:boolean = CacheManager.forgeImmortals.isImmortalAct(this.roleIndex,subType);
        this.txtDesc.color = isAct?0xf3f232:Color.toNum(Color.Color_9);
        this.txtDesc.text = suitInfo.effectDesc;
        let immInfo:any = ConfigManager.cltImmortal.getByPk(subType);
        this.modelShow.setData(immInfo.modelid);
        this.c2.setSelectedPage(String(immInfo.modelid));
        let realyLv:number = CacheManager.forgeImmortals.getSuitLevel(this.roleIndex,subType,true); 
        this.txtTitle.text = immInfo.name+`(${realyLv}阶)`;

        let totalAttr:any = CacheManager.forgeImmortals.getSubTypeTotalAttr(this.roleIndex,subType);
        this.txtFight.text = ""+WeaponUtil.getCombat(totalAttr);
        let attrs:any[] = CacheManager.forgeImmortals.attrDictToArr(totalAttr);
        if(attrs.length==0){
            let immortalInfo:any = CacheManager.forgeImmortals.getSuitInfo(this.roleIndex,subType,ForgeImmortalsCache.IMMINFO_SUIT_LV); 
            totalAttr = WeaponUtil.getAttrDict(immortalInfo.attr);
            attrs = CacheManager.forgeImmortals.attrDictToArr(totalAttr);
        }
        this.listAttr.setVirtual(attrs); //获取所有已经激活的碎片的所有属性；没有激活显示所有属性值为0 读取一级的属性名

        this.updateItemView(subType);
        this.updateSuitInfo(subType);
        this.setOptCmd(subType);
        let isSubTypeAct:boolean = CacheManager.forgeImmortals.isImmortalAct(this.roleIndex,subType);
        let isImmortalHasUse:boolean = CacheManager.forgeImmortals.isImmortalHasUse(this.roleIndex);
        let isTip:boolean =  (isSubTypeAct && !isImmortalHasUse) || CacheManager.forgeImmortals.isHasSubTypeUnlock(this.roleIndex,subType);
        CommonUtils.setBtnTips(this.btnAction,isTip);
	}
    public getData():any{
        return this._data;
    }
    public updateByProp():void{
        if(this._data){
            this.updateItemView(this._data.subType);
        }
    }
    private setOptCmd(subType:number):void{
        let idx2:number = 0; 
        if(!CacheManager.forgeImmortals.isImmortalAct(this.roleIndex,subType)){
            idx2 = 0;//解锁
            this.cmdType = EImmortalCmd.EImmortalCmdUnLock;
        }else if(!CacheManager.forgeImmortals.isImmortalUse(this.roleIndex,subType)){
            idx2 = 1;//使用
            if(CacheManager.forgeImmortals.isImmortalHasUse(this.roleIndex)){
                this.cmdType = EImmortalCmd.EImmortalCmdReplace;
                idx2 = 3;//替换
            }else{
                this.cmdType = EImmortalCmd.EImmortalCmdUse;
            }             
        }else{
            idx2 = 2;//取消
            this.cmdType = EImmortalCmd.EImmortalCmdCancle;
        }
        this.btnAction.text = LangForge.L2[idx2]; 
    }

    private updateSuitInfo(subType:number):void{
        this.baseItem.itemData = null;
        let skillCfg:any = ConfigManager.cltImmortal.getSkillInfo(subType);
        let iconUrl:string = URLManager.getIconUrl(skillCfg.skillIcon, URLManager.SKIL_ICON);
        this.baseItem.icoUrl = iconUrl;
        this.baseItem.setNameText(HtmlUtil.html(skillCfg.skillName,"#c8b185"));
        this.baseItem.bgUrl = URLManager.getItemColorUrl(`color_${EColor.EColorSpe}`);
        //this.baseItem.colorBgVisible = true;
        //this.baseItem.setColorBG(EColor.EColorSpe);
    }
    private updateItemView(subType:number):void{
        let infos:number[] = CacheManager.forgeImmortals.getPosItemInfo(subType);
        let idx:number = this.itemCounts.indexOf(infos.length);
        let curCom:ForgeImmortalsItemView = this.itemViewDict[infos.length];        
        this.c1.setSelectedIndex(idx);
        curCom.updateAll({roleIndex:this.roleIndex,infos:infos});
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnAction:
                EventManager.dispatch(LocalEventEnum.ForgeImmortalOpt,{roleIndex:this.roleIndex,cmdType:this.cmdType,subType:this._data.subType});
                break;
            case this.baseItem:
                EventManager.dispatch(LocalEventEnum.ForgeImmortalShowSkillTips,{roleIndex:this.roleIndex,subType:this._data.subType});
                break;
        }
    }
    

}