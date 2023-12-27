/**
 * Home图标管理
 */
class HomeIconController {
	private module: HomeModule;
	private _listen: BaseListen;
	private isInitialized: boolean = false;
	private rightPoint: egret.Point = new egret.Point(102, -10);
	private leftPoint:egret.Point = new egret.Point(54,-10);
	private rechargeFirstLevel: number = 30;//30级提示首冲
	private isTipRechargeFirstByLevel: boolean;//等级更新是否已提示首冲
	/**是否首次添加首充图标 */
	private isFirstAddRecharge:boolean = true;

	public constructor(module: HomeModule) {
		this.module = module;
		this._listen = new BaseListen();
	}

	/**
	 * 增加监听，界面关闭时会移除监听
	 */
	protected addListen1(name: any, listener: Function, caller: any): void {
		this._listen.add(name, 1, listener, caller);
	}

	/**
	 * 所有图标在Home打开时就加一次
	 * 后续图标更新通过功能相关的事件更新添加图标
	 */
	private initIcons(): void {
		this.onAddIconHandler(IconResId.Daily);
		this.onAddIconHandler(IconResId.Arena);
		this.onAddIconHandler(IconResId.CopyHall);
		this.onAddIconHandler(IconResId.Boss);
		this.onAddIconHandler(IconResId.Shop);
		this.onAddIconHandler(IconResId.Lottery);
		this.onAddIconHandler(IconResId.GuildNew);
		this.checkGuildEffect();
        this.updateGamePlayIcon();
        this.checkAddCrossIcon();
        this.checkAddPeakIcon();
        this.checkAddContestIcon();
        this.checkAddQualifyingIcon();

		this.addLevelUpSdkIco();
		if (Sdk.isNeedFavorite) {
			this.onAddIconHandler(IconResId.Favorite);
		}
		/*
		if (Sdk.isNeedSwitchAccount) {
			this.onAddIconHandler(IconResId.SwitchAccount);
		}
		*/
		if (!CacheManager.recharge.isFirstRecharge()) {
			this.onAddIconHandler(IconResId.RechargeFirst);
		}
		if (CacheManager.timeLimitTask.needShowIcon()) {
			this.onAddIconHandler(IconResId.TimeLimitTask);
			this.setIconTimeHandler(IconResId.TimeLimitTask,CacheManager.timeLimitTask.leftTime);
		}
		if(CacheManager.sevenDayMagicWeapon.isIconShow()){
			this.onAddIconHandler(IconResId.SevenDayMagicWeapon);
		}
		
		this.activityIconUpdate();
		this.onAddIconHandler(IconResId.Welfare);
		this.checkAddMonthCardIcon();
		this.checkMultiRoleIcon();
		this.onAddIconHandler(IconResId.Rank);
        this.checkAddV3RewardIcon();
		this.onAddIconHandler(IconResId.QiongCang);
		this.addOnlineRewardIcon();
		this.checkLoginRewardIcon();
	}
	
