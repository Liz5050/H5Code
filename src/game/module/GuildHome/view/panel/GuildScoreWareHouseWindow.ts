class GuildScoreWareHouseWindow extends BaseWindow {
	private list_item:List;
	private txt_score:fairygui.GRichTextField;
	private btn_log:fairygui.GButton;

	private allItems:ItemData[];
	private logView:GuildScoreWarehouseLogView;
	public constructor() {
		super(PackNameEnum.GuildHome,"GuildScoreWareHouseWindow");
	}

	public initOptUI():void {
		this.list_item = new List(this.getGObject("list_item").asList);
		this.txt_score = this.getGObject("txt_score").asRichTextField;
		this.btn_log = this.getGObject("btn_log").asButton;
		this.btn_log.addClickListener(this.onOpenLogViewHandler,this);
		ProxyManager.guild.warehouseOpen();
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.GuildScoreWarehouseItemUpdate,this.updateAllItems,this);
		this.addListen1(LocalEventEnum.GuildNewPlayerGuildInfoUpdate,this.onPlayerGuildInfoUpdate,this);
	}

	public updateAll():void {
		this.updateAllItems();
		this.onPlayerGuildInfoUpdate();
	}

	private onPlayerGuildInfoUpdate():void {
		this.txt_score.text = HtmlUtil.colorSubstitude(LangGuildNew.L20,CacheManager.guildNew.warehouseScore);
	}

	private updateAllItems():void {
		this.allItems = CacheManager.guildNew.scoreWarehouseItems;
		this.list_item.setVirtual(this.allItems, this.setItemRenderer, this);
	}

	private setItemRenderer(index: number, item: BaseItem): void {
		item.setData(this.allItems[index]);
		item.enableToolTipOpt = true;
		item.showBind();
		item.toolTipSource = ToolTipSouceEnum.GuildScoreWarehouse;
	}

	private onOpenLogViewHandler():void {
		if(!this.logView) {
			this.logView = new GuildScoreWarehouseLogView();
		}
		this.logView.show();
	}

	public hide():void {
		if(this.logView && this.logView.isShow) {
			this.logView.hide();
		}
		super.hide();
	}
}