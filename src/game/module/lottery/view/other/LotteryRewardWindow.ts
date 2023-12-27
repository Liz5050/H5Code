class LotteryRewardWindow extends BaseWindow {
	private txtTips:fairygui.GRichTextField;
	private itemList:List;
	private c1:fairygui.Controller;
	public constructor() {
		super(PackNameEnum.Lottery,"LotteryRewardWindow");
	}

	public initOptUI():void {
		this.c1 = this.getController("c1")
		this.txtTips = this.getGObject("txt_tips").asRichTextField;
		this.itemList = new List(this.getGObject("list_item").asList);
	}

	public updateAll(data?:any):void {
		let rewardCfg:any = data.cfg;
		let lotteryInfo:any = data.info;
		let times:number = lotteryInfo != null ? lotteryInfo.times : 0;
		let needTimes:number = rewardCfg.lotteryTimes - times;
		let hadGet:boolean = lotteryInfo != null && lotteryInfo.hadGetRewards.data_I.indexOf(rewardCfg.lotteryTimes) != -1;
		if(hadGet) {
			//已领取
			this.c1.setSelectedIndex(1);
			this.txtTips.text = "你已累计寻宝" + HtmlUtil.html(times + "",Color.Green2) + "次";
		}
		else {
			//未领取
			this.c1.setSelectedIndex(0);
			this.txtTips.text = "你已累计寻宝" + HtmlUtil.html(times + "",Color.Green2) + "次\n再寻宝" + HtmlUtil.html(needTimes + "",Color.Green2) + "次即可领取以下奖励";
		}
		let itemDatas:ItemData[] = [];
		let rewardStr:string[] = rewardCfg.rewardStr.split("#");
		for(let i:number = 0; i < rewardStr.length; i++) {
			itemDatas.push(RewardUtil.getReward(rewardStr[i]));
		}
		this.itemList.data = itemDatas;
	}
}