class BeastEquipDecomposeWindow extends BaseWindow {
	private expTxt: fairygui.GRichTextField;
	private beastEquipList: List;
	private decomposeBtn: fairygui.GButton;
	private colorBtn: any;

	private itemDatas: Array<ItemData>;
	private decomposeDatas: Array<ItemData>;
	private beastEquipExpAdd: number;

	public constructor() {
		super(PackNameEnum.BeastBattle, "BeastEquipDecomposeWindow");
	}

	public initOptUI(): void {
		this.expTxt = this.getGObject("txt_exp").asRichTextField;
		this.beastEquipList = new List(this.getGObject("list_beastEquip").asList);
		this.beastEquipList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

		this.colorBtn = {};
		for (let color = EColor.EColorWhite; color <= EColor.EColorRed; color++) {
			let btn: fairygui.GObject = this.getGObject(`btn_color${color}`);
			if(btn){
				btn.addClickListener(this.onSelectColor, this);
				this.colorBtn[`color_${color}`] = btn;
			}
		}

		this.decomposeBtn = this.getGObject("btn_resolve").asButton;
		this.decomposeBtn.addClickListener(this.clickDecomposeBtn, this);
	}

	public updateAll(): void {
		this.beastEquipExpAdd = 0;
		this.updateEquipList();
		this.autoSelect();
	}

	public updateDecompose(): void {
		this.beastEquipExpAdd = 0;
		this.updateEquipList();
		this.updateExp();
	}

	/**打开界面时，自动选择白色装备 */
	private autoSelect(): void {
		for (let color = EColor.EColorWhite; color <= EColor.EColorRed; color++) {
			let btn: fairygui.GButton = this.colorBtn[`color_${color}`];
			if(btn){
				if (color == EColor.EColorWhite) {
					let select: any = { "color": color, "isSelect": true };
					this.updateSelect(select);
					btn.selected = true;
				} else {
					btn.selected = false;
				}
			}
		}
	}

	/**点击复选框 */
	private onSelectColor(e: any): void {
		let btn: fairygui.GButton = e.target.asButton;
		let color: number = Number(btn.name.replace("btn_color", ""));
		let select: any = { "color": color, "isSelect": e.target.selected };
		this.updateSelect(select);
	}

	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let decomposeItem: BeastDecomposeItem = <BeastDecomposeItem>e.itemObject;
		let itemData: ItemData = decomposeItem.itemData;
		if (ItemsUtil.isTrueItemData(itemData)) {
			CacheManager.beastBattle.decomIndexSel[this.beastEquipList.selectedIndex] = decomposeItem.selected;
			if (decomposeItem.selected) {
				this.beastEquipExpAdd += WeaponUtil.getBeastEquipDecomposeExp(itemData);
			}
			else {
				this.beastEquipExpAdd -= WeaponUtil.getBeastEquipDecomposeExp(itemData);
			}
		}
		this.updateExp();
	}

	/**分解按钮操作 */
	private clickDecomposeBtn(): void {
		let decomposeEquip: any = {};
		let isCanDecompose: boolean = false;
		for (let i = 0; i < this.decomposeDatas.length; i++) {
			if (CacheManager.beastBattle.decomIndexSel[i] && ItemsUtil.isTrueItemData(this.decomposeDatas[i])) {
				let uid: string = this.decomposeDatas[i].getUid();
				if (decomposeEquip[uid]) {
					decomposeEquip[uid]++;
				} else {
					decomposeEquip[uid] = 1;
				}
				if (!isCanDecompose) {
					isCanDecompose = true;
				}
			}
		}
		if (isCanDecompose) {
			let sendUids: Array<string> = [];
			let sendAmounts: Array<number> = [];
			for (let uid in decomposeEquip) {
				if (sendUids.length == 50) {
					// EventManager.dispatch(LocalEventEnum.BeastBattleDecomposeEquip, sendUids, sendAmounts);
					EventManager.dispatch(LocalEventEnum.BeastBattleDecomposeEquip, {"uids": sendUids, "amounts": sendAmounts});
					sendUids = [];
					sendAmounts = [];
				}
				sendUids.push(uid);
				sendAmounts.push(decomposeEquip[uid]);
			}
			if (sendUids.length > 0) {
				EventManager.dispatch(LocalEventEnum.BeastBattleDecomposeEquip, {"uids": sendUids, "amounts": sendAmounts});
			}
			App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);
		} else {
			EventManager.dispatch(LocalEventEnum.ShowRollTip, "未选中任何装备");
		}
	}

	/**更新分解列表 */
	private updateEquipList(): void {
		let index: number = 0;
		this.itemDatas = CacheManager.pack.propCache.getAllBeastEquips();
		this.sortEquipsDecompose();
		CacheManager.beastBattle.decomIndexSel = {};
		this.decomposeDatas = [];
		for (let data of this.itemDatas) {
			let max: number = data.getItemAmount();
			for (let i = 0; i < max; i++) {
				this.decomposeDatas.push(data);
				CacheManager.beastBattle.decomIndexSel[index++] = false;
			}
		}
		this.beastEquipList.setVirtual(this.decomposeDatas);
		if (this.beastEquipList.list.numItems > 0) {
			this.beastEquipList.list.scrollToView(0);
		}
	}

	/**分解列表排序 */
	public sortEquipsDecompose(): void {
		if (this.itemDatas && this.itemDatas.length > 0) {
			this.itemDatas.sort((a: any, b: any): number => {
				return this.getEquipSort(a, b);
			});
		}
	}

	private getEquipSort(a: ItemData, b: ItemData): number {
		if (a.getColor() > b.getColor()) {//先根据颜色排序
			return -1;
		} else if (a.getColor() < b.getColor()) {
			return 1;
		} else {//根据星级排序
			if (ConfigManager.mgBeastEquip.getStar(a.getEffect()) > ConfigManager.mgBeastEquip.getStar(b.getEffect())) {
				return -1;
			} else if (ConfigManager.mgBeastEquip.getStar(a.getEffect()) < ConfigManager.mgBeastEquip.getStar(b.getEffect())) {
				return 1;
			} else {//根据type排序
				if (a.getType() > b.getType()) {
					return -1;
				} else if (a.getType() < b.getType()) {
					return 1;
				}
			}
		}
		return 0;
	}

	/**根据复选框更新选择 */
	private updateSelect(selected: any): void {
		for (let i = 0; i < this.decomposeDatas.length; i++) {
			let itemData: ItemData = this.decomposeDatas[i];
			if (itemData.getColor() == selected["color"]) {
				if (selected["isSelect"]) {
					if (!CacheManager.beastBattle.decomIndexSel[i]) {
						CacheManager.beastBattle.decomIndexSel[i] = true;
						this.beastEquipExpAdd += WeaponUtil.getBeastEquipDecomposeExp(itemData);
					}
				}
				else {
					if (CacheManager.beastBattle.decomIndexSel[i]) {
						CacheManager.beastBattle.decomIndexSel[i] = false;
						this.beastEquipExpAdd -= WeaponUtil.getBeastEquipDecomposeExp(itemData);
					}
				}
			}
		}
		this.updateExp();
		this.beastEquipList.list.refreshVirtualList();
	}

	/**更新增加的经验值 */
	private updateExp(): void {
		let beastEquipExp: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitBeastEquipExp);
		this.expTxt.text = `${beastEquipExp}`;
		this.expTxt.text += this.beastEquipExpAdd > 0 ? `  <font color = ${Color.Color_6}>+${this.beastEquipExpAdd}</font>` : "";
	}
}