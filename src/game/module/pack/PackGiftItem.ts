class PackGiftItem extends ListRenderer {
	private baseItem: BaseItem;

	private itemData: ItemData;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.baseItem = this.getChild("baseItem") as BaseItem;
		this.baseItem.enableToolTip = false;
	}

	public setData(data: any): void {
		this._data = data;
		this.itemData = data;
		this.baseItem.itemData = this.itemData;
	}
}