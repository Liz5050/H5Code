class HomeChatMsgItem extends ListRenderer {
	private static CONTENT_FONT_SIZE:number = 20; 
	protected _callH:number = 0;
	protected cell1:ChatContentCell;
	public constructor() {
		super();
	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		var msg:SChatMsg = <SChatMsg>this._data;
		var idx:number = ChatUtils.HomeChatItemChanel.indexOf(msg.chatType_I);
		idx = Math.max(idx,0);
		//let isNew:boolean = index!=CacheManager.chat.homeMsgArr.length-1; //最新的那条消息 显示成两行
		this.updateCell(msg,false);
		
	}
	private updateCell(msg:SChatMsg,isOneLine:boolean):void{
		let maxWid:number = ChatContentCell.CHANELITEM_W;
		if(!this.cell1){
			this.cell1 = new ChatContentCell(maxWid);
			this.addChild(this.cell1);
		}
		this.cell1.setFaceScale(0.7); 
		this.cell1.setVipScale(0.9);
		this.cell1.setFontSize(19);
		this.cell1.setOnlyLineFlag(isOneLine);
		this.cell1.setHome(true);
		this.cell1.setLabelType(ChatEnum.Label_Text);
		this.cell1.setMaxWid(maxWid);
		this.cell1.update(msg);
		this._callH = this.cell1.contentH;
		this.cell1.x = 0;
		this.cell1.y = -7;
		if(!isOneLine){
			this.setSize(this.width,this._callH);
		}		
	}
	
	public getHeight():number{
		return this._callH;
	}
		
	public recycleChild():void{
		if(this.cell1){
			this.cell1.resetContent();
		}
	}


}