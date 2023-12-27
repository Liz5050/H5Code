class ShopCache implements ICache {
	private shopId: Array<number> = [1001, 1002, 1015, 1003, 1004, 1005];
	private limitDatas: any;
	private _mysteryGoods: Array<any>;
	public mysteryRefreshTime: number = 0;

	// public initTip: boolean = true;//神秘商店重登显示红点

	public constructor() {
		// super();
	}


	public set limitGoods(value: any) {
		this.limitDatas = value;
	}

	public get limitGoods(): any {
		if (this.limitDatas) {
			return this.limitDatas;
		}
		return {};
	}

	public get shops(): Array<number> {
		return this.shopId;
	}

	public set mysteryGoods(datas: Array<any>) {
		this._mysteryGoods = datas;
	}

	public get mysteryGoods(): Array<any> {
		if (this._mysteryGoods) {
			return this._mysteryGoods;
		}
		return [];
	}

	public checkFreeRefresh(): boolean {
		let leftTime: number = CacheManager.shop.mysteryRefreshTime - CacheManager.serverTime.getServerTime();
		if (leftTime > 0) {
			return false;
		}
		return true;
	}

	public checkTips(): boolean {
		// let flag: boolean = this.initTip;
		// if (!flag) {
		// 	flag = this.checkFreeRefresh();
		// }
		return this.checkFreeRefresh();
	}

	public startCountdown(): void {
		App.TimerManager.remove(this.countdown, this);
		App.TimerManager.doTimer(1000, 0, this.countdown, this);
	}

	public countdown(): void {
		let leftTime: number = CacheManager.shop.mysteryRefreshTime - CacheManager.serverTime.getServerTime() / 1000;
		if (leftTime <= 0) {
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.Shop, this.checkTips());
			EventManager.dispatch(LocalEventEnum.MysteryShopFreeRefresh);
			App.TimerManager.remove(this.countdown, this);
		}
	}

	public clear(): void {

	}
}