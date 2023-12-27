class ShapeDrugItem extends ListRenderer {

	private iconLoader: GLoader;
	private useNumTxt: fairygui.GTextField;
	private canUseTxt: fairygui.GTextField;

	private itemCode: number;
	private toolTipData: ToolTipData;
	private canUse: number;
	private propCount: number;
	private useNum: number;
	private role : number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.useNumTxt = this.getChild("txt_useNum").asTextField;
		this.canUseTxt = this.getChild("txt_canUse").asTextField;
		this.iconLoader.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		this.role = -1;
		this._data = data;
		this.itemCode = data.code;
		let itemCfg: any = ConfigManager.item.getByPk(data.code);
		this.iconLoader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
		this.useNumTxt.text = this._data.used;
		if(data.role >= 0) {
			this.role = data.role;
		}
		this.canUseTxt.text = "";
		this.propCount = CacheManager.pack.propCache.getItemCountByCode2(this.itemCode);
		if (this.propCount > 0) {
			this.canUse = this._data.max - this._data.used;
			if (this.canUse > 0) {
				if (this.propCount > this.canUse) {
					this.useNum = this.canUse;
				}else{
					this.useNum = this.propCount;
				}
				this.canUseTxt.text = `${this.useNum}↑`;
			}else{
				this.propCount = 0;
			}
		}
	}

	private click(): void{
		if (this.propCount > 0) {
			if (this.canUse > 0) {
				if(this._data.shape){
					if(this.role == -1) {
						ProxyManager.shape.shapeUseDrug(this._data.shape, this._data.drugType, this.useNum);
					}
					else {
						ProxyManager.shape.shapeUseDrug(this._data.shape, this._data.drugType, 1, this.role);
					}
				}else{
					EventManager.dispatch(LocalEventEnum.PlayerStrengthExUseDrug, this._data.strengthenType, this.role, this._data.drugType, 1);
				}
				return;
			}
			else {
				Tip.showTip("新上限即将开放，敬请期待");
			}
		}
		this.showDrugTip();
	}

	/**点击弹出tooltip */
	public showDrugTip(): void {
		let itemData: ItemData = new ItemData(this.itemCode);
		if (itemData) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.data = itemData;
			this.toolTipData.type = ToolTipTypeEnum.Drug;
			this.toolTipData.extData = {"useNum": this._data.used, "maxNum": this._data.max, "shape": this._data.shape, "level": this._data.level};
			ToolTipManager.show(this.toolTipData);
		}
	}
}