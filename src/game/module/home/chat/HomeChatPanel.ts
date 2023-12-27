/**主界面聊天缩略框 */
class HomeChatPanel extends BaseContentView{	
	private listChannel:List;
	public constructor(parentObj:fairygui.GComponent) {
		super(PackNameEnum.HomeChat,"ChatPanel",null,parentObj);
	}

	public initOptUI():void{
		this.listChannel = new List(this.getGObject("list_channel").asList);
		this.addClickListener(this.onClick,this);
	}
	public updateAll(data?:any){
		//this.listChannel.setVirtual(CacheManager.chat.homeMsgArr,this.setItemRenderer);
		this.listChannel.data = CacheManager.chat.homeMsgArr;
		this.listChannel.list.setBoundsChangedFlag();
		if(CacheManager.chat.homeMsgArr.length>0){
			let idx:number = CacheManager.chat.homeMsgArr.length - 1;
			this.listChannel.scrollToView(idx,false,false);
		}		
	}

	private setItemRenderer(index: number, item:HomeChatMsgItem): void {
		if (!item || item["setData"] == undefined) return;		
		item.setData(CacheManager.chat.homeMsgArr[index],index);
		item.setSize(item.width,item.getHeight());		
	}

	private onClick():void{
		let openLevel: number = 21;
		if(CacheManager.role.getRoleLevel() < openLevel) {
			EventManager.dispatch(UIEventEnum.TaskTraceClick);
			Tip.showOptTip(App.StringUtils.substitude(LangChat.L5, openLevel));
			return;
		}
		this.openChat();
	}
	private openChat(): void {
		this.visible = false;    
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Chat);
    }
	
}