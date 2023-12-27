/**
 * 仓库记录
 */
class GuildWarehouseRecordItem extends ListRenderer {
	private recordTxt: fairygui.GRichTextField;

	private itemData: ItemData;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.recordTxt = this.getChild("txt_record").asRichTextField;
		this.recordTxt.addEventListener(egret.TextEvent.LINK, this.onClickLink, this);
	}

	/**
	 * @param data SNewGuildWarehouseRecord
	 */
	public setData(data: any, index: number): void {
		this._data = data;
		// 	optional int32 guildId_I = 1;
		// optional string playerName_S = 2;
		// optional int32 itemCode_I = 3;
		// optional string itemJs_S = 4;
		// optional int32 recordType_I = 5;
		// optional int32 recordDt_DT = 6;
		if (data != null) {
			let oper: string;
			let recordType: number = data.recordType_I;
			if (recordType == 1) {
				oper = "捐献了";
			} else if (recordType == 2) {
				oper = "兑换了";
			} else if (recordType == 3) {
				oper = "销毁了";
			}
			this.itemData = new ItemData({ "itemCode_I": data.itemCode_I, "jsStr_S": data.itemJs_S });
			let record: string = "[" + App.DateUtils.formatDate(data.recordDt_DT, DateUtils.FORMAT_Y_M_D_HH_MM_SS) + "]";
			record += ` <font color='#01ab24'>${data.playerName_S}</font>${oper}`
			record += `<a href="event:0"><u>${this.itemData.getName(true)}</u></a>`;

			this.recordTxt.text = record;
		}
	}

	private onClickLink(e: any): void {
		EventManager.dispatch(UIEventEnum.ToolTipShowItem, this.itemData);
	}
}