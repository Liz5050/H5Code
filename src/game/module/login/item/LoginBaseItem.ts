class LoginBaseItem extends ListRenderer  {
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
	}
	public setData(data:any,index:number):void{
		this._data = data;
		//this.selected = false;
		this.itemIndex = index;
		this.text = this._data.name;
	}
}