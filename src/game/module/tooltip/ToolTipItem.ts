/**
 * 物品提示
 */
class ToolTipItem extends ToolTipBase {
	private c1:fairygui.Controller;
	private nameTxt: fairygui.GTextField;
	private numTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private descTxt: fairygui.GRichTextField;
	private usageDescTxt: fairygui.GRichTextField;
	private gainTxt: fairygui.GTextField;

	// private btnList: fairygui.GList;

	private baseItem: BaseItem;
	private itemData: ItemData;

	private tipImg: fairygui.GImage;
	private shopCom: ToolTipShop;
	private shopData: any;

	private endGroup: fairygui.GGroup;
	/**仙盟仓库积分、数量显示组件 */
	// private guildWarehouseScoreComp: fairygui.GComponent
	private warehouseScoreCom:WarehouseExchangeCom;
	private numberInput: NumberInput;

	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;


	//购买调试接口
	/*
	private group_test:fairygui.GGroup;
	private txt_code:fairygui.GTextField;
	private txt_buyNum:fairygui.GTextField;
	private btn_buyDebug:fairygui.GButton;
	*/

	public constructor() {
		super(PackNameEnum.Common, "ToolTipItem");
	}

	public initUI(): void {
		super.initUI();
		this.c1 = this.getController("c1");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.numTxt = this.getChild("txt_num").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.descTxt = this.getChild("txt_desc").asRichTextField;
		this.usageDescTxt = this.getChild("txt_usageDesc").asRichTextField;
		this.gainTxt = this.getChild("txt_gain").asTextField;
		this.baseItem = <BaseItem>this.getChild("loader_item");
		this.baseItem.isShowName = false;
		// this.btnList = this.getGObject("btn_list").asList;
		// this.btnList.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);

		this.tipImg = this.getChild("window_itemtip").asImage;

		this.warehouseScoreCom = this.getChild("com_exchange") as WarehouseExchangeCom;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		this.c1.selectedIndex = 0;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if(toolTipData.source == ToolTipSouceEnum.GuildScoreWarehouse) {
				this.c1.selectedIndex = 1;
				this.warehouseScoreCom.setData(this.itemData);
			}
			
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				this.nameTxt.text = this.itemData.getName(true);
				this.numTxt.text = App.MathUtils.formatItemNum(this.itemData.getItemAmount());
				this.levelTxt.text = this.itemData.getItemLevel().toString();
				this.descTxt.text = this.itemData.getDesc();
				this.usageDescTxt.text = this.itemData.getItemInfo().usageDesc;
				this.gainTxt.text = this.itemData.getItemInfo().gainDesc;
				if(this.itemData.getType() == EProp.EPropDynamicRoleStateProp){
					let roleExp: number = ConfigManager.mgDynamicRoleStateProp.getRoleExp(this.itemData.getCode(), CacheManager.role.getRoleState());
					this.descTxt.text = App.StringUtils.substitude(this.itemData.getDesc(), roleExp);
				}
			}
			this.baseItem.itemData = this.itemData;
			this.baseItem.numTxt.text = "";
			this.enableOptList(toolTipData.isEnableOptList);
		}
	}

	public enableOptList(enable: boolean): void {
		// this.btnList.visible = enable;
	}

	// public center(): void {
	// 	// let optListWidth: number = 130;
	// 	let optListWidth: number = 0;
	// 	let centerX: number = (fairygui.GRoot.inst.width - this.width + optListWidth) / 2;
	// 	let centerY: number = (fairygui.GRoot.inst.height - this.height) / 2;
	// 	this.setXY(centerX, centerY);
	// }

	/**
	 * 更新操作按钮
	 */
	private updateBtnList(): void {
		let data: Array<any> = [];
		if (this.toolTipData.optBtnList != null) {
			data = this.toolTipData.optBtnList;
		} else {
			if (this.toolTipSource != ToolTipSouceEnum.None) {
				if (this.toolTipSource == ToolTipSouceEnum.GuildWarehouse) {
					data = [ToolTipOptEnum.GuildWarehouseExchange];
				} else if (this.toolTipSource == ToolTipSouceEnum.ShopMall) {
					//商城购买按钮
					if (this.shopData && this.shopData["limitNum"] != 0) {
						data = [ToolTipOptEnum.Buy];
					}
				} else if (this.toolTipSource == ToolTipSouceEnum.Compose) {
					data = [];
				} else {
					data = GameDef.ToolTipOptList[this.toolTipData.source];
				}
			} else {
				if (CacheManager.pack.backPackCache.hasItem(this.itemData)) {
					if (ItemsUtil.isCanSplit(this.itemData)) {//可拆分
						data.push(ToolTipOptEnum.Split);
					}
					if (ItemsUtil.isCanSell(this.itemData)) {
						data.push(ToolTipOptEnum.Sell);
					}
					data.push(ToolTipOptEnum.Store);
				} else if (CacheManager.pack.warePackCache.hasItem(this.itemData)) {
					data = [ToolTipOptEnum.Fetch];
				} else {
				}
			}
		}

		// this.btnList.removeChildrenToPool();
		// for (let opt of data) {
		// 	var button: fairygui.GButton = <fairygui.GButton>this.btnList.addItemFromPool();
		// 	button.text = GameDef.ToolTipOptName[opt];
		// 	button.name = opt;
		// }
	}
	/**点击操作按钮 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let button: fairygui.GButton = <fairygui.GButton>e.itemObject;
		if (button != null) {
			switch (Number(button.name)) {
				case ToolTipOptEnum.Use:
					EventManager.dispatch(LocalEventEnum.PackUse, this.itemData);
					break;
				case ToolTipOptEnum.Split:
					EventManager.dispatch(UIEventEnum.PackSplitOpen, this.itemData);
					break;
				case ToolTipOptEnum.Sell:
					EventManager.dispatch(LocalEventEnum.PackSale, this.itemData);
					break;
				case ToolTipOptEnum.Fetch:
					EventManager.dispatch(LocalEventEnum.PackFetch, this.itemData);
					break;
				case ToolTipOptEnum.Store:
					EventManager.dispatch(LocalEventEnum.PackStore, this.itemData);
					break;
				case ToolTipOptEnum.Buy:
					if (this.shopData) {
						let shop: any = ConfigManager.shop.getByPk(this.shopData["sellData"].shopCode);
						if (MoneyUtil.checkEnough(shop.unit, this.shopData["sellData"].price * this.shopCom.getValue(), true, true)) {
							if (CacheManager.pack.backPackCache.capacity - CacheManager.pack.backPackCache.usedCapacity > 0) {
								ProxyManager.shop.buyItem(0, this.shopData["sellData"].shopCode, this.shopData["sellData"].itemCode, this.shopCom.getValue(), 0, false);
							} else {
								AlertII.show("您的背包已满，请立即整理，否则将无法获得物品！", null, this.openPack, this, [AlertType.NO, AlertType.YES], ["取消", "前往整理"], null);
							}
						}
					} else {
						ProxyManager.test.addItem(this.itemData.getCode(), 1);
					}
					break;
				case ToolTipOptEnum.GuildWarehouseExchange:
					EventManager.dispatch(LocalEventEnum.GuildChangeItem, { "itemData": this.itemData, "num": this.numberInput.value });
					break;
			}
		}
		ToolTipManager.hide();
	}

	private openPack(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Pack);
	}
}