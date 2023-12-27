/**
 * 仙盟日志
 */
class GuildNewManageLogItem extends ListRenderer{
	private txtLog:fairygui.GTextField;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.txtLog = this.getChild("txt_log").asTextField;
		
	}
	public setData(data:any,index:number):void{
		this._data = data; //SGuildLog
		this.itemIndex = index;		
		this.txtLog.text = ""+App.DateUtils.formatDate(this._data.timestamp_I,DateUtils.FORMAT_Y_M_D_HH_MM)+"  "+this._data.content_S;
	}
}