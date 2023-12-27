class PackSplitWindow extends BaseWindow{
	
	public itemData:ItemData;
	public constructor() {
		super(PackNameEnum.Pack, "WindowSplit");
	}

	private splitSlider:Slider;
	private uid:string;
	private itemNameTxt: fairygui.GTextField;
	private baseItem: BaseItem;

	public initOptUI(){
		this.baseItem = <BaseItem>this.getGObject("baseItem_prop");
		this.splitSlider = <Slider>this.getGObject("slider_split");
		this.itemNameTxt = this.getGObject("txt_itemname").asTextField;
	}

	public updateAll(){
		
		this.baseItem.itemData = this.itemData;
		this.uid = this.baseItem.itemData.getUid();
		this.itemNameTxt.text = this.baseItem.itemData.getName();

		this.splitSlider.value = 1;
		this.splitSlider.max = this.itemData.getItemAmount() - 1;
		
		this.getGObject("btn_split").addClickListener(this.sendSplitItem, this);
		
	}

	private sendSplitItem():void{
		let value:number = this.splitSlider.value;
		ProxyManager.pack.splitItem(this.uid, value);
	}
}