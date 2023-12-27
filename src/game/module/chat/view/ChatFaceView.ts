class ChatFaceView extends BaseContentView {
	private faceList:List;
	public constructor(parentObj:fairygui.GComponent) {
		super(PackNameEnum.ChatFaceView,"ChatFaceView",null,parentObj);
	}
	public initOptUI():void{
		//let com:fairygui.GComponent = this.getGObject("panel_face").asCom;
		this.faceList = new List(this.getGObject("list_face").asList);
		this.faceList.setVirtual(CacheManager.chat.faceData);
		this.faceList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickFace,this);
		
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchView,this);
	}
	
	public updateAll(data?:any):void{
		this.faceList.setVirtual(CacheManager.chat.faceData);
	}
	// public setVisible(value:boolean):void{
	// 	this.viewCom.visible = value; 
	// }
	protected onClickFace(e:fairygui.ItemEvent):void{
		var item:ChatFaceItem = <ChatFaceItem>e.itemObject;
		EventManager.dispatch(LocalEventEnum.ChatAppendText,"#"+item.getData().id);
		e.stopPropagation();
	}
	protected onTouchView(e:egret.TouchEvent):void{
		e.stopPropagation();
	}
}