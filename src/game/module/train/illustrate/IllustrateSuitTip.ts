/**
 * 图鉴套装详情
 */
class IllustrateSuitTip extends BaseWindow {
	
	private _list:List;
	private _nameTxt:fairygui.GTextField;

	public constructor() {
		super(PackNameEnum.TrainIllustratePanel, "IllustrateSuitTip");
		
	}

	public initOptUI():void {
		this._list = new List(this.getGObject("list_suitinfo").asList);

		this._nameTxt = this.getGObject("txt_name").asTextField;
	}

	public updateAll(data:any):void {
		let datas:Array<any> = ConfigManager.cultivateSuit.select({"cultivateType": ECultivateType.ECultivateTypeIllustrated, "subtype": data});
		this._list.data = datas;

		if(datas.length > 0) {
			this._nameTxt.text = App.StringUtils.substitude(LangTrain.L8, datas[0].suitName);
		}
	}

}