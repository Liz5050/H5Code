class OpenServerActiveItem extends ListRenderer {
	public constructor() {
		super();
	}
	public setData(data:any,index:number):void{
		this._data = data;// {mId:,name:,isTip:}
		this.text = this._data.name;
		CommonUtils.setBtnTips(this,this._data.isTip); 
	}
}