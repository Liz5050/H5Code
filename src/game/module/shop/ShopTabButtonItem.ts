class ShopTabButtonItem  extends ListRenderer {
	public constructor() {
		super();
		this.enabledSound = true;
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
	}

	public setData(data:any):void {
		this._data = data;
		if(this._data.label){
			this.title = this._data.label;
		}else{
			this.title = LangCommon.getTabName(data);
		}		
	}

	public set btnSelected(value:boolean) {
		this.selected = value;
	}
}