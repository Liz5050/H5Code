/**
 * 仓库界面
 */
class PackWarehousePanel extends BaseTabPanel {

    private itemList: List;
    private tidyWarehouseTimerBtn: TimerButton;
    private tabC: fairygui.Controller;
    private capacityTxt: fairygui.GTextField;//容量

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
        this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

        this.tidyWarehouseTimerBtn = this.getGObject("btn_tidy_warehouse") as TimerButton;
        this.tidyWarehouseTimerBtn.addClickListener(this.tidyWarehouse, this);

        this.capacityTxt = this.getGObject("txt_capacity").asTextField;
        this.getGObject("btn_addCapacity").addClickListener(this.openExtendWindow, this);
    }

    //根据缓存更新
    public updateAll(): void {
        this.updateItems();
        this.updateCapacity();
        this.itemList.selectedIndex = -1;
    }

    /**
     * 更新所有物品
     */
    public updateItems(): void {
        this.itemList.data = CacheManager.pack.warePackCache.itemDatas;
        let baseItem:BaseItem;
		for (let item of this.itemList.list._children) {
			baseItem = (item as BaseItem);
			baseItem.enableToolTipOpt = true;
			baseItem.showScoreCompare(true);
			baseItem.showBind();
		}
    }

    /**
     * 更新容量
     */
    public updateCapacity(): void {
        var pack: PackBaseCache = CacheManager.pack.warePackCache;
        this.capacityTxt.text = `${pack.usedCapacity}/${pack.capacity}`;
    }

    /**
     * 整理仓库
     */
    private tidyWarehouse(): void {
        // let second: number = Number(this.tidyWarehouseTimerBtn.packageItem.componentData.attributes.customData);
        let second: number = Number(this.tidyWarehouseTimerBtn.baseUserData);
        if (!second) {
            this.tidyWarehouseTimerBtn.start();
        } else {
            this.tidyWarehouseTimerBtn.start(second);
        }
        EventManager.dispatch(LocalEventEnum.PackTidy, EPlayerItemPosType.EPlayerItemPosTypeWarehouse);
    }

    /**
     * 打开扩展窗口
     */
    private openExtendWindow(): void {
        let posType: number = EPlayerItemPosType.EPlayerItemPosTypeWarehouse;
        EventManager.dispatch(UIEventEnum.PackExtendOpen, posType);
    }

    /**点击物品项 */
    private onClickItem(e: fairygui.ItemEvent): void {
        let baseItem: BaseItem = <BaseItem>e.itemObject;
        if (!baseItem.itemData) {
            this.itemList.selectedIndex = -1;
        }
    }
}