class ExpPositionRankWindow extends BaseWindow {
	private list_rank:List;
	private txt_myRank:fairygui.GRichTextField;
	private txt_myExp:fairygui.GRichTextField;
	public constructor() {
		super(PackNameEnum.Copy2,"ExpPositionRankWindow");
	}

	public initOptUI():void {
		this.list_rank = new List(this.getGObject("list_rank").asList);
		this.txt_myRank = this.getGObject("txt_myRank").asRichTextField;
		this.txt_myExp = this.getGObject("txt_myExp").asRichTextField;
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.ExpPositionRankListUpdate,this.onRankListUpdate,this);
    }

	public updateAll():void {
		this.onRankListUpdate();
	}

	public onRankListUpdate():void {
		let rankInfos:any[] = CacheManager.posOccupy.rankInfos;
		this.list_rank.data = rankInfos;
		let myRank:number = CacheManager.posOccupy.myRank;
		let myRankStr:any = myRank > 0 ? myRank : LangArena.LANG36;
		this.txt_myRank.text = App.StringUtils.substitude(LangArena.L39,myRankStr);
		this.updateMyExp();
	}	

	public updateMyExp():void {
		this.txt_myExp.text = App.StringUtils.substitude(LangArena.L40,CacheManager.posOccupy.myExp);
	}
}