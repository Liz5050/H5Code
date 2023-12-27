class EfficientDemoWindow extends BaseWindow {
	
	public constructor() {
		super("EfficientDemo","EfficientDemoWindow",null,LayerManager.UI_DEMO); //LayerManager.UI_Demo
		this.modal =  false;
		this.isPopup = true;
		
	}

	public initOptUI():void{
		/*
		var msg:SChatMsg = new SChatMsg();
		msg.chatType_I = EChatType.EChatTypeGuild;
		msg.content_S = "方便你我默认有表情两个#1字啦啦哈哈你是#10";
		msg.content_S = "#1"; //每一个表情增加两个DC 图集交叉渲染一个 表情动画本身只占一个
		msg.fromPlayer = {name_S:"zhh"};
		msg.playerItems = {data:[]};

		var msgCell:ChatMsgCell = new ChatMsgCell(ChatMsgCell.CHATITEM_W,
			"　　 　   ",ChatItem.CONTENT_FONT_SIZE,
			"#ff0000",false);
		msgCell.setFontColor(ChatUtils.getChatChanelColor(msg.chatType_I));
		this.addChild(msgCell);
		msgCell.x = msgCell.y = 100;
		msgCell.update(msg);
		
		let item:BaseItem = <BaseItem>this.getGObject("baseItem");
		if(item){	
			//40110204 红色宝箱
			// 12001006 红色装备
			let data:ItemData = new ItemData(12001006);
			item.itemData = data; 
			//item.displayObject.cacheAsBitmap = true;
		}
		let lst:List = new List(this.getGObject("list_test").asList);
		let data:any[] = [];
		for(let i:number=0;i<200;i++){
			data.push(i);
		}
		lst.setVirtual(data);
		lst.list.scrollToView(data.length-1);
		*/

		let item:BaseItem = <BaseItem>this.getGObject("baseItem");
		if(item){
			item.itemData = new ItemData(12000022);
		}
		
	}


}