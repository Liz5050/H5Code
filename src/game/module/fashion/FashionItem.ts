class FashionItem extends ListRenderer{
	private baseItem: BaseItem;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private activeTxt: fairygui.GTextField;
	private controller: fairygui.Controller;
	private _fashionData: any;
	private _tipImg:fairygui.GImage;
	private fashionCache:any;
	public constructor() {
		super();
	}
	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.levelTxt = this.getChild("txt_number").asTextField;
		this.activeTxt = this.getChild("txt_condition").asTextField;
		this.controller = this.getController("c1");
		this.baseItem.touchable = false;

		this._tipImg = GUIUtils.getRedTips();
		this.addChild(this._tipImg);
		this._tipImg.x = this.baseItem.x + (this.baseItem.width - this._tipImg.width);
		this._tipImg.y = this.baseItem.y;
	}

	public setData(fashionData:any):void{
		this._fashionData = fashionData;
		switch(fashionData.type){
			case 1:
				this.fashionCache = CacheManager.clothesFashion;
				break;
			case 2:
				this.fashionCache = CacheManager.weaponFashion;
				break;
		}
		this.nameTxt.text = fashionData.name;
		let star: number = this.fashionCache.getStar(this._fashionData.code);
		if(star > -1){
			// if(star == 0){
			// 	this.controller.selectedIndex = (fashionData.code == fashionCache.equipFashion) ? 4 : 1;
			// }
			// else{
			// 	this.levelTxt.text = star.toString();
			// 	this.controller.selectedIndex = (fashionData.code == fashionCache.equipFashion) ? 3 : 2;
			// }
			this.levelTxt.text = star.toString();
			this.controller.selectedIndex = (fashionData.code == this.fashionCache.equipFashion) ? 3 : 2;
		}
		else{
			this.activeTxt.text = "未激活";
			this.controller.selectedIndex = 0;
		}
		// let icon: number = ConfigManager.item.getByPk(fashionData.propCode).icon;
		// this.loadIcon(this.getIconRes(icon));
		this.baseItem.itemData = new ItemData(fashionData.propCode);
		this.baseItem.grayed = star < 0;
		this.updateTips();
	}
	public updateTips():void{
		var num:number = CacheManager.pack.backPackCache.getItemCountByCode2(this._fashionData.propCode);
		let star: number = this.fashionCache.getStar(this._fashionData.code);
		var isFullStar:boolean = ShapeUtils.isShapeFullStar(star);
		this._tipImg.visible = num>0 && !isFullStar;
	}
	// public getIconRes(icon: number):string{
	// 	if(icon){
	// 		return `resource/assets/icon/item/${icon}.png`;
	// 	}
	// 	return "";
	// }
}