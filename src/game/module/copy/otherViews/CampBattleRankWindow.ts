class CampBattleRankWindow extends BaseWindow {
	private c1:fairygui.Controller;
	private scoreRank:CampBattleScoreRank;
	private rankReward:CampBattleRankReward;
	public constructor() {
		super(PackNameEnum.Copy,"CampBattleRankWindow");
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED,this.onSelectedChange,this);
		this.scoreRank = new CampBattleScoreRank(this.getGObject("score_rank").asCom);
		this.rankReward = new CampBattleRankReward(this.getGObject("rank_reward").asCom);
	}

	public onShow(param: any = null): void {
		super.onShow();
		this.closeTipTxt.visible = false;
	}

	public updateAll():void {
		this.c1.selectedIndex = 0;
		this.scoreRank.updateAll();
	}

	public updateScore():void {
		if(this.c1.selectedIndex == 0) {
			this.scoreRank.updateScore();
		}
	}

	private onSelectedChange():void {
		if(this.c1.selectedIndex == 0) {
			this.scoreRank.updateAll();
		}
		else {
			this.rankReward.updateAll();
		}
	}
}