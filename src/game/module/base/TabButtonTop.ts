class TabButtonTop extends ListRenderer{
	public constructor() {
		super();
	}
	public setData(data:any):void{
		this._data = data;
		this.text = this._data.floor;		
	}
}