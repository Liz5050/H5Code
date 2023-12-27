/**世界频道的item */
class ChatItem extends ListRenderer {

	public static CONTENT_FONT_SIZE: number = 22;
	
	/**长按时长 */
	protected static touch_tick: number = 500;
	private isLongTouch:boolean = false;
	protected _calH: number = 160;
	private c1: fairygui.Controller;
	private cell: ChatMsgCell; //ChatContentCell
	private index: number = 0;
	private curImg: fairygui.GImage;
	private img_system: fairygui.GImage;
	private img_team: fairygui.GImage;
	private icoLoader0: fairygui.GLoader;
	private icoLoader1: fairygui.GLoader;
	private txtVip0: fairygui.GTextField;
	private txtVip1: fairygui.GTextField;
	private txtName0: fairygui.GTextField;
	private txtName1: fairygui.GTextField;
	private txtContent0: fairygui.GTextField;
	private txtContent1: fairygui.GTextField;
	private bgImg0:fairygui.GImage;
	private bgImg1:fairygui.GImage;
	/**是否有聊天气泡背景 */
	private isHasBg:boolean = false;
	public constructor() {
		super();

	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.img_system = this.getChild("img_system").asImage;
		this.img_team = this.getChild("img_system").asImage;

		this.icoLoader0 = this.getChild("loader_0").asLoader;
		this.icoLoader0.addClickListener(this.onCheckPlayerInfoHandler,this);
		this.icoLoader1 = this.getChild("loader_1").asLoader;
		this.txtVip0  = this.getChild("txt_vip0").asTextField;
		this.txtVip1  = this.getChild("txt_vip1").asTextField;
		this.txtName0  = this.getChild("txt_name0").asTextField;
		this.txtName1  = this.getChild("txt_name1").asTextField;
		this.txtContent0  = this.getChild("txt_chat0").asTextField;
		this.txtContent1  = this.getChild("txt_chat1").asTextField;
		this.bgImg0 = this.getChild("img_bg0").asImage;
		this.bgImg1 = this.getChild("img_bg1").asImage;
		this.c1.setSelectedIndex(7);

	}

	public setData(data: any, index: number): void {
		this._data = data;//原始数据 SChatMsg
		this.index = index;
		var msg: SChatMsg = <SChatMsg>this._data;
		var idx: number = 0;
		this.isHasBg = msg.fromPlayer && msg.fromPlayer.entityId;
		this.updateCell(msg);
		
		if (this.isHasBg) {
			idx = this.updatePlayerChat(msg);
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		} else {
			switch (msg.chatType_I) {
				case EChatType.EChatTypeSystem:
					idx = 2;
					this.cell.x = this.img_system.x;
					this.cell.y = this.img_system.y-2;
					this._calH = this.cell.contentH;
					break;
				case EChatType.EChatTypeGuild:
					idx = 4;
					this.cell.x = this.width - this.cell.contentW >> 1;
					this.cell.y = 0;
					this._calH = this.cell.contentH;
					break;
			}
			this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
			this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		}
		this.c1.selectedIndex = idx;
		
	}
	private updateCell(msg: SChatMsg): void {
		var labelWid:number = 0;
		switch(msg.chatType_I){
			case EChatType.EChatTypeSystem:
				labelWid = this.img_system.x + this.img_system.width;
				break;
			case EChatType.EChatTypeGroup:
				labelWid = this.img_team.x + this.img_team.width;
				break;
		}
		var isLabel:boolean = msg.chatType_I==EChatType.EChatTypeSystem ||  msg.chatType_I==EChatType.EChatTypeGroup;
		if (!this.cell) {
			this.cell = new ChatMsgCell(ChatMsgCell.CHATITEM_W,
				"　　 　   ", ChatItem.CONTENT_FONT_SIZE,
				"",isLabel);
			this.addChild(this.cell);
		}
		if(isLabel){
			this.cell.setLabelWid(labelWid);
		}

		if(ChatUtils.isSysChanel(msg) || msg.chatType_I==EChatType.EChatTypeGuild && !this.isHasBg){
			this.cell.setMaxWid(670);
		}else{
			this.cell.setMaxWid(ChatMsgCell.CHATITEM_W);
		}
		this.cell.setFontColor(ChatUtils.getChatChanelColor(msg.chatType_I,this.isHasBg));
		this.cell.setLabelFlag(isLabel);
		this.cell.update(msg);
	}

