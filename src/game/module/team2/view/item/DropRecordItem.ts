class DropRecordItem extends ListRenderer {

    private txt_time : fairygui.GTextField;
    //private txt_record :  fairygui.GRichTextField;
    private cell:ChatContentCell;
    private _calH:number;
    private c1 : fairygui.Controller;


    public constructor() {
        super();

    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.txt_time = this.getChild("txt_time").asTextField;
        //this.txt_record = this.getChild("txt_record").asRichTextField;
        this.c1 = this.getController("c1");
    }

    public setData(data: any, index: number): void {
      	this._data = data;
		this.itemIndex = index;
		let date:Date = new Date(this._data.timpstamp_I*1000);
		this.txt_time.text = App.DateUtils.timeToLongStr(date.getMonth() + 1)+"-"+App.DateUtils.timeToLongStr(date.getDate())+
		"  "+App.DateUtils.timeToLongStr(date.getHours())+":"+App.DateUtils.timeToLongStr(date.getMinutes());
        //this.txt_record = 
        let flag:number = this._data.notice.flags.data_I[0];
		this.c1.setSelectedIndex(flag);
		let maxWid:number = 545; //490
		let px:number = 15;
		if(flag){
			px = 75;
			maxWid = 490;
		}
		if(!this.cell){
			this.cell = new ChatContentCell(maxWid);
		}
		this.addChild(this.cell);
		this.cell.setNameFlag(false);
		this.cell.setVipFlag(false);
		this.cell.setMaxWid(maxWid);
		this.cell.setLinkFlag(true);
		this.cell.setLabelType(ChatEnum.Label_None);
		let notice:any = ChatUtils.fmtBroadMsg(this._data.notice.notice);
        let msg:SChatMsg = ChatUtils.noticeToChatMsg(notice);
		msg.chatType_I = EChatType.EChatTypeSystem;
		this.cell.update(msg);
		this.cell.x = px;
		this.cell.y = 50;
		this._calH = this.cell.contentH+10;
    }

}