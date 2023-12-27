/**
 * 科举答题结算界面
 */
class ExamResultWindow extends BaseWindow {
	private c1: fairygui.Controller;
	private rankTxt: fairygui.GTextField;
	private scoresTxt: fairygui.GRichTextField;
	private resultBgLoader: GLoader;
	private exitBtn: fairygui.GButton;
	private rewardList: List;
	private retData: any;

	public constructor() {
		super(PackNameEnum.Exam, "ExamResultWindow");

	}
	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.rankTxt = this.getGObject("txt_rank").asTextField;
		this.scoresTxt = this.getGObject("txt_scores").asRichTextField;
		this.resultBgLoader = <GLoader>this.getGObject("loader_result_Bg");
		this.resultBgLoader.load(URLManager.getModuleImgUrl("copy_result_win.png", PackNameEnum.Copy));
		this.exitBtn = this.getGObject("btn_exit").asButton;
		this.rewardList = new List(this.getGObject("list_reward").asList);

		this.exitBtn.addClickListener(this.onClickExitBtn, this);
	}

	public updateAll(data?: any): void {
		let rank: number = data.myRank_I;
		let scores: number = data.myScore_I;
		let rewardInfoArr: Array<any> = data.showRewards.data;
		let rewardDataArr: Array<ItemData> = [];

		// if(rank > 15){
		// 	this.c1.selectedIndex = 1;
		// }else{
		// 	this.c1.selectedIndex = 0;
		// 	this.rankTxt.text = `${rank}`;
		// }
		this.rankTxt.text = `${rank}`;
		this.scoresTxt.text = `我的积分： <font color = ${Color.Color_6}>${scores}</font>`;

		for(let sReward of rewardInfoArr){
			rewardDataArr.push(RewardUtil.getRewardBySReward(sReward));
		}
		this.rewardList.data = rewardDataArr;
	}

	private onClickExitBtn(): void{
		this.hide();
	}
}