	private updatePlayerChat(msg: SChatMsg):number {
		var dir: number = 1;
		var idx: number = 0;
		var isMySelf: boolean = EntityUtil.isSame(msg.fromPlayer.entityId, CacheManager.role.entityInfo.entityId);
		var icoUrl: string = URLManager.getPlayerHead(msg.fromPlayer.career_SH);
		if (isMySelf) {
			idx = 1;
			dir = 0;
		}
		var bgImg: fairygui.GImage = this["bgImg" + idx];
		this.curImg = bgImg;
		var icoLoader: GLoader = this["icoLoader" + idx] as GLoader;
		var txtVip: fairygui.GTextField = this["txtVip" + idx];
		var txtName: fairygui.GTextField = this["txtName" + idx];
		var txtContent: fairygui.GTextField = this["txtContent" + idx];
		icoLoader.load(icoUrl);
		// icoLoader.url = icoUrl;
		txtContent.autoSize = fairygui.AutoSizeType.Both;

		txtVip.text = msg.fromPlayer.vipLevel_BY>0?"V" + msg.fromPlayer.vipLevel_BY:"";
		txtName.text = msg.fromPlayer.name_S;
		txtContent.text = "";

		var gapH: number = 24;
		var gapW: number = 40;
		bgImg.setSize(this.cell.contentW + gapW, this.cell.contentH + gapH);
		var headW: number = 122;
		var cellGapX: number = 6;
		if (isMySelf) {
			bgImg.x = this.width - bgImg.width - headW+15;
			this.cell.x = bgImg.x + gapW / 2 - cellGapX;
		} else {
			this.cell.x = bgImg.x + gapW / 2 + cellGapX;
		}
		this.cell.y = bgImg.y + gapH / 2;
		this._calH = bgImg.y + bgImg.height + 30;
		return idx;
	}

	protected onTouchEnd(e: egret.TouchEvent = null): void {
		App.TimerManager.remove(this.onTimer, this);
		if (e) {
			e.stopPropagation();
			if(!this.isLongTouch){
				CacheManager.chat.isCopyMsgEnd = true;		
			}				
			this.isLongTouch = false;
		}else{
			CacheManager.chat.isCopyMsgEnd = false;
		}
		
	}
	protected onTouchBegin(e: egret.TouchEvent): void {
		var rect: egret.Rectangle = new egret.Rectangle(this.curImg.x, this.curImg.y, this.curImg.width, this.curImg.height);
		var localP: egret.Point = this.globalToLocal(e.stageX, e.stageY);
		var b: boolean = rect.containsPoint(localP);
		if (b) {
			App.TimerManager.doTimer(ChatItem.touch_tick, 1, this.onTimer, this, this.onTimerComplete, this);
		}

	}

	protected onTimerComplete(): void {
		this.isLongTouch = true;
		this.onTouchEnd();
		EventManager.dispatch(UIEventEnum.ChatShowCopyMsg, this.index);
	}

	protected onTimer(): void {

	}
	protected removeEvent(): void {
		App.TimerManager.remove(this.onTimer, this);
	}

	public get height(): number {
		return this._calH;
	}

	public getBubblePos(): egret.Point {
		var p: egret.Point = new egret.Point();
		if (this.curImg) {
			var tx: number = this.curImg.x + this.curImg.width / 2 - 10;
			p = this.curImg.parent.localToGlobal(tx, this.curImg.y);
		}
		return p;
	}

	public recycleChild(): void {
		if (this.cell) {
			this.cell.resetContent();

		}
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
	}

	private onCheckPlayerInfoHandler():void {
		EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.fromPlayer.entityId});
	}

}