class TabButtonItem extends ListRenderer {
	private btn:fairygui.GButton;
	public constructor() {
		super();
		this.enabledSound = true;
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.btn = this.getChild("btn").asButton;
	}

	public setData(data:any):void {
		this._data = data;
		if(this._data.label){
			this.btn.text = this._data.label; 	
		}else{
			this.btn.text = LangCommon.getTabName(data);
		}		
	}

	public set btnSelected(value:boolean) {
		this.btn.selected = value;
		this.btn.touchable = !value;
		this.touchable = !value;
	}
}