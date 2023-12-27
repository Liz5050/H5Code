class RankTypeItem extends ListRenderer {
	private typeBtn:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.typeBtn = this.getChild("btn_type").asButton;
	}

	public setData(data:any):void {
		this._data = data;
		let rankInfo:RankInfo = CacheManager.rank.getClientRankInfo(data);
		this.typeBtn.text = rankInfo.typeName;
	}

	public set btnSelected(value:boolean){
		this.typeBtn.selected = value;
		this.touchable = !value;
	}
}