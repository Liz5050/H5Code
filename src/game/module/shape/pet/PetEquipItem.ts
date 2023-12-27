class PetEquipItem extends ListRenderer {

	private nameLoader: GLoader;
	private baseItem: BaseItem;

	private itemData: ItemData;
	private toolTipData: ToolTipData;
	//private point: egret.Point = new egret.Point(56,-12);

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.nameLoader = this.getChild("loader_name") as GLoader;
		this.baseItem = this.getChild("baseItem") as BaseItem;
		this.baseItem.isShowName = false;
		this.baseItem.enableToolTip = false;
		this.baseItem.enableToolTipOpt = false;
		this.baseItem.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		this._data = data;
		this.nameLoader.load(URLManager.getModuleImgUrl(`petEquip_${data.type}.png`, PackNameEnum.Pet));
		// this.baseItem.updateNum("");
		if(data.itemCode){
			this.nameLoader.visible = false;
			this.itemData = new ItemData(data.itemCode);
		}else{
			this.nameLoader.visible = true;
			this.itemData = null;
		}
		this.baseItem.itemData = this.itemData;
		CommonUtils.setBtnTips(this, CacheManager.pet.isEquipHasTipByType(data.type),56,-12,false);
	}

	private click(): void{
		let level: number = 0;
		let dressEquip: ItemData;
		if(this.itemData){
			level = this.itemData.getItemLevel();
		}
		dressEquip = CacheManager.pack.propCache.getPetEquipMaxLevel(level, this._data.type);
		if(dressEquip){
			ProxyManager.shape.shapeDressEquip(EShape.EShapePet, this._data.type, dressEquip.getCode());
		}else if(this.itemData){
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			// this.toolTipData.isEnableOptList = this.enableToolTipOpt;
			this.toolTipData.data = this.itemData;
			// this.toolTipData.extData = this.extData;
			this.toolTipData.type = ItemsUtil.getToolTipType(this.itemData);
			this.toolTipData.source = ToolTipSouceEnum.PetEquip;
			ToolTipManager.show(this.toolTipData);
		}else{
			Tip.showTip("没有可穿戴的宠物装备");
		}
	}

	public getIconRes(icon: number): string {
		if (icon) {
			return URLManager.getIconUrl(icon, URLManager.ITEM_ICON);
		}
		return "";
	}
}