	/**module显示的时候才初始化 仅管理动态图标更新，监听全都用addListen1 */
	public addListenerOnShow(): void {
		if (this.isInitialized) {
			return;
		}
		this.isInitialized = true;
		this.initIcons();
		this.checkBtnTips();
		this.addListen1(LocalEventEnum.AddHomeIcon, this.onAddIconHandler, this);
		this.addListen1(LocalEventEnum.RemoveHomeIcon, this.onRemoveIconHandler, this);
		this.addListen1(NetEventEnum.BossListInfUpdate, this.onBossInfoUpdate, this);
		this.addListen1(NetEventEnum.packPosTypeLotteryChange, this.onPosTypeBagChange, this);
		this.addListen1(NetEventEnum.packPosTypeLotteryRuneChange, this.onPosTypeBagChange, this);
		this.addListen1(NetEventEnum.packPosTypeLotteryAncientChange, this.onPosTypeBagChange, this);
		this.addListen1(LocalEventEnum.HomeIconSetTip, this.setIconTips, this);
		this.addListen1(LocalEventEnum.HomeIconSetTime, this.setIconTimeHandler, this);
		this.addListen1(LocalEventEnum.MonthCardInfoUpdate, this.checkAddMonthCardIcon, this);
		this.addListen1(LocalEventEnum.HomeIconUpdateEffect, this.onIconEffectUpdate, this);
		//this.addListen1(LocalEventEnum.HomeAddGuildDefendIco, this.onAddGuildDefendIco, this);
		this.addListen1(LocalEventEnum.RechargeActInfo, this.onRechargeInfoUpdate, this);
		
		this.addListen1(LocalEventEnum.PlayerNewRoleUpdated, this.onPlayerNewRoleUpdate, this);
		this.addListen1(LocalEventEnum.PlayerCopyInfoUpdate, this.onPlayerCopyInfoUpdate, this);
		this.addListen1(LocalEventEnum.OpenRoleModuleShow, this.checkMultiRoleIcon, this);

		this.addListen1(LocalEventEnum.VipUpdate, this.onVipUpdate, this);
        this.addListen1(LocalEventEnum.VipRewardUpdate, this.onVipRewardUpdate, this);
		this.addListen1(NetEventEnum.roleStateChanged, this.onRoleStateUpdate, this);
		this.addListen1(LocalEventEnum.EncounterTipChange, this.onCheckArenaTip, this);
		this.addListen1(LocalEventEnum.UpdateMyMiningInfo, this.onCheckArenaTip, this);
		this.addListen1(LocalEventEnum.TaskFinished, this.onTaskFinished, this);
		this.addListen1(LocalEventEnum.CrossTips, this.onCheckCrossIconTips, this);
		this.addListen1(LocalEventEnum.PlayerFirstDead, this.onPlayerFirstDead, this);
		this.addListen1(UIEventEnum.SMStatesUpdate, this.updateSMIcon,this);
		this.addListen1(LocalEventEnum.GameCrossDay, this.onCrossDay, this);//服务器跨天
		this.addListen1(LocalEventEnum.PeakStateUpdated, this.checkAddPeakIcon, this);
		this.addListen1(LocalEventEnum.PeakStateChanged, this.onPeakStateChanged, this);
		this.addListen1(LocalEventEnum.ContestCheckIcon, this.checkAddContestIcon, this);
		this.addListen1(LocalEventEnum.ContestStateChanged, this.onContestStateChanged, this);
		this.addListen1(LocalEventEnum.QualifyingStateChanged, this.onQualifyingStateChanged, this);
		this.addListen1(LocalEventEnum.PeakTipsChanged, this.onPeakTipsChanged, this);
		this.addListen1(LocalEventEnum.QualifyingTipsChanged, this.onQualifyingTipsChanged, this);
		this.addListen1(UIEventEnum.FirstRechargeOpen, this.hideMultiRoleTips, this);
		this.addListen1(UIEventEnum.SceneMapUpdated, this.sceneMapUpdated, this);

		this.addListen1(LocalEventEnum.HomeSetTrainRedTip, this.setTrainRedTip, this);
		this.addListen1(LocalEventEnum.HomeLoginRewardUpdate, this.checkLoginRewardIcon, this);
		this.addListen1(NetEventEnum.moneyGoldUpdate, this.moneyGoldUpdate, this);

		// if(Sdk.platform_config_data.is_focus == 2) {
		// 	ProxyManager.operation.getPlatformReward(EShareRewardType.EShareRewardTypeCare);
		// }
		if(Sdk.platform_config_data.has_micro_client == 2) {
			ProxyManager.operation.getPlatformReward(EShareRewardType.EShareRewardTypeMicro);
		}

		EventManager.dispatch(UIEventEnum.ViewOpened, "Home");
	}

	public checkBtnTips(): void {
		this.setIconTips(IconResId.RechargeFirst, CacheManager.recharge.isCanFirstRchGetReward());
		this.setIconTips(IconResId.Daily, CacheManager.train.checkTips()); //日常
		this.setIconTips(IconResId.CopyHall, CacheManager.copy.checkTips()); //副本 
		this.setIconTips(IconResId.Boss, CacheManager.bossNew.checkTips()); //新版的boss 
		this.setIconTips(IconResId.Arena, CacheManager.arena.checkTips());
		this.setIconTips(IconResId.Lottery, CacheManager.lottery.checkAllTips());
		this.setIconTips(IconResId.Welfare, CacheManager.welfare2.checkTips());
		this.setIconTips(IconResId.Shop, CacheManager.shop.checkTips());
		this.setIconTips(IconResId.MultiRole, CacheManager.role.checkCanOpenRole());
		this.setIconTips(IconResId.TimeLimitTask, CacheManager.timeLimitTask.checkTips());
		this.setIconTips(IconResId.GuildNew, CacheManager.guildNew.checkTips());
		this.setIconTips(IconResId.SevenDayMagicWeapon, CacheManager.sevenDayMagicWeapon.checkCanActived());
		this.setIconTips(IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
		this.setIconTips(IconResId.OnlineRewardFashion,CacheManager.welfare2.checkOnlineOnceRewardTips());
		this.setIconTips(IconResId.Certification,CacheManager.certification.checkShowSMIcon());
        this.onCheckCrossIconTips();
	}

	/**
	 * 服务器跨天
	 * 有开服天数限制的图标需要在这里add一次
	 */
	private onCrossDay():void {
		this.onAddIconHandler(IconResId.QiongCang);
		this.dayRechargeIconUpdate();
		this.checkAddCrossIcon();
		this.checkAddContestIcon();
	}

	/**
	 * 场景更新
	 */
	private sceneMapUpdated():void {
		this.setIconTips(IconResId.CrossStair, CacheManager.crossStair.checkTips());
	}

	//日常
	private setTrainRedTip(): void {
		this.setIconTips(IconResId.Daily, CacheManager.train.checkTips()); 
	}

	/**
	 * 背包更新
	 */
	public onPosTypeBagChange(): void {
		this.setIconTips(IconResId.Lottery, CacheManager.lottery.checkAllTips());
	}

	/**副本信息更新 */
	public onCopyInfoUpdate(): void {
		//优先检测图标开启，再检测红点
		//竞技场图标开启检测
		this.onAddIconHandler(IconResId.Arena);
		//副本图标开启检测
		this.onAddIconHandler(IconResId.CopyHall);

		this.setIconTips(IconResId.Arena, CacheManager.arena.checkTips());
		this.setIconTips(IconResId.Boss, CacheManager.bossNew.checkTips()); //新版的boss

	}

	private onPlayerFirstDead(): void {
	    this.checkRechargeFirstTips(true);
    }

	public onPlayerDieInTower() : void {
		//this.checkMultiRoleTips();
	}

	private checkRechargeFirstTips(flag: boolean = false):void{
		if (ConfigManager.mgOpen.isOpenedByKey(IconResId[IconResId.RechargeFirst],false) &&
		 !CacheManager.recharge.isFirstRecharge() && CacheManager.task.isNeedRechargeFirstTips) {
			if((ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.RechargeFirstTips], false) && !ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.RechargeFirstTipEnd, false)) || flag){
				this.module.showIconImgTip(IconResId.RechargeFirst);
				this.module.hideIconImgTip(IconResId.MultiRole);
				//ChatUtils.fakeVIPBroad(); //完成首充任务不发伪广播
			}
		}
	}

	private checkMultiRoleTips() : void {

	}

	private hideMultiRoleTips(): void {
		this.module.hideIconImgTip(IconResId.MultiRole);
	}

	private onTaskFinished(taskCode:number):void {
		this.checkRechargeFirstTips();
		this.onAddIconHandler(IconResId.Boss);
	}

	private onCheckArenaTip() {
        this.setIconTips(IconResId.Arena, CacheManager.arena.checkTips());
	}

	private addLevelUpSdkIco():void{

		if(CacheManager.platform.isNeedEntrance()){
			this.onAddIconHandler(IconResId.Oprating);
		}
		
		/*
		if (Sdk.isNeedSaveToDesktop) {
			this.onAddIconHandler(IconResId.SaveDesktop);
		}
		if (Sdk.isNeedMicroClient) {
			this.onAddIconHandler(IconResId.MiniClient);
		}
		if (Sdk.isNeedFocus) {
			this.onAddIconHandler(IconResId.Focus);
		}
		if (Sdk.isNeedShare) {
			this.onAddIconHandler(IconResId.Share);
		}
		*/

		if (CacheManager.certification.checkShowSMIcon()) {
			this.onAddIconHandler(IconResId.Certification);
			this.setIconTips(IconResId.Certification,CacheManager.certification.checkShowSMIcon());
		}
		
	}

	/**激活神器 */
	public onGodWeaponAct():void{

		this.onAddIconHandler(IconResId.Daily);
		this.setIconTips(IconResId.Daily, CacheManager.train.checkTips()); //日常
		
	}

	/**
	 * 角色等级提升
	 */
	public onRoleLevelUpdate(data: any): void {
		//优先检测图标开启，再检测红点
		//Boss图标开启检测
		//this.onAddIconHandler(IconResId.Daily);
		this.onAddIconHandler(IconResId.Boss);
		this.onAddIconHandler(IconResId.Lottery);
		this.onAddIconHandler(IconResId.Welfare);
		this.onAddIconHandler(IconResId.GuildNew);
		this.onAddIconHandler(IconResId.Rank);
		this.onAddIconHandler(IconResId.Shop);
		this.onAddIconHandler(IconResId.QiongCang);
		this.addLevelUpSdkIco();
		this.updateGamePlayIcon();
		this.checkMultiRoleIcon();
		this.checkAddMonthCardIcon();
		this.checkAddCrossIcon();
		this.checkAddV3RewardIcon();
		this.checkGuildEffect();
		this.onAddGuildDefendIco();	
		//副本图标开启检测
		this.onAddIconHandler(IconResId.CopyHall);		
		this.activityIconUpdate();
		this.checkLoginRewardIcon();
		
		if (!CacheManager.recharge.isFirstRecharge()){
			this.onAddIconHandler(IconResId.RechargeFirst);
			this.setIconTips(IconResId.RechargeFirst, CacheManager.recharge.isCanFirstRchGetReward());			
		}
		//this.setIconTips(IconResId.Daily, CacheManager.train.checkTips()); //日常
		this.setIconTips(IconResId.CopyHall, CacheManager.copy.checkTips());
		this.setIconTips(IconResId.Boss, CacheManager.bossNew.checkTips()); //新版的boss
		this.setIconTips(IconResId.Lottery, CacheManager.lottery.checkAllTips());
		this.setIconTips(IconResId.Welfare, CacheManager.welfare2.checkTips());
		this.setIconTips(IconResId.Shop, CacheManager.shop.checkTips());
		this.setIconTips(IconResId.DayRecharge, CacheManager.activity.checkDayRechargeTips());
		
		// if(CacheManager.role.getRoleLevel() == this.rechargeFirstLevel) {
		// 	if(!this.isTipRechargeFirstByLevel) {
		// 		this.checkRechargeFirstTips(true);
		// 		this.isTipRechargeFirstByLevel = true;
		// 	}
		// }

	}

	private checkGuildEffect():void{
		//添加仙盟图标时 设置红点状态和特效
		if(CacheManager.guildNew.isNeedOpenRedTip && ConfigManager.mgOpen.isOpenedByKey(IconResId[IconResId.GuildNew],false)){
			CacheManager.guildNew.isNeedOpenRedTip = false;
			CacheManager.guildNew.setOpenRedTip(true,false);
			this.onIconEffectUpdate(IconResId.GuildNew,true);
			this.setIconTips(IconResId.GuildNew,CacheManager.guildNew.checkTips());
		}
	}
	/**
	 * VIP等级提升
	 */
	private onVipUpdate():void {
		this.setIconTips(IconResId.MultiRole, CacheManager.role.checkCanOpenRole());
        this.setIconTips(IconResId.Vip3Reward, CacheManager.vip.isVip3AndHasReward());
	}

	/**
	 * VIP奖励更新
	 */
	private onVipRewardUpdate():void {
		this.checkAddV3RewardIcon();
	}

	/**
	 * 角色转数改变
	 */
	private onRoleStateUpdate(): void {
		this.onAddIconHandler(IconResId.QiongCang);

		this.setIconTips(IconResId.QiongCang,CacheManager.talentCultivate.checkTips());

		this.setIconTips(IconResId.MultiRole, CacheManager.role.checkCanOpenRole());
        this.setIconTips(IconResId.Lottery, CacheManager.lottery.checkAllTips());
        this.checkAddCrossIcon();
        this.checkAddPeakIcon();
        this.checkAddContestIcon();
        this.checkAddQualifyingIcon();
	}

	/**
	 * 任务完成
	 */
	public onTaskOpenEndUpdated(): void {
		this.onAddIconHandler(IconResId.Boss);

		this.setIconTips(IconResId.CopyHall, CacheManager.copy.checkTips());
	}

	/**boss信息更新 */
	private onBossInfoUpdate(): void {
		this.setIconTips(IconResId.Boss, CacheManager.bossNew.checkTips()); //新版的boss
	}

	/**
	 * 充值信息更新（首充，每日累充）
	 * 领奖、充值数变化
	 */
	private onRechargeInfoUpdate(): void {
		this.dayRechargeIconUpdate();
	}

	/**
	 * 更新邮件
	 */
	private updateMailIcon(): void {
		if (this.isShow) {
			if (CacheManager.friend.isShowMail) {
                this.onAddIconHandler(IconResId.Mail);
				this.setIconTips(IconResId.Mail, true);
            }
            else {
                this.onRemoveIconHandler(IconResId.Mail);
            }
		}
	}

	/**
	 * 设置模块按钮红点提示
	 * @param key ModuleEnum定义的模块 或者 实例名
	 */
	public onSetBtnTip(key: any, isTip: boolean, isName: boolean = false, point:egret.Point=null): void {
		if (this.isShow) {
			let btn: fairygui.GComponent;
			btn = this.module.getModuleBtn(key, isName);
			let px:number = point?point.x:null;
			let py:number = point?point.y:null;
			CommonUtils.setBtnTips(btn, isTip, px,py,false);//, px,py,false
		}
	}

	private setIconTips(iconId: number, showTips: boolean, point:egret.Point=null): void {
		let icon: BaseIcon = this.module.getHomeIcon(iconId);
		if (!icon) return;

		if(HomeUtil.isRightIcon(iconId)) {
			// point = this.rightPoint;
		}
		else if(HomeUtil.isLeft2Icon(iconId)) {
			point = this.leftPoint;
		}
		if(point) {
			CommonUtils.setBtnTips(icon, showTips, point.x,point.y,false);
		}
		else {
			CommonUtils.setBtnTips(icon, showTips);
		}
	}

	private setIconTimeHandler(iconId:number,time:number):void {
		let icon: BaseIcon = this.module.getHomeIcon(iconId);
		if(!icon) return;
		icon.setTime(time);
	}

	private onIconEffectUpdate(iconId: IconResId, isShow: boolean): void {
		if(HomeUtil.isTopIcon(iconId)) return;//策划需求，顶部图标全部不加特效
		let icon: BaseIcon = this.module.getHomeIcon(iconId);
		if (!icon) return;
		if (isShow) {
			icon.showEffect()
		}
		else {
			icon.removeEffect()
		}
	}

	private activityIconUpdate(): void {
		let activityList: ActivityInfo[] = CacheManager.activity.activityIconInfos;
		let dayRechargeInfo: ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeRechargeToday);
		let canShowRecharge: boolean = true;
		for (let i: number = 0; i < activityList.length; i++) {
			let iconId: number = activityList[i].iconId;
			let icon: BaseIcon = this.module.getHomeIcon(iconId);
			if (!icon) {
				if (activityList[i].isOpen) {
					activityList[i].iconInit = true;
					this.onAddIconHandler(iconId);
					this.setIconTips(iconId, CacheManager.activity.checkActivityTips(activityList[i].category));
					if(activityList[i].leftShowTime > 0) {
						this.setIconTimeHandler(iconId,activityList[i].leftShowTime);
					}
				}
			}
			else if (!activityList[i].isOpen) {
				this.onRemoveIconHandler(iconId);
				if (dayRechargeInfo && activityList[i].category == dayRechargeInfo.category) {
					canShowRecharge = false;
					this.onRemoveIconHandler(IconResId.DayRecharge);
					// this.onRemoveIconHandler(IconResId.DayRechargeShow);
				}
			}
			else {
				this.setIconTips(iconId, CacheManager.activity.checkActivityTips(activityList[i].category));
			}
		}
		if (canShowRecharge) {
			this.dayRechargeIconUpdate();
		}
	}

	private dayRechargeIconUpdate(): void {
		let hadAllGet: boolean = CacheManager.activity.dayRechargeHadAllGet();
		let icon: BaseIcon = this.module.getHomeIcon(IconResId.DayRecharge);
		// let iconShow:BaseIcon = this.module.getHomeIcon(IconResId.DayRechargeShow);

		// let shapeRewardCfg:any = ConfigManager.rechargeFirst.getHaveShapeRewardRechargeCfg();
		// if(!shapeRewardCfg && iconShow) {
		// 	this.onRemoveIconHandler(IconResId.DayRechargeShow);
		// }

		if (hadAllGet) {
			if (icon) {
				this.onRemoveIconHandler(IconResId.DayRecharge);
			}
			return;
		}
		// if(icon && iconShow) return;
		if(icon) return;
		let dayRechargeInfo: ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeRechargeToday);
		if (dayRechargeInfo && dayRechargeInfo.isOpen) {
			let isOpened:boolean = ConfigManager.mgOpen.isOpenedByKey(ActivityCategoryEnum[dayRechargeInfo.category], false);
			if(!isOpened) return;
			if (CacheManager.recharge.isFirstRecharge()) {
				if(!icon) {
					this.onAddIconHandler(IconResId.DayRecharge);
					this.setIconTips(IconResId.DayRecharge, CacheManager.activity.checkDayRechargeTips());
				}
			}
			// if(shapeRewardCfg && !iconShow) {
			// 	this.onAddIconHandler(IconResId.DayRechargeShow);
			// 	this.setIconTips(IconResId.DayRechargeShow, CacheManager.activity.checkDayRechargeShapeRewadTips());
			// 	this.setIconTimeHandler(IconResId.DayRechargeShow,dayRechargeInfo.leftShowTime);
			// }
		}
	}

	/** 显/隐月卡图标自定义逻辑*/
	private checkAddMonthCardIcon(): void {
		if (!CacheManager.welfare2.isGoldCard || !CacheManager.welfare2.isPrivilegeCard) {
			this.onAddIconHandler(IconResId.MonthCard);
		} else {
			this.onRemoveIconHandler(IconResId.MonthCard);
		}
	}

	private checkAddCrossIcon():void {
        // if (CacheManager.crossBoss.isOpen) {
            this.onAddIconHandler(IconResId.Cross);
        // } else {
        //     this.onRemoveIconHandler(IconResId.Cross);
        // }
	}

	private checkAddContestIcon():void {
		if (CacheManager.contest.isOpen) {
        	this.onAddIconHandler(IconResId.Contest);
            this.onContestStateChanged();
        } else {
            this.onRemoveIconHandler(IconResId.Contest);
		}
	}

	private checkAddQualifyingIcon():void {
		if (CacheManager.qualifying.isOpen) {
        	this.onAddIconHandler(IconResId.Qualifying);
        	this.onQualifyingStateChanged();
        	this.onQualifyingTipsChanged();
        }
	}

	private onQualifyingStateChanged():void {
        let icon: BaseIcon = this.module.getHomeIcon(IconResId.Qualifying);
        if(!icon) return;
        icon.setText(CacheManager.qualifying.curStateStr);
	}

	private onQualifyingTipsChanged():void {
		this.onCheckCrossIconTips();
        this.setIconTips(IconResId.Qualifying, CacheManager.qualifying.checkOpenTips());
	}

	private onContestStateChanged():void {
        let icon: BaseIcon = this.module.getHomeIcon(IconResId.Contest);
        if(!icon) return;
        icon.setText(CacheManager.contest.curStateStr);
	}

	private checkAddPeakIcon():void {
		if (CacheManager.peak.hasUpdatedState) {
        	this.onAddIconHandler(IconResId.Peak);
        	this.onPeakStateChanged();
        	this.onPeakTipsChanged();
        }
	}

	private onPeakStateChanged():void {
        let icon: PeakIcon = this.module.getHomeIcon(IconResId.Peak) as PeakIcon;
        if(!icon) return;
        icon.setPeakState();
	}

	private onPeakTipsChanged():void {
        this.setIconTips(IconResId.Peak, CacheManager.peak.checkTips());
	}

    private onCheckCrossIconTips() {
        this.setIconTips(IconResId.Cross, CacheManager.crossBoss.isCheckTips()
			|| CacheManager.qualifying.checkOpenTips()
			|| CacheManager.qualifying.checkFunTips());
    }

	private checkAddV3RewardIcon():void {
		// let v3Reward:any = CacheManager.vip.getVipLevelReward(3);
        // if (v3Reward && v3Reward.flags_B) {
        //     this.onRemoveIconHandler(IconResId.Vip3Reward);
        // } else {
        //     this.onAddIconHandler(IconResId.Vip3Reward);
        //     this.setIconTips(IconResId.Vip3Reward, CacheManager.vip.isVip3AndHasReward());
        // }
	}

	private addOnlineRewardIcon():void {
		let onceCfg:any = ConfigManager.online.getOnceOnlineRewardCfg();
		if(!CacheManager.welfare2.onlineRewardHadGet(onceCfg.type,onceCfg.onlineMinute)) {
			let onlineTime:number = CacheManager.serverTime.totalOnlineTime;
			this.onAddIconHandler(IconResId.OnlineRewardFashion);
			this.setIconTimeHandler(IconResId.OnlineRewardFashion,onceCfg.onlineMinute * 60 - onlineTime);
		}
	}

	private onPlayerNewRoleUpdate():void {
		this.checkMultiRoleIcon();
	}

	private onPlayerCopyInfoUpdate(typeDic:any): void {
		// if (typeDic.all || typeDic[ECopyType.ECopyPunchLead]) {
		// 	this.checkMultiRoleIcon();
		// }
	}

	/** 显/隐三角色图标*/
	private checkMultiRoleIcon(): void {
		if(!this.isShow) {
			return;
		}
		
		if (CacheManager.role.roles.length < 3) {
			this.onAddIconHandler(IconResId.MultiRole);
			this.setIconTips(IconResId.MultiRole, CacheManager.role.checkCanOpenRole());
			if(CacheManager.role.roles.length == 2) {
				let icon: BaseIcon = this.module.getHomeIcon(IconResId.MultiRole);
				if(icon) {
					icon.setIconImg(10081);
				}
			}
		}
		else {
			this.onRemoveIconHandler(IconResId.MultiRole);
		}
		//this.checkMultiRoleTips();
		// return;//屏蔽图标
	}

	private updateGamePlayIcon():void {
		if(CacheManager.timeLimitBoss.showIcon) {
			this.onAddIconHandler(IconResId.TimeLimitBoss);
			this.setIconTimeHandler(IconResId.TimeLimitBoss,CacheManager.timeLimitBoss.leftOpenTime);
			this.setIconTips(IconResId.TimeLimitBoss, CacheManager.timeLimitBoss.isOpen);
		}
		if(CacheManager.posOccupy.showIcon) {
			this.onAddIconHandler(IconResId.ExpPositionOccupy);
			this.setIconTimeHandler(IconResId.ExpPositionOccupy,CacheManager.posOccupy.leftOpenTime);
			this.setIconTips(IconResId.ExpPositionOccupy, CacheManager.posOccupy.isOpen);
		}
		if(CacheManager.campBattle.showIcon) {
			this.onAddIconHandler(IconResId.CampBattle);
			this.setIconTimeHandler(IconResId.CampBattle,CacheManager.campBattle.leftOpenTime);
			this.setIconTips(IconResId.CampBattle, CacheManager.campBattle.isOpen);
		}
		if(CacheManager.guildBattle.showIcon) {
			this.onAddIconHandler(IconResId.GuildBattle);
			this.setIconTimeHandler(IconResId.GuildBattle,CacheManager.guildBattle.leftOpenTime);
			this.setIconTips(IconResId.GuildBattle, CacheManager.guildBattle.isOpen);
		}
		if(CacheManager.guildCopy.showIcon) {
			this.onAddIconHandler(IconResId.GuildTeam);
			this.setIconTimeHandler(IconResId.GuildTeam,CacheManager.guildCopy.leftOpenTime);
			this.setIconTips(IconResId.GuildTeam, CacheManager.guildCopy.isOpen);
		}
		if(CacheManager.crossStair.showIcon) {
			this.onAddIconHandler(IconResId.CrossStair);
			this.setIconTimeHandler(IconResId.CrossStair,CacheManager.crossStair.leftOpenTime);
			this.setIconTips(IconResId.CrossStair, CacheManager.crossStair.checkTips());
		}
		this.onAddGuildDefendIco();		
	}
	
	private onAddGuildDefendIco():void{
		if(CacheManager.guildDefend.showIcon){
			this.onAddIconHandler(IconResId.GuildDefend);
			this.setIconTimeHandler(IconResId.GuildDefend,CacheManager.guildDefend.leftOpenTime);
			this.setIconTips(IconResId.GuildDefend, CacheManager.guildDefend.checkTips());
		}
	}

	private onAddIconHandler(iconId: number): void {
		if (this.isShow) {
			this.module.addIcon(iconId);	
		}
		//首充图标出现,预加载首充界面
		if(iconId==IconResId.RechargeFirst 
		&& ConfigManager.mgOpen.isOpenedByKey(IconResId[iconId],false) && this.isFirstAddRecharge ){
			this.isFirstAddRecharge = false;
			App.LoaderManager.getResByUrl(URLManager.getRechargeFirstBg());
			ResourceManager.load(PackNameEnum.RechargeFirst);
		}
	}

	private onRemoveIconHandler(iconId: number): void {
		if (this.isShow) {
			this.module.removeIcon(iconId);
		}
	}

	public get isShow(): boolean {
		return this.module != null && this.module.isShow && this.isInitialized;
	}

	public hide(): void {
		this._listen.hide();
	}

	public updateSMIcon() {
		if (CacheManager.certification.checkShowSMIcon()) {
			this.onAddIconHandler(IconResId.Certification);
			this.setIconTips(IconResId.Certification,CacheManager.certification.checkShowSMIcon());
		}
		else {
			this.onRemoveIconHandler(IconResId.Certification);
		}
	}

	private checkLoginRewardIcon():void {
		let isShow: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Welfare, false) && CacheManager.welfare2.isLoginRewardPanelShow();
		if(isShow) {
			let icon:LoginRewardIconII = this.module.getHomeIcon(IconResId.LoginReward) as LoginRewardIconII;
			if(icon) {
				icon.updateAll();
			} 
			else {
				this.onAddIconHandler(IconResId.LoginReward);
			}
		}
		else {
			this.onRemoveIconHandler(IconResId.LoginReward);
		}
	}

	private moneyGoldUpdate(): void {
		this.setIconTips(IconResId.CopyHall, CacheManager.copy.checkTips()); 
	}

}