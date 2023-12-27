class LotteryEquipLogItem extends ListRenderer {
	private logTxt:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.logTxt = this.getChild("txt_log").asRichTextField;
	}
	public setData(data:any):void {
		this._data = data;
		let itemCode:number = Number(data.params.data_S[1].split(",")[0]);
		let category:number = Number(data.params.data_S[3])/100;
		let itemCfg:any = ConfigManager.item.getByPk(itemCode);
		let career:number = 0;
		if(itemCfg.career) {
			career = itemCfg.career;
		}
		// let itemAmount:number = Number(data.params.data_S[2]);
		let nameStr:string = itemCfg.name + (category != LotteryCategoryEnum.LotteryAncient ? "（" + WeaponUtil.getEquipLevelText(new ItemData(itemCode),false)
			+ " " + CareerUtil.getCareerName(career) + "）" : "");
		// let itemColor:string = category != LotteryCategoryEnum.LotteryAncient ? Color.RedCommon : Color.BASIC_COLOR_9;
		this.logTxt.text = HtmlUtil.html(data.publicMiniplayers.data[0].name_S,"#61d3e8") + "  获得了  " + HtmlUtil.html(nameStr,Color.getItemColr(itemCfg.color));// + data.content_S;// + HtmlUtil.html("*" + itemAmount,Color.Green2)
	}
}