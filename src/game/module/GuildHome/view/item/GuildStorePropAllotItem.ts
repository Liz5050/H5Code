class GuildStorePropAllotItem extends ListRenderer {
    private baseItem:BaseItem;
    private txt_propName:fairygui.GTextField;
    private txt_count:fairygui.GRichTextField;
    private btn_selectMember:fairygui.GButton;
    private list_member:List;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.txt_propName = this.getChild("txt_propName").asTextField;
        this.txt_count = this.getChild("txt_count").asRichTextField;
        this.btn_selectMember = this.getChild("btn_selectMember").asButton;
        this.list_member = new List(this.getChild("list_member").asList);

        this.btn_selectMember.addClickListener(this.selectMemberHandler, this);
	}
	public setData(data:ItemData,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        this.baseItem.itemData = data;
        this.txt_propName.text = data.getName();
        let itemUid:string = data.getUid();
        let allocateNum:number = CacheManager.guildNew.getStoreItemAllocateCount(itemUid);
		let leftNum:number = CacheManager.guildNew.getStoreItemLeftCount(itemUid);
        this.txt_count.text = "奖励分配：" + HtmlUtil.html(allocateNum + "/" + leftNum,Color.Green2);
        this.list_member.data = CacheManager.guildNew.getAllocateInfo(itemUid);
	}

    private selectMemberHandler(e:egret.TouchEvent):void{
        EventManager.dispatch(UIEventEnum.AllotMemberSelectedOpen,this._data.getUid());
    }
}