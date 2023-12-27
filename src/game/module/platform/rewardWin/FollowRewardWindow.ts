/**关注奖励窗口 */
class FollowRewardWindow extends BasePlatformWindow {
	public constructor() {
		super(PackNameEnum.FollowReward);
		this.rewardType = EShareRewardType.EShareRewardTypeCare;
	}
	public initOptUI():void{
		super.initOptUI();		
		
	}
	protected getBgUrl():string{
		return URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.FollowReward);
	}

	protected getBtnIco():string{
		let icoUrl:string = "";
		if(this.isCanGet()){
			icoUrl = URLManager.getPackResUrl(PackNameEnum.FollowReward,"getReward");
		}else{
			icoUrl = URLManager.getPackResUrl(PackNameEnum.FollowReward,"follow");
		}
		return icoUrl;
	}
}