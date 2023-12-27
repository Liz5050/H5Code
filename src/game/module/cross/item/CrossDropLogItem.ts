/**
 * 跨服掉落记录item
 * @author zhh
 * @time 2018-12-12 16:54:36
 */
class CrossDropLogItem extends ListRenderer {
    private c1:fairygui.Controller;
    private txtTime:fairygui.GTextField;
	private cell:ChatContentCell;
	private _calH:number;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.txtTime = this.getChild("txt_time").asTextField;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let date:Date = new Date(this._data.timpstamp_I*1000);
		this.txtTime.text = App.DateUtils.timeToLongStr(date.getMonth())+"-"+App.DateUtils.timeToLongStr(date.getDate())+
		"  "+App.DateUtils.timeToLongStr(date.getHours())+":"+App.DateUtils.timeToLongStr(date.getMinutes());
		let flag:number = this._data.notice.flags.data_I[0];
		this.c1.setSelectedIndex(flag);
		let maxWid:number = 470; //490
		let px:number = 160;
		if(flag){
			px = 220;
			maxWid = 430;
		}
		if(!this.cell){
			this.cell = new ChatContentCell(maxWid);
		}
		this.addChild(this.cell);
		this.cell.setNameFlag(false);
		this.cell.setVipFlag(false);
		this.cell.setMaxWid(maxWid);
		this.cell.setLinkFlag(false);
		this.cell.setLabelType(ChatEnum.Label_None);
		let notice:any = ChatUtils.fmtBroadMsg(this._data.notice.notice);
        let msg:SChatMsg = ChatUtils.noticeToChatMsg(notice);
		msg.chatType_I = EChatType.EChatTypeSystem;
		this.cell.update(msg);
		this.cell.x = px;
		this.cell.y = 0;
		this._calH = this.cell.contentH+10;
	}
	public getHeight():number{
		return this._calH;
	}

}