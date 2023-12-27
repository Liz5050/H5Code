/**
 * 穹苍副本排行榜界面
 * @author zhh
 * @time 2018-10-08 15:01:01
 */
class QCCopyRankWindow extends BaseWindow {
    private listRank:List;

	public constructor() {
		super(PackNameEnum.QiongCangCopy,"QCCopyRankWindow")

	}
	public initOptUI():void{
        //---- script make start ----
        this.listRank = new List(this.getGObject("list_rank").asList);

        //---- script make end ----

	}

	public updateAll(data?:any):void{
		if(data){
			data = data.slice(0,10);
			this.listRank.setVirtual(data);
		}
	}

	public onShow(param: any = null): void{
		super.onShow(param);
		EventManager.dispatch(LocalEventEnum.GetRankList,EToplistType.ETopListTypeQiongCangDreamland);
	}
}