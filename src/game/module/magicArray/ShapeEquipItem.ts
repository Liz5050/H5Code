class ShapeEquipItem extends ListRenderer {

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
		switch(data.shape) {
			case EShape.EShapeLaw:
				this.nameLoader.load(URLManager.getModuleImgUrl(`lawEquip_${data.type}.png`, PackNameEnum.MagicArray));
				break;
			case EShape.EShapeBattle:
				this.nameLoader.load(URLManager.getModuleImgUrl(`${data.type}.png`, PackNameEnum.ShapeBattle));
				break;
			case EShape.EShapeMount:
				this.nameLoader.load(URLManager.getModuleImgUrl(`mountEquip_${data.type}.png`, PackNameEnum.Mount));
				break;
			case EShape.EShapeSwordPool:
				this.nameLoader.load(URLManager.getModuleImgUrl(`swordEquip_${data.type}.png`, PackNameEnum.SwordPool));
				break;
			default:
				this.nameLoader.clear();
				break;
		}
		
		// this.baseItem.updateNum("");
		if(data.itemCode){
			this.nameLoader.visible = false;
			this.itemData = new ItemData(data.itemCode);
		}else{
			this.nameLoader.visible = true;
			this.itemData = null;
		}
		this.baseItem.itemData = this.itemData;
		//CommonUtils.setBtnTips(this, CacheManager.pet.isEquipHasTipByType(data.type),56,-12,false);
	}

	private click(): void{
		let level: number = 0;
		let dressEquip: ItemData;

		if(!this.itemData) {
			var equips = CacheManager.pack.propCache.getShapeEquipsByPos(this._data.shape, this._data.type);
			if(equips.length > 0) {
				var equipData = {"dressPos": this._data.type,  "roleIndex":this._data.roleIndex, "shape":this._data.shape};
				EventManager.dispatch(UIEventEnum.ShapeEquipReplaceOpen,equipData);
			}
			else{
				Tip.showLeftTip(`没有可穿戴的${this.getPosTxt(this._data.shape,this._data.type)}装备`);
			}
		}
		else {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.isEnableOptList = true;
			this.toolTipData.data = this.itemData;
			this.toolTipData.extData = "equip";
			this.toolTipData.type = ItemsUtil.getToolTipType(this.itemData);
			this.toolTipData.source = ToolTipSouceEnum.PetEquip;
			this.toolTipData.roleIndex = this._data.roleIndex;
			ToolTipManager.show(this.toolTipData);
		}
	}

	public getIconRes(icon: number): string {
		if (icon) {
			return URLManager.getIconUrl(icon, URLManager.ITEM_ICON);
		}
		return "";
	}

	private getPosTxt(shape : EShape, type : number) : string {
		switch(shape) {
			case EShape.EShapeLaw: 
				return GameDef.EShapeLawEquipType[type];
			case EShape.EShapePet: 
				return GameDef.EShapePetEquipType[type];
			case EShape.EShapeBattle:
				return GameDef.EShapeBattleEquipType[type];
			case EShape.EShapeMount: 
				return GameDef.EShapeMountEquipType[type];
			case EShape.EShapeSwordPool:
				return GameDef.EShapeSwordPoolEquipType[type];
			default: 
				return "";
		}
	}
}