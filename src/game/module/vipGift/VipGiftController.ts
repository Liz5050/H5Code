/**
 * vip礼包
 */
class VipGiftController extends SubController
{
	public constructor()
	{
		super();
	}

    public getModule():VipModule {
        return <VipModule>this._module;
    }

	public addListenerOnInit(): void
	{
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActivePushPlayerVipGiftPackageInfo], this.onVipGiftInfoPush, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActivePlayerVipGiftPackageInfoUpdate], this.onVipGiftInfoUpdate, this);

		this.addListen0(LocalEventEnum.VipUpdate, this.onVipLevelUpdate, this);//vip更新
		this.addListen0(NetEventEnum.moneyGoldUpdate, this.moneyUpdate, this);
	}

	private onVipLevelUpdate():void {
		if(this.isShow) {
			(this._module as VipGiftModule).updateVipGiftPackageInfo();
		}
		// EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.VipGiftPackage, CacheManager.vipGift.checkVipGiftTips());
        EventManager.dispatch(LocalEventEnum.VipGiftTips);
	}

	private moneyUpdate():void {
		if(this.isShow) {
			(this._module as VipGiftModule).updateVipGiftPackageInfo();
		}
		// EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.VipGiftPackage, CacheManager.vipGift.checkVipGiftTips());
        EventManager.dispatch(LocalEventEnum.VipGiftTips);
	}

	/**
	 * 玩家 Vip 礼包信息推送（登录） S2C_SPushPlayerVipGiftPackageInfo
	 * @param data
	 */
	private onVipGiftInfoPush(data: any): void
	{
		let infos:any = data.infos.infos.data;

		let dic:any = {};
		for(let info of infos) {
			dic[info.type_I] = info;
		}

		CacheManager.vipGift.setVipGiftInfo(dic);

		EventManager.dispatch(LocalEventEnum.VipGiftInfoUpdate);

		if(this.isShow) {
			(this._module as VipGiftModule).updateVipGiftPackageInfo();
		}

		if(/*CacheManager.activity.checkActivityIcon(ActivityCategoryEnum.VipGiftPackage) &&*/ !CacheManager.vipGift.hasBuyAll()) {
			// EventManager.dispatch(LocalEventEnum.AddHomeIcon, IconResId.VipGiftPackage);
			// EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.VipGiftPackage, CacheManager.vipGift.checkVipGiftTips());
            EventManager.dispatch(LocalEventEnum.VipGiftTips);
		}
	}

	/**
	 * 玩家 Vip 礼包信息更新 S2C_SPlayerVipGiftPackageInfoUpdate
	 * @param data
	 */
	private onVipGiftInfoUpdate(data: any): void
	{
		CacheManager.vipGift.updateVipGiftInfo(data.info);

		EventManager.dispatch(LocalEventEnum.VipGiftInfoUpdate);

		if(this.isShow) {
			(this._module as VipGiftModule).updateVipGiftPackageInfo();
		}

		if(CacheManager.vipGift.hasBuyAll()) {
			// EventManager.dispatch(LocalEventEnum.RemoveHomeIcon, IconResId.VipGiftPackage);
		}
		else {
			// EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.VipGiftPackage, CacheManager.vipGift.checkVipGiftTips());
            EventManager.dispatch(LocalEventEnum.VipGiftTips);
		}
	}

}