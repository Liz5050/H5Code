class ChatExtendView extends BaseContentView{
	protected c1:fairygui.Controller;
	protected btn_face:fairygui.GButton;
	protected btn_language:fairygui.GButton;
	protected list_language:List;

	private faceCnt:fairygui.GComponent;
	private faceView:ChatFaceView;

	public constructor(parentObj:fairygui.GComponent) {
		super(PackNameEnum.Chat,"ChatExtendView",null,parentObj);
		this.isDestroyOnHide = true;
	}
	public initOptUI():void{
		this.c1 = this.getController("c1");
		this.btn_face = this.getGObject("btn_face").asButton;
		this.btn_language = this.getGObject("btn_language").asButton;
		this.faceCnt = this.getGObject("face_cnt").asCom;
		this.faceView = new ChatFaceView(this.faceCnt);

		this.btn_face.addClickListener(this.onClickBtn,this);
		this.btn_language.addClickListener(this.onClickBtn,this);		
		this.list_language = new List(this.getGObject("list_language").asList);
		this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onC1Change,this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchView,this);
		this.list_language.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickLangItem,this);
		
		//this.onCItemChange();		

	}

	protected onClickBtn(e:egret.TouchEvent):void{		
		e.stopPropagation();
	}

	protected onC1Change(e:any):void{		
		this.updateViews();
	}

	private updateViews():void{
		switch(this.c1.selectedIndex){
			case 0: //表情
				this.faceView.show();
				break;
			case 1://常用语
				this.updatePhrase();
				break;
		}
	}

	/*
	protected onCItemChange(e:any=null):void{
		var allItems:Array<any>;
		var cItems:any[];
		var p:PackCache = CacheManager.pack;	
		switch(this.cItem.selectedIndex){
			case 0:			
				cItems = p.rolePackCache.getTrueItems();	
				allItems = cItems.concat(p.backPackCache.getTrueItems(),p.warePackCache.getTrueItems(),p.propCache.getTrueItems(),p.runePackCache.getTrueItems());				
				break; 
			case 1: //装备
				cItems = p.rolePackCache.getByC(ECategory.ECategoryEquip);
				allItems = cItems.concat(p.backPackCache.getByC(ECategory.ECategoryEquip),p.warePackCache.getByC(ECategory.ECategoryEquip));
				break;
			case 2://道具
				allItems = p.propCache.getTrueItems();//cItems.concat(p.backPackCache.getByC(ECategory.ECategoryMaterial),p.warePackCache.getByC(ECategory.ECategoryMaterial));
				break;
			case 3://符文
				allItems = p.runePackCache.getTrueItems();
				break;
		}
	}
	*/

	private onClickLangItem(e:fairygui.ItemEvent):void{
		var item:ChatLanguageItem = <ChatLanguageItem>e.itemObject;
		EventManager.dispatch(LocalEventEnum.ChatReplaceText,item.getData().phrase_S);
	}
	protected onClickItem(e:fairygui.ItemEvent):void{
		var item:BaseItem = <BaseItem>e.itemObject;
		item.selected = false;
		if(ItemsUtil.isTrueItemData(item.itemData)){
			EventManager.dispatch(LocalEventEnum.ChatAddItem,item.itemData);
		}		
	}
	
	protected onTouchView(e:egret.TouchEvent):void{
		e.stopPropagation();
		if(ChatLanguageItem.lastEditeBtn){
			ChatLanguageItem.lastEditeBtn.selected = false;
		}
		this.saveLang();
	}

	public saveLang():void{
		if(this.list_language){
			for(let i:number = 0;i<this.list_language.list._children.length;i++){
				let item:fairygui.GObject = this.list_language.list._children[i];
				if(item instanceof ChatLanguageItem){
					item.saveLang();
				}
			}
		}
		
	}

	public updateAll():void{
		this.updateViews();
	}

	public updatePhrase():void{
		this.list_language.setVirtual(CacheManager.chat.chatPhrase);
	}
	
	public hide(param: any = null, callBack: CallBack = null):void{
		super.hide(param,callBack);
		this.saveLang();
	}

	
}