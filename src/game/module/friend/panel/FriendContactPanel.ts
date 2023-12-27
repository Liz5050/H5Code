/**
 * 最近联系人
 * @author zhh
 * @time 2018-09-15 16:09:58
 */
class FriendContactPanel extends BaseTabView{
    private listContact:List;
    private listChat:List;
    private contactSelectIdx:number = 0;
    private curSelContactItem:FriendContactItem;
	public constructor() {
		super();
        this.isDestroyOnHide = false;
	}

	protected initOptUI():void{
        //---- script make start ----
        this.listContact = new List(this.getGObject("list_contact").asList);
        this.listChat = new List(this.getGObject("list_chat").asList);

        this.listContact.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //this.listChat.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----


	}
    
	public updateAll(data?:any):void{
        this.contactSelectIdx = 0;
        CacheManager.friend.sortContact();
        this.updateList();
	}

    public getChatPlayer():any{
        let data:any = this.listContact.selectedData;
        return data;
    }
    /**更新联系人列表 */
    public updateList(selectIndex:number=-1):void{        
        if(selectIndex>-1){
            this.contactSelectIdx = selectIndex;
        }
        this.listContact.setVirtual(CacheManager.friend.friendContacts);        
        if(this.contactSelectIdx<this.listContact.data.length){
            let isInView:boolean = this.listContact.isChildInView(this.contactSelectIdx);
            if(!isInView){
                this.listContact.scrollToView(this.contactSelectIdx,false,false);
            }            
            this.listContact.selectedIndex = this.contactSelectIdx;
            this.curSelContactItem = this.listContact.selectedItem;
            if(this.curSelContactItem){
                this.curSelContactItem.selected = true;
            }
        }
        this.updateChatContent();
    }
    public updateChatContent():void{
        let msgs:any[] = [];
        if(this.curSelContactItem){
            let data:any = this.curSelContactItem.getData();
            let miniPlayer:any = data.player;
            EventManager.dispatch(LocalEventEnum.FriendRemoveReadMsgId,miniPlayer.entityId.id_I); //已读的消息,从离线列表删掉
            let cacheMsgs:any[] = CacheManager.chat.getPrivateMsgs(miniPlayer.entityId.id_I);
            cacheMsgs?msgs = cacheMsgs:null; 
            this.curSelContactItem.checkTips(0);
        }
        this.listChat.setVirtual(msgs,this.setItemRender,this);
        this.listChat.setVirtual(msgs,this.setItemRender,this);
        if(msgs.length>0){
            this.listChat.scrollToView(msgs.length-1,false);
        }
        
    }
    /**判断当前是否选中某个联系人 */
    public isSelectPlayer(playerId:number):boolean{
        if(this.curSelContactItem){
            let data:any = this.curSelContactItem.getData();
            let miniPlayer:any = data.player;
            return miniPlayer.entityId.id_I==playerId;
        }
        return false;
    }

    private setItemRender(index: number, item: FriendContactChatItem):void{
        if(index>=this.listChat.data.length){
            return;
        }
        item.setData(this.listChat.data[index],index);
        item.setSize(item.width,item.getContentH());
    }
    
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:FriendContactItem = <FriendContactItem>e.itemObject;       
        this.curSelContactItem = item;
        this.contactSelectIdx = this.listContact.selectedIndex;
        this.updateChatContent();
        /*
        var list: any = e.target;
        switch (list) {
            case this.listContact.list:
                break;
            case this.listChat.list:
                break;

        }
        */
               
    }
    
    
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}
    public hide():void{
        super.hide();
        this.contactSelectIdx = 0;
        if(this.curSelContactItem){
            this.curSelContactItem.selected = false;            
        }
        this.curSelContactItem = null;
    }
}