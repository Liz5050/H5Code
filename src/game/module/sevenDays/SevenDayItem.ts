class SevenDayItem extends ListRenderer {
	private loader:GLoader;
	private txt_days:fairygui.GTextField;
	private c1:fairygui.Controller;
	public constructor() {
		super();
		this.constructFromXML
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.loader = <GLoader>this.getChild("loader");
		this.txt_days = this.getChild("txt_days").asTextField;
	}
	
	public setData(data:any,index:number):void{
		this._data = data;
		this.itemIndex = index;
		this.loader.load(URLManager.getPackResUrl(PackNameEnum.SevenDays,`img_day${this._data.day}_1`));
		this.txt_days.text = `第${this._data.day}天`;
		var isGot:boolean = CacheManager.sevenDay.isDayGot(this._data.day);
		var idx:number = isGot?1:0;
		this.c1.setSelectedIndex(idx); 
	}

}