/**
 * 背包装备界面
 */
class PackEquipPanel extends BaseTabView {

	private itemList: List;
	private tidyPackTimerBtn: TimerButton;
	private capacityTxt: fairygui.GTextField;//容量
	private smeltBtn: fairygui.GButton;

	private equips: Array<ItemData>;
	private backPackCache: PackBackCache = CacheManager.pack.backPackCache;
	private isInit: boolean = true;
	private framExc: FrameExecutor;
	private itemIndexs: number[];
	private items: BaseItem[];

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.itemList = new List(this.getGObject("list_item").asList);
		this.itemList.list.defaultItem = URLManager.getPackResUrl(PackNameEnum.Common, "BaseItem");
		this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

		this.smeltBtn = this.getGObject("btn_smelt").asButton;
		this.smeltBtn.addClickListener(this.openSmeltWindow, this);
		this.capacityTxt = this.getGObject("txt_capacity").asTextField;
		this.getGObject("btn_addCapacity").addClickListener(this.openExtendWindow, this);
		this.framExc = new FrameExecutor(1);
		GuideTargetManager.reg(GuideTargetName.PackSaleBtn, this.smeltBtn);
	}

	//根据缓存更新
	public updateAll(): void {
		//延迟更新渲染
		App.TimerManager.doDelay(35, this.updateItems, this);
	}

    /**
     * 更新所有物品
     */

	public updateItems(): void {
		this.equips = this.backPackCache.itemDatas;
		let minSize: number = 30;
		let maxSize: number = 0;
		let showItems: Array<ItemData> = [];
		let ownSize: number = this.equips.length;
		if (ownSize <= minSize) {
			maxSize = minSize;
		} else {
			let remainder: number = ownSize % 5;
			if (remainder != 0) {
				maxSize = ownSize + (5 - remainder);
			} else {
				maxSize = ownSize;
			}
		}
		for (let i: number = 0; i < maxSize; i++) {
			if (i < ownSize) {
				showItems.push(this.equips[i]);
			} else {
				showItems.push(null);
			}
		}
		this.sortEquip();
		this.itemList.setVirtual(showItems, this.setItemRenderer, this);
		this.initItemList();
		this.updateCapacity();
		this.updateBtnTips();
	}

	public updateBtnTips(): void {
		CommonUtils.setBtnTips(this.smeltBtn, CacheManager.pack.isSmeltRedTip);
	}

	private initItemList(): void {
		if (!this.itemIndexs) {
			return;
		}
		if (this.isInit) {
			this.itemList.list.scrollPane.touchEffect = false;
			let perNum: number = 4;
			let maxIdx: number = this.itemIndexs.length - this.itemIndexs.length % perNum + 1;
			for (let i: number = 1; i <= this.itemIndexs.length; i++) {
				let isLast: boolean = i >= maxIdx;
				if (i % perNum == 0 || isLast) {
					this.framExc.regist(() => {
						if (this.itemIndexs) {
							let idxs: number[] = this.itemIndexs.splice(0, perNum);
							let subItems: BaseItem[] = this.items.splice(0, perNum);
							for (let i: number = 0; i < idxs.length; i++) {
								let index: number = idxs[i];
								let item: BaseItem = subItems[i];
								this.renderItem(item, this.equips[index]);
							}
						}
					}, this);
				}
				if (isLast) {
					break;
				}
			}
			//注册最后一个函数 监听list初始化完成
			this.framExc.regist(() => {
				this.isInit = false;
				this.itemList.list.scrollPane.touchEffect = true; //开启滚动
				this.itemIndexs = null;
				this.items = null;
			}, this);
			this.framExc.execute();

		}
	}

	private setItemRenderer(index: number, item: BaseItem): void {
		if (this.isInit) {
			if (!this.itemIndexs) {
				this.itemIndexs = [];
			}
			if (!this.items) {
				this.items = [];
			}
			this.itemIndexs.push(index);
			this.items.push(item);

		} else {
			this.renderItem(item, this.equips[index]);
		}
		item.bgUrl = `ui://${PackNameEnum.Pack}/item_bg`;
	}

	protected renderItem(item: BaseItem, itemData: ItemData): void {
		item.setData(itemData);
		item.enableToolTipOpt = true;
		item.showBind();
		item.toolTipSource = ToolTipSouceEnum.Pack;
	}

    /**
     * 更新容量
     */
	public updateCapacity(): void {
		this.capacityTxt.text = `${this.backPackCache.usedCapacity}/${this.backPackCache.capacity}`;
	}

	/**
	 * 打开熔炼窗口
	 */
	private openSmeltWindow(): void {
		// let itemDatas: Array<ItemData> = CacheManager.pack.backPackCache.getItemsByFun(ItemsUtil.isCanOneKeySmeltEquip, ItemsUtil);
		let itemDatas: Array<ItemData> = WeaponUtil.getItemsCanSmelt();
		// if (itemDatas.length > 0) {
		// 	EventManager.dispatch(UIEventEnum.PackSmeltOpen, itemDatas);
		// }
		// else {
		// 	Tip.showTip("无可熔炼的装备");
		// }
		EventManager.dispatch(UIEventEnum.PackSmeltOpen, itemDatas);
	}

    /**
     * 打开扩展窗口
     */
	private openExtendWindow(): void {
		let extendCapacity: number = CacheManager.pack.backPackCache.getExtendCapacity();
		if (extendCapacity <= 0) {
			Tip.showTip("已达到背包最大容量");
			return;
		}
		let posType: number = EPlayerItemPosType.EPlayerItemPosTypeBag;
		EventManager.dispatch(UIEventEnum.PackExtendOpen, posType);
	}

	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let baseItem: BaseItem = <BaseItem>e.itemObject;
		// if (!baseItem.itemData) {
		// 	this.itemList.selectedIndex = -1;
		// }
		this.itemList.selectedIndex = -1;
	}

	/**装备排序 */
	private sortEquip(): void {
		this.equips.sort((a: any, b: any): number => {
			return this.getEquipSort(a, b);
		});
	}

	private getEquipSort(a: ItemData, b: ItemData): number {
		let comA: number = WeaponUtil.getCombatByItemData(a);
		let comB: number = WeaponUtil.getCombatByItemData(b);
		if (comA > comB) {
			return -1;
		} else if (comA < comB) {
			return 1;
		} else {
			if (a.getColor() > b.getColor()) {
				return -1;
			} else if (a.getColor() < b.getColor()) {
				return 1;
			} else {
				if (a.getItemLevel() > b.getItemLevel()) {
					return -1;
				} else if (a.getItemLevel() < b.getItemLevel()) {
					return 1;
				} else {
					let carA: number = a.getCareer();
					let carB: number = b.getCareer();
					let baseCarA: number = CareerUtil.getBaseCareer(carA);
					let baseCarB: number = CareerUtil.getBaseCareer(carB);
					if (baseCarA > baseCarB) {
						return 1;
					} else if (baseCarA < baseCarB) {
						return -1;
					} else {
						if (a.getType() > b.getType()) {
							return 1;
						} else if (a.getType() < b.getType()) {
							return -1;
						} else {
							return 0;
						}
					}
				}
			}
		}
	}
}