class RecordText extends ListRenderer {
	protected txt_record:fairygui.GTextField;
	public constructor() {
		super();
		
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.txt_record = this.getChild("txt_record").asTextField;
	}
	
	public setData(data:any):void{
		this._data = data;
		//var ts:string = App.DateUtils.getFormatBySecond(this._data.recordDt_DT,1);
		var d:Date = new Date();
		var dt:number = this._data.recordDt_DT*1000;
		d.setTime(dt);
		var ts:string = App.DateUtils.timeToLongStr(d.getHours()) +":"+
		 App.DateUtils.timeToLongStr(d.getMinutes()) +":"+App.DateUtils.timeToLongStr(d.getSeconds());
		this.txt_record.text = HtmlUtil.html(ts,Color.Yellow3,false)+"　"+
		HtmlUtil.html("被",Color.Yellow3,false)+HtmlUtil.html(this._data.playerName_S,Color.Blue,false)+HtmlUtil.html("击杀",Color.Yellow3,false);  
	}
}