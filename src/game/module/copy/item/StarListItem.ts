class StarListItem extends ListRenderer {
	private c1:fairygui.Controller;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
	}

	public setData(data:any,index:number):void{
		this._data = data;
		this.itemIndex = index;
		var idx:number = this._data.isOpen?0:1;
		this.c1.selectedIndex = idx;
	}

}