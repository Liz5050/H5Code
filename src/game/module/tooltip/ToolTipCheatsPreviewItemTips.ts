/**
 * 秘籍总览图标tips
 * @author zhh
 * @time 2018-09-05 15:53:35
 */
class ToolTipCheatsPreviewItemTips extends ToolTipBase {
    private c1:fairygui.Controller;
    private baseItem:BaseItem;
    private windowItemtip:fairygui.GImage;
    private txtName:fairygui.GTextField;
    private txtScore:fairygui.GTextField;
    private txtInfo:fairygui.GRichTextField;
    private txtDesc:fairygui.GRichTextField;
    private btnRoad1:fairygui.GButton;

    private debugBuy:ToolTipDebugBuy;

    private warehouseScoreCom:WarehouseExchangeCom;

	public constructor() {
		super(PackNameEnum.Common,"ToolTipCheatsPreviewItemTips");

	}
	public initUI():void{
        super.initUI();
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.baseItem.isShowName = false;
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtName = this.getGObject("txt_name").asTextField;
        this.txtScore = this.getGObject("txt_score").asTextField;
        this.txtInfo = this.getGObject("txt_info").asRichTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.btnRoad1 = this.getGObject("btn_road1").asButton;

        this.btnRoad1.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        //this.debugBuy = FuiUtil.addDebugBuy(this.view);
        this.warehouseScoreCom = this.getChild("com_exchange") as WarehouseExchangeCom;
	}

	public setToolTipData(toolTipData: ToolTipData):void{
        super.setToolTipData(toolTipData);
        let roleIndex:number = toolTipData.extData.roleIndex;
        this.c1.selectedIndex = 0;
		let itemData:ItemData = <ItemData>toolTipData.data;
        if(itemData){
            if(toolTipData.source == ToolTipSouceEnum.GuildScoreWarehouse) {
				this.c1.selectedIndex = 1;
				this.warehouseScoreCom.setData(itemData);
			}
            this.baseItem.itemData = itemData;
            this.txtName.text = itemData.getName(false);
            let code:number = itemData.getCode();
            this.txtScore.text = "评分："+ConfigManager.cheats.getFight(code,roleIndex);
            this.txtDesc.text = itemData.getDesc();
            let num:number = CacheManager.pack.propCache.getItemCountByCode2(code);
            this.txtInfo.text = "等级："+HtmlUtil.html(itemData.getItemLevel()+"级",Color.Color_8,true)+"数量："+HtmlUtil.html(num+"",Color.Color_8,false);
            if(this.debugBuy){
                this.debugBuy.update(itemData,this.hide,this);
            }
        }else{
            this.hide();
        }
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        EventManager.dispatch(LocalEventEnum.CheatsHidePreviewWin);
        HomeUtil.open(ModuleEnum.Arena,false,{tabType:PanelTabType.KingBattle});
        this.hide();
    }


}