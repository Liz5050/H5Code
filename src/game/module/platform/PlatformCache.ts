class PlatformCache implements ICache {
	/**分享可以领取奖励次数 */
	public static SHARE_REWARD_TIME:number = 3;
	/**领奖cd时间 秒*/
	public static SHARE_REWARD_CD_SEC:number = 7200; //2小时 7200

	private shareRewardStatus:any; 
	/**分享的奖励信息 */
	//private _shareRewardInfo:any;
	private sdkRewardInfoDict:any;

	private icoTypes:number[];

	public constructor() {
		this.shareRewardStatus = {};
		this.sdkRewardInfoDict = {};
		//PanelTabType.Certification
		this.icoTypes = [PanelTabType.Focus,PanelTabType.Share,PanelTabType.MiniClient,PanelTabType.SaveDesktop];
	}

	/**分享奖励是否还有次数 */
	public isHasShareRewardTime():boolean{
		let shareRewardInfo:any = this.getShareRewardInfo(EShareRewardType.EShareRewardTypeShare);
		return shareRewardInfo && shareRewardInfo.times<PlatformCache.SHARE_REWARD_TIME;
	}

	/**分享奖励是否在cd状态 */
	public isShareInCd():boolean{
		let flag:boolean = this.getShareCdLeftSec() > 0; 
		return flag;
	}	
	/**当前分享是否可领奖励 */
	public isShareCanGetReward():boolean{
		return this.isHasShareRewardTime() && !this.isShareInCd();
	}

	public getShareCdLeftSec():number{
		let sec:number = 0;		
		let shareRewardInfo:any = this.getShareRewardInfo(EShareRewardType.EShareRewardTypeShare);
		if(shareRewardInfo){
			let sevTime:number = CacheManager.serverTime.getServerTime();
			let getDt:number = shareRewardInfo.getDt + PlatformCache.SHARE_REWARD_CD_SEC;
			if(App.DateUtils.isSameDay(sevTime,getDt)){
				sec = getDt - sevTime;
			}
		}
		return sec;
	}

	/**设置平台的各种奖励信息 */
	public setShareRewardInfo(data:any):void{
		this.sdkRewardInfoDict[data.type]=data;
	}

	public getShareRewardInfo(type:number):any{
		return this.sdkRewardInfoDict[type];
	}
	/**获取已领取的奖励次数 */
	public getShareRewardTimes(type:number):number{
		let info:any = this.getShareRewardInfo(type);
		return info?info.times:0;
	}
	/**是否领取了保存桌面/微端的奖励 */
	public isGetDestopReward():boolean{
		let info:any = this.getShareRewardInfo(EShareRewardType.EShareRewardTypeMicro);
		return info && info.times >0;
	}

	public isNeedIco(type:number):boolean{
		let flag:boolean = true;
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[type],false);
		if(!isOpen){
			return false;
		}
		switch(type){
			case PanelTabType.Focus:
				flag = Sdk.isNeedFocus;
				break;
			case PanelTabType.Share: //分享 邀请 始终显示
				flag = true; //Sdk.isNeedShare;
				break;
			case PanelTabType.MiniClient:
				flag = Sdk.isNeedMicroClient;
				break;
			case PanelTabType.SaveDesktop:
				flag = Sdk.isNeedSaveToDesktop;
				break;			
		}
		return flag;
	}

	public isNeedEntrance():boolean{
		for(let type of this.icoTypes){
			if(this.isNeedIco(type)){
				return true;
			}
		}
		return false;
	}
	
	public clear():void{
		
	}
}