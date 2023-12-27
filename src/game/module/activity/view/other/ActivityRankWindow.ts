class ActivityRankWindow extends BaseWindow {
	private list_rank:List;
	private txt_rankTips:fairygui.GTextField;
	public constructor() {
		super(PackNameEnum.ActivityRank,"ActivityRankWindow");
	}

	public initOptUI():void {
		this.list_rank = new List(this.getGObject("list_rank").asList);
		this.txt_rankTips = this.getGObject("txt_rankTips").asTextField;
	}

	public updateAll(infos:any[]):void {
		// let rankInfos:any[] = CacheManager.activity.getRankListByType(type);
		// EventManager.dispatch(LocalEventEnum.GetRankList,type);
		this.updateRankInfos(infos);
	}

	public updateRankInfos(infos:any[]):void {
		this.list_rank.setVirtual(infos);
		this.list_rank.scrollToView(0);
		this.txt_rankTips.visible = !infos || infos.length == 0;
	}

	public hide():void {
		super.hide();
	}
}