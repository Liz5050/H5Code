/**
 * 道具合成界面
 */

class ComposeItemPanel extends BaseTabPanel{
	private composeItem: BaseItem;
	private costTxt: fairygui.GTextField;
	private composeBtn: fairygui.GButton;
	private oneKeyComposeBtn: fairygui.GButton;
	private smeltTypeList: fairygui.GList;
	private composeItemList: List;
	private materialItems: Array<ComposeMaterialItem>;
	private materialData: Array<any>;
	private smeltTypeData: Array<any>;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void{
		this.composeItem = <BaseItem>this.getGObject("BaseItem_produce");
		this.costTxt = this.getGObject("txt_num").asTextField;
		this.composeBtn = this.getGObject("btn_compose").asButton;
		this.oneKeyComposeBtn = this.getGObject("btn_onekey").asButton;
		this.smeltTypeList = this.getGObject("list_category").asList;
		this.composeItemList = new List(this.getGObject("list_type").asList);//把smeltPlan表数据存在这里，可通过字段smeltMaterialList获取合成材料和、需要数量和费用，合成的物品也可以从中读取
		this.smeltTypeList.addEventListener(fairygui.ItemEvent.CLICK, this.updateComposeItemList, this);
		this.composeItemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.updateComposeItem, this);
		this.composeBtn.addClickListener(this.clickComposeBtn, this);
		this.oneKeyComposeBtn.addClickListener(this.clickOneKeyBtn, this);
		
		this.materialItems = [];
		for(let i = 0; i < 4; i++){
			let item: ComposeMaterialItem = <ComposeMaterialItem>this.getGObject("BaseItem_material" + (i+1));
			this.materialItems.push(item);
		}
	}

	public updateAll(): void{
		this.updateSmeltType();
		this.enableSmelt(false);
	}

	protected onTabChanged(e: any): void {
		super.onTabChanged(e);
		this.enableSmelt(false);
	}

	/**点击合成 */
	private clickComposeBtn(): void{
		this.smelt();
	}

	/**点击一键合成 */
	private clickOneKeyBtn(): void{
		if(ControllerManager.compose.isSmelt){
			this.enableSmelt(false);
		}else{
			ControllerManager.compose.isSmelt = true;
			this.oneKeyComposeBtn.title = "停止";
			this.enableSmelt(true);
		}
	}

	/**能否合成 */
	public enableSmelt(enable: boolean): void{
		if(enable){
			this.smelt();
		}else if(this.oneKeyComposeBtn.title == "停止"){
			this.oneKeyComposeBtn.title = "一键合成";
			ControllerManager.compose.isSmelt = enable;
		}
	}

	/**合成，发送消息到服务器 */
	private smelt(): void{
		ProxyManager.compose.smelt(this.composeItemList.selectedData.smeltPlanCode);
	}

	/**更新道具合成的所有数据 */
	private updateSmeltType(): void{
		this.smeltTypeData = [];
		let typeData: Array<any> = ConfigManager.smeltCategory.select({"smeltCategory": 1});
		this.smeltTypeList.removeChildrenToPool();
		for(let data of typeData){
			if(data.openLevel <= CacheManager.role.getRoleLevel()){
				let item: fairygui.GButton = this.smeltTypeList.addItemFromPool().asButton;
				this.smeltTypeData.push(data);
				item.title = data.smeltTypeName;
			}
		}
		this.smeltTypeList.selectedIndex = 0;
		this.updateComposeItemList();
	}

	/**更新合成道具列表 */
	private updateComposeItemList(): void{
		let selectTypeData: any = this.smeltTypeData[this.smeltTypeList.selectedIndex];
		let ComposeData: Array<any> = ConfigManager.smeltPlan.select({"smeltCategory": selectTypeData.smeltCategory, "smeltType": selectTypeData.smeltType});
		this.composeItemList.data = ComposeData;
		this.composeItemList.selectedIndex = 0;
		this.updateComposeItem();
	}

	/**更新选中的将合成的道具 */
	private updateComposeItem(): void{
		let selectData: any = this.composeItemList.selectedData;
		let materialDict: any = WeaponUtil.getAttrDict(selectData.smeltMaterialList);
		this.materialData = [];
		this.composeItem.itemData = new ItemData(selectData.showItemCode);
		this.composeItem.showBind();
		this.costTxt.text = selectData.smeltPlanCost;
		for(let key in materialDict){
			let itemData: ItemData = new ItemData(key);
			this.materialData.push({"needNum": materialDict[key], "itemData": itemData});
		}
		this.updateMaterial();
	}

	/**更新合成材料 */
	public updateMaterial(): void{
		for(let i = 0; i < 4; i++){
			if(this.materialData[i]){
				this.materialItems[i].setData(this.materialData[i]);
			}else{
				this.materialItems[i].setData(null);
			}
		}
	}
}