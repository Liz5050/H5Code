class MWDrugItem extends ListRenderer {
	/**
	 * 是否启用Tip
	 */
	public enableToolTip: boolean = true;
	public numTxt: fairygui.GRichTextField;
	private iconLoader: GLoader;
	private _itemData: ItemData;
	private toolTipData: ToolTipData;
	private _num: number = 0;
	public maxNum: number = 0;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.numTxt = this.getChild("txt_num").asRichTextField;
		this.addClickListener(this.click, this);
	}

	public setData(data: any) {
		this.itemData = <ItemData>data;
	}

	public set itemData(itemData: ItemData) {
		this._itemData = itemData;
		if (itemData) {
			this.iconLoader.load(itemData.getIconRes());
			if (itemData.getItemAmount() > 1) {
				this.numTxt.text = App.MathUtils.formatNum(itemData.getItemAmount());
			} else {
				this.numTxt.text = "";
			}
		} else {
			this.iconLoader.clear();
		}
	}

	public get itemData(): ItemData {
		return this._itemData;
	}

	/**点击弹出tooltip */
	public click(): void {
		if (!this.enableToolTip) {
			return;
		}
		if (this.itemData) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.data = this.itemData;
			// this.toolTipData.type = ItemsUtil.getToolTipType(this.itemData);
			this.toolTipData.type = ToolTipTypeEnum.Drug;
			this.toolTipData.extData = {"useNum": this.num, "maxNum": this.maxNum};
			ToolTipManager.show(this.toolTipData);
		}
	}

	public set num(num: number) {
		this._num = num;
		this.numTxt.text = num.toString();
	}

	public get num(): number {
		return this._num;
	}
}