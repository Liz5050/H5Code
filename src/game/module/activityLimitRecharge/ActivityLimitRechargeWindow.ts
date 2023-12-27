class ActivityLimitRechargeWindow extends BaseWindow {
	private loader_bg:GLoader;
	private list_btn:List;
	private list_item:List;
	private btn_get:fairygui.GButton;
	private txt_recharge:fairygui.GTextField;
	private fightPanel: FightPanel;
	private playerShow:PlayerModel;
	private txt_time:fairygui.GTextField;

	private activityInfo:ActivityInfo;
	private getInfos:number[];
	private curIndex:number = -1;
	private curSelectBtn:LimitRechargeBtnItem;
	private curReward:ActivityRewardInfo;
	private isCanGet:boolean = false;
	private needRecharge:number;
	private leftTime:number;
	private curTime:number;
	public constructor(moduleId:ModuleEnum) {
		super(PackNameEnum.ActivityLimitRecharge,"Main",moduleId);
		this.isShowCloseObj = true;
	}

	public initOptUI():void {
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("activity_bg_6.png",PackNameEnum.Activity));
		this.txt_recharge = this.getGObject("txt_recharge").asTextField;
		this.list_btn = new List(this.getGObject("list_btn").asList);
		this.list_btn.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectBtnChange,this);
		this.list_item = new List(this.getGObject("list_item").asList,{isShowName:false});
		this.btn_get = this.getGObject("btn_get").asButton;
		this.btn_get.addClickListener(this.onGetRewardHandler,this);
		this.fightPanel = this.getGObject("panel_fight") as FightPanel;
		this.txt_time = this.getGObject("txt_time").asTextField;

		this.playerShow = new PlayerModel([EEntityAttribute.EAttributeClothes, EEntityAttribute.EAttributeWeapon]);
		let container:fairygui.GComponent = this.getGObject("model_container").asCom;
		container.displayListContainer.addChild(this.playerShow);
	}

	public updateAll():void {
		this.updateActicityInfo();
		this.playerShow.updatePlayer(1000021);
		this.playerShow.updateWeapon(101005);
	}

	public updateActicityInfo():void {
		this.activityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypeFlashRecharge);
		if(!this.activityInfo) return;

		let rewardInfos:ActivityRewardInfo[] = this.activityInfo.rewardInfos;
		this.list_btn.data = rewardInfos;
		this.updateRewardInfo();
		
		this.leftTime = this.activityInfo.leftTime;
		if(this.leftTime > 0) {
			if(!App.TimerManager.isExists(this.onTimerUpdate,this)) {
				this.curTime = egret.getTimer();
				this.txt_time.text = App.StringUtils.substitude(LangActivity.L15,App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false));
				App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			}
		}
		else {
			this.txt_time.text = LangActivity.L14;
		}
	}

	/**领奖信息更新 */
	public updateRewardInfo():void {
		this.getInfos = CacheManager.activity.getActivityGetRewardInfo(this.activityInfo.code);
		this.updateCurRewardState();
		this.checkTabBtnTips();

		let index:number = 0;
		for(let i:number = 0; i < this.activityInfo.rewardInfos.length; i++) {
			if(this.activityInfo.rewardInfos[i].hadGetCount > 0) continue;
			index = i;
			break;
		}
		this.setIndex(index);
		this.list_btn.scrollToView(index);
	}

	public updateRechargeNum():void {
		//conds索引对应意义 --- 充值数额,模型类型,模型id,战力显示
		let rechargeNum:number = Math.floor(CacheManager.activity.limitRechargeNum / 100);
		this.txt_recharge.text = App.StringUtils.substitude(LangActivity.L13,rechargeNum);
		// this.progressBar.setValue(CacheManager.activity.limitRechargeNum,this.needRecharge);
		this.updateCurRewardState();
		this.checkTabBtnTips();
	}

	private onSelectBtnChange(evt:egret.TouchEvent):void {
		let index:number = this.list_btn.selectedIndex;
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		this.clearCurIndex();
		this.curIndex = index;
		this.curSelectBtn = this.list_btn.list.getChildAt(this.curIndex) as LimitRechargeBtnItem;
		this.curSelectBtn.btnSelected = true;

		this.curReward = this.activityInfo.rewardInfos[this.curIndex];
		this.needRecharge = this.curReward.conds[0];
		this.fightPanel.updateValue(this.curReward.conds[3]);
		let itemDatas:ItemData[] = this.curReward.getItemDatas();
		this.list_item.data = itemDatas;

		this.updateRechargeNum();
	}

	private checkTabBtnTips():void {
		let rechargeNum:number = CacheManager.activity.limitRechargeNum;
		for(let i:number = 0; i < this.activityInfo.rewardInfos.length; i++) {
			let rewardInfo:ActivityRewardInfo = this.activityInfo.rewardInfos[i];
			let hadGet:boolean = this.getInfos != null && this.getInfos[i] > 0;
			let btnItem:LimitRechargeBtnItem = this.list_btn.list.getChildAt(i) as LimitRechargeBtnItem;
			CommonUtils.setBtnTips(btnItem,rechargeNum >= rewardInfo.conds[0] && !hadGet);
		}
	}

	private updateCurRewardState():void {
		let hadGet:boolean = this.getInfos != null && this.getInfos[this.curIndex] > 0;
		this.isCanGet = false;
		if(hadGet) {
			//已领取
			this.btn_get.title = LangActivity.LANG9;
			App.DisplayUtils.grayButton(this.btn_get, true, true);
		}
		else {
			App.DisplayUtils.grayButton(this.btn_get, false, false);
			if(CacheManager.activity.limitRechargeNum >= this.needRecharge) {
				//可领取
				this.isCanGet = true;
				this.btn_get.title = LangActivity.LANG2;
			}
			else {
				//未达成
				this.btn_get.title = LangActivity.LANG11;
			}
		}
	}

	private onGetRewardHandler():void {
		if(!this.isCanGet) {
			HomeUtil.openRecharge();
			return;
		}
		EventManager.dispatch(LocalEventEnum.ActivityGetReward,this.activityInfo.code,this.curIndex);
	}

	private clearCurIndex():void {
		if(this.curIndex != -1) {
			this.curSelectBtn.btnSelected = false;
			this.list_item.data = null;
			// this.playerShow.updatePlayer(0);
			// this.playerShow.updateWeapon(0);
			this.curIndex = -1;
		}
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime <= 0){
			this.removeTimer();
			this.txt_time.text = LangActivity.L14;
			return;
		}
		this.txt_time.text = App.StringUtils.substitude(LangActivity.L15,App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false));
	}

	private removeTimer():void {
		App.TimerManager.remove(this.onTimerUpdate,this);
	}

	public hide():void {
		super.hide();
		this.removeTimer();
		this.clearCurIndex();
		this.playerShow.updatePlayer(0);
		this.playerShow.updateWeapon(0);
	}
}