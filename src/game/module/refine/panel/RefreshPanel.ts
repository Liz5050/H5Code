/**
 * 装备洗炼
 */

class RefreshPanel extends BaseTabPanel{
	private statusController: fairygui.Controller;
	private refreshEquipItem: BaseItem;
	private refreshStoneItem: BaseItem;
	private tipsTxt: fairygui.GRichTextField;
	private timeTxt: fairygui.GRichTextField;
	private euipmentTxt: fairygui.GRichTextField;
	private scoreTxt: fairygui.GTextField;
	private goldBtn: fairygui.GButton;
	private refreshBtn: fairygui.GButton;
	private explainBtn: fairygui.GButton;
	private refreshEquipList: List;
	private refreshAttrList: List;
	private needGold: number;
	private needStone: number;
	private openAttr: number;
	private lockIndex: Array<number>;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void{
		this.statusController = this.getController("c1");
		this.refreshEquipItem = <BaseItem>this.getGObject("BaseItem_product");
		this.refreshStoneItem = <BaseItem>this.getGObject("BaseItem_material");
		this.tipsTxt = this.getGObject("txt_tishi").asRichTextField;
		this.timeTxt = this.getGObject("txt_time").asRichTextField;
		this.euipmentTxt = this.getGObject("txt_euipment").asRichTextField;
		this.scoreTxt = this.getGObject("txt_score").asTextField;
		this.goldBtn = this.getGObject("btn_consume").asButton;
		this.refreshBtn = this.getGObject("btn_polish").asButton;
		this.explainBtn = this.getGObject("btn_explain").asButton;
		this.refreshEquipList = new List(this.getGObject("list_equipment").asList);
		this.refreshAttrList = new List(this.getGObject("list_att").asList);
		this.explainBtn.addClickListener(this.clickExplainBtn, this);
		this.refreshBtn.addClickListener(this.clickRefreshBtn, this);
		this.refreshEquipList.list.addEventListener(fairygui.ItemEvent.CLICK, this.selectItem, this);
		this.refreshAttrList.list.addEventListener(fairygui.ItemEvent.CLICK, this.clickAttrItem, this);

		let refreshData: Array<any> = ConfigManager.item.selectByCT(ECategory.ECategoryProp, EProp.EPropRefresh)
		this.refreshStoneItem.itemData = new ItemData(refreshData[0].code);
	}

	public updateAll(): void{
		this.updateEquipList();
		this.updateRefreshStone();
		this.refreshEquipList.selectedIndex = 0;
		this.updateCheckBox();
		this.updateRefreshFreeTime();

	}

	/**开启洗炼槽/洗炼后更新 */
	public updateRefreshItem(itemData: ItemData): void{
		for(let i = 1; i < EDressPos.EDressPosSpirit; i++){
			let selectData: any = (<RefreshEquipItem>this.refreshEquipList.list.getChildAt(i-1)).getData();
			if(selectData["itemData"] && selectData["itemData"].getCode() == itemData.getCode()){
				selectData["itemData"] = itemData;
				this.refreshEquipList.updateListItem(i-1, selectData);
			}
		}
		let lock: Array<number> = this.lockIndex;
		this.updateCheckBox();
		this.updateLockAttr(lock);
		this.updateRefreshFreeTime();
	}

	/**更新免费洗炼次数 */
	private updateRefreshFreeTime(): void{
		let color: string = CacheManager.refine.isCanRefreshFree() ? "#0cf24a" : "#df140e";
		this.timeTxt.text = `今日免费：<font color = ${color}>${CacheManager.refine.refreshFreeTime}</font><font color = "#0cf24a">/3</font>`;
	}

	/**点击问号 */
	private clickExplainBtn(): void{
		ToolTipManager.showInfoTip(`1、洗练属性按品质由低到高分为白、<font color = ${Color.ItemColor[EColor.EColorBlue]}>蓝</font>、<font color = ${Color.ItemColor[EColor.EColorPurple]}>紫</font>、<font color = ${Color.ItemColor[EColor.EColorOrange]}>橙</font>、<font color = ${Color.ItemColor[EColor.EColorRed]}>红</font>五种，品质越高属性值越高\n2、想要保留高品质的属性，可以将其锁定再进行洗炼\n3、装备替换时，洗炼属性可以<font color = "#01ab24">无损传承</font>\n4、转职成功开启洗炼功能，默认开启3个部位，每五级新增一个部位`, this.explainBtn);
	}

