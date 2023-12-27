class ClothesFashionPanel extends BaseFashionsPanel{
	private fightTxt: fairygui.GTextField;
	private clothNameTxt: fairygui.GTextField;
	private starsList: fairygui.GList;
	private attrAddList: fairygui.GList;
	private unLoadBtn: fairygui.GButton;
	
	private clothItem: BaseItem;
	private modelContainer: fairygui.GComponent;
	private playerModel: PlayerModel;

	private preChangeSelect: number;


	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super(view, controller, index);
	}

	public initOptUI():void{
		this.fightTxt = this.getGObject("txt_fight").asTextField;
		this.clothNameTxt = this.getGObject("txt_name").asTextField;
		this.starsList = this.getGObject("list_stars").asList;
		this.attrAddList = this.getGObject("list_attributeup").asList;
		this.list_fashion = new List(this.getGObject("list_fashion").asList);
		this.starsUpBtn = this.getGObject("btn_starsup").asButton;
		this.unLoadBtn = this.getGObject("btn_unload").asButton;
		this.activationBtn = this.getGObject("btn_activation").asButton;
		this.clothItem = <BaseItem>this.getGObject("baseItem");
		this.list_fashion.list.addEventListener(fairygui.ItemEvent.CLICK, this.setCurrentChange, this);
		this.activationBtn.addClickListener(this.clickActivationBtn, this);
		this.starsUpBtn.addClickListener(this.clickStarUpBtn, this);
		this.unLoadBtn.addClickListener(this.clickUnLoadBtn, this);

		this.modelContainer = this.getGObject("model_container").asCom;
	}

	public updateAll():void{
		CacheManager.clothesFashion.listData();
		CacheManager.clothesFashion.sortFashion();
		this.list_fashion.data = CacheManager.clothesFashion.fashionsData;
		this.list_fashion.list.selectedIndex = 0;
		this.setCurrentChange();
	}

	//升级后需要更新
	public setChanges():void{
		
		this.list_fashion.data = CacheManager.clothesFashion.fashionsData;
		this.list_fashion.list.selectedIndex = this.preChangeSelect;
		this.setCurrentChange();
	}

	public addModel(playerModel:PlayerModel):void{
		this.playerModel = playerModel;
		this.playerModel.showArray = [EEntityAttribute.EAttributeClothes, EEntityAttribute.EAttributeWeapon];
		this.playerModel.removeFromParent();
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.playerModel);
		this.playerModel.updateAll();
	}

	

	/**发送激活请求 */
	private clickActivationBtn(): void{
		let amount: number = CacheManager.pack.backPackCache.getItemCountByCode2(CacheManager.clothesFashion.propCode);
		if(amount > 0){
			ProxyManager.fashion.activateFashion(CacheManager.clothesFashion.type, CacheManager.clothesFashion.code);
		}
		else{
			Tip.showTip("道具不足，无法激活");
		}
		
	}

	/**发送升星请求 */
	private clickStarUpBtn(): void{
		let amount: number = CacheManager.pack.backPackCache.getItemCountByCode2(CacheManager.clothesFashion.propCode);
		if(ShapeUtils.isShapeFullStar(CacheManager.clothesFashion.star)){
			Tip.showTip("星级已满，无法提升");
		}
		else if(amount > 0){
			ProxyManager.fashion.upgradeFashion(CacheManager.clothesFashion.type, CacheManager.clothesFashion.code); //升星
		}
		else{
			Tip.showTip("道具不足，无法提升");
		}
	}

	/**发送时装装备or卸下请求 */
	private clickUnLoadBtn(): void{
		if(CacheManager.clothesFashion.code == CacheManager.clothesFashion.equipFashion){
			ProxyManager.fashion.undressFashion(CacheManager.clothesFashion.type, CacheManager.clothesFashion.code);
		}
		else{
			ProxyManager.fashion.dressFashion(CacheManager.clothesFashion.type, CacheManager.clothesFashion.code);
		}
		this.unLoadBtn.text = (CacheManager.clothesFashion.code == CacheManager.clothesFashion.equipFashion) ? "卸下" : "穿戴";
	}

	/**
	 * 设置当前选择外形数据，更新页面显示
	 */
	private setCurrentChange():void{
		this.preChangeSelect = this.list_fashion.list.selectedIndex;
		CacheManager.clothesFashion.currentChangeData = CacheManager.clothesFashion.fashionsData[this.list_fashion.list.selectedIndex];
		CacheManager.clothesFashion.setAttrs();

		this.activationBtn.visible = CacheManager.clothesFashion.star < 0;
		this.starsUpBtn.visible = !(CacheManager.clothesFashion.star < 0);
		this.unLoadBtn.visible = !(CacheManager.clothesFashion.star < 0);
		this.starsUpBtn.grayed = CacheManager.clothesFashion.star > 4;
		this.unLoadBtn.text = (CacheManager.clothesFashion.code == CacheManager.clothesFashion.equipFashion) ? "卸下" : "穿戴";
		if(CacheManager.clothesFashion.star > 4){
			this.starsUpBtn.removeClickListener(this.clickStarUpBtn, this);
		}
		else{
			this.starsUpBtn.addClickListener(this.clickStarUpBtn, this);
		}

		this.updateCombat();
		this.updateAttr();
		this.updateItem();		
		this.updateClothes();
	}

	private updateClothes():void{
		let modelId:number = CacheManager.clothesFashion.modelId;
		this.playerModel.updatePlayer(modelId);
	}

	/**
	 * 更新战力
	 */
	private updateCombat():void{
		let attrItems: any = CacheManager.clothesFashion.attrItems;
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
		for(let i = 0; i < CacheManager.clothesFashion.star; i++){
			this.starsList.addItemFromPool();
		}
		this.fightTxt.text = fight.toString();
		this.clothNameTxt.text = CacheManager.clothesFashion.name;
	}

	/**
	 * 更新升星材料
	 */
	 public updateItem():void{
		let amount: number = CacheManager.pack.backPackCache.getItemCountByCode2(CacheManager.clothesFashion.propCode);
		let useAmount: number = CacheManager.clothesFashion.useNum;
		var isOk:boolean = amount >= useAmount;
		let color: string = isOk ? "#00ff00" : "#ff0000";
		this.clothItem.itemData = new ItemData(CacheManager.clothesFashion.propCode);
		this.clothItem.updateNum(`<font color='${color}'>${amount}/${useAmount}</font>`);
		this.clothItem.iconLoader.grayed = !amount;
		this.clothItem.numTxt.stroke = 2;
		var isFullStar:boolean = ShapeUtils.isShapeFullStar(CacheManager.clothesFashion.star);
		isOk = isOk && !isFullStar;
		this.setBtnTip(isOk);
		this.updateCurFashionItemTips();
	}

	/**
	 * 更新化形基本属性
	 */
	private updateAttr():void{
		let attrItems: any = CacheManager.clothesFashion.attrItems;
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
				// if(data["name"] == GameDef.EJewelName[EJewel.EJewelPhysicalAttackLevelAdd][0] || data["name"] == GameDef.EJewelName[EJewel.EJewelKnowingRate][0]){
				// 	typeValueTxt.text = data["value"]/100 + "%";
				// 	typeIncreaseTxt.text = data["typeIncrease"]/100 + "%";
				// }
				typeIncreaseTxt.visible = CacheManager.clothesFashion.star < 5;
				attrItem.getChild("up").visible = CacheManager.clothesFashion.star < 5;
			}
		}
	}
}