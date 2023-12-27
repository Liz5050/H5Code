class CrossStairRankWindow extends BaseWindow {
	private list_rank:List;
	public constructor() {
		super(PackNameEnum.Copy,"CrossStairRankWindow");
	}

	public initOptUI():void {
		this.list_rank = new List(this.getGObject("list_rank").asList);
	}

	public updateAll():void {
		this.updateRankInfo();
	}

	public updateRankInfo():void {
		let ranks:any[] = CacheManager.crossStair.rankInfos;
		this.list_rank.data = ranks;
	}
}