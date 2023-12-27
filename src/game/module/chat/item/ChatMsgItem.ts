/***综合频道 */
class ChatMsgItem extends ListRenderer{
	private cell1: ChatContentCell;
	protected _calH:number = 70;
	private loaderLabel:GLoader;
	/**是否综合频道 */
	public isChatTypeTotal:boolean = false;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.loaderLabel = <GLoader>this.getChild("loader_label");
	}
	public setData(data:any,index:number):void{
		this._data = data;
		this._itemIndex = index;
		var msg: SChatMsg = <SChatMsg>this._data;		
		this.updateCell1(msg);
	}
	private updateCell1(msg:SChatMsg):void{
		let maxWid:number = 621;
		if(!this.cell1){
			this.cell1 = new ChatContentCell(maxWid);
			this.addChild(this.cell1);
		}
		this.cell1.setNameColor(ChatContentCell.NAME_CLR);
		this.cell1.setVipFlag(true);
		this.cell1.setNameFlag(true);
		this.cell1.setLinkFlag(true);
		this.cell1.setFontSize(23);
		this.cell1.setOnlyLineFlag(false);
		let isSys:boolean = ChatUtils.isSysChanel(msg);
		if(isSys || this.isChatTypeTotal || msg.chatType_I==EChatType.EChatTypeCrossEx){ //只有系统和综合有标签
			this.cell1.setLabelType(ChatEnum.Label_Text);
		}else{
			this.cell1.setLabelType(ChatEnum.Label_None);
		}
		
		this.cell1.setMaxWid(maxWid);
		this.cell1.update(msg);
		this._calH = this.cell1.contentH;
	}
	public getHeight():number{
		return this._calH;
	}
	public dispose():void{
		super.dispose();
	}

}