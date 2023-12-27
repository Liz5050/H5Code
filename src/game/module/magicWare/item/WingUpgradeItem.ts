class WingUpgradeItem extends fairygui.GComponent {
	private iconLoader: GLoader;
	private colorLoader: GLoader;
	private stageLoader: GLoader;

	private timeTxt: fairygui.GTextField;

	private thisParent: fairygui.GComponent;

	private endTime: number;
	private upgradeItem: ItemData;
	private curStage: number;
	private roleIndex: number;

	private timerHandler: number = -1;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.colorLoader = this.getChild("loader_color") as GLoader;
		this.stageLoader = this.getChild("loader_stage") as GLoader;
		this.timeTxt = this.getChild("txt_time").asTextField;
		this.addClickListener(this.onClickHandler, this);
	}

	public setParent(thisParent: fairygui.GComponent, x: number, y: number): void {
		this.thisParent = thisParent;
		this.x = x;
		this.y = y;
		this.addRelation(this.thisParent, fairygui.RelationType.Center_Center);
		this.addRelation(this.thisParent, fairygui.RelationType.Middle_Middle);
	}

	public setData(roleIndex: number): void {
		let upgradeItemDatas: ItemData[] = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isWingUpgradeItem, ItemsUtil);
		let lowItem: ItemData = null;
		this.roleIndex = roleIndex;
		this.upgradeItem = null;
		this.curStage = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeWing, roleIndex).stage;
		if (roleIndex != -1) {
			for (let itemData of upgradeItemDatas) {
				if (!itemData.isExpire) {
					if(itemData.getEffect() >= this.curStage){
						if(ItemsUtil.isTrueItemData(this.upgradeItem)){
							if(itemData.getEffect() < this.upgradeItem.getEffect() || (itemData.getEffect() == this.upgradeItem.getEffect() && this.upgradeItem.pidt > itemData.pidt)){
								this.upgradeItem = itemData;
							}
						}else{
							this.upgradeItem = itemData;
						}
					}else{
						if(ItemsUtil.isTrueItemData(lowItem)){
							if(itemData.getEffect() < lowItem.getEffect() || (itemData.getEffect() == lowItem.getEffect() && lowItem.pidt > itemData.pidt)){
								lowItem = itemData;
							}
						}else{
							lowItem = itemData;
						}
					}
					if(!ItemsUtil.isTrueItemData(this.upgradeItem)){
						this.upgradeItem = lowItem;
					}
				}
			}
		}
		this.removeTimer();
		if (ItemsUtil.isTrueItemData(this.upgradeItem)) {
			this.iconLoader.load(this.upgradeItem.getIconRes());
			this.colorLoader.load(this.upgradeItem.getColorRes());
			this.stageLoader.load(URLManager.getModuleImgUrl(`wing_useStage/stage_${this.upgradeItem.getEffect()}.png`, PackNameEnum.MagicWare));
			this.onCountTime();
			if (this.timerHandler == -1) {
				this.timerHandler = egret.setInterval(this.onCountTime, this, 1000);
			}
			this.thisParent.addChild(this);
		} else {
			this.thisParent.removeChild(this);
		}
		CommonUtils.setBtnTips(this, CacheManager.magicWare.checkWingUpItem(roleIndex));
	}

	private onCountTime(): void {
		let leftTime: number = CacheManager.serverTime.getTodayLeftTime() / 1000;
		this.timeTxt.text = App.DateUtils.getTimeStrBySeconds(leftTime);
		if (this.timeTxt.text == "0") {
			this.thisParent.removeChild(this);
			this.removeTimer();
		}
	}

	private removeTimer(): void {
		if (this.timerHandler != -1) {
			egret.clearInterval(this.timerHandler);
			this.timerHandler = -1;
		}
	}

	private onClickHandler(): void {
		let useStage: number = this.upgradeItem.getEffect();
		let showTxt: string = App.StringUtils.substitude(LangForge.L18, this.upgradeItem.getName(), useStage, this.upgradeItem.sellPrice);
		let isCanUse: boolean = true;
		let btnTxt: string = "";
		if (this.curStage <= useStage) {
			btnTxt = "直升1阶";
			if (this.curStage < useStage) {
				isCanUse = false;
			}
		} else {
			btnTxt = "使用";
		}
		AlertII.show(showTxt, null,
			function (type: AlertType) {
				if (type == AlertType.YES) {
					if (isCanUse) {
						ProxyManager.pack.useItem(this.upgradeItem.getUid(), 1, [], this.roleIndex);
					} else {
						// Tip.showCenterTip(`${useStage}阶可使用`);
						EventManager.dispatch(LocalEventEnum.ShowRollTip, `${useStage}阶可使用`);
					}
				}
			}, this, [AlertType.NO, AlertType.YES], ["取消", btnTxt]);
	}
}