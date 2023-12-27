class ShapeChangeItem extends ListRenderer{
	private iconLoader: GLoader;
	private levelTxt: fairygui.GTextField;
	private controller: fairygui.Controller;
	private _changeData: any;

	private tip: boolean;
	
	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.controller = this.getController("c1");
	}

	public setData(changeData:any):void{
		this._changeData = changeData;
		this.iconLoader.load(URLManager.getIconUrl(changeData.change, URLManager.Shape_Change_Icon));
		this.levelTxt.text = `${changeData.level}`;
		this.levelTxt.visible = changeData.isActived;
		if(changeData.isActived){
			this.controller.selectedIndex = 1;
		}else{
			this.controller.selectedIndex = 0;
		}
		this.tip = false;
		if(CacheManager.shape.isChangedModel(changeData.shape, changeData.cfg.modelId, changeData.roleIndex)){
			this.controller.selectedIndex = 2;
		}
		// if(changeData.shape == EShape.EShapePet){
		// 	this.tip = CacheManager.petChange.checkTipsByChangeData(changeData.change, changeData);//宠物幻形的红点
		// }
		// else if(changeData.shape == EShape.EShapeSpirit){
		// 	this.tip = CacheManager.magicWeaponChange.checkTipsByChangeData(changeData.change, changeData);//法宝幻形的红点
		// }else{
		// 	this.tip = CacheManager.shape.checkTipsByChangeData(changeData.change, changeData, changeData.roleIndex);
		// }
		switch(changeData.shape){
			case EShape.EShapePet:
				this.tip = CacheManager.petChange.checkTipsByChangeData(changeData.change, changeData);//宠物幻形的红点
				break;
			case EShape.EShapeSpirit:
				this.tip = CacheManager.magicWeaponChange.checkTipsByChangeData(changeData.change, changeData);//法宝幻形的红点
				break;
			case EShape.EShapeLaw:
				this.tip = CacheManager.magicArrayChange.checkTipsByChangeData(changeData.change, changeData, changeData.roleIndex);
				break;
			case EShape.EShapeBattle:
				this.tip = CacheManager.battleArrayChange.checkTipsByChangeData(changeData.change, changeData, changeData.roleIndex);
				break;
			case EShape.EShapeSwordPool:
				this.tip = CacheManager.swordPoolChange.checkTipsByChangeData(changeData.change, changeData, changeData.roleIndex);
				break;
			case EShape.EShapeMount:
				this.tip = CacheManager.mountChange.checkTipsByChangeData(changeData.change, changeData, changeData.roleIndex);
				break;
			case EShape.EShapeWing:
				this.tip = CacheManager.shapeWingChange.checkTipsByChangeData(changeData.change, changeData, changeData.roleIndex);
				break;
		}
		CommonUtils.setBtnTips(this, this.tip);
	}

	public get changeData(): any{
		return this._changeData;
	}

	public get hasTip():boolean{
		return this.tip;
	}

}