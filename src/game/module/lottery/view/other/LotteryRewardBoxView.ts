class LotteryRewardBoxView extends BaseView {
	private c1:fairygui.Controller;
	private txtCount:fairygui.GTextField;
	private rewardCfg:any;
	private lotteryInfo:any;
	public constructor(component:fairygui.GComponent) {
		super(component);
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.txtCount = this.getGObject("txt_count").asTextField;
		this.view.addClickListener(this.onClickHandler,this);
	}

	public updateAll(rewardCfg:any):void {
		this.rewardCfg = rewardCfg;
		// let category:LotteryCategoryEnum = Math.floor(rewardCfg.type / 100);
		// let info:any = CacheManager.lottery.getLotteryInfo(category);
		// this.updateLotteryInfo(info);
	}

	public updateLotteryInfo(info:any):void {
		let hadGetList:number[] = [];
		let times:number = 0;
		this.lotteryInfo = info;
		if(this.lotteryInfo) {
			hadGetList = info.hadGetRewards.data_I;
			times = info.times;
		}
		CommonUtils.setBtnTips(this.viewCom,false);
		if(hadGetList.indexOf(this.rewardCfg.lotteryTimes) != -1) {
			//已领取
			this.c1.setSelectedIndex(2);
			this.txtCount.text = "已领取";
			this.txtCount.color = Color.Green2;
		}
		else {
			if(times >= this.rewardCfg.lotteryTimes) {
				//可领取
				this.c1.setSelectedIndex(1);
				this.txtCount.text = "可领取";
				this.txtCount.color = Color.Green2;
				CommonUtils.setBtnTips(this.viewCom,true);
			}
			else {
				//不可领
				this.c1.setSelectedIndex(0);
				this.txtCount.text = this.rewardCfg.lotteryTimes + "次";
				this.txtCount.color = 0x979595;
			}
		}
	}

	private onClickHandler():void {
		// if(this.c1.selectedIndex == 2) {
		// 	Tip.showTip("已领取");
		// 	return;
		// }
		if(this.c1.selectedIndex != 1) {
			// let times:number = this.lotteryInfo != null ? this.lotteryInfo.times : 0;
			// let needTimes:number = this.rewardCfg.lotteryTimes - times;
			// Tip.showTip("再寻宝" + needTimes + "次可领取奖励");
			EventManager.dispatch(UIEventEnum.LotteryNumRewardOpen,{cfg:this.rewardCfg,info:this.lotteryInfo});
			return;
		}
		EventManager.dispatch(LocalEventEnum.LotteryGetCountReward,this.rewardCfg.type,this.rewardCfg.lotteryTimes);
	}
}