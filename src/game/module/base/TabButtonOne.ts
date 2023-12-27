/**
 * 对应原一级分页按钮
 */
class TabButtonOne extends ListRenderer{
	public constructor() {
		super();
		this.enabledSound = true;
	}

	public setData(data:any):void{
		this._data = data;
		this.text = this._data.text;		
	}
}