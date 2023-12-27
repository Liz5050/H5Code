class WeaponFashionPanel extends BaseFashionsPanel{
	private fightTxt: fairygui.GTextField;
	private weaponNameTxt: fairygui.GTextField;
	private starsList: fairygui.GList;
	private attrAddList: fairygui.GList;
	//private weaponList: List;
	
	private unLoadBtn: fairygui.GButton;
	private weaponItem: BaseItem;
	private modelContainer: fairygui.GComponent;
	private playerModel: PlayerModel;

	private preChangeSelect: number;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super(view, controller, index);
	}

	public initOptUI():void{
		this.fightTxt = this.getGObject("txt_fight").asTextField;
		this.weaponNameTxt = this.getGObject("txt_name").asTextField;
		this.starsList = this.getGObject("list_stars").asList;
		this.attrAddList = this.getGObject("list_attributeup").asList;
		this.list_fashion = new List(this.getGObject("list_fashion").asList);
		this.starsUpBtn = this.getGObject("btn_starsup").asButton;
		this.unLoadBtn = this.getGObject("btn_unload").asButton;
		this.activationBtn = this.getGObject("btn_activation").asButton;
		this.weaponItem = <BaseItem>this.getGObject("baseItem");
		this.list_fashion.list.addEventListener(fairygui.ItemEvent.CLICK, this.setCurrentChange, this);
		this.activationBtn.addClickListener(this.clickActivationBtn, this);
		this.starsUpBtn.addClickListener(this.clickStarUpBtn, this);
		this.unLoadBtn.addClickListener(this.clickUnLoadBtn, this);

		this.modelContainer = this.getGObject("model_container").asCom;
	}

	public updateAll():void{
		CacheManager.weaponFashion.listData();
		CacheManager.weaponFashion.sortFashion();
		this.list_fashion.data = CacheManager.weaponFashion.fashionsData;
		this.list_fashion.list.selectedIndex = 0;
		this.setCurrentChange();
	}

	public addModel(playerModel:PlayerModel):void{
		this.playerModel = playerModel;
		this.playerModel.showArray = [EEntityAttribute.EAttributeClothes, EEntityAttribute.EAttributeWeapon];
		this.playerModel.removeFromParent();
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.playerModel);
		this.playerModel.updateAll();		
	}

	//升级后需要更新
	public setChanges():void{
		this.list_fashion.data = CacheManager.weaponFashion.fashionsData;
		this.list_fashion.list.selectedIndex = this.preChangeSelect;
		this.setCurrentChange();
		
	}

	/**发送激活请求 */
	private clickActivationBtn(): void{
		let amount: number = CacheManager.pack.backPackCache.getItemCountByCode2(CacheManager.weaponFashion.propCode);
		if(amount > 0){
			ProxyManager.fashion.activateFashion(CacheManager.weaponFashion.type, CacheManager.weaponFashion.code);
		}
		else{
			Tip.showTip("道具不足，无法激活");
		}
	}

	/**发送升星请求 */
	private clickStarUpBtn(): void{
		let amount: number = CacheManager.pack.backPackCache.getItemCountByCode2(CacheManager.weaponFashion.propCode);
		if(ShapeUtils.isShapeFullStar(CacheManager.weaponFashion.star)){
			Tip.showTip("星级已满，无法提升");
		}
		else if(amount > 0){
			ProxyManager.fashion.upgradeFashion(CacheManager.weaponFashion.type, CacheManager.weaponFashion.code); //升星
		}
		else{
			Tip.showTip("道具不足，无法提升");
		}
	}

	/**发送时装装备or卸下请求 */
	private clickUnLoadBtn(): void{
		if(CacheManager.weaponFashion.code == CacheManager.weaponFashion.equipFashion){
			ProxyManager.fashion.undressFashion(CacheManager.weaponFashion.type, CacheManager.weaponFashion.code);
		}
		else{
			ProxyManager.fashion.dressFashion(CacheManager.weaponFashion.type, CacheManager.weaponFashion.code);
		}
		this.unLoadBtn.text = (CacheManager.weaponFashion.code == CacheManager.weaponFashion.equipFashion) ? "卸下" : "穿戴";
	}

	/**
	 * 设置当前选择外形数据，更新页面显示
	 */
	private setCurrentChange():void{
		this.preChangeSelect = this.list_fashion.list.selectedIndex;
		CacheManager.weaponFashion.currentChangeData = CacheManager.weaponFashion.fashionsData[this.list_fashion.list.selectedIndex];
		// this.spiritChangeModel.setData(CacheManager.spiritChange.change);
		CacheManager.weaponFashion.setAttrs();
		this.activationBtn.visible = CacheManager.weaponFashion.star < 0;
		this.starsUpBtn.visible = !(CacheManager.weaponFashion.star < 0);
		this.unLoadBtn.visible = !(CacheManager.weaponFashion.star < 0);
		this.starsUpBtn.grayed = CacheManager.weaponFashion.star > 4;
		this.unLoadBtn.text = (CacheManager.weaponFashion.code == CacheManager.weaponFashion.equipFashion) ? "卸下" : "穿戴";
		if(CacheManager.weaponFashion.star > 4){
			this.starsUpBtn.removeClickListener(this.clickStarUpBtn, this);
		}
		else{
			this.starsUpBtn.addClickListener(this.clickStarUpBtn, this);
		}		
		this.updateCombat();
		this.updateAttr();
		this.updateItem();
		this.updateWeapon();

	}

	private updateWeapon():void{
		let modelId:number = CacheManager.weaponFashion.modelId;
		this.playerModel.updateWeapon(modelId);
	}

	/**
	 * 更新战力
	 */
	private updateCombat():void{
		let attrItems: any = CacheManager.weaponFashion.attrItems;
		let fight: number = 0;
		for(let data of attrItems){
			switch(data["name"]){
				case GameDef.EJewelName[EJewel.EJewelLife][0]:
					fight += data["value"]*0.5;
					break;
				default :
					fight += data["value"]*10;
					break;
			}
		}
		this.starsList.removeChildrenToPool();
		for(let i = 0; i < CacheManager.weaponFashion.star; i++){
			this.starsList.addItemFromPool();
		}
		this.fightTxt.text = fight.toString();
		this.weaponNameTxt.text = CacheManager.weaponFashion.name;
	}

	/**
	 * 更新升星材料
	 */
	public updateItem():void{
		let amount: number = CacheManager.pack.backPackCache.getItemCountByCode2(CacheManager.weaponFashion.propCode);
		let useAmount: number = CacheManager.weaponFashion.useNum;
		var isOk:boolean = amount >= useAmount;
		let color: string = isOk ? "#00ff00" : "#ff0000";
		this.weaponItem.itemData = new ItemData(CacheManager.weaponFashion.propCode);
		this.weaponItem.updateNum(`<font color='${color}'>${amount}/${useAmount}</font>`);
		this.weaponItem.iconLoader.grayed = !amount;
		this.weaponItem.numTxt.stroke = 2;
		var isFullStar:boolean = ShapeUtils.isShapeFullStar(CacheManager.weaponFashion.star);
		isOk = isOk && !isFullStar;
		this.setBtnTip(isOk);
		this.updateCurFashionItemTips();	
	}

	/**
	 * 更新化形基本属性
	 */
	private updateAttr():void{
		let attrItems: any = CacheManager.weaponFashion.attrItems;
		this.attrAddList.removeChildrenToPool();
		if(attrItems){
			for(let data of attrItems){
				let attrItem: fairygui.GComponent = this.attrAddList.addItemFromPool().asCom;
				let typeTxt: fairygui.GTextField = attrItem.getChild("txt_type").asTextField;
				let typeValueTxt: fairygui.GTextField = attrItem.getChild("txt_typeSum").asTextField;
				let typeIncreaseTxt: fairygui.GTextField = attrItem.getChild("txt_typeIncrease").asTextField;
				typeTxt.text = data["name"] + ":";
				typeValueTxt.text = data["value"];
				typeIncreaseTxt.text = data["typeIncrease"];
				typeIncreaseTxt.visible = CacheManager.weaponFashion.star < 5;
				attrItem.getChild("up").visible = CacheManager.weaponFashion.star < 5;
			}
		}
	}
}