	/**点击洗炼 */
	private clickRefreshBtn(): void{
		let isHighQuality: boolean = false;
		if(this.goldBtn.selected){
			if(!MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGoldBind, this.needGold, true)){
				return;
			}
		}
		else{
			if(CacheManager.refine.refreshFreeTime < 1 && CacheManager.pack.backPackCache.getItemCountByCode2(this.refreshStoneItem.itemData.getCode()) < this.needStone){
				Tip.showTip("洗炼石不足！");
				return;
			}
		}
		for(let i = 0; i < this.refreshAttrList.list.numItems; i++){
			let attrItem: RefreshAttrItem = <RefreshAttrItem>this.refreshAttrList.list.getChildAt(i);
			if(attrItem.getColor() > EColor.EColorPurple && !attrItem.isLock()){
				isHighQuality = true;
				break;
			}
		}
		if(isHighQuality){
			Alert.alert("已洗出高品质属性，是否不锁定就进行洗炼？", this.checkRefresh, this, null,"今日不再提醒", AlertCheckEnum.KEY_REFRESH_HIGH_QUALITY, "");
			return;
		}
		this.checkRefresh();
	}

	/**洗炼，发送洗炼信息到服务器 */
	private checkRefresh(): void{
		ProxyManager.refine.refresh(this.refreshEquipItem.itemData.getUid(), this.goldBtn.selected, {"data_I": this.lockIndex});
	}

	/**更新选择装备 */
	public selectItem(): void{
		// this.seletedItem.itemData = this.stoneEquipList.selectedData;
		// this.updateStoneInlay();
		this.updateCheckBox();
	}

	/**更新属性锁定 */
	private clickAttrItem(): void{
		this.lockIndex = [];
		this.needGold = 0;
		this.needStone = 0;
		let unLockItem: RefreshAttrItem;
		let lockNum: number = 0;
		// let gold: number;
		for(let i = 0; i < this.refreshAttrList.list.numItems; i++){
			let attrItem: RefreshAttrItem = <RefreshAttrItem>this.refreshAttrList.list.getChildAt(i);
			if(attrItem.getsatus() == 2){
				attrItem.setsatus(1);
			}
			if(attrItem.isLock()){
				lockNum += 1;
				this.lockIndex.push(i);
			}
			else if(attrItem.getsatus() == 1){
				unLockItem = attrItem;
			}
		}
		if(unLockItem && lockNum+1 == this.openAttr){
			unLockItem.setsatus(2);
		}
		this.needGold = ConfigManager.mgRefreshCost.getByPk(lockNum).costGold;
		this.needStone = ConfigManager.mgRefreshCost.getByPk(lockNum).costProp;
		this.tipsTxt.text = `消耗<font color = "#01ab24">${this.needGold}</font>元宝必出一条<font color = ${Color.ItemColor[EColor.EColorPurple]}>紫色</font>以上属性\n(开启属性槽不消耗)`;
		this.updateRefreshStone();
	}

	/**洗炼后，还原锁定属性 */
	private updateLockAttr(lock: Array<number>): void{
		for(let i = 0; i < lock.length; i++){
			let index: number = lock[i];
			let attrItem: RefreshAttrItem = <RefreshAttrItem>this.refreshAttrList.list.getChildAt(index);
			attrItem.setLock();
		}
		this.clickAttrItem();
	}

	/**更新洗炼石 */
	public updateRefreshStone(): void{
		let color: string;
		if(CacheManager.pack.backPackCache.getItemCountByCode2(this.refreshStoneItem.itemData.getCode()) < this.needStone){
			this.refreshStoneItem.iconLoader.grayed = true;
			color = Color.ItemColor[EColor.EColorRed];
		}
		else{
			this.refreshStoneItem.iconLoader.grayed = false;
			color = Color.ItemColor[EColor.EColorWhite];
		}
		this.refreshStoneItem.updateNum(`<font color = ${color}>${CacheManager.pack.backPackCache.getItemCountByCode2(this.refreshStoneItem.itemData.getCode())}/${this.needStone}</font>`);
	}

	/**更新洗炼装备 */
	private updateEquipList(): void{
		let items: Array<any> = [];
		let itemData: ItemData;
		let equipData: any;
		let index: number;
		for(let i = 1; i < EDressPos.EDressPosSpirit; i++){
			equipData = {};
			itemData = <ItemData>CacheManager.pack.rolePackCache.getItemAtIndex(i);
			index = ConfigManager.mgRefreshOrder.getByPk(i).index ? ConfigManager.mgRefreshOrder.getByPk(i).index : 0;
			equipData["index"] = index;
			equipData["type"] = i;
			// equipData["isOpen"] = itemData.getItemExtInfo().refresh ? true : false;
			equipData["itemData"] = itemData ? itemData : ItemDataEnum.empty;
			equipData["openLevel"] = this.getOpenLevel(index);
			items.push(equipData);
		}
		items = this.sortRefresh(items);
		this.refreshEquipList.data = items;
	}

	/**更新洗炼评分 */
	private updateScores(): void{
		let attrItem: RefreshAttrItem;
		let maxScore: number;
		let maxValue: number;
		let scores: number = 0;
		for(let i = 0; i < this.refreshAttrList.list.numItems; i++){
			attrItem = <RefreshAttrItem>this.refreshAttrList.list.getChildAt(i);
			let data: any = attrItem.getData();
			maxScore = 0;
			maxValue = 0;
			if(data["refresh"]){
				let attrData:any = ConfigManager.mgRefreshRate.getByPk(data["refresh"][0]);
				maxScore = ConfigManager.mgRefreshAttrRate.getByPk(attrData.attrType).maxCredit;
				maxValue = ConfigManager.mgRefreshRate.getAttMax(attrData.attrType);
				if(maxScore && maxValue){
					scores += (data["refresh"][1]/maxValue)*maxScore;
				}
			}
		}
		this.scoreTxt.text = Math.round(scores).toString();
	}

	/**更新洗炼的属性 */
	private updateAttrList(itemData: ItemData): void{
		this.openAttr = 1;
		let attrDatas: Array<any> = [];
		let refresh: any = itemData.getItemExtInfo().refresh ? itemData.getItemExtInfo().refresh : {};
		for(let i = 0; i < 4; i++){
			if(refresh[i]){
				// attrDatas.push(refresh[i]);
				attrDatas.push({"refresh": refresh[i]});
				if(i != 0){
					this.openAttr += 1;
				}
			}
			else{
				// attrDataspush(i);
				attrDatas.push({"index": i, "uid": itemData.getUid()});
			}
		}
		this.refreshAttrList.data = attrDatas;
		this.clickAttrItem();
		this.updateScores();
	}

	/**更新锁定属性 */
	private updateCheckBox(): void{
		if(this.refreshEquipList.list.numItems){
			for(let i = 0; i < this.refreshEquipList.list.numItems; i++){
				let equipItem: RefreshEquipItem = <RefreshEquipItem>this.refreshEquipList.list.getChildAt(i);
				equipItem.setSelected(false);
				if(this.refreshEquipList.selectedIndex == i){
					if(equipItem.openLevel() == 0){
						equipItem.setSelected(true);
						if(equipItem.getItemData()){
							this.refreshEquipItem.itemData = equipItem.getItemData();
							this.euipmentTxt.text = `<font color = ${Color.ItemColor[this.refreshEquipItem.itemData.getColor()]}>${this.refreshEquipItem.itemData.getName()}</font>`
							this.updateAttrList(equipItem.getItemData());
							this.statusController.selectedIndex = 0;
						}
						else{
							this.statusController.selectedIndex = 1;
						}
					}
					else{
						Tip.showTip(`开启该洗炼部位需要人物等级到达${equipItem.openLevel()}级`);
					}
				}
			}
		}
	}

	/**装备的开启等级 */
	private getOpenLevel(index: number): number{
		let level: number = CacheManager.role.playerLevelWhen3State;
		if(index == 0){
			return level;
		}
		else if(index > 0){
			if(level % 5 == 0){
				return level + index*5;
			}
			else{
				return level - level%5 + index*5;
			}
		}
	}


	/**可洗炼的装备排序 */
	public sortRefresh(items: Array<any>): Array<any>{
		if(items && items.length > 0){
			items.sort((a: any, b:any): number =>{
				return this.getRefreshSort(a) - this.getRefreshSort(b);
			});
		}
		return items;
	}

	/**洗炼装备排序规则 */
	private getRefreshSort(data: any):number{
		if(data["openLevel"] <= CacheManager.role.getRoleLevel()){
			if(data["itemData"]){
				return data["index"];
			}
		}
		return data["index"] + 20;//没有穿戴的根据index往后排
	}

}