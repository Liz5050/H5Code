class LotteryStoreWindow extends BaseWindow {
	private itemList:List;
	private btnGet:fairygui.GButton;
	private fromPosType:EPlayerItemPosType;
	private items:ItemData[];
	private packCache:PackBaseCache;
	public constructor() {
		super(PackNameEnum.Lottery,"LotteryStoreWindow");
	}

	public initOptUI():void {
		this.itemList = new List(this.getGObject("list_item").asList);
		this.btnGet = this.getGObject("btn_get").asButton;
		this.btnGet.addClickListener(this.onGetAllHandler,this);
		GuideTargetManager.reg(GuideTargetName.LotteryStoreWindowGetBtn, this.btnGet);
	}

	public updateAll(category:LotteryCategoryEnum):void {
		if(this.packCache && category == -1) {
			this.items = this.packCache.itemDatas;
			if(this.items.length == 0) {
				this.hide();
				return;
			}
		}
		else {
			if(category == LotteryCategoryEnum.LotteryEquip) {
				this.packCache = CacheManager.pack.lotteryEquipPack;
				this.items = this.packCache.itemDatas;
				this.fromPosType = EPlayerItemPosType.EPlayerItemPosTypeLottery;
			}
			else if(category == LotteryCategoryEnum.LotteryRune) {
                this.packCache = CacheManager.pack.lotteryRunePack;
                this.items = this.packCache.itemDatas;
                this.fromPosType = EPlayerItemPosType.EPlayerItemPosTypeLotteryRune;
            }
            else if(category == LotteryCategoryEnum.LotteryAncient) {
                this.packCache = CacheManager.pack.lotteryAncientPack;
                this.items = this.packCache.itemDatas;
                this.fromPosType = EPlayerItemPosType.EPlayerItemPosTypeLotteryAncient;
            }
			else {
				this.fromPosType = -1;
				this.items = [];
				this.packCache = null;
			}
		}
		this.itemList.setVirtual(this.items);
	}

	/**
	 * 全部取出
	 */
	private onGetAllHandler():void {
		if(this.items.length == 0) {
			Tip.showTip("寻宝仓库空空如也");
			return;
		}
		let items:{[posType:number]:ItemData[]} = this.packCache.getAllPosTypeItems();
		for(let toType in items) {
			EventManager.dispatch(LocalEventEnum.MovePackItemList,this.fromPosType,Number(toType));
		}
	}

	public hide():void {
		super.hide();
		this.itemList.list.numItems = 0;
		this.packCache = null;
	}
}