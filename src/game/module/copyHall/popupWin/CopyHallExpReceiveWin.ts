/**
 * 经验副本结算界面
 * @author zhh
 * @time 2019-03-13 20:38:23
 */
class CopyHallExpReceiveWin extends BaseWindow {
    private listReward:List;

	public constructor() {
		super(PackNameEnum.CopyDaily,"CopyHallExpReceiveWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.listReward = new List(this.getGObject("list_reward").asList);

        //---- script make end ----

	}

	public updateAll(data?:any):void{
		let listData: any[] = CopyUtils.getNewExpCopyExpRewardList();
        let isHas: boolean = listData.length > 0;
		this.listReward.setVirtual(listData);
	}

	public hide(param: any = null, callBack: CallBack = null):void{
		super.hide(param,callBack);
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewExperience)){
            EventManager.dispatch(LocalEventEnum.CopyReqExit);
        }
	}


}