/**
 * 私聊内容item
 * @author zhh
 * @time 2018-09-18 11:24:05
 */
class FriendContactChatItem extends ListRenderer {
    private txtTime:fairygui.GTextField;
	private cell: ChatContentCell;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtTime = this.getChild("txt_time").asTextField;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		var msg: SChatMsg = <SChatMsg>this._data;
		this.txtTime.text = App.DateUtils.formatDate(msg.chatDt,DateUtils.FORMAT_Y_M_D_HH_MM_SS);
		let maxWid:number = 477;
		if(!this.cell){
			this.cell = new ChatContentCell(maxWid);
		}		
		this.addChild(this.cell);
		this.cell.x = 22;
		this.cell.y = 44;		
		this.cell.setVipFlag(false);
		this.cell.setNameFlag(true);
		this.cell.setLinkFlag(true);
		this.cell.setMaxWid(maxWid);
		this.cell.setFontSize(22);		
		let clr:number = 0xfea700; //自己的颜色
		if(!EntityUtil.isSame(msg.fromPlayer.entityId,CacheManager.role.entityInfo.entityId)){
			clr = 0xf2e1c0;
		}
		this.cell.setNameColor(clr);
		this.cell.setFontColor(clr);
		this.cell.setLabelType(ChatEnum.Label_None);
		this.cell.update(msg);
	}

	public getContentH():number{
		if(this.cell){
			return this.cell.y + this.cell.contentH;
		}	
		return 78;
	}


}