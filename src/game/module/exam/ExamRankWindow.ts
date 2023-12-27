class ExamRankWindow extends BaseWindow {
	private c1:fairygui.Controller;
	private scoresTxt: fairygui.GTextField;
	private rankTxt: fairygui.GTextField;
	private rankList: List;
	private rewardList:List;

	private closeTip: fairygui.GComponent;

	public constructor() {
		super(PackNameEnum.Exam, "ExamRankWindow");

	}
	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onSelectedChange,this);
		this.scoresTxt = this.getGObject("txt_scores").asTextField;
		this.rankTxt = this.getGObject("txt_rank").asTextField;
		this.rankList = new List(this.getGObject("list_rank").asList);
		this.rewardList = new List(this.getGObject("list_reward").asList);
		this.closeTip = this.frame.getChild("txt_closeTip").asCom;
		this.closeTip.y += 50;
	}

	public updateAll(): void {
		this.c1.selectedIndex = 0;
		this.updateRank();
	}

	public updateRankInfo(): void{
		this.onSelectedChange()
	}

	private onSelectedChange():void {
		if(this.c1.selectedIndex == 0) {
			this.updateRank();
		}
		else {
			this.updateReward();
		}
	}

	private updateRank(): void{
		this.rankList.setVirtual(CacheManager.exam.rankList);
		this.rankTxt.text = `我的排名：${CacheManager.exam.myRank}`;
		this.scoresTxt.text = `我的积分：${CacheManager.exam.myScore}分`;
	}

	private updateReward(): void{
		this.rewardList.data = ConfigManager.questionRankReward.getScoreAllRewards();
	}

}