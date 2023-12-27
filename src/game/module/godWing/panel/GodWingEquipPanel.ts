/**
 * 神羽装备
 * @author zhh
 * @time 2018-08-09 11:27:39
 */
class GodWingEquipPanel extends BaseTabView{
    private baseItem:BaseItem;
    private txtCost:fairygui.GRichTextField;
    private txtFight:fairygui.GTextField;
    private btnEquip:fairygui.GButton;
    private btnCompose:fairygui.GButton;
    private btnPath:fairygui.GButton;
    private btnMaster:fairygui.GButton;
    private listItem:List;
    private rolePanel:RoleItemPanel;
    private c1:fairygui.Controller;
    private loaderBg:GLoader;
    private isOneAttr:boolean;
    private curAttrView:GodWingAttrShowCom;
    private nextAttrView:GodWingAttrShowCom;
    private curWingType:number;
    private curInfo:any;//当前的信息
    private smeltPlanInfo:any;
    private curMaterialItem:ItemData;
    private isSmeltMaterialOk:boolean = false;
    private isMaxLv:boolean;
    private lastRoleIndex:number = 0;
    private icon_loader : GLoader;
    private lastSelectItem:ItemData;
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderBg.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.GodWing));
        this.c1 = this.getController("c1");
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.txtCost = this.getGObject("txt_cost").asRichTextField;
        this.btnEquip = this.getGObject("btn_equip").asButton;
        this.btnCompose = this.getGObject("btn_compose").asButton;
        this.btnPath = this.getGObject("btn_path").asButton;
        this.btnMaster = this.getGObject("btn_master").asButton;
        this.listItem = new List(this.getGObject("list_item").asList);
        let fightCom:fairygui.GComponent = this.getGObject("panel_fight").asCom;
        this.txtFight = fightCom.getChild("txt_fight").asTextField;

        this.btnEquip.addClickListener(this.onGUIBtnClick, this);
        this.btnCompose.addClickListener(this.onGUIBtnClick, this);
        this.btnPath.addClickListener(this.onGUIBtnClick, this);
        this.btnMaster.addClickListener(this.onGUIBtnClick, this);
        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickItem,this);
        //---- script make end ----
        this.baseItem.itemData = null;
        this.baseItem.setNameText(HtmlUtil.html("疾风斩","#ff7610"));
        this.baseItem.icoUrl =URLManager.getModuleImgUrl("skill.png",PackNameEnum.GodWing);
        this.baseItem.addClickListener(()=>{
            Tip.showLeftTip(LangGodWing.L5);
        },this);
        this.rolePanel = <RoleItemPanel>this.getGObject("PlayerRole");
        this.curAttrView = new GodWingAttrShowCom(this.getGObject("curAttrCom").asCom);
        this.nextAttrView = new GodWingAttrShowCom(this.getGObject("nextAttrCom").asCom);
        this.rolePanel.setSelectChangedFun(this.changeRole,this);
        this.icon_loader = <GLoader>this.getGObject("item_loader");
        this.icon_loader.addClickListener(this.clickIcon, this);
	}

	public updateAll(data?:any):void{
        if(data && data.roleIndex!=null){
            this.lastRoleIndex = data.roleIndex;
        }
        this.rolePanel.updateRoles();
        this.rolePanel.selectedIndex = this.lastRoleIndex;
        this.rolePanel.checkRoleTipsByFn(this.checkRoleTip,this);
        this.updateRoleInfo();
        
	}
    private changeRole():void{
        this.lastRoleIndex = this.rolePanel.selectedIndex;
        this.updateRoleInfo();
    }
    private checkRoleTip(roleIndex:number):boolean{
        let b:boolean = CacheManager.godWing.checkRoleTip(roleIndex);
        return b; 
    }
    private updateRoleInfo():void{
        let items:any[] = CacheManager.godWing.getRoleGodWing(this.rolePanel.selectedIndex);        
        this.listItem.setVirtual(items);
        this.listItem.selectedIndex<0?this.listItem.selectedIndex=0:null;     
        this.isSmeltMaterialOk = false;  
        let isTip:boolean = CacheManager.godWing.isRoleHasEquipGodWing(this.rolePanel.selectedIndex);
        CommonUtils.setBtnTips(this.btnEquip,isTip);
        this.updateInfo(false);
        this.txtFight.text = CacheManager.godWing.getRoleFight(this.rolePanel.selectedIndex)+"";
    
    }

    private onClickItem(e:fairygui.ItemEvent){
        this.updateInfo(true);
    }

    private updateInfo(isClick:boolean):void{
        this.curWingType = CacheManager.godWing.getTypeByIdx(this.listItem.selectedIndex);
        let itemRender:GodWingEquipItem = this.listItem.selectedItem;
        let isMax:boolean = false;   
        let curInfo:any;     
        let nextInfo:any;
        let data:any = itemRender.getData();
        let itemData:ItemData = data && data.item?data.item:null;
        if(this.lastSelectItem && itemData && itemData.getCode()==this.lastSelectItem.getCode()){
            if(isClick){
                ToolTipManager.showByCode(this.lastSelectItem);
            }            
            return;//不需要重复刷新
        }
        this.lastSelectItem = itemData; 
        if(itemData){
            //更新当前的属性，下一阶属性            
            curInfo = ConfigManager.mgStrengthenExAccessory.getByPk(itemData.getCode());
            nextInfo = ConfigManager.mgStrengthenExAccessory.getNextLevelInfo(curInfo);            
            isMax = nextInfo==null;
            // {color?:string,attr:string,title:string,titleCenter:boolean}
            
        }else{
            let cfg:MgStrengthenExAccessoryConfig = ConfigManager.mgStrengthenExAccessory;
            curInfo = cfg.getInfoBy(EStrengthenExType.EStrengthenExTypeWing,this.curWingType,1);
            this.smeltPlanInfo = ConfigManager.smeltPlan.getByPk(curInfo.smeltPlanCode);
        }
        this.curInfo = curInfo; 
        this.isMaxLv = isMax;
        this.isOneAttr = itemData==null || isMax;
        if(curInfo){
            let titleStr:string = this.isOneAttr?"合成预览":"升阶前";
            this.curAttrView.updateAll({attr:curInfo.attrList,title:titleStr,titleCenter:this.isOneAttr});
        }
        
        if(nextInfo){
            this.nextAttrView.updateAll({attr:nextInfo.attrList,title:"升阶后",titleCenter:false}); 
            this.smeltPlanInfo = ConfigManager.smeltPlan.getByPk(nextInfo.smeltPlanCode);
        }
        let idx:number = this.isOneAttr?1:0;
        this.c1.setSelectedIndex(idx);
        let isQickTip:boolean = false;
        if(this.smeltPlanInfo){
            let equipNum: number =  itemData != null ? 1 : 0;//需要算上已装备的
            let item:ItemData = CommonUtils.configStrToArr(this.smeltPlanInfo.smeltMaterialList)[0];
            this.curMaterialItem = item; 
            let count:number = CacheManager.pack.propCache.getItemCountByCode2(item.getCode()) + equipNum;
            let needNum:number = item.getItemAmount();
            this.isSmeltMaterialOk = count >= needNum;
            let clr:string = this.isSmeltMaterialOk?Color.GreenCommon:Color.RedCommon;
            this.txtCost.text = HtmlUtil.html(count+"/"+needNum,clr);
            let isEquip:boolean = CacheManager.godWing.getRoleGodWingCode(this.rolePanel.selectedIndex,this.curInfo.type) > 0;
            let nextLvInfo:any = isEquip?ConfigManager.mgStrengthenExAccessory.getNextLevelInfo(this.curInfo):this.curInfo;
            isQickTip = !this.isMaxLv && this.isSmeltMaterialOk && CacheManager.godWing.isGodWingCanEquip(nextLvInfo,this.rolePanel.selectedIndex);
            this.icon_loader.load(item.getIconRes());
        }else{
            this.txtCost.text = "";
            this.isSmeltMaterialOk = false;
        }
        this.txtCost.visible = !this.isMaxLv;
        CommonUtils.setBtnTips(this.btnCompose,isQickTip);
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnEquip:
                let item:ItemData = CacheManager.godWing.getPackEquipGodWing(this.rolePanel.selectedIndex,this.curWingType);
                if(item){
                    EventManager.dispatch(LocalEventEnum.GodWingReqEmbeded,this.rolePanel.selectedIndex,EStrengthenExType.EStrengthenExTypeWing,this.curWingType);
                }else{
                    Tip.showLeftTip(LangGodWing.L4);
                }            
                break;
            case this.btnCompose: //快速合成
                if(this.isMaxLv){
                    Tip.showLeftTip(LangGodWing.L3);
                    return;
                }
                let isEquip:boolean = CacheManager.godWing.getRoleGodWingCode(this.rolePanel.selectedIndex,this.curInfo.type) > 0;
                let nextInfo:any = isEquip?ConfigManager.mgStrengthenExAccessory.getNextLevelInfo(this.curInfo):this.curInfo;
                if(!CacheManager.godWing.isGodWingCanEquip(nextInfo,this.rolePanel.selectedIndex)){
                    Tip.showLeftTip(LangGodWing.L2);
                    return;
                }
                if(!this.isSmeltMaterialOk){
                    Tip.showLeftTip(LangGodWing.L8);
                    return;
                }                
                EventManager.dispatch(LocalEventEnum.GodWingReqQickSmelt,this.rolePanel.selectedIndex,EStrengthenExType.EStrengthenExTypeWing,this.curWingType);
                break;
            case this.btnPath://获取途径
                if(this.curMaterialItem){
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode":this.curMaterialItem.getCode()});
                }                
                break;
            case this.btnMaster:
                if(this.rolePanel.selectedIndex>-1){
                    EventManager.dispatch(LocalEventEnum.GodWingLookupMaster,this.rolePanel.selectedIndex);
                }
                break;

        }
    }
 	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
        this.listItem.selectedIndex = 0;
        this.lastRoleIndex = 0;
	}

    public clickIcon() {
        ToolTipManager.showByCode(this.curMaterialItem.getCode());
    }

}