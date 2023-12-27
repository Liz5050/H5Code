class GuildScoreWarehouseLogView extends BaseContentView {
	private list_log:List;
	public constructor() {
		super(PackNameEnum.GuildHome,"GuildScoreWarehouseLogView",null,LayerManager.UI_Popup);
		this.modal = true;
		this.isCenter = true;
		this.isPopup = true;
	}

	public initOptUI():void {
		this.list_log = new List(this.getGObject("list_log").asList);
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.GuildScoreWarehouseRecordUpdate,this.updateRecord,this);
	}

	public updateAll():void {
		this.updateRecord();
	}

	private updateRecord():void {
		let records:any[] = CacheManager.guildNew.warehouseRecords;
		if(records) {
			this.list_log.setVirtual(records);
			if(records.length > 0) {
				this.list_log.scrollToView(0);
			}
		}
	}
}