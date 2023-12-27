/**
 * 点击鼓舞弹出的对话框
 */
class CopyInspireWindow extends CopyBasePopupWin {
	private btn_silver: fairygui.GButton;
	private btn_gold: fairygui.GButton;
	public constructor() {
		super(PackNameEnum.Copy, "WindowCopybuff");
	}

	public initOptUI(): void {
		super.initOptUI();
		this.btn_silver = this.getGObject("btn_silver").asButton;
		this.btn_gold = this.getGObject("btn_gold").asButton;
		this.btn_silver.addClickListener(this.onChanged, this);
		this.btn_gold.addClickListener(this.onChanged, this);
	}

	public updateAll(): void {
		var coinInspireNum: number = CacheManager.copy.coinInspireNum; //金钱剩余鼓舞次数
		var goldInspireNum: number = CacheManager.copy.goldInspireNum; //元宝剩余鼓舞次数

		if (goldInspireNum > 0) {
			if (!this.btn_gold.selected) {
				this.initSelect();
			}
		} else {
			this.initSelect();
		}	

	}

	private initSelect(): void {
		var coinInspireNum: number = CacheManager.copy.coinInspireNum; //金钱剩余鼓舞次数
		var goldInspireNum: number = CacheManager.copy.goldInspireNum; //元宝剩余鼓舞次数
		if (goldInspireNum <= 0 && coinInspireNum <= 0) { //没有次数了
			this.btn_gold.selected = true;
			this.btn_silver.selected = false;
		} else {
			this.btn_silver.selected = coinInspireNum > 0;
			this.btn_gold.selected = !this.btn_silver.selected && goldInspireNum > 0;
		}
	}

	protected onBtnClick(isOk: boolean): void {
		super.onBtnClick(isOk);
		if (isOk) {
			if (this.btn_silver.selected && CacheManager.copy.coinInspireNum > 0) {
				if (CommonUtils.isPriceEnough(CopyEnum.INSPIRE_COIN_COST, EPriceUnit.EPriceUnitCoinBind)) {
					EventManager.dispatch(UIEventEnum.CopyInspire, CopyEnum.INSPRITE_COIN);
				}
			} else if (this.btn_gold.selected && CacheManager.copy.goldInspireNum > 0) {
				var isGoldOK: boolean = CommonUtils.isGoldEnough(CopyEnum.INSPIRE_GOLD_COST);
				if (isGoldOK) {
					EventManager.dispatch(UIEventEnum.CopyInspire, CopyEnum.INSPRITE_GOLD);
				}
			}
			if (!CacheManager.copy.isHasInspireTime()) {
				Tip.showTip("鼓舞次数已满");
				this.hide();
			}
		}


	}

	protected onChanged(e: any): void {
		if (!CacheManager.copy.isHasInspireTime()) { //没有鼓舞次数了
			this.btn_gold.selected = true;
			this.btn_silver.selected = false;
		} else {
			var coinInspireNum: number = CacheManager.copy.coinInspireNum; //金钱剩余鼓舞次数
			var goldInspireNum: number = CacheManager.copy.goldInspireNum; //元宝剩余鼓舞次数
			switch (e.target) {
				case this.btn_silver:
					if (this.btn_silver.selected) {
						if (coinInspireNum > 0) {
							this.btn_gold.selected = false;
						} else {
							this.btn_silver.selected = false;
							this.btn_gold.selected = true;
						}
					}
					break;
				case this.btn_gold:
					if (this.btn_gold.selected) {
						if (goldInspireNum > 0) {
							this.btn_silver.selected = false;
						} else {
							this.btn_silver.selected = true;
							this.btn_gold.selected = false;
						}
					}
					break;

			}
		}

	}
	public onHide(): void {
		super.onHide();
		this.btn_gold.selected = false;
		this.btn_silver.selected = false;
	}





}