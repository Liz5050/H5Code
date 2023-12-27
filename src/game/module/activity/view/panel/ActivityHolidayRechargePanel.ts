class ActivityHolidayRechargePanel extends ActivityBaseTabPanel {
	private txt_rechargeNum:fairygui.GRichTextField;
	private list_btn:List;
	private list_reward:List;
	private curIndex:number = -1;

	private rechargeAmounts:number[];
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeComposeRechargeEx;
		this.desTitleStr = "";
	}

	public initOptUI():void {
		super.initOptUI();
		this.txt_rechargeNum = this.getGObject("txt_rechargeNum").asRichTextField;
		this.list_btn = new List(this.getGObject("list_btn").asList);
		this.list_btn.list.addEventListener(fairygui.ItemEvent.CLICK, this.onSelectBtnChange, this);
		this.list_reward = new List(this.getGObject("list_reward").asList);
	}

	public updateAll():void {
		super.updateAll();
	}

	private onSelectBtnChange():void {
		this.setIndex(this.list_btn.selectedIndex);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		let itemBtn:ActivityHolidayRechargeBtn;
		if(this.curIndex != -1) {
			itemBtn = this.list_btn.list.getChildAt(this.curIndex) as ActivityHolidayRechargeBtn;
			itemBtn.setSelected(false);
		}
		this.curIndex = index;
		itemBtn = this.list_btn.list.getChildAt(this.curIndex) as ActivityHolidayRechargeBtn;
		itemBtn.setSelected(true);

		this.refreshRewardList();
		this.list_reward.scrollToView(0);
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		this.rechargeAmounts = ConfigManager.rechargeRebate.getRechargeAmounts(info.code);
		this.list_btn.data = this.rechargeAmounts;
		this.updateRewardGetInfo();
	}

	public updateRewardGetInfo():void {
		if(!this.activityInfo) return;
		this.txt_rechargeNum.text = HtmlUtil.colorSubstitude(LangActivity.L23,Math.floor(CacheManager.activity.getHolidayTodayRechargeNum(this.activityInfo.code) / 100));
		this.refreshRewardList();
		let index:number = this.checkTips();
		this.setIndex(index);
	}

	private checkTips():number {
		let canGetIndex:number = -1;//可领奖的索引
		let canRechargeIndex:number = -1;//有奖励未达成的索引（不包含已过期）
		for(let i:number = 0; i < this.rechargeAmounts.length; i++) {
			let rechargeCfgs:any[] = ConfigManager.rechargeRebate.getRechargeList(this.activityInfo.code,this.rechargeAmounts[i]);
			let showTips:boolean = false;
			for(let cfg of rechargeCfgs) {
				let state:number = CacheManager.activity.holidayRechargeGetState(cfg.code,cfg.id);
				if(state == 1) {
					showTips = true;
					if(canGetIndex == -1) canGetIndex = i;
					break;
				}
				else if(state == 0 && cfg.type == 1 && this.activityInfo.openedDay == cfg.day) {
					if(canRechargeIndex == -1) canRechargeIndex = i;
				}
			}
			let tabBtn:ActivityHolidayRechargeBtn = this.list_btn.list.getChildAt(i) as ActivityHolidayRechargeBtn;
			CommonUtils.setBtnTips(tabBtn,showTips);
		}
		let index:number = 0;
		if(canGetIndex != -1) {
			index = canGetIndex;
		}
		else if(canRechargeIndex != -1) {
			index = canRechargeIndex;
		}
		return index;
	}

	private refreshRewardList():void {
		if(this.curIndex == -1) return;
		let rechargeCfgs:any[] = ConfigManager.rechargeRebate.getRechargeList(this.activityInfo.code,this.rechargeAmounts[this.curIndex]);
		rechargeCfgs.sort(sortRechargeCfg);
		function sortRechargeCfg(value1:any,value2:any):number {
			let state1:number = CacheManager.activity.holidayRechargeGetState(value1.code,value1.id);
			let state2:number = CacheManager.activity.holidayRechargeGetState(value2.code,value2.id);
			if(value1.type == 2 && value2.type == 1) return -1;//type 1为每天充值奖励，2为累积充值天数奖励，类型2始终置顶无视领奖状态
			if(value1.type == 1 && value2.type == 2) return 1;
			if(state1 == 1 && state2 != 1) return -1;//可领取排前面
			if(state1 != 1 && state2 == 1) return 1;
			if(state1 != 2 && state2 == 2) return -1;//已领取排后面
			if(state1 == 2 && state2 != 2) return 1;
			if(state1 != 3 && state2 == 3) return -1;//过期排后面
			if(state1 == 3 && state2 != 3) return 1;
			return 0;
		}
		this.list_reward.data = rechargeCfgs;
	}

	public hide():void {
		super.hide();
		if(this.curIndex != -1) {
			let itemBtn:ActivityHolidayRechargeBtn = this.list_btn.list.getChildAt(this.curIndex) as ActivityHolidayRechargeBtn
			itemBtn.setSelected(false);
			this.curIndex = -1;
		}
	}
}