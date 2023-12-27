class CampBattleScoreRank extends BaseView {
	private list_rank:List;
	private txt_myRank:fairygui.GTextField;
	private txt_myScore:fairygui.GTextField;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}

	public initOptUI():void {
		this.txt_myRank = this.getGObject("txt_myRank").asTextField;
		this.txt_myScore = this.getGObject("txt_myScore").asTextField;
		this.list_rank = new List(this.getGObject("list_rank").asList);
	}

	public updateAll():void {
		this.updateScore();
		this.list_rank.list.scrollToView(0);
	}

	public updateScore():void {
		let scoreInfos:any[] = CacheManager.campBattle.scoreInfos
		this.txt_myScore.text = "我的积分：" + CacheManager.campBattle.myScore;
		let myRank:number =  CacheManager.campBattle.myRank;
		if(myRank > 0) {
			this.txt_myRank.text = "我的排名：" + myRank;
		}
		else {
			this.txt_myRank.text = "我的排名：未上榜";
		}
		if(scoreInfos) {
			this.list_rank.setVirtual(scoreInfos);
		}
	}
}