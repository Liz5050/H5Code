class KingBattleRankWindow extends BaseWindow {
	private c1:fairygui.Controller;
	private rankList:List;
	private myRankView:MyBattleRankView;
	private type:number;
	public constructor() {
		super(PackNameEnum.KingBattle,"KingBattleRankWindow");
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.rankList = new List(this.getGObject("rank_list").asList);
		this.myRankView = new MyBattleRankView(this.getGObject("myRankView").asCom);
	}

	public updateAll(data:any = null):void {
		this.type = data;
		this.c1.selectedIndex = this.type;
		let rankInfos:any = CacheManager.arena.getRankInfo(this.type);
		if(!rankInfos) return;
		this.rankList.data = rankInfos.data;
		this.myRankView.updateAll(this.type);
	}
}