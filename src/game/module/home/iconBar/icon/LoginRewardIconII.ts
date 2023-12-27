class LoginRewardIconII extends BaseIcon {
	private days: Array<number> = [3, 5, 10];
	private targetDay:number = 1;
	public constructor() {
		super(IconResId.LoginReward);
	}

	public updateAll(): void {
        if (CacheManager.welfare2.isLoginRewardGot(3)) {
            for (let day of this.days) {
                if (CacheManager.welfare2.isLoginRewardGot(day)) {
                    this.targetDay = day;
                }
            }
        } 
		else {
			this.targetDay = 1;
		}
        this.iconImg.load(this.iconUrl);
        CommonUtils.setBtnTips(this, CacheManager.welfare2.checkLoginRewardTips());
    }

	protected get iconUrl():string {
		if(!this.targetDay) this.targetDay = 1;
		return URLManager.getModuleImgUrl(`icon/${this.targetDay}.png`, PackNameEnum.Welfare2);
	}
}