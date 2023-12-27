/**
 * 符文分解
 */
class RuneDecomposePanel extends BaseTabView {
	private chipNumTxt: fairygui.GTextField;
	// private chipAddTxt: fairygui.GTextField;
	private expNumTxt: fairygui.GTextField;
	// private expAddTxt: fairygui.GTextField;
	private runeList: List;
	private decomposeBtn: fairygui.GButton;
	private colorBtn: any;

	private itemDatas: Array<ItemData>;
	private decomposeDatas: Array<ItemData>;
	private runeExpAdd: number;
	private runeCoinAdd: number;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.chipNumTxt = this.getGObject("txt_chipNum").asTextField;
		this.expNumTxt = this.getGObject("txt_expNum").asTextField;
		this.runeList = new List(this.getGObject("list_rune").asList);
		this.runeList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

		this.colorBtn = {};
		for (let color = EColor.EColorBlue; color <= EColor.EColorGold; color++) {
			let btn: fairygui.GButton = this.getGObject(`btn_color${color}`).asButton;
			btn.addClickListener(this.onSelectColor, this);
			this.colorBtn[`color_${color}`] = btn;
		}

		this.decomposeBtn = this.getGObject("btn_resolve").asButton;
		this.decomposeBtn.addClickListener(this.clickDecomposeBtn, this);

		GuideTargetManager.reg(GuideTargetName.RuneDecomposeBtn, this.decomposeBtn);
	}

	public updateAll(): void {
		this.runeExpAdd = 0;
		this.runeCoinAdd = 0;
		this.updateRuneList();
		this.autoSelect();
	}

	public updateDecompose(): void {
		this.runeExpAdd = 0;
		this.runeCoinAdd = 0;
		this.updateRuneList();
		this.updateExp();
	}

	/**打开界面时，自动选择蓝符文 */
	private autoSelect(): void {
		for (let color = EColor.EColorBlue; color <= EColor.EColorGold; color++) {
			let btn: fairygui.GButton = this.colorBtn[`color_${color}`];
			if (color == EColor.EColorBlue) {
				let select: any = { "color": color, "isSelect": true };
				this.updateSelect(select);
				btn.selected = true;
			} else {
				btn.selected = false;
			}
		}
	}

	/**点击符文复选框 */
	private onSelectColor(e: any): void {
		let btn: fairygui.GButton = e.target.asButton;
		let color: number = Number(btn.name.replace("btn_color", ""));
		let select: any = { "color": color, "isSelect": e.target.selected };
		this.updateSelect(select);
	}

	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let decomposeItem: RuneDecomposeItem = <RuneDecomposeItem>e.itemObject;
		if (decomposeItem.itemData) {
			CacheManager.rune.decomIndexSel[this.runeList.selectedIndex] = decomposeItem.selected;
			if (decomposeItem.selected) {
				this.runeExpAdd += decomposeItem.runeExp;
				this.runeCoinAdd += decomposeItem.runeCoin;
			}
			else {
				this.runeExpAdd -= decomposeItem.runeExp;
				this.runeCoinAdd -= decomposeItem.runeCoin;
			}
		}
		this.updateExp();
	}

	/**分解按钮操作 */
	private clickDecomposeBtn(): void {
		let decomposeRune: any = {};
		let isCanDecompose: boolean = false;
		for (let i = 0; i < this.decomposeDatas.length; i++) {
			if (CacheManager.rune.decomIndexSel[i] && ItemsUtil.isTrueItemData(this.decomposeDatas[i])) {
				let uid: string = this.decomposeDatas[i].getUid();
				if (decomposeRune[uid]) {
					decomposeRune[uid]++;
				} else {
					decomposeRune[uid] = 1;
				}
				if (!isCanDecompose) {
					isCanDecompose = true;
				}
			}
		}
		if (isCanDecompose) {
			let sendUids: Array<string> = [];
			let sendAmounts: Array<number> = [];
			for (let uid in decomposeRune) {
				if (sendUids.length == 50) {
					// ProxyManager.rune.decomposeRune({"data_S": sendUids});
					EventManager.dispatch(LocalEventEnum.RuneDecompose, sendUids, sendAmounts);
					sendUids = [];
					sendAmounts = [];
				}
				sendUids.push(uid);
				sendAmounts.push(decomposeRune[uid]);
			}
			if (sendUids.length > 0) {
				EventManager.dispatch(LocalEventEnum.RuneDecompose, sendUids, sendAmounts);
			}
			App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);
		} else {
			EventManager.dispatch(LocalEventEnum.ShowRollTip, "未选中需要分解的符文");
		}
	}

	/**更新符文分解列表 */
	private updateRuneList(): void {
		let index: number = 0;
		this.itemDatas = CacheManager.pack.runePackCache.getRuneDecompose();
		this.sortRuneDecompose();
		CacheManager.rune.decomIndexSel = {};
		this.decomposeDatas = [];
		for (let data of this.itemDatas) {
			let max: number = data.getItemAmount();
			for (let i = 0; i < max; i++) {
				this.decomposeDatas.push(data);
				CacheManager.rune.decomIndexSel[index++] = false;
			}
		}
		// this.runeList.data = this.decomposeDatas;
		this.runeList.setVirtual(this.decomposeDatas);
		if (this.runeList.list.numItems > 0) {
			this.runeList.list.scrollToView(0);
		}

		//取消全部勾选框的勾选
		for (let color = EColor.EColorBlue; color <= EColor.EColorGold; color++) {
			let btn: fairygui.GButton = this.colorBtn[`color_${color}`];
			btn.selected = false;
		}
	}

	/**符文分解列表排序 */
	public sortRuneDecompose(): void {
		if (this.itemDatas && this.itemDatas.length > 0) {
			this.itemDatas.sort((a: any, b: any): number => {
				return this.getRuneSort(a, b);
			});
		}
	}

	private getRuneSort(a: ItemData, b: ItemData): number {
		if (a.getColor() > b.getColor()) {//先根据颜色排序
			return -1;
		} else if (a.getColor() < b.getColor()) {
			return 1;
		} else {//再根据type排序
			if (a.getType() > b.getType()) {
				return -1;
			} else if (a.getType() < b.getType()) {
				return 1;
			} else {
				if (a.getItemExtInfo().level > b.getItemExtInfo().level) {
					return -1;
				} else if (a.getItemExtInfo().level < b.getItemExtInfo().level) {
					return 1;
				}
			}
		}
		return 0;
	}

	/**根据复选框更新符文选择 */
	private updateSelect(selected: any): void {
		for (let i = 0; i < this.decomposeDatas.length; i++) {
			let itemData: ItemData = this.decomposeDatas[i];
			if (itemData.getColor() == selected["color"]) {
				if (selected["isSelect"]) {
					if (!CacheManager.rune.decomIndexSel[i]) {
						CacheManager.rune.decomIndexSel[i] = true;
						this.runeExpAdd += ConfigManager.mgRune.getRuneExp(itemData);
						this.runeCoinAdd += ConfigManager.mgRune.getRuneCoin(itemData);
					}
				}
				else {
					if (CacheManager.rune.decomIndexSel[i]) {
						CacheManager.rune.decomIndexSel[i] = false;
						this.runeExpAdd -= ConfigManager.mgRune.getRuneExp(itemData);
						this.runeCoinAdd -= ConfigManager.mgRune.getRuneCoin(itemData);
					}
				}
			}
		}
		this.updateExp();
		this.runeList.list.refreshVirtualList();
	}

	/**更新增加的经验值 */
	private updateExp(): void {
		let runeExp: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneExp);
		let runeCoin: number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneCoin);
		this.expNumTxt.text = `${runeExp}`;
		this.chipNumTxt.text = `${runeCoin}`;
		this.expNumTxt.text += this.runeExpAdd > 0 ? `  +${this.runeExpAdd}` : "";
		this.chipNumTxt.text += this.runeCoinAdd > 0 ? `  +${this.runeCoinAdd}` : "";
	}
}