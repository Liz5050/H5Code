/**
 * 必杀碎片分解窗口
 */

class UniqueSkillDecomposeWindow extends BaseWindow{
	private decomposeList: List;
	private decomposeBtn: fairygui.GButton;
	private mcs: Array<UIMovieClip>;
	private itemDatas: Array<ItemData>;
	private showItemDatas: Array<ItemData>;
	private maxSize: number = 9;

	public constructor() {
		super(PackNameEnum.UniqueSkill, "WindowDecompose");
	}

	public initOptUI():void{
		this.decomposeList = new List(this.getGObject("list_decompose").asList);
		this.decomposeBtn = this.getGObject("btn_decompose").asButton;
		this.decomposeList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.decomposeBtn.addClickListener(this.clickDecompose, this);
	}

	public updateAll(): void{
		this.updateList();
	}

	private updateList(): void{
		this.itemDatas = CacheManager.pack.backPackCache.getChipsCanDecompose();
		// this.decomposeList.data = this.itemDatas;
		this.showItemDatas = [];
		for (let i: number = 0; i < this.maxSize; i++) {
			if (i < this.itemDatas.length) {
				this.showItemDatas.push(this.itemDatas[i]);
			} else {
				this.showItemDatas.push(null);
			}
		}
		this.showItemDatas.sort(function (a: ItemData, b: ItemData): number {//按等级排序
			if (a != null && b == null) {
				return -1;
			}else if (a == null && b != null) {
				return 1;
			}else if (a != null && b != null) {
				return a.getItemLevel() - b.getItemLevel();
			}
			return 0;
		});
		this.decomposeList.data = this.showItemDatas;
		let baseItem: BaseItem;
		for (let item of this.decomposeList.list._children) {
			baseItem = <BaseItem>item;
			baseItem.enableToolTip = false;
		}
	}

	private clickDecompose(): void{
		let uids: Array<string> = [];
		for (let itemData of this.showItemDatas) {
			if (itemData != null) {
				uids.push(itemData.getUid());
			}
		}
		if (uids.length > 0) {
			ProxyManager.uniqueSkill.decomposeKill(EPlayerItemPosType.EPlayerItemPosTypeBag, uids);
		} else {
			EventManager.dispatch(LocalEventEnum.ShowRollTip, "没有可分解的碎片");
		}
		
	}

	public decomposeSuccess(): void {
		for (let itemData of this.showItemDatas) {
			if (itemData) {
				CacheManager.pack.backPackCache.removeItemByUid(itemData.getUid());
			}
		}
		EventManager.dispatch(NetEventEnum.packBackPackItemsChange);
		
		this.playerSmeltSuccessEffect();
		this.updateList();
	}

	/**
	 * 播放熔炼成功特效
	 */
	private playerSmeltSuccessEffect(): void {
		let mc: UIMovieClip;
		if (this.mcs == null) {
			this.mcs = [];
			for (let i: number = 0; i < this.maxSize; i++) {
				// mc = fairygui.UIPackage.createObject(PackNameEnum.MovieClip, "MCMelting").asMovieClip;
                mc = UIMovieManager.get(PackNameEnum.MCMelting);
				this.mcs.push(mc);
			}
		}

		let baseItem: BaseItem;
		for (let i: number = 0; i < this.maxSize; i++) {
			baseItem = <BaseItem>this.decomposeList.list._children[i];
			if (baseItem.itemData == null) {
				continue;
			}
			let mc: UIMovieClip = this.mcs[i];
			mc.x = -66;
			mc.y = -86;
			baseItem.addChild(mc);
			mc.setPlaySettings(0, -1, 1, -1, function (): void {
				mc.removeFromParent();
				mc.playing = false;
			}, this);
			mc.playing = true;
		}
	}

	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let baseItem: BaseItem = <BaseItem>e.itemObject;
		this.showItemDatas.splice(this.showItemDatas.indexOf(baseItem.itemData), 1);
		baseItem.itemData = null;
	}
}