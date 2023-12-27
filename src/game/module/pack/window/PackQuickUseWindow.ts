enum EQuickUseType
{
	PACK,//普通背包物品使用
	SHOP//查看商城物品
}
/**
 * 快速使用
 */
class PackQuickUseWindow extends BaseWindow {
	private baseItem: BaseItem;
	private useBtn: fairygui.GButton;
	private nameTxt: fairygui.GTextField;
	private timeTxt: fairygui.GTextField;//部分item显示额外信息
	private itemData: ItemData;
	private countdown: number = 5;
	private btnText: string;
	private currentTime: number = this.countdown;
	private dataList:Array<{itemData:ItemData, isShowCountdown?:boolean, quickUseType?:EQuickUseType}> = [];
	private isProcessing: boolean = false;
	private _isShowCountdown: boolean = true;
	private quickUseType:EQuickUseType;
    private viewCtl: fairygui.Controller;

	public constructor() {
		super(PackNameEnum.Pack, "WindowQuickUse");
		this.modal = false;
		this.isCenter = false;
	}

	public initOptUI(): void {
        this.viewCtl = this.getController("c1");
		this.baseItem = <BaseItem>this.getGObject("baseItem");
		this.baseItem.enableToolTipOpt = false;
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.timeTxt = this.getGObject("txt_time").asTextField;
		this.useBtn = this.getGObject("btn_use").asButton;
		this.useBtn.addClickListener(this.clickUseBtn, this);
	}

	public updateAll(): void {
	}

	public show(): void {
		super.show();
		this.setXY(Math.round((fairygui.GRoot.inst.width - this.width) / 2 + this.width), fairygui.GRoot.inst.height - 585);
		App.TimerManager.doFrame(1, 0, this.process, this);
		App.TimerManager.doTimer(1000, 0, this.updateTimeText, this);
	}

	public hide(): void {
		this.isProcessing = false;
	}

	public addData(data: {itemData:ItemData, isShowCountdown?:boolean, quickUseType?:EQuickUseType}): void {
		if(!this.isExist(data.itemData)){
			this.dataList.push(data);
		}
	}

	public isExist(itemData: ItemData): boolean {
		for (let data of this.dataList) {
			if (itemData.getUid() == data.itemData.getUid()) {
				return true;
			}
		}
		return false;
	}

	public set isShowCountdown(isShowCountdown: boolean) {
		this._isShowCountdown = isShowCountdown;
	}

	public get isShowCountdown(): boolean {
		return this._isShowCountdown;
	}

	public get width(): number {
		return 174;
	}

	public get height(): number {
		return 234;
	}

	/**
	 * 处理快速使用
	 */
	private process(): void {
		if (!this.isProcessing) {
			if (this.dataList.length > 0) {
				if (!this.isShow) {
					return;
				}
				let data:any = this.dataList.shift();
                this.quickUseType = data.quickUseType || EQuickUseType.PACK;
                this.setItemData(data.itemData);
                this.isShowCountdown = data.isShowCountdown;
				this.isProcessing = true;
				this.currentTime = this.countdown;
				this.updateTimeText();
			} else {
				super.hide();
				this.isProcessing = false;
				App.TimerManager.remove(this.process, this);
				App.TimerManager.remove(this.updateTimeText, this);
			}
		}
	}

	private setItemData(itemData: ItemData) {
		this.itemData = itemData;
		if (itemData != null) {
			this.btnText = this.getBtnText(itemData);
            this.viewCtl.selectedIndex = 0;
            if (ItemsUtil.isEquipSpritItem(itemData) && itemData.isExpire) {//过期守护特效处理
				this.nameTxt.text = "守护过期";
				this.baseItem.setData(itemData);
				this.baseItem.showBind();
				this.baseItem.showScoreCompare(false);
				this.baseItem.showBestMc(false);
			} else {
				let cfg: any = ConfigManager.itemQuickUse.getByPk(itemData.getCode());
				if (cfg != null) {
					this.countdown = cfg["countdown"];
				}

				if (itemData.getColor() == EColor.EColorWhite) {//白色装备默认显示黑色
					this.nameTxt.text = itemData.getName();
				} else {
					this.nameTxt.text = itemData.getColorString(itemData.getName());
				}
				this.baseItem.setData(itemData);
				this.baseItem.showBind();
				this.baseItem.showScoreCompare(true);
				this.baseItem.showBestMc(false);
				//特殊道具处理
            	if (ItemsUtil.isOfflineWork(itemData) && this.quickUseType == EQuickUseType.SHOP) {
                    let leftHours:number = Math.ceil(CacheManager.sysSet.offlineWorkLeftTime / 3600) || 1;
                    this.viewCtl.selectedIndex = 1;
                    this.timeTxt.text = App.StringUtils.substitude(LangSetting.LANG7, leftHours);
                }
			}
		}
	}

	private updateTimeText(): void {
		if (this.isProcessing) {
			if (this.isShowCountdown) {
				this.useBtn.text = `${this.btnText}  ${this.currentTime}`;
			} else {
				this.useBtn.text = this.btnText;
			}
			this.currentTime--;
			if (this.currentTime < 0) {
				this.isProcessing = false;
				if (!this.isShowCountdown) {
					return;
				}
				if (ItemsUtil.isEquipSpritItem(this.itemData)) {
					this.clickUseBtn();
				} else {
					//新手阶段，如果是装备，倒计时结束后自动装备
					if (this.itemData != null && ItemsUtil.isEquipItem(this.itemData) && CareerUtil.isNovice(CacheManager.role.getRoleCareer())) {
						this.clickUseBtn();
					}
				}
			}
		}
	}

	/**
	 * 点击使用/装备
	 */
	private clickUseBtn(): void {
		if (this.itemData != null) {
			if(ItemsUtil.isMonthTempPrivilegeCard(this.itemData)) {
				EventManager.dispatch(UIEventEnum.ShowPrivilegeCardExpWindow);
			}
			else if (ItemsUtil.isEquipSpritItem(this.itemData) && this.itemData.isExpire) {
				EventManager.dispatch(UIEventEnum.ShopRenewSpiritOpen, this.itemData);
			} else if (this.quickUseType == EQuickUseType.SHOP) {
				//链接到商城
				EventManager.dispatch(UIEventEnum.ShopBuyOpen, this.itemData);
            } else {
				EventManager.dispatch(LocalEventEnum.PackUse, this.itemData);
			}
		}
		this.isProcessing = false;
	}

	/**
	 * 获取按钮文字
	 */
	private getBtnText(itemData: ItemData): string {
		let text: string = "";
		if (itemData.isExpire || this.quickUseType == EQuickUseType.SHOP) {
			text = "查看";
		} else if (itemData.getCategory() == ECategory.ECategoryEquip) {
			text = "装备";
		} else {
			text = "使用";
		}
		return text;
	}
}