/**
 * 微端下载奖励
 * @author zhh
 * @time 2018-08-02 14:46:06
 */
class MicroClientWindow extends BasePlatformWindow {   
	public constructor() {
		super(PackNameEnum.MicroClient,"Main");
		this.rewardType = EShareRewardType.EShareRewardTypeMicro;
		
	}
	public initOptUI():void{
		super.initOptUI();
		// this.titleIcon = "micro_client";
	}
	protected getBgUrl():string{
		return URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.MicroClient);
	}

	protected getBtnIco():string{
		let icoUrl:string = "";
		if(this.isCanGet()){
			icoUrl = URLManager.getPackResUrl(PackNameEnum.MicroClient,"getReward");
		}else{
			icoUrl = URLManager.getPackResUrl(PackNameEnum.MicroClient,"download");
		}
		return icoUrl;
	}
	
}