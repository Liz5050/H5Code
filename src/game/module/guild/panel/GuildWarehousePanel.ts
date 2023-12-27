/**
 * 仙盟仓库
 */
class GuildWarehousePanel extends BaseTabPanel {
	private spreadC: fairygui.Controller;
	private manageC: fairygui.Controller;
	private donateC: fairygui.Controller;
	private recordList: List;
	private spreadRecordList: List;
	private itemList: List;
	private myCareerCheckBox: fairygui.GButton;
	private stageComb: fairygui.GComboBox;
	private colorComb: fairygui.GComboBox;
	private colorFilterComb: fairygui.GComboBox;
	private scoreTxt: fairygui.GTextField;
	private donateBtn: fairygui.GButton;
	private destroyBtn: fairygui.GButton;
	private batchBtn: fairygui.GButton;
	private exitBtn: fairygui.GButton;
	private upBtn: fairygui.GButton;
	private downBtn: fairygui.GButton;

	private isSetedTipSource: boolean;
	private isBatch: boolean;

	public initOptUI() {
		this.spreadC = this.getController("c1");
		this.manageC = this.getController("c2");
		this.donateC = this.getController("c3");
		this.myCareerCheckBox = this.getGObject("cb_myCareer").asButton;
		this.stageComb = this.getGObject("comb_stage").asComboBox;
		this.colorComb = this.getGObject("comb_color").asComboBox;
		this.colorFilterComb = this.getGObject("comb_color_filter").asComboBox;

		this.itemList = new List(this.getGObject("list_item").asList);
		this.recordList = new List(this.getGObject("list_record").asList);
		this.spreadRecordList = new List(this.getGObject("list_recordSpread").asList);
		this.scoreTxt = this.getGObject("txt_score").asTextField;
		this.exitBtn = this.getGObject("btn_exit").asButton;
		this.destroyBtn = this.getGObject("btn_destroy").asButton;
		this.batchBtn = this.getGObject("btn_batch").asButton;
		this.donateBtn = this.getGObject("btn_donate").asButton;
		this.upBtn = this.getGObject("btn_up").asButton;
		this.downBtn = this.getGObject("btn_down").asButton;

		this.myCareerCheckBox.addClickListener(this.updateItems, this);
		this.stageComb.addEventListener(fairygui.StateChangeEvent.CHANGED, this.updateItems, this);
		this.colorComb.addEventListener(fairygui.StateChangeEvent.CHANGED, this.updateItems, this);
		this.colorFilterComb.addEventListener(fairygui.StateChangeEvent.CHANGED, this.autoSelectItems, this);

		this.upBtn.addClickListener(this.clickUp, this);
		this.downBtn.addClickListener(this.clickDown, this);
		this.donateBtn.addClickListener(this.clickDonate, this);
		this.destroyBtn.addClickListener(this.clickDestroy, this);
		this.batchBtn.addClickListener(this.clickBatch, this);
		this.exitBtn.addClickListener(this.clickExitBatch, this);

		this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.clickItem, this);
	}

	public updateAll() {
		EventManager.dispatch(LocalEventEnum.GuildWarehouseGetData);
		this.manageC.selectedIndex = CacheManager.guild.isCanManageWarehouse ? 0 : 1;
		this.donateC.selectedIndex = 1;
		this.stageComb.selectedIndex = 0;
		this.colorComb.selectedIndex = 0;
		this.colorFilterComb.selectedIndex = 0;
		this.setBatch(false);
		this.myCareerCheckBox.selected = false;
		this.updateScore();
	}

	/**
	 * 更新物品
	 */
	public updateItems(): void {
		let size: number = 100;
		let showItems: Array<ItemData> = [new ItemData(ItemCodeConst.PetExpItem)];//第一个固定
		let isMyCareer: boolean = this.myCareerCheckBox.selected;
		let stage: number = -1;
		let color: number = -1;
		if (this.stageComb.value != null) {
			stage = Number(this.stageComb.value);
		}
		if (this.colorComb.value != null) {
			color = Number(this.colorComb.value);
		}
		let filterItems: Array<ItemData> = [];
		let warehouseItems: Array<ItemData> = CacheManager.guild.warehouseItems;
		let isMatch: boolean;
		let isCareerMatch: boolean;
		let isStageMatch: boolean;
		let isColorMatch: boolean;
		let itemData: ItemData;
		for (let i: number = 0; i < warehouseItems.length; i++) {
			itemData = warehouseItems[i];
			if (ItemsUtil.isTrueItemData(itemData)) {
				if (isMyCareer) {
					isCareerMatch =  true;//CareerUtil.isCareerMatch(itemData.getCareer());
				} else {
					isCareerMatch = true;
				}
				isStageMatch = stage == -1 || itemData.getItemLevel() == stage;
				isColorMatch = color == -1 || itemData.getColor() == color;
				if (isCareerMatch && isStageMatch && isColorMatch) {
					filterItems.push(itemData);
				}
			}
		}
		filterItems.sort(this.itemSort);
		showItems = showItems.concat(filterItems);
		let addLen: number = size - showItems.length;
		for (let i: number = 0; i < addLen; i++) {
			showItems.push(null);
		}
		this.itemList.data = showItems;
		if (!this.isSetedTipSource) {
			this.setToolTipSource();
			this.isSetedTipSource = true;
		}
		//兑换物品显示绑定
		let changeItem: BaseItem = this.itemList.list._children[0] as BaseItem;
		changeItem.forceShowBind(ItemsUtil.isTrueItemData(changeItem.itemData));

	}

	/**
	 * 删除仓库物品
	 */
	public removeItems(sPlayerItems: Array<any>): void {
		let baseItem: BaseItem;
		let itemData: ItemData;
		let index: number;
		for (let sPlayerItem of sPlayerItems) {
			index = this.getIndexBySPlayerItem(sPlayerItem);
			if (index != -1) {
				baseItem = this.itemList.list._children[index] as BaseItem
				baseItem.itemData = null;
				baseItem.selected = false;
			}
		}
	}

	/**
	 * 获取物品所在序号
	 */
	private getIndexBySPlayerItem(sPlayerItem: any): number {
		let itemData: ItemData;
		for (let i: number = 0; i < this.itemList.list._children.length; i++) {
			itemData = (this.itemList.list._children[i] as BaseItem).itemData;
			if (ItemsUtil.isTrueItemData(itemData) && itemData.getUid() == sPlayerItem.uid_S) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 更新记录
	 */
	public updateRecords(): void {
		let records: Array<any> = CacheManager.guild.warehouseRecords;
		records.sort((a: any, b: any): number => {
			return b.recordDt_DT - a.recordDt_DT;
		});
		this.recordList.data = records;
		this.spreadRecordList.data = records;
	}

	/**
	 * 更新积分
	 */
	public updateScore(): void {
		this.scoreTxt.text = CacheManager.guild.playerGuildInfo.warehouseCredit_L64;
	}

	private setToolTipSource(): void {
		for (let baseItem of this.itemList.list._children) {
			(baseItem as BaseItem).toolTipSource = ToolTipSouceEnum.GuildWarehouse;
		}
	}

	/**
	 * 展开记录
	 */
	private clickUp(): void {
		this.recordList.list.visible = false;
		this.spreadRecordList.list.visible = true;
	}

	/**
	 * 收缩记录
	 */
	private clickDown(): void {
		this.recordList.list.visible = true;
		this.spreadRecordList.list.visible = false;
	}

	/**
	 * 捐献
	 */
	private clickDonate(): void {
		EventManager.dispatch(UIEventEnum.GuildDonateWindownOpen);
	}

	/**
	 * 销毁
	 */
	private clickDestroy(): void {
		let selectedIndexes: Array<number> = this.itemList.list.getSelection();
		if (selectedIndexes.length == 0) {
			Tip.showTip("请选择需要销毁的装备");
		} else {
			let uids: Array<string> = [];
			for (let i of selectedIndexes) {
				uids.push((this.itemList.data[i] as ItemData).getUid());
			}
			Alert.info("是否确认销毁这些珍贵的装备？", () => {
				EventManager.dispatch(LocalEventEnum.GuildDestroyEquip, uids);
			}, this);
		}
	}

	/**点击批了处理 */
	private clickBatch(): void {
		this.setBatch(true);
	}

	/**点击退出管理 */
	private clickExitBatch(): void {
		this.setBatch(false);
	}

	/**
	 * 设置批量管理
	 */
	private setBatch(isBatch: boolean): void {
		if (isBatch) {
			this.isBatch = true;
			this.itemList.selectedIndex = -1;
			this.itemList.list.selectionMode = fairygui.ListSelectionMode.Multiple_SingleClick;
			this.setSelectMode(true);
		} else {
			this.isBatch = false;
			this.itemList.selectedIndex = -1;
			this.itemList.list.selectionMode = fairygui.ListSelectionMode.Single;
			this.setSelectMode(false);
		}
	}

	/**
	 * 设置选择模式
	 */
	private setSelectMode(isMultiple: boolean): void {
		let baseItem: BaseItem;
		for (let item of this.itemList.list._children) {
			baseItem = item as BaseItem;
			if (isMultiple) {
				baseItem.enableToolTip = false;
				baseItem.mode = fairygui.ButtonMode.Check;
			} else {
				baseItem.enableToolTip = true;
				baseItem.mode = fairygui.ButtonMode.Common;
			}
		}
	}

	/**
	 * 点击物品
	 */
	private clickItem(e: fairygui.ItemEvent): void {
		let baseItem: BaseItem = e.itemObject as BaseItem;
		if (baseItem.itemData) {
			if (this.isBatch && !ItemsUtil.isEquipItem(baseItem.itemData)) {
				baseItem.selected = false;
				Tip.showTip("该物品不能销毁");
			}
		} else {
			baseItem.selected = false;
		}
	}

	/**
	 * 装备排序
	 * 按装备部位→等级最高→品阶最高→星级最高
	 */
	private itemSort(a: ItemData, b: ItemData): number {
		if (a && !b) {
			return -1
		} else if (!a && b) {
			return 1;
		} else {
			if (!a && !b) {
				return 0;
			}
			let aType: number = a.getType();
			let bType: number = b.getType();
			if (aType == bType) {
				let aLevel: number = a.getLevel();
				let bLevel: number = b.getLevel();
				if (aLevel == bLevel) {
					let aItemLevel: number = a.getItemLevel();
					let bItemLevel: number = b.getItemLevel();
					if (aItemLevel == bItemLevel) {
						let aStar: number = WeaponUtil.getStar(a);
						let bStar: number = WeaponUtil.getStar(b);
						return bStar - aStar;
					} else {
						return bItemLevel - aItemLevel;
					}
				} else {
					return bLevel - aLevel;
				}
			} else {
				return aType - bType;
			}
		}
	}

	/**
	 * 批量处理下自动选择装备
	 */
	private autoSelectItems(): void {
		let color: number = -1;
		if (this.colorFilterComb.value != null) {
			color = Number(this.colorFilterComb.value);
		}
		if (color == -1) {
			this.itemList.selectedIndex = -1;
		} else {
			let baseItem: BaseItem;
			let itemData: ItemData;
			for (let i: number = 0; i < this.itemList.list._children.length; i++) {
				baseItem = this.itemList.list._children[i] as BaseItem;
				if (i == 0) {
					baseItem.selected = false;
				} else {
					itemData = baseItem.itemData;
					if (ItemsUtil.isTrueItemData(itemData) && itemData.getColor() <= color) {
						baseItem.selected = true;
					} else {
						baseItem.selected = false;
					}
				}
			}
		}
	}
}