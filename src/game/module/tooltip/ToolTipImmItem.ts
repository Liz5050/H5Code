/**
 * 神兵碎片toolTips
 * @author zhh
 * @time 2018-08-21 22:04:38
 */
class ToolTipImmItem extends ToolTipBase {
    private windowItemtip:fairygui.GImage;
    private line1:fairygui.GImage;
    private txtLevel:fairygui.GTextField;
    private txtNum:fairygui.GTextField;
    private txtName:fairygui.GRichTextField;
    private txtDesc:fairygui.GRichTextField;
    private toolTipSource:any;
    private extData:any;
    private btnSmelt:fairygui.GButton;
    private baseItem: BaseItem;
    private itemData: ItemData;

    private isItemNumOk:boolean;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipImmItem");
	}

	public initUI(): void {
		super.initUI();
        //---- script make start ----
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.line1 = this.getGObject("line1").asImage;
        this.txtLevel = this.getGObject("txt_level").asTextField;
        this.txtNum = this.getGObject("txt_num").asTextField;
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.btnSmelt = this.getGObject("btn_smelt").asButton;
        this.baseItem = <BaseItem>this.getChild("loader_item");
		this.baseItem.isShowName = false;
        this.btnSmelt.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----

	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);		
		this.toolTipSource = toolTipData.source;        
		this.extData = toolTipData.extData;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
            if (ItemsUtil.isTrueItemData(this.itemData)) {
				this.txtName.text = this.itemData.getName(true);
				this.txtNum.text = App.MathUtils.formatItemNum(this.itemData.getItemAmount());
				this.txtLevel.text = this.itemData.getItemLevel().toString();
				this.txtDesc.text = this.itemData.getDesc();
                this.baseItem.itemData = this.itemData;

                let itemInfo:any =this.itemData.getItemInfo();
                let meterialItem:ItemData = ConfigManager.smeltPlan.getMeterialItem(itemInfo.effect); 
                let hasNum:number = CacheManager.pack.propCache.getItemCountByCode2(meterialItem.getCode());
                let needNum:number = meterialItem.getItemAmount();
                this.isItemNumOk = hasNum>=needNum;
            }
		}
        this.btnSmelt.visible = this.toolTipSource==ToolTipSouceEnum.Pack && this.isItemNumOk; 	
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnSmelt:
                if(!CacheManager.pack.propCache.isHasCapacity(1)){
                    Tip.showLeftTip(LangForge.L7);
                    return;
                }
                let itemInfo:any =this.itemData.getItemInfo();
                if(this.isItemNumOk){
                    EventManager.dispatch(LocalEventEnum.ComposeReqPlan,itemInfo.effect);                    
                }else{
                    Tip.showLeftTip(LangForge.L6);
                }  
                this.hide();              
                break;

        }
    }

	
}