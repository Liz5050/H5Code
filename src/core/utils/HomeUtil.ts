class HomeUtil {
	/**
	 * 所有功能图标 按数组索引排序
	 * 排序规则根据IconContainer中的排序方向决定
	 */
	public static AllIcons: number[] = [
		//左边图标 索引越大，越靠上
		IconResId.TestLeft5,

		//水平方向索引越大，越靠左
		//竖直方向索引越大，越靠上
		IconResId.Vip3Reward,
		IconResId.MonthCard,
		IconResId.ActivityLimitRecharge,
		IconResId.MultiRole,
		IconResId.RechargeFirst,
		IconResId.DayRecharge,
		IconResId.DayRechargeShow,

		//右边图标 索引越大，越靠下
		IconResId.Daily,
		IconResId.Arena,
		IconResId.CopyHall,
		IconResId.Boss,
	];
	//顶部图标
	//水平方向索引越大，越靠右
	//第一行
	public static topIcon1:number[] = [
		IconResId.SevenDayMagicWeapon,
		IconResId.Welfare,
		IconResId.Rank,
		IconResId.GuildNew,
		IconResId.Shop,
		IconResId.Lottery
	];
	//第二行
	public static topIcon2:number[] = [
		IconResId.ActivityBoss,
		IconResId.QiongCang,
		IconResId.Cross,
		IconResId.ActivityInvest,
		IconResId.ActivityHoliday,
		IconResId.ActivityHoliday2,
		IconResId.ActivityOpenServer,
		IconResId.ActivityMergeServer,
		IconResId.ActivityShop,
		IconResId.ActivityRecharge,
		IconResId.VipGiftPackage,
		IconResId.Certification,
		IconResId.Oprating,
	];
	//第三行
	public static topIcon3:number[] = [
		IconResId.LoginReward,
        IconResId.Qualifying,
		IconResId.OnlineRewardFashion,
		IconResId.CrossStair,
		IconResId.GuildBattle,
		IconResId.CampBattle,
		IconResId.ExpPositionOccupy,
		IconResId.TimeLimitBoss,
		IconResId.GuildTeam,
		IconResId.GuildDefend,
		IconResId.TimeLimitTask,
		IconResId.SwitchAccount,
		IconResId.Favorite,
		IconResId.SaveDesktop,
		IconResId.MiniClient,
		IconResId.Share,
        IconResId.Contest,
        IconResId.Peak,
		IconResId.ActivitySeven,
		IconResId.ActivityContinue,
	];

	//点击过图标
	private static iconClickedDic:any = {};

	/**图标特效点击一次消失 */
	private static initEffectIcon: number[] = [
		IconResId.MonthCard, IconResId.Vip3Reward,
		IconResId.MultiRole,
		IconResId.ActivityLimitRecharge,];
	
	/**常驻图标特效 */
	private static effectIcon: number[] = [
		IconResId.RechargeFirst, IconResId.DayRecharge,IconResId.DayRechargeShow];
	/**是否点击就隐藏图片tip */
	private static iconClickHideImpTips:number[] = [IconResId.RechargeFirst, IconResId.MultiRole];

	/**
	 * 图标id对应类名 [IconResId.Achievement]:BaseIcon
	 * 默认BaseIcon
	 */
	private static iconClass:any = {
		[IconResId.LoginReward]:LoginRewardIconII,
		[IconResId.Peak]:PeakIcon,
		[IconResId.RechargeFirst]:RechargeFirstIco,
		[IconResId.ActivityLimitRecharge]:ActivityLimitRechargeIcon,
		[IconResId.TimeLimitBoss]:WarfareActivityIcon,
		[IconResId.GuildBattle]:WarfareActivityIcon,
		[IconResId.CampBattle]:WarfareActivityIcon,
		[IconResId.CrossStair]:WarfareActivityIcon,
		[IconResId.GuildDefend]:WarfareActivityIcon,
		[IconResId.GuildTeam]:WarfareActivityIcon,
	};

	/**图标id对应获得类型字典 */
	private static iconToActveTypeMap:any = {
		[IconResId.ExpPositionOccupy]:EActiveType.EActiveTypePosition,
		[IconResId.CampBattle]:EActiveType.EActiveTypeBattleBich,
		[IconResId.CrossStair]:EActiveType.EActiveTypeCrossStair,
		[IconResId.GuildDefend]:EActiveType.EActiveTypeMgGuildDefense,
	};

	public static isTopIcon(iconId: number): boolean {
		return iconId >= 1 && iconId <= 1000;
	}

	public static isLeftIcon(iconId: number): boolean {
		return iconId >= 1003 && iconId <= 2000;
	}

	public static isLeft2Icon(iconId: number): boolean {
		return iconId >= 1001 && iconId <= 1002;
	}

	public static isRightIcon(iconId: number): boolean {
		return iconId >= 2001 && iconId <= 3000;
	}

	public static isActivityIcon(iconId: number): boolean {
		return iconId >= 100 && iconId <= 300;
	}

	public static getSortId(iconId:number):number {
		let index:number = -1;
		if(HomeUtil.isTopIcon(iconId)) {
			index = HomeUtil.topIcon1.indexOf(iconId);
			if(index != -1) return index + 300000;
			index = HomeUtil.topIcon2.indexOf(iconId);
			if(index != -1) return index + 200000;
			index = HomeUtil.topIcon3.indexOf(iconId);
			if(index != -1) return index + 100000;
		}
		else {
			index = HomeUtil.AllIcons.indexOf(iconId);
		}
		return index;
	}

	public static getTopIconLine(iconId: number): number {
		let index:number = HomeUtil.topIcon1.indexOf(iconId);
		if(index != -1) {
			return 0;
		}
		index = HomeUtil.topIcon2.indexOf(iconId);
		if(index != -1) {
			return 1;
		}
		index = HomeUtil.topIcon3.indexOf(iconId);
		if(index != -1) {
			return 2;
		}
		return 3;
		// if(iconId >= 1 && iconId <= 99){
		// 	return 1;
		// }
		// else if(iconId >= 100 && iconId <= 400){
		// 	return 2;
		// }
		// else if(iconId >= 801 && iconId <= 900){
		// 	return 3;
		// }
		// else if(iconId >= 901 && iconId <= 1000) {
		// 	return 4;
		// }
		// return -1;
	}

	/**
	 * 初始化是否显示特效（点击一次消失）
	 */
	public static initShowEffect(iconId: number): boolean {
		return HomeUtil.initEffectIcon.indexOf(iconId) != -1;
	}
	/**
	 * 是否是永久存在特效的图标
	 */
	public static showEffectIcon(iconId: number): boolean {
		return HomeUtil.effectIcon.indexOf(iconId) != -1;
	}
	
	public static isClickHideImgTips(iconId: number):boolean{
		return HomeUtil.iconClickHideImpTips.indexOf(iconId) > -1;
	}

	/**
	 * 获取图标对应类
	 */
	public static getIconClass(iconId:number):any {
		let className:any = HomeUtil.iconClass[iconId];
		if(!className) return BaseIcon;
		return className;
	}

	//本次登陆是否点击过该图标
	public static isIconClicked(iconId: number): boolean {
		if (HomeUtil.iconClickedDic[iconId]) {
			return true;
		}
		return false;
	}

	public static setIconClicked(iconId: number): void {
		HomeUtil.iconClickedDic[iconId] = true;
	}

	/**通过图标id打开模块 */
	public static openByIconId(iconId: number): void {
		HomeUtil.setIconClicked(iconId);

		if (HomeUtil.isActivityIcon(iconId)) {
			let categoryName: string = IconResId[iconId];
			HomeUtil.openActivityModule(ActivityCategoryEnum[categoryName]);
		}
		else {
			switch (iconId) {
				case IconResId.Daily:
					 HomeUtil.open(ModuleEnum.Train, true);
					 break;
				case IconResId.Arena:
					HomeUtil.open(ModuleEnum.Arena);
					// let king:MainPlayer = CacheManager.king.leaderEntity;
					// EventManager.dispatch(LocalEventEnum.CopyShowExpEffect,king.avatar.mainLayer.localToGlobal());
					break;
				case IconResId.CopyHall:
					HomeUtil.open(ModuleEnum.CopyHall, false, {tabType: PanelTabType.CopyHallMaterial});
					break;
				case IconResId.Boss:
					let panelTabType: PanelTabType = PanelTabType.PersonalBoss;
					if (CacheManager.guide.isGuideTarget(GuideTargetName.HomeBossBtn)) {
						panelTabType = PanelTabType.WorldBoss;
					}
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": panelTabType});
					break;
				case IconResId.Friend:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Friend);
					break;
				case IconResId.Mail:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Friend, {"tabType": PanelTabType.FriendMail});
					// EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Mail, {"tabIndex": 1});
					break;
				case IconResId.Shop:
					HomeUtil.open(ModuleEnum.Shop);
					break;
				case IconResId.Lottery:
					HomeUtil.open(ModuleEnum.Lottery);
					break;
				case IconResId.SaveDesktop:
					Sdk.saveToDesktop();
					EventManager.dispatch(LocalEventEnum.RemoveHomeIcon,IconResId.SaveDesktop);
					if(!CacheManager.platform.isGetDestopReward()){ //还没领取微端奖励 领取
						ProxyManager.operation.getPlatformReward(EShareRewardType.EShareRewardTypeMicro);
					}					
					break;
				case IconResId.Share: 
					EventManager.dispatch(LocalEventEnum.PlatformShowShareReward);
					Sdk.platformOperation(EShareRewardType.EShareRewardTypeShare);
					break;
				case IconResId.Focus:
					EventManager.dispatch(LocalEventEnum.PlatformShowFollowReward);
					//Sdk.platformOperation(EShareRewardType.EShareRewardTypeCare);
					break;
				case IconResId.MiniClient:
					EventManager.dispatch(LocalEventEnum.PlatformShowMicorReward);
					//Sdk.platformOperation(EShareRewardType.EShareRewardTypeMicro);
					break;
				case IconResId.Favorite:
					Sdk.favorite();
					break;
				case IconResId.SwitchAccount:
					Sdk.switchAccount();
					break;
				case IconResId.RechargeFirst:
					HomeUtil.openRecharge(ViewIndex.One);
					break;
				case IconResId.GuildNew:
					if (CacheManager.guildNew.isJoinedGuild()) {
						// HomeUtil.open(ModuleEnum.GuildNew);
                        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GuildHome);
					} else {
						EventManager.dispatch(LocalEventEnum.GuildNewOpenSearchWin);
					}
					break;
				case IconResId.Welfare:
					HomeUtil.open(ModuleEnum.Welfare2);
					break;
				case IconResId.MonthCard:
					let tabType: PanelTabType = CacheManager.welfare2.isGoldCard ? PanelTabType.PrivilegeCard : PanelTabType.GoldCard;
					HomeUtil.open(ModuleEnum.Welfare2, false, {tabType: tabType});
					break;
				case IconResId.DayRecharge:
					EventManager.dispatch(LocalEventEnum.OpenDayRecharge);
					break;
				case IconResId.DayRechargeShow:
					EventManager.dispatch(LocalEventEnum.OpenDayRechargeShow);
					break;
				case IconResId.MultiRole:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.OpenRole, null, ViewIndex.One);
					break;
				case IconResId.TimeLimitTask:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.TimeLimitTask);
					break;
				case IconResId.Rank:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Rank);
					break;
				case IconResId.TimeLimitBoss:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.TimeLimitBoss);
					break;
				case IconResId.ExpPositionOccupy:
				case IconResId.CampBattle:
				case IconResId.CrossStair:
				case IconResId.GuildDefend:
					// EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Train,{tabType:PanelTabType.GamePlay});
					let activeType:EActiveType=HomeUtil.iconToActveTypeMap[iconId];
					let gamePlayCfg:any = ConfigManager.gamePlay.getByPk(activeType);
					if(gamePlayCfg) {
						EventManager.dispatch(LocalEventEnum.GamePlayWindowOpen,gamePlayCfg);
					}
					break;
				case IconResId.VipGiftPackage:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.VIP,{tabType:PanelTabType.VipGiftPackage});
					break;
				case IconResId.SevenDayMagicWeapon:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.SevenDayMagicWeapon);
					break;
				case IconResId.GuildBattle:
					if (CacheManager.guildNew.isJoinedGuild()) {
						EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildBattle);
					} 
					else {
						EventManager.dispatch(LocalEventEnum.GuildNewOpenSearchWin,true);
					}
					break;
				case IconResId.Cross:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Cross);
					break;
				case IconResId.Vip3Reward:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Vip3Reward);
					break;
				case IconResId.ActivitySeven:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.ActivitySeven);
					break;
				case IconResId.QiongCang:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.QiongCang);
					break;
				case IconResId.ActivityBoss:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.ActivityBoss);
					break;
				case IconResId.Peak:
					if (!CacheManager.peak.hasUpdatedState) {
                        Tip.showTip(LangCommon.L29);
						return;
                    }
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Peak);
					break;
				case IconResId.Contest:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Contest
                        , {tabType:CacheManager.contest.state == EContestState.EContestStateContest ? PanelTabType.ContestMain : PanelTabType.ContestQualification});
					break;
				case IconResId.Certification:
					EventManager.dispatch(LocalEventEnum.CertificationOpenGiftWindow,this);
					break;
				case IconResId.OnlineRewardFashion:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.OnlineReward);
					break;
				case IconResId.Oprating:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Operating);
					break;
				case IconResId.GuildTeam:
					if (CacheManager.guildNew.isJoinedGuild()) {
						EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildCopy,{tabType:PanelTabType.GuildTeam});
					} 
					else {
						EventManager.dispatch(LocalEventEnum.GuildNewOpenSearchWin,true);
					}
					break;
				case IconResId.ActivityLimitRecharge:
					EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.ActivityLimitRecharge);
					break;
                case IconResId.Qualifying:
                	this.openQualifying();
                	break;
				case IconResId.LoginReward:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Welfare2, { "tabType": PanelTabType.LoginReward });
					break;
			}
		}
	}

	public static openCrossBoss():void {
        if (!CacheManager.crossBoss.isOpen || !CacheManager.crossBoss.isCrossOpen) {
            Tip.showTip(LangCommon.L29);
            return;
        }
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CrossBoss);
	}

	public static openQualifying():void {
        /*if (!CacheManager.qualifying.isOpen) {
            Tip.showTip(LangCommon.L29);
            return;
        }*/
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Qualifying);
	}

	/**
	 * 通过活动类型打开活动界面 （并且直接跳转到该类型界面）
	 * @param isCheckComp 检查该活动的奖励是否全部领完(已经领完的弹提示不打开界面)
	 * @param showTypes 指定显示的活动,未开启的不管，从已开启的活动中筛选(传参可以传未开启的类型，会筛选过滤)
	 * */
	public static openActivityByType(activityType:ESpecialConditonType,showTypes:ESpecialConditonType[] = null):void {
		let tabType:PanelTabType = PanelTabType[ESpecialConditonType[activityType]];
		if(activityType == ESpecialConditonType.ESpecialConditonTypeRechargeToday || 
			activityType == ESpecialConditonType.ESpecialConditonTypeRechargeDayReturn) {
			if(CacheManager.serverTime.serverOpenDay > 7) {
				HomeUtil.openActivityModule(ActivityCategoryEnum.ActivityContinue,tabType,showTypes);
			}
			else {
				HomeUtil.openActivityModule(ActivityCategoryEnum.ActivityRecharge,tabType,showTypes);
			}
		}
		else {
			let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(activityType);
			if(!info) {
				Tip.showTip("活动未开启");
				return;
			}
			if(CacheManager.activity.isComplete(info)){ //已经领完该活动所有奖励,不打开界面
				Tip.showTip("您已领取所有奖励");
				return;
			}
			HomeUtil.openActivityModule(info.category,PanelTabType[ESpecialConditonType[activityType]],showTypes);
		}
	}

	public static openActivityModule(activityCategory:ActivityCategoryEnum,type:PanelTabType = null,showTypes:ESpecialConditonType[] = null):void {
		let categoryName:string = ActivityCategoryEnum[activityCategory];
		let index: number = categoryName.indexOf("_");
			if (index != -1) {
				categoryName = categoryName.substring(0, index);
			}
			let hasOpen: boolean = false;
			let category: ActivityCategoryEnum = ActivityCategoryEnum[categoryName];
			let list: ActivityInfo[] = CacheManager.activity.getActivityListByCategory(category);
			let tips:string = "暂无活动";
			if (!list || list.length == 0) {
				Log.trace(Log.TEST, tips);
			}
			else {
				for (let i: number = 0; i < list.length; i++) {
					if (list[i].isOpen) {
						hasOpen = true;
						break;
					}
				}
				tips = "您已领取所有奖励";
			}
			if (!hasOpen) {
				Tip.showTip(tips);
				return;
			}
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Activity, {
				category: category,
				activityList: list,
				tabType:type,
				showTypes:showTypes
			});
	}

	/**
	 * 获取图标倒计时结束后需要显示的文本内容
	 */
	public static getIconTimeEndStr(iconId:number):string {
		switch(iconId) {
			case IconResId.TimeLimitBoss:
			case IconResId.CampBattle:
			case IconResId.GuildBattle:
			case IconResId.GuildTeam:
			case IconResId.ExpPositionOccupy:
			case IconResId.CrossStair:
			case IconResId.GuildDefend:
				return "进行中";
			case IconResId.OnlineRewardFashion:
				return "可领取";
			default :
				return "";
		}
	}

	private shareCB(result: any): void {
		console.log("sdk测试分享:callback:", result);
		let resultStr = "测试分享返回, code:" + result.code + ", message:" + result.message;
		AlertII.show(resultStr, null, function () {
		}, this, [AlertType.YES], ["确定"]);
	}

	public static close(eModuleId: number, ...params): void {
		EventManager.dispatch(UIEventEnum.ModuleClose, eModuleId, ...params);
	}

	/**
	 * 打开模块的统一管理方法
	 */
	public static open(eModuleId: number, isToggle: boolean = false, ...params: any[]): void {
		if (isToggle) {
			EventManager.dispatch(UIEventEnum.ModuleToggle, eModuleId, ...params);
		}
		else {
			EventManager.dispatch(UIEventEnum.ModuleOpen, eModuleId, ...params);
		}
	}

	/**
	 * 模块是否开启
	 */
	public static isModuleOpen(moduleId: number, data?: any): boolean {
		if (!data) {
			data = {};
		}
		if (typeof (data) != "object" || (data instanceof Array)) {
			Log.trace(Log.SERR, "打开模块", ModuleEnum[moduleId], "的数据类型错误:", data);
			return false;
		}
		// if(moduleId == ModuleEnum.Friend){//好友页面开启在模块里单独处理
		// 	return true;
		// }
		let openKey: string;
		let openCfg: any;
		let tabType: PanelTabType = data.tabType;
		let moduleTypes: PanelTabType[] = UIManager.ModuleTabTypes[moduleId];
		if(tabType == PanelTabType.FriendMail){//好友邮件界面可打开
			return true;
		}
		if (!tabType) {
			//未指定打开的页签，自动查找一个已开启的
			if (moduleTypes && moduleTypes.length > 0) {
				let showTips: boolean = moduleTypes.length == 1;//仅有一个页签时，未开启取页签的未开启提示
				for (let i: number = 0; i < moduleTypes.length; i++) {
					tabType = moduleTypes[i];
					if(tabType == PanelTabType.DragonSoul) {
						showTips = true;
					}
					if(tabType == PanelTabType.HeartMethod) {
						showTips = false;
					}
					openKey = PanelTabType[tabType];
					openCfg = ConfigManager.mgOpen.getByOpenKey(openKey);
					let previewLevel:number = openCfg && openCfg.previewLevel > 0 ? openCfg.previewLevel : 0;
					if (ConfigManager.mgOpen.isOpenedByKey(openKey, showTips)) {
						//已开启功能
						data.tabType = tabType;
						return true;
					}
					else if(openCfg.showStyleUnopen == UnOpenShowEnum.Preview && CacheManager.role.getRoleLevel() >= previewLevel) {
						//可预览功能
						data.tabType = tabType;
						return true;
					}
				}
				//多个页签都未开启
				if (!showTips) {
					openCfg = ConfigManager.mgOpen.getByOpenKey(MountEnum[moduleId]);
					if (openCfg) Tip.showTip(openCfg.openCondDesc);
				}
				return false;
			}
			else {				
				//非页签模块，并且没有功能开启限制
				//如有功能开启限制，必须加一个对应openKey的类型到UIManager.ModuleTabTypes
				return true;
			}
		}
		else {
			//指定打开页签类型
			if (!moduleTypes || moduleTypes.indexOf(tabType) == -1) {
				Log.trace(Log.SERR, "页签类型错误 : ", PanelTabType[tabType],"模块：" + ModuleEnum[moduleId]);
				return false;
			}
			if (!ConfigManager.mgOpen.isOpenedByKey(ModuleEnum[moduleId])) {
				//指定打开页签的，优先判断模块是否开启
				return false;
			}
			openKey = PanelTabType[tabType];
		}
		openCfg = ConfigManager.mgOpen.getByOpenKey(openKey);
		if(openCfg) {
			let previewLevel:number = openCfg.previewLevel > 0 ? openCfg.previewLevel : 0;
			if (!ConfigManager.mgOpen.isOpenedByKey(openKey)) {
				if (openCfg.showStyleUnopen != UnOpenShowEnum.Preview || CacheManager.role.getRoleLevel() < previewLevel) {
					return false;
				}
			}
		}
		return true;
	}


	/**检查开服活动几个模块的红点提示 */
	public static checkOpenServerModuleTips(eModuleId: number): boolean {
		var flag: boolean = false;
		switch (eModuleId) {
			case ModuleEnum.SevenDays:
				flag = CacheManager.sevenDay.checkTips();
				break;
			case ModuleEnum.BibleActivity:
				flag = CacheManager.bibleActivity.checkTips();
				break;
		}
		return flag;
	}

	public static checkOpenServerTips(): boolean {
		if (CacheManager.sevenDay.checkTips() || CacheManager.bibleActivity.checkTips()) {
			return true;
		}
		return false;
	}

	/**
	 * 打开充值界面;未首充打开首充
	 * @param rechargeFirstIdx 首充界面的 viewIndex 默认都是Two
	 * */
	public static openRecharge(rechargeFirstIdx: number = ViewIndex.Two): void {
		if (CacheManager.recharge.isFirstRecharge()) {
			HomeUtil.open(ModuleEnum.Recharge);
		} else {
			HomeUtil.open(ModuleEnum.RechargeFirst, false, {}, ViewIndex.Two); //打开首充界面都不会有返回按钮， 只能作为二级界面打开
		}
	}

}