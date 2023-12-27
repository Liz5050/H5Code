class ActivityModule extends BaseTabModule {
	// private showInfos:ActivityInfo[];
	private showInfos:{[type:number]:ActivityInfo};
	// /**
	//  * 所有活动类型对应的类名映射
	//  */
	// private classMap:{[type:number]:any[]};
	private category:ActivityCategoryEnum;
	private btnLeft:fairygui.GButton;
	private btnRight:fairygui.GButton;

	public static BtnTipsPos:egret.Point = new egret.Point(71,22);
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.Activity);
	}

	public initOptUI():void {
		super.initOptUI();
		this.className = {
			[PanelTabType.ESpecialConditionTypePreferentialGift]:["PreferentialGiftPanel",PreferentialGiftPanel,PackNameEnum.ActivityII],//特惠礼包
			[PanelTabType.ESpecialConditionTypePreferentialGiftNormal]:["PreferentialGiftPanelII",PreferentialGiftPanelII,PackNameEnum.ActivityII],//特惠礼包(暖冬福利活动)
			[PanelTabType.ESpecialConditionTypeNewServerLimitBuy]:["NewServerBuyPanel",NewServerLimitBuyPanel,PackNameEnum.ActivityShop],//开服限购
			[PanelTabType.ESpecialConditonTypeMgRecharge]:["RechargeAddPanelII",RechargeAddPanelII,PackNameEnum.ActivityIII],//累计礼包
			[PanelTabType.ESpecialConditonTypeRechargeCondDayCount]:["RechargeContinuePanel",RechargeContinuePanel,PackNameEnum.ActivityIII],//连续充值
			[PanelTabType.ESpecialConditonTypeRechargeDayReturn]:["ActivityRebatePanel",ActivityRebatePanel,PackNameEnum.ActivityIV],//天天返利
			// [PanelTabType.ESpecialConditonTypeBossTask]:["ActivityBossPanel",ActivityBossPanel,PackNameEnum.ActivityBoss],//全民boss
			// [PanelTabType.ESpecialConditonTypeRechargeToday]:["DayRechargePanel",ActivityDayRechargePanel,PackNameEnum.ActivityIII],//每日累充
			[PanelTabType.ESpecialConditonTypeToplistActiveOpen]:["ActivityRankRewardPanel",ActivityRankRewardPanel,PackNameEnum.ActivityRank],//冲榜排名
			[PanelTabType.ESpecialConditonTypeReachGoal]:["ActivityDayTargetPanel",ActivityDayTargetPanel,PackNameEnum.ActivityRank],//冲榜达标
			[PanelTabType.ESpecialConditionTypeLevelReward]:["ActivityUpgradeLvPanel",ActivityUpgradeLvPanel,PackNameEnum.ActivityRank],//等级豪礼
			[PanelTabType.ESPecialConditionTypeParadiesLost]:["ActivityLostCopyPanel",ActivityLostCopyPanel,PackNameEnum.ActivityBoss],//双生乐园副本
			[PanelTabType.ESpecialConditionTypeBossScore]:["ActivityScorePanel",ActivityScorePanel,PackNameEnum.ActivityScore],//积分兑换
			[PanelTabType.ESpecialConditionTypeSpiritSports]:["ActivityUpgradeFaBaoPanel",ActivityUpgradeFaBaoPanel,PackNameEnum.ActivityRank],//法宝竞技
			[PanelTabType.ESpecialConditonTypeComposeRecharge]:["ActivityRechargeRebatePanel",ActivityRechargeRebatePanel,PackNameEnum.ActivityIV],//累充返利
			[PanelTabType.ESpecialConditionTypeMgNewGuildWar]:["ActivityGuildBattlePanel",ActivityGuildBattlePanel,PackNameEnum.ActivityWar],//仙盟争霸
			[PanelTabType.ESpecialConditionTypeRechargeGroup]:["ActGroupBuyPanel",ActGroupBuyPanel,PackNameEnum.ActGroupBuy],//团购
			[PanelTabType.ESpecialConditionTypeInvestPlan]:["ActivityInvestPanel",ActivityInvestPanel,PackNameEnum.ActivityInvest],//投资计划
			[PanelTabType.ESpecialConditonTypeComposeRechargeEx]:["ActivityHolidayRechargePanel",ActivityHolidayRechargePanel,PackNameEnum.ActivityIV],//投资计划
			[PanelTabType.ESpecialConditonTypeBossExtraDrop]:["ActivityBossDropPanel",ActivityBossDropPanel,PackNameEnum.ActivityBoss],//boss献礼
		};

		this.btnLeft = this.getGObject("btn_left").asButton;
		this.btnLeft.addClickListener(this.onBtnLeftClick, this);
		this.btnRight = this.getGObject("btn_right").asButton;
		this.btnRight.addClickListener(this.onBtnRightClick, this);
		this.tabBtnList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onSubTypeListScroll, this);
		this.tabBtnList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onSubTypeListScrollEnd, this);
	}

	public updateAll(data?:any):void {
		this.category = data.category;
		this.tabBtnList.list.visible = this.category != ActivityCategoryEnum.ActivityInvest && this.category != ActivityCategoryEnum.ActivityShop;
		let list:ActivityInfo[] = data.activityList;
		this.showInfos = {};
		this._tabTypes = [];
		// this.className = {};
		for(let i:number = 0; i < list.length; i++) {
			let activityInfo:ActivityInfo = list[i];
			if(data.showTypes && data.showTypes.indexOf(activityInfo.type) == -1) continue;
			if(!activityInfo.isOpen || activityInfo.type == ESpecialConditonType.ESpecialConditonTypeRechargeToday) continue;
			activityInfo.iconInit = true;
			this.onAdd(activityInfo);
		}
		if(this._tabTypes.length == 0) {
			Tip.showTip("暂无活动");
			return;
		}
		this._tabTypes.sort(this.sortTypes);
		this.tabBtnList.data = this._tabTypes;
		let tabType:PanelTabType = data.tabType;
		if(this._tabTypes.indexOf(tabType) == -1) {
			tabType = this._tabTypes[0];
		}
		this.setIndex(tabType);
		this.tabBtnList.scrollToView(0);
		this.onSubTypeListScroll();
		this.checkAllBtnTips();
	}

	private onAdd(info:ActivityInfo):PanelTabType {
		let typeName:string = ESpecialConditonType[info.type];
		let tabType:PanelTabType = PanelTabType[typeName];
		this._tabTypes.push(tabType);
		// this.className[tabType] = this.classMap[info.type];
		this.showInfos[tabType] = info;
		// this.className.push(this.classMap[info.type]);
		// this.showInfos.push(info);
		return tabType;
	}

	private onRemove(info:ActivityInfo):void {
		let typeName:string = ESpecialConditonType[info.type];
		let tabType:PanelTabType = PanelTabType[typeName];
		if(this.tabViews[tabType]) {
			this.setBtnTips(tabType,false);
			this.tabViews[tabType].destroy();
			this.tabViews[tabType] = null;
			delete this.tabViews[tabType];
		}
		let index:number = this._tabTypes.indexOf(tabType);
		this._tabTypes.splice(index,1);
		// this.showInfos.splice(index,1);
		delete this.showInfos[tabType];
		// delete this.className[tabType];
		// this.className.splice(index,1);
	}

	public addActivity(info:ActivityInfo):void {
		if(info.type == ESpecialConditonType.ESpecialConditonTypeRechargeToday) return;
		if(info.category == this.category) {
			// for(let i:number = 0; i < this.showInfos.length; i++){
			// 	if(this.showInfos[i].code == info.code) return;
			// }
			let typeName:string = ESpecialConditonType[info.type];
			let tabType:PanelTabType = PanelTabType[typeName];
			if(this.showInfos[tabType]) {
				info.iconInit = false; //不能加
				return;
			}
			this.closeCurPanel();
			this.onAdd(info);
			this._tabTypes.sort(this.sortTypes);
			this.tabBtnList.data = this._tabTypes;
			this.setIndex(this._tabTypes[0]);
			this.setBtnTips(tabType,CacheManager.activity.checkActivityTipsByInfo(info),ActivityModule.BtnTipsPos);
			this.onSubTypeListScroll();
			this.onSubTypeListScrollEnd();
		}
	}

	public removeActivity(info:ActivityInfo):void {
		if(info.category == this.category) {
			if(info.type == ESpecialConditonType.ESpecialConditonTypeShowIcon) {
				//图标被移除，直接关闭界面
				this.hide();
			}
			else {
				//子活动被移除
				this.closeCurPanel();
				//移除数据
				this.onRemove(info);
				if(this._tabTypes.length == 0) {
					this.hide();
				}
				else {
					this._tabTypes.sort(this.sortTypes);
					this.tabBtnList.data = this._tabTypes;
					this.setIndex(this._tabTypes[0]);
				}
				this.onSubTypeListScroll();
				this.onSubTypeListScrollEnd();
			}
		}
	}

	private closeCurPanel():void {
		if(this.curType != -1){
			//先关闭当前页签
			if(this.tabViews[this.curType]) {
				this.tabViews[this.curType].hide();
				let btn:ListRenderer = this.tabBtnList.list.getChildAt(this.curIndex) as ListRenderer;
				btn["btnSelected"] = false;
				delete this.tabViews[this.curType];
			}
			this.curType = -1;
			this.curIndex = -1;
		}
	}

	public updateActicityInfo():void {
		this.updateSubView();
	}

	/**
	 * 已领取奖励信息更新
	 */
	public updateRewardInfo():void {
		if(this.curPanel) {
			this.curPanel.updateRewardGetInfo();
			this.setBtnTips(this.curType,CacheManager.activity.checkActivityTipsByInfo(this.showInfos[this.curType]),ActivityModule.BtnTipsPos);
			this.onSubTypeListScrollEnd();
		}
	}

	/**
	 * 天天返利信息更新
	 */
	public rebateInfoUpdate():void {
		if(this.curType != PanelTabType.ESpecialConditonTypeRechargeDayReturn) {
			this.setBtnTips(PanelTabType.ESpecialConditonTypeRechargeDayReturn,CacheManager.activity.checkRechargeRebateTips(),ActivityModule.BtnTipsPos);
		}
		this.updateRewardInfo();
	}

	/**
	 * 充值天数更新
	 */
	public updateRechargeDay():void {
		if(this.curPanel) {
			this.curPanel.updateRechargeDay();
		}
		let index:number = this.tabTypes.indexOf(PanelTabType.ESpecialConditonTypeRechargeCondDayCount);
		if(index != -1) {
			this.setBtnTips(this._tabTypes[index],CacheManager.activity.checkContinueRechargeTips(this.showInfos[PanelTabType.ESpecialConditonTypeRechargeCondDayCount]),ActivityModule.BtnTipsPos);
			this.onSubTypeListScrollEnd();
		}
	}

	public updateBossScore():void{
		if(this.curPanel instanceof ActivityScorePanel){
			this.curPanel.updateAll();
			let index:number = this.tabTypes.indexOf(PanelTabType.ESpecialConditionTypeBossScore);
			if(index != -1) {
				this.setBtnTips(this._tabTypes[index],CacheManager.activity.checkScoreExcTip(this.showInfos[PanelTabType.ESpecialConditionTypeBossScore]),ActivityModule.BtnTipsPos);
				this.onSubTypeListScrollEnd();
			}
		}
	}

	/**
	 * 累计充值额度更新
	 */
	public updateRechargeNum():void {
		if(this.curPanel) {
			this.curPanel.updateRechargeNum();
		}
		let index:number = this.tabTypes.indexOf(PanelTabType.ESpecialConditonTypeMgRecharge);
		if(index != -1) {
			this.setBtnTips(this._tabTypes[index],CacheManager.activity.checkAddRechargeTips(this.showInfos[PanelTabType.ESpecialConditonTypeMgRecharge]),ActivityModule.BtnTipsPos);
			this.onSubTypeListScrollEnd();
		}
	}

	/**
	 * 冲榜活动排行榜更新
	 */
	public updateActivityRank(data:any[]):void {
		if(this.curPanel) {
			this.curPanel.updateActivityRank(data);
		}
	}

	/**
	 * 升级狂欢更新
	 */
	public updateUpgradeLvList():void {
		if(this.curPanel) {
			this.curPanel.updateUpgradeLv();
		}
		let index:number = this.tabTypes.indexOf(PanelTabType.ESpecialConditionTypeLevelReward);
		if(index != -1) {
			this.setBtnTips(this._tabTypes[index],CacheManager.activity.checkUpgradeLvTips(),ActivityModule.BtnTipsPos);
			this.onSubTypeListScrollEnd();
		}
	}

	/**
	 * 元宝更新
	 */
	public moneyGoldUpdate():void {
		if(this.category == ActivityCategoryEnum.ActivityOpenServer || this.category == ActivityCategoryEnum.ActivityHoliday || this.category == ActivityCategoryEnum.ActivityHoliday2) {
			this.checkAllBtnTips();
		}	
	}
	
	/**
	 * 奖励份数更新
	 */
	public updateRewardNumList():void {
		if(this.category == ActivityCategoryEnum.ActivityContinue) {
			this.checkAllBtnTips();
		}
		if(this.curPanel) {
			this.curPanel.updateRewardNumList();
		}
	}

	public updateInvestInfo():void {
		if(this.curPanel) {
			this.curPanel.updateInvestInfo();
		}
		if(this.category == ActivityCategoryEnum.ActivityInvest) {
			this.setBtnTips(PanelTabType.ESpecialConditionTypeInvestPlan,CacheManager.activity.checkActivityInvestTips(),ActivityModule.BtnTipsPos);
		}
	}

	private checkAllBtnTips():void {
		for(let type in this.showInfos) {
			this.setBtnTips(Number(type),CacheManager.activity.checkActivityTipsByInfo(this.showInfos[type]),ActivityModule.BtnTipsPos);
		}
		//触发左右箭头的红点计算
		this.onSubTypeListScrollEnd();
		// for(let i:number = 0; i < this.showInfos.length; i++) {
		// 	this.setBtnTips(this._tabTypes[i],CacheManager.activity.checkActivityTipsByInfo(this.showInfos[i]),this.btnTipsPos);
		// }
	}

	protected updateSubView():void {
		if(this.curPanel) {
			let curInfo:ActivityInfo = this.showInfos[this.curType];
			this.curPanel.updateActicityInfo(curInfo);
			let isFirst:boolean = false;
			if(this.curType == PanelTabType.ESpecialConditonTypeRechargeCondDayCount) {
				//连续充值活动红点首次登陆显示
				isFirst = CacheManager.activity.checkShowEffect(this.curType);
			}
			(this.curTabBtn as ActivityButtonItem).onShow();
			if(isFirst) {
				this.setBtnTips(this.curType,CacheManager.activity.checkContinueRechargeTips(curInfo),ActivityModule.BtnTipsPos);
				let iconTips:boolean = CacheManager.activity.checkActivityTips(curInfo.category);
				EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId[ActivityCategoryEnum[curInfo.category]],iconTips);
			}
		}
		if(CacheManager.activity.gotoActivityType != ESpecialConditonType[PanelTabType[this.curType]]) {
			CacheManager.activity.gotoActivityType = -1;
		}
	}

	protected changeTitle():void {
		if(this.curType == -1) return;
		let typeName:string = PanelTabType[this.curType];
		let type:ESpecialConditonType = this.showInfos[this.curType].type;
		this.title = ModuleEnum[this.moduleId] + "_" + type;
	}

	public get activityCategory():ActivityCategoryEnum {
		return this.category;
	}

	protected get curPanel():ActivityBaseTabPanel {
		return (this.tabViews[this.curType] as ActivityBaseTabPanel);
	}

	private sortTypes(type1:PanelTabType,type2:PanelTabType):number {
		let types:PanelTabType[] = UIManager.ModuleTabTypes[ModuleEnum.Activity];
		return types.indexOf(type1) - types.indexOf(type2)
	}

	private onBtnLeftClick():void {
		let idx:number = this.tabBtnList.list.getFirstChildInView();
		idx -= 5;
		idx < 0 ? idx = 0 : null;
		
		this.tabBtnList.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onSubTypeListScrollEnd, this);
	}

	private onBtnRightClick():void {
		let idx:number = this.tabBtnList.list.getFirstChildInView();
		idx += 5;
		idx > this.tabBtnList.data.length-1 ? idx = this.tabBtnList.data.length-1 : null;
		
		this.tabBtnList.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onSubTypeListScrollEnd, this);
	}

	private onSubTypeListScroll():void {
		let percX:number = this.tabBtnList.list.scrollPane.percX;

		if(percX == 0) {
			this.btnLeft.visible = false;
			this.btnRight.visible = this.tabBtnList.canScroll;
			
		}
		else if(percX == 1) {
			this.btnLeft.visible = true;
			this.btnRight.visible = false;
		}
		else {
			this.btnLeft.visible = true;
			this.btnRight.visible = true;
		}
	}

	private onSubTypeListScrollEnd():void {
		let leftTip:boolean = false;
		let rightTip:boolean = false;
		let firstIdx:number = this.tabBtnList.list.getFirstChildInView();
		let item:ActivityButtonItem;
		for(let i=0; i < this.tabBtnList.data.length; i++) {
			if(!this.tabBtnList.isChildInView(i)) {
				item = this.tabBtnList.list.getChildAt(this.tabBtnList.list.itemIndexToChildIndex(i)) as ActivityButtonItem;
				if(item && item.hasTip) {
					if(i <= firstIdx) {
						leftTip = true;
						if(rightTip) break;
					}
					else {
						rightTip = true;
						if(leftTip) break;
					}
				}
			}
		}
		CommonUtils.setBtnTips(this.btnLeft, leftTip);
		CommonUtils.setBtnTips(this.btnRight, rightTip, 0,0,false);
	}

	protected getTabListDefaultItem():string {
		return URLManager.getPackResUrl(PackNameEnum.Activity,"ActivityButtonItem");
	}

	public hide():void {
		CacheManager.activity.backRankView = false;
		if(CacheManager.activity.gotoActivityType == ESpecialConditonType[PanelTabType[this.curType]]) {
			CacheManager.activity.backRankView = true;
			CacheManager.activity.gotoActivityType = -1;
		}
		super.hide();
	}
}