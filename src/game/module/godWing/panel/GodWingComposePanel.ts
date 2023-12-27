/**
 * 神羽合成界面
 * @author zhh
 * @time 2018-08-09 11:30:57
 */
class GodWingComposePanel extends BaseTabView{
    private baseitemLeft:BaseItem;
    private baseitemRight:BaseItem;
    private txtCost:fairygui.GRichTextField;
    private loaderBg:GLoader;

    private btnCompose:fairygui.GButton;
    private listWing:List;
    private listItem:List;
    private curMaterialItem:ItemData;
    private c1:fairygui.Controller;
    private curAttrView:GodWingAttrShowCom;
    private nextAttrView:GodWingAttrShowCom;
    private isCan:boolean = false;
    private curInfo:any;
    private lastItemIndex:number = 0;
    private lastWingIndex:number = 0;
	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
               
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderBg.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.GodWing));
        
        this.c1 = this.getController("c1");
        this.baseitemLeft = <BaseItem>this.getGObject("baseItem_left");
        this.baseitemRight = <BaseItem>this.getGObject("baseItem_right");
        this.txtCost = this.getGObject("txt_cost").asRichTextField;
        this.btnCompose = this.getGObject("btn_compose").asButton;
        this.listWing = new List(this.getGObject("list_wing").asList);
        this.listItem = new List(this.getGObject("list_item").asList);
        

        this.btnCompose.addClickListener(this.onGUIBtnClick, this);
        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickGUIList,this);
        this.listWing.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickGUIList,this);
        //---- script make end ----
        //this.baseitemLeft.isShowName = false;
        //this.baseitemRight.isShowName = false;

        this.curAttrView = new GodWingAttrShowCom(this.getGObject("curAttrCom").asCom);
        this.nextAttrView = new GodWingAttrShowCom(this.getGObject("nextAttrCom").asCom);

	}

	public updateAll(data?:any):void{
        this.listItem.data = CacheManager.godWing.godWingTypeOrder;
        this.listItem.selectedIndex = this.lastItemIndex;
        this.updateWingList();
        this.updateInfo();
	}
    private updateWingList():void{
        let type:number = this.listItem.selectedData;
        let items:ItemData[] = ConfigManager.mgStrengthenExAccessory.getGodWingLevelItemCodes(type);
        this.listWing.setVirtual(items);
        this.listWing.selectedIndex = this.lastWingIndex;
    }
    private updateInfo():void{
        let item:ItemData = this.listWing.selectedData;
        let curInfo:any = ConfigManager.mgStrengthenExAccessory.getByPk(item.getCode());
        this.curInfo = curInfo; 
        let smeltPlanInfo  = ConfigManager.smeltPlan.getByPk(curInfo.smeltPlanCode);
        this.curMaterialItem = CommonUtils.configStrToArr(smeltPlanInfo.smeltMaterialList)[0]; 
        this.baseitemLeft.itemData = this.curMaterialItem;
        this.baseitemRight.itemData = item;
        let count:number = CacheManager.pack.propCache.getItemCountByCode2(this.curMaterialItem.getCode());
        let needNum:number = this.curMaterialItem.getItemAmount();
        this.isCan = count>= needNum;
        let clr:string = this.isCan?Color.GreenCommon:Color.RedCommon;
        this.txtCost.text = HtmlUtil.html(count+"/"+needNum,clr);
        //this.curMaterialItem.itemAmount = 0;
        this.baseitemLeft.updateNum("");

        let leftInfo:any = ConfigManager.mgStrengthenExAccessory.getByPk(this.curMaterialItem.getCode()); //材料
        let idx:number = 0;
        let isOneAttr:boolean=false;
        if(leftInfo){ //材料是神羽
             this.curAttrView.updateAll({attr:leftInfo.attrList,title:"升阶前",titleCenter:false});
             this.nextAttrView.updateAll({attr:curInfo.attrList,title:"升阶后",titleCenter:false});
        }else{
            isOneAttr = true;
            idx = 1;
            let titleStr:string = isOneAttr?"合成预览":"升阶前";
            this.curAttrView.updateAll({attr:curInfo.attrList,title:titleStr,titleCenter:isOneAttr});
        }
        this.c1.setSelectedIndex(idx);
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCompose:
                if(this.isCan && this.curInfo){
                    EventManager.dispatch(LocalEventEnum.ComposeReqPlan,this.curInfo.smeltPlanCode)
                }else{
                    Tip.showLeftTip("材料不足无法合成");
                }
                break;

        }
    }
    protected onClickGUIList(e:fairygui.ItemEvent):void{
        switch(e.target){
            case this.listItem.list:
                this.lastItemIndex = this.listItem.selectedIndex; 
                this.updateWingList();
                this.updateInfo();
                break;
            case this.listWing.list:
                this.lastWingIndex = this.listWing.selectedIndex;
                this.updateInfo();
                break;
        }
    }
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
        this.lastItemIndex = 0;
        this.lastWingIndex = 0;
	}

}