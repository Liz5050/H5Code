/**
 * 装备合成
 */

class ComposeEquipPanel extends BaseTabPanel{
	private rateTxt: fairygui.GTextField;
	private composeBtn: fairygui.GButton;
	private oneKeyBtn: fairygui.GButton;
	private explainBtn: fairygui.GButton;
	private composeItem: BaseItem;
	private starCombobox: fairygui.GComboBox;
	private levelCombobox: fairygui.GComboBox;
	private equipList: fairygui.GList;
	private typeController: fairygui.Controller;
	private statusController: fairygui.Controller;
	private materialItems: Array<ComposeMaterialItem>;
	private equipItems: Array<ComposeMaterialItem>;
	private smeltCategoryData: Array<any>;
	private selectTypeDatas: Array<any>;
	private selectStarDatas: Array<any>;
	private selectLevelDatas: Array<any>;
	private materialData: Array<any>;
	private equipData: Array<any>;
	private toolTipData: ToolTipData;
	private selectUids: any;


	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void{
		this.rateTxt = this.getGObject("txt_rate").asTextField;
		this.composeBtn = this.getGObject("btn_compose").asButton;
		this.oneKeyBtn = this.getGObject("btn_onekey").asButton;
		this.explainBtn = this.getGObject("btn_explain").asButton;
		this.composeItem = <BaseItem>this.getGObject("BaseItem_produce");
		this.starCombobox = this.getGObject("combobox_star").asComboBox;
		this.levelCombobox = this.getGObject("combobox_rank").asComboBox;
		this.equipList = this.getGObject("list_item").asList;
		this.typeController = this.getController("c1");
		this.statusController = this.getController("c2");
		this.composeBtn.addClickListener(this.clickCompose, this);
		this.oneKeyBtn.addClickListener(this.clickOneKeyAdd, this);
		this.explainBtn.addClickListener(this.clickExplainBtn, this);
		this.typeController.addEventListener(fairygui.StateChangeEvent.CHANGED, this.updateStarCombobox, this);
		this.starCombobox.addEventListener(fairygui.StateChangeEvent.CHANGED, this.updateLevelCombobox, this);
		this.levelCombobox.addEventListener(fairygui.StateChangeEvent.CHANGED, this.updateEquipList, this);
		this.equipList.addEventListener(fairygui.ItemEvent.CLICK, this.onEquipChanged, this);

		this.materialItems = [];
		for(let i = 0; i < 2; i++){
			let item: ComposeMaterialItem = <ComposeMaterialItem>this.getGObject("BaseItem_material" + (i+1));
			this.materialItems.push(item);
		}

		this.equipItems = [];
		for(let i = 0; i < 5; i++){
			let item: ComposeMaterialItem = <ComposeMaterialItem>this.getGObject("BaseItem_equip" + (i+1));
			this.equipItems.push(item);
		}
	}

	public updateAll(): void{
		this.updateSmeltType();
	}

	/**更新选中的装备 */
	public onEquipChanged():void{
		let selectEquipData: any = this.selectLevelDatas[this.equipList.selectedIndex];
		this.composeItem.itemData = new ItemData(selectEquipData.targetCode);
		this.composeItem.setStarNum(selectEquipData.star);
		this.composeItem.extData = {"bestRecommand": true};
		this.materialData = [];
		if(selectEquipData.materials){
			let materialStr = selectEquipData.materials.split("#");
			for (let str of materialStr){
				let itemData: ItemData = RewardUtil.getReward(str);
				this.materialData.push({"needNum": itemData.getItemAmount(), "itemData": itemData});
			}
		}
		this.updateMaterial();
		this.updateEquip();
		this.selectUids = {};
		this.rateTxt.text = `0%`;
		this.composeBtn.enabled = false;
	}

	/**更新合成材料 */
	public updateMaterial(): void{
		for(let i = 0; i < 2; i++){
			if(this.materialData[i]){
				this.materialItems[i].setData(this.materialData[i]);
			}else{
				this.materialItems[i].setData(null);
			}
		}
	}

	/**更新某个合成装备的数据 */
	public updateEquip(): void{
		let selectEquipData: any = this.selectLevelDatas[this.equipList.selectedIndex];
		this.equipData = [];
		for(let i = 0; i < 5; i++){
			if(i < selectEquipData.equipNum){
				this.equipData.push({"isOpen": true, "pos": i});
				this.equipItems[i].setData(this.equipData[i]);
			}else{
				this.equipItems[i].setData(null);
			}
			this.equipItems[i].addClickListener(this.clickAddEquip, this);
		}
		this.composeBtn.enabled = false;
	}

	/**点击+，打开可用于合成的装备列表*/
	private clickAddEquip(e: any): void{
		let item: ComposeMaterialItem = <ComposeMaterialItem> e.target;
		let uids: any = {};
		if(item.isShowToolTip()){
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.data = this.selectLevelDatas[this.equipList.selectedIndex];
			this.toolTipData.extData = {"pos": item.getPos(), "uids": this.selectUids};
			this.toolTipData.type = ToolTipTypeEnum.Compose;
			ToolTipManager.show(this.toolTipData);
		}
	}

	/**点击合成 */
	private clickCompose(): void{
		let equipAmount: number = 0;
		for(let key in this.selectUids){
			if(this.selectUids[key]){
				equipAmount++;
			}
		}
		AlertII.show(`您当前放入<font color = "#01AB26">${equipAmount}</font>件装备，成功率为<font color = "#01AB26">${this.rateTxt.text}</font>，是否合成`, null, this.smeltEquip, this, [AlertType.NO, AlertType.YES], ["取消","确定"], null);
	}

	/**点击一键添加 */
	private clickOneKeyAdd(): void{
		if(this.statusController.selectedIndex == 0){
			Tip.showTip("请先选择需要合成装备的品质和等阶");
		}else{
			let selectEquipData: any = this.selectLevelDatas[this.equipList.selectedIndex];
			let itemDatas: Array<ItemData> = WeaponUtil.getItemsCanCompose(selectEquipData);
			for(let i = 0; i < this.equipData.length; i++){
				if(this.equipData[i]["isOpen"]){
					for(let itemData of itemDatas){
						if(!this.selectUids[`${itemData.getUid()}`]){
							this.equipData[i] = {"itemData": itemData, "pos": i};
							this.equipItems[i].setData(this.equipData[i]);
							this.selectUids[`${itemData.getUid()}`] = true;
							break;
						}
					}
				}
			}
		}
		this.updateRate();
	}

	/**更新问号提示 */
	private clickExplainBtn(): void{
		if(this.statusController.selectedIndex == 1){
			let selectEquipData: any = this.selectLevelDatas[this.equipList.selectedIndex];
			let equipCareer: number = selectEquipData.equipCareer ? selectEquipData.equipCareer : 0;
			let equipLevel: number = selectEquipData.equipLevel ? selectEquipData.equipLevel : 0;
			let equipColor: number = selectEquipData.equipColor ? selectEquipData.equipColor : 0;
			let equipStar: number = selectEquipData.equipStar ? selectEquipData.equipStar : 0;
			let equipType: Array<string> =selectEquipData.equipType.split("#");
			if(this.typeController.selectedIndex == 0){
				ToolTipManager.showInfoTip(`<font color = "#c8b185">1、合成材料：${selectEquipData.equipNum}件通用职业${equipLevel}阶${equipStar ? `${equipStar}星的` : ""}<font color = ${Color.ItemColor[equipColor]}>${GameDef.ColorName[equipColor]}${GameDef.EEquip[equipType[0]]}</font>\n2、带有强化、镶嵌、套装、洗练属性及绑定的装备不可合成</font>`);
			}else if(this.typeController.selectedIndex == 3){
				ToolTipManager.showInfoTip(`<font color = "#c8b185">1、多件<font color = "#0DF14B">${ConfigManager.mgCareer.getCareerName(equipCareer)}</font>职业<font color = "#0DF14B">${equipLevel}</font>阶<font color = "#0DF14B">${equipStar}</font>星的<font color = ${Color.ItemColor[equipColor]}>${GameDef.ColorName[equipColor]}${GameDef.EEquip[equipType[0]]}</font>可合成\n2、带有强化、镶嵌、套装、洗练属性及绑定的装备不可合成\n3、合成有概率失败，放入的装备越多，成功率越高</font>`);
			} else{
				ToolTipManager.showInfoTip(`<font color = "#c8b185">1、多件<font color = "#0DF14B">${ConfigManager.mgCareer.getCareerName(equipCareer)}</font>职业<font color = "#0DF14B">${equipLevel}</font>阶<font color = "#0DF14B">${equipStar}</font>星的<font color = ${Color.ItemColor[equipColor]}>${GameDef.ColorName[equipColor]}</font>装备可合成\n2、带有强化、镶嵌、套装、洗练属性及绑定的装备不可合成\n3、合成有概率失败，放入的装备越多，成功率越高</font>`);
			}
		}
	}

	/**更新装备合成所有数据 */
	private updateSmeltType(): void{
		this.smeltCategoryData = [];
		let typeData: Array<any> = ConfigManager.smeltCategory.select({"smeltCategory": 100});
		for(let data of typeData){
			if(data.openLevel <= CacheManager.role.getRoleLevel()){
				this.smeltCategoryData.push(data);
			}
		}
		this.typeController.selectedIndex = 0;
		this.updateStarCombobox();
	}

	/**更新星级选项 */
	private updateStarCombobox(): void{
		this.selectTypeDatas = [];
		this.starCombobox.items = [];
		this.starCombobox.text = "星级";
		this.levelCombobox.text = "等阶";
		for(let data of this.smeltCategoryData){
			if(data.smeltTitle == (this.typeController.selectedIndex+1)){
				this.selectTypeDatas.push(data);
				this.starCombobox.items.push(data.smeltTypeName);
			}
		}
		this.levelCombobox.enabled = false;
		this.statusController.selectedIndex = 0;
		this.composeBtn.enabled = false;
	}

	/**更新等级选项 */
	private updateLevelCombobox(): void{
		let selectTypeData: any = this.selectTypeDatas[this.starCombobox.selectedIndex];
		let selectData: Array<any> = ConfigManager.smeltPlanEquip.select({"smeltCategory": selectTypeData.smeltCategory, "smeltType": selectTypeData.smeltType});
		this.selectStarDatas = [];
		this.levelCombobox.enabled = true;
		this.levelCombobox.items = [];
		this.levelCombobox.values = [];
		this.levelCombobox.text = "等阶";
		let levels: any = {};
		for(let data of selectData){
			if(data.openLevel <= CacheManager.role.getRoleLevel()){
				this.selectStarDatas.push(data);
				let itemData: ItemData = new ItemData(data.targetCode);
				if(!levels[`${itemData.getItemLevel()}`]){
					levels[`${itemData.getItemLevel()}`] = true;
					this.levelCombobox.items.push(`${GameDef.NumberName[itemData.getItemLevel()]}阶装备`);
					this.levelCombobox.values.push(`${itemData.getItemLevel()}`);
				}
			}
		}
	}

	/**更新装备列表 */
	private updateEquipList(): void{
		let level: number = Number(this.levelCombobox.value);
		this.selectLevelDatas = [];
		this.equipList.removeChildrenToPool();
		for(let data of this.selectStarDatas){
			let itemData: ItemData = new ItemData(data.targetCode);
			if(itemData.getItemLevel() == level){
				let itemData: ItemData = new ItemData(data.targetCode);
				let baseItem: BaseItem = <BaseItem>this.equipList.addItemFromPool();
				baseItem.enableToolTip = false;
				baseItem.itemData = itemData;
				baseItem.setStarNum(data.star);
				this.selectLevelDatas.push(data);
			}
		}
		this.equipList.selectedIndex = 0;
		this.statusController.selectedIndex = 1;
		this.onEquipChanged();
	}

	/**更新合成列表的装备 */
	public updateSelectedEquip(data: any): void{
		this.equipData[data["pos"]] = {"itemData": data["itemData"], "pos": data["pos"]};
		this.equipItems[data["pos"]].setData(this.equipData[data["pos"]]);
		this.selectUids[`${data["itemData"].getUid()}`] = true;
		this.updateRate();
	}

	/**卸下装备 */
	public unDressEquip(data: any): void{
		this.equipData[data["pos"]] = {"isOpen": true, "pos": data["pos"]};
		this.equipItems[data["pos"]].setData(this.equipData[data["pos"]]);
		this.selectUids[`${data["itemData"].getUid()}`] = false;
		this.updateRate();
	}

	/**更新合成概率 */
	private updateRate(): void{
		let rate: any;
		let i = 0;
		if(this.selectLevelDatas[this.equipList.selectedIndex].rate){
			rate = WeaponUtil.getAttrDict(this.selectLevelDatas[this.equipList.selectedIndex].rate);
		}
		for(let key in this.selectUids){
			if(this.selectUids[key]){
				i++;
			}
		}
		this.rateTxt.text = rate[i] ? `${rate[i]}%` : `0%`;
		this.composeBtn.enabled = rate[i] ? true : false;
	}

	/**合成装备，发送消息到服务器 */
	private smeltEquip(): void{
		let uids: Array<string> = [];
		let value: Array<number> = [];
		for(let key in this.selectUids){
			if(this.selectUids[key]){
				uids.push(key);
				value.push(1);
			}
		}
		ProxyManager.compose.smeltEquip( this.selectLevelDatas[this.equipList.selectedIndex].smeltPlanCode, {"key_S": uids, "value_I": value});
	}
}