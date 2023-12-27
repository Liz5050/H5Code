/**
 * 图鉴UI界面Item
 */
class IllustrateDecomposeItem extends ListRenderer {
    
	private baseItem: BaseItem;
	private nameTxt: fairygui.GTextField;
	private fragmentCostTxt: fairygui.GTextField;
	private decomposeBtn: fairygui.GButton;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseIitem");
		this.baseItem.touchable = false;
		this.baseItem.isShowCareerIco = false;
		this.baseItem.isShowName = false;

		this.nameTxt = this.getChild("txt_equipName").asTextField;
		this.fragmentCostTxt = this.getChild("txt_get").asTextField;

		this.decomposeBtn = this.getChild("btn_decompose").asButton;
		this.decomposeBtn.addClickListener(this.clickDecompose, this);
	}

	public setData(itemData: ItemData):void {
		this._data = itemData;

		this.baseItem.itemData = itemData;
		this.baseItem.updateNum("");

		this.nameTxt.color = Color.ItemColorHex[itemData.getColor()];
		this.nameTxt.text = itemData.getName();

		let exp:number = itemData.getItemInfo().effectEx;
		if(!exp) {
			exp = 0;
		}
		this.fragmentCostTxt.text = App.StringUtils.substitude(LangTrain.L9, exp);
	}

	private clickDecompose():void {
		//调用分解协议
		ProxyManager.cultivate.decomposeItem(this.baseItem.itemData.getUid(), 1);
		//移除此项
		EventManager.dispatch(LocalEventEnum.TrainIllustrateDecomposeClick, this.baseItem.itemData.getUid());
	}

}