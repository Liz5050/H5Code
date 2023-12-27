class StoneInlayItem extends fairygui.GComponent{
	private jewelNameTxt: fairygui.GTextField;
	private jewelAttrTxt: fairygui.GTextField;
	private conditionTxt: fairygui.GTextField;
	private iconLoader: GLoader;
	private conditionController: fairygui.Controller;
	private vipController: fairygui.Controller;
	private attrController: fairygui.Controller;
	private toolTipData: ToolTipData;
	private _inlayData: any;
	// private _itemCode: number;
	private _inlayColor: number;
	private _equipUid: string;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.jewelNameTxt = this.getChild("txt_JewelName").asTextField;
		this.jewelAttrTxt = this.getChild("txt_JewelAttr").asTextField;
		this.conditionTxt = this.getChild("txt_condition").asTextField;
		this.iconLoader = this.getChild("loader") as GLoader;
		this.conditionController = this.getController("c1");
		this.vipController = this.getController("c2");
		this.attrController = this.getController("c3");
		this.iconLoader.addClickListener(this.click, this);
	}

	public setData(itemCode: number):void{
		this.inlayData["code"] = itemCode;
		this.vipController.selectedIndex = this.inlayData["vip"];
		switch(this.inlayData["pos"]){//设置加成属性的显示位置
			case 3:
				this.attrController.selectedIndex = 3;
				break;
			case 4:
			case 5:
				this.attrController.selectedIndex = 1;
				break;
			default:
				this.attrController.selectedIndex = 0;
				break;
		}

		this.touchable = true;
		this.iconLoader.clear();
		if(itemCode == 0){//镶嵌孔位未开启
			this.conditionTxt.text = GameDef.NumberName[this.inlayData["unLock"]] + "阶装备解锁";
			this.conditionController.selectedIndex = 0;
			this.touchable = false;
		}
		else if(itemCode == 1){//镶嵌孔位已开启未镶嵌
			this.conditionController.selectedIndex = 1;
		}
		else{//已镶嵌宝石
			this.conditionController.selectedIndex = 2;
			let itemData: ItemData = new ItemData(itemCode);
			let level: number = itemData.getItemLevel();
			this.jewelNameTxt.text = `${level}级${this.inlayData["color"] == EProp.EPropJewelAdvance ? "红" : "蓝"}宝石`;
			this.jewelAttrTxt.text = this.setAttr(level);
			this.iconLoader.load(itemData.getIconRes());
		}
		let point: egret.Point = new egret.Point();
		point.setTo(195,40);
		CommonUtils.setBtnTips(this, this.isBtnTip(), 195,40,false);
	}

	public set inlayData(inlayData: any){
		this._inlayData = inlayData;
	}

	public get inlayData(): any{
		return this._inlayData;
	}

	/**宝石的加成属性 */
	private setAttr(level: number):string{
		if(level){
			let attr: string = "";
			let jewelData: any = ConfigManager.jewel.getByPk(level);
			let jewelDict: any = WeaponUtil.getAttrDict(this.inlayData["color"] == EProp.EPropJewelAdvance ? jewelData.attackAttrList : jewelData.defenseAttrList);
			for(let key in jewelDict){
				attr += `${GameDef.EJewelName[key][0]} +${jewelDict[key]}\n`;
			}
			return attr;
		}
		return "";
	}

	/**点击弹出tooltip */
	private click(): void {
		if (this.inlayData) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			// this.toolTipData.data = this._itemCode;
			this.toolTipData.data = this.inlayData;
			this.toolTipData.type = ToolTipTypeEnum.Stone;
			ToolTipManager.show(this.toolTipData);
		}
	}

	private isBtnTip(): boolean{
		if(this._inlayData["code"] > 1){
			let stoneItems: Array<ItemData> = [];
			let itemData: ItemData = new ItemData(this._inlayData["code"]);
			stoneItems = CacheManager.pack.backPackCache.getByCT(ECategory.ECategoryJewel, this._inlayData["color"]);
			if(stoneItems.length > 0){
				for(let stoneItem of stoneItems){
					if(stoneItem.getItemLevel() > itemData.getItemLevel()){
						return true;
					}
				}
			}
		}
		return false;
	}

	public getIconRes(icon: number):string{
		if(icon){
			return `resource/assets/icon/item/${icon}.png`;
		}
		return "";
	}
}