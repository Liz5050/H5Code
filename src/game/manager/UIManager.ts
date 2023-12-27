/**
 * UI管理器
 */
class UIManager {
	/**
	 * 所有视图
	 */
	private static views: any = {};
	/**
     * 开启中UI
     */
	private static showedViews: Array<number> = [];

	/**UI自定义层级 */
	private static viewIndexMap: any = {};

	/**界面栈 */
	private static viewsStack: Array<any> = [];

	/**同级可以共存的窗口: key的窗口打开 不会关闭value的窗口 例如:打开ModuleEnum.OpenRole 已经打开的 ModuleEnum.Player 不会关闭 */
	private static coexist: any = {
		[ModuleEnum.Chat]: [ModuleEnum.Team],
		[ModuleEnum.PlayerOther]: [ModuleEnum.Team],
		[ModuleEnum.CrossBoss]: [ModuleEnum.Cross],
		[ModuleEnum.Qualifying]: [ModuleEnum.Cross]
	};
	/**包资源数量不是2的注册 */
	private static packNumDict: any = {
		[PackNameEnum.Test]: 1,
		[PackNameEnum.Common]: 3,
		[PackNameEnum.TaskDialog]: 1,
		[PackNameEnum.CopyHall]: 1,
		[PackNameEnum.GuildNew]: 1,
		[PackNameEnum.Train]: 1,
		[PackNameEnum.ActivityScore]: 1,
		[PackNameEnum.Welfare2]: 1,
        [PackNameEnum.PlayerOther]: 1,
		[PackNameEnum.Welfare2Cdkey]: 1,
		[PackNameEnum.PropGet]: 2,
		[PackNameEnum.GodWing]: 1,
		[PackNameEnum.GuildActivity]: 1,
		[PackNameEnum.Copy]: 3,
		[PackNameEnum.Copy2]: 2,
		[PackNameEnum.HomeChat]: 1,
		// [PackNameEnum.Reincarnation]: 1,
		[PackNameEnum.RpgTeam]: 1,
		[PackNameEnum.ActivityWar]: 1,
		[PackNameEnum.QiongCang]: 1,
		[PackNameEnum.Peak]: 3,
		[PackNameEnum.Mount]: 1,
		[PackNameEnum.GuildNewMember]: 1,
		[PackNameEnum.PetChange]: 1,
		[PackNameEnum.MountChange]: 1,
		[PackNameEnum.MagicWeaponChange]: 1,
		[PackNameEnum.ShapeBattle] : 1,
		[PackNameEnum.ShapeBattleChange] : 1,
		[PackNameEnum.MagicArray] : 1,
		[PackNameEnum.MagicArrayChange] : 1,
		[PackNameEnum.SwordPool] : 1,
		[PackNameEnum.RechargeFirstIco] : 1,
		[PackNameEnum.SwordPoolChange] : 1,
		[PackNameEnum.Arena] : 1,
	};

	/**
	 * 所有模块页签类型 
	 * 无页签的模块，如有功能开启限制，也需要定义一个类型
	 **/
	public static ModuleTabTypes: { [moduleId: number]: PanelTabType[] } = {
		//角色
		[ModuleEnum.Player]: [PanelTabType.Player, PanelTabType.UniqueSkill, PanelTabType.RoleState],
		//背包
		[ModuleEnum.Pack]: [PanelTabType.PackEquip, PanelTabType.PackProp, PanelTabType.PackRune, PanelTabType.TrainIllustrate, PanelTabType.PackSmelt],
		//神装
		[ModuleEnum.GodEquip]: [PanelTabType.GodEquip, PanelTabType.Shura],
		//符文
		[ModuleEnum.Rune]: [PanelTabType.RuneInlay, PanelTabType.RuneDecompose],
		//技能 
		[ModuleEnum.Skill]: [PanelTabType.Skill,PanelTabType.TrainGodWeapon, PanelTabType.InnerPower, PanelTabType.Nerve,PanelTabType.SkillCheats], 
		//宠物幻形
		[ModuleEnum.PetChange]: [PanelTabType.PetChange],
		//竞技
		[ModuleEnum.Arena]: [PanelTabType.Encounter, PanelTabType.KingBattle, PanelTabType.Mining],
		//Boss
		[ModuleEnum.Boss]: [PanelTabType.PersonalBoss, PanelTabType.WorldBoss, PanelTabType.SecretBoss,PanelTabType.GodBoss, PanelTabType.BossHome],
		//历练
		[ModuleEnum.Train]: [PanelTabType.TrainDaily,PanelTabType.TrainNobility, PanelTabType.TrainMedal,PanelTabType.GamePlay],
		//副本大厅
		[ModuleEnum.CopyHall]: [PanelTabType.CopyHallMaterial, PanelTabType.CopyHallDaily, PanelTabType.CopyHallTower/*, PanelTabType.CopyHallLegend*/, PanelTabType.Team2],
		//炼器
		[ModuleEnum.Forge]: [PanelTabType.Strengthen, PanelTabType.Refine, PanelTabType.Casting,PanelTabType.Immortals],
		//商城
		[ModuleEnum.Shop]: [PanelTabType.ShopMystery, PanelTabType.ShopProp],
		//寻宝
		[ModuleEnum.Lottery]: [PanelTabType.LotteryEquip, PanelTabType.LotteryRune/*, PanelTabType.LotteryAncient*/],
		//法器 
		[ModuleEnum.MagicWare]: [PanelTabType.DragonSoul, PanelTabType.ColorStone, PanelTabType.HeartMethod, PanelTabType.BeastBattle],
		//传世装备
		[ModuleEnum.AncientEquip]: [PanelTabType.AncientEquip],
		[ModuleEnum.GodWing]: [PanelTabType.GodWingEquip, PanelTabType.GodWingCompose,PanelTabType.GodWingTransform],
		//好友
		[ModuleEnum.Friend]: [PanelTabType.FriendContact,PanelTabType.Friend, PanelTabType.FriendApply, PanelTabType.FriendShield, PanelTabType.FriendMail],
		[ModuleEnum.Mail]: [PanelTabType.FriendMail],
		[ModuleEnum.GuildNew]: [PanelTabType.GuildNewBasics, PanelTabType.GuildNewManager, PanelTabType.GuildNewMember, PanelTabType.GuildNewList],
		[ModuleEnum.Activity]: [
			//开服活动子活动图标
			/**开服8-14天活动 */
			PanelTabType.ESpecialConditonTypeComposeRecharge,
			PanelTabType.ESpecialConditionTypeSpiritSports,
			PanelTabType.ESPecialConditionTypeParadiesLost,
			PanelTabType.ESpecialConditionTypeBossScore,

			PanelTabType.ESpecialConditonTypeReachGoal,//冲榜达标
			PanelTabType.ESpecialConditonTypeToplistActiveOpen,//冲榜排名
			PanelTabType.ESpecialConditonTypeComposeRechargeEx,//连充返利
			PanelTabType.ESpecialConditionTypeNewServerLimitBuy,//开服限购
			PanelTabType.ESpecialConditionTypePreferentialGift,//特惠礼包
			PanelTabType.ESpecialConditonTypeBossExtraDrop,
			PanelTabType.ESpecialConditionTypePreferentialGiftNormal,//特惠礼包2(3月初活动)
			PanelTabType.ESpecialConditionTypeLevelReward,//升级狂欢
			// PanelTabType.ESpecialConditonTypeBossTask,//全民Boss（分开独立界面了）
			PanelTabType.ESpecialConditionTypeMgNewGuildWar,//仙盟争霸

			//开服返利子活动图标
			// PanelTabType.ESpecialConditonTypeRechargeToday,
			PanelTabType.ESpecialConditonTypeRechargeCondDayCount,
			PanelTabType.ESpecialConditonTypeMgRecharge,
			PanelTabType.ESpecialConditonTypeRechargeDayReturn,

			//投资计划
			PanelTabType.ESpecialConditionTypeInvestPlan,
			PanelTabType.ESpecialConditionTypeRechargeGroup,
		],
		//福利新版
		[ModuleEnum.Welfare2]: [PanelTabType.SignIn, PanelTabType.LoginReward, PanelTabType.GoldCard, PanelTabType.PrivilegeCard,PanelTabType.Notice,PanelTabType.ExCdKey],
		//时装
		[ModuleEnum.FashionII]: [PanelTabType.FashionClothes,PanelTabType.FashionWeapon, PanelTabType.FashionWing, PanelTabType.FashionTitle],
        //仙盟活动
        [ModuleEnum.GuildActivity]: [PanelTabType.GuildVein, PanelTabType.GuildBonfire],
		/**仙盟副本 */
		[ModuleEnum.GuildCopy]: [PanelTabType.GuildTeam],
        //VIP礼包
        [ModuleEnum.VIP]: [PanelTabType.VipActive, PanelTabType.VipGiftPackage],

		//运营礼包
		[ModuleEnum.Operating]:[PanelTabType.Focus,PanelTabType.Share,PanelTabType.MiniClient,PanelTabType.SaveDesktop],

		[ModuleEnum.MagicWeaponStrengthen] : [PanelTabType.MagicWeaponStarUp, PanelTabType.MagicWeaponCopy],
        //跨服战场
		[ModuleEnum.Cross] : [/*PanelTabType.CrossBoss,*/ PanelTabType.CrossEntrance,PanelTabType.CrossBossGuild,PanelTabType.CrossDropLog],
        //跨服BOSS
		[ModuleEnum.CrossBoss] : [PanelTabType.CrossBossCross],
        //跨服3V3
		[ModuleEnum.Qualifying] : [PanelTabType.QualifyingMain, PanelTabType.QualifyingRank, PanelTabType.QualifyingStandard, PanelTabType.QualifyingStage],

		//穹苍系统
		[ModuleEnum.QiongCang] :[PanelTabType.TalentCultivate,PanelTabType.QiongCangCopy,PanelTabType.QCSmelt, PanelTabType.QiongCangBoss],
		//巅峰竞技
		[ModuleEnum.Peak] :[PanelTabType.PeakMain, PanelTabType.PeakReward, PanelTabType.PeakShop, PanelTabType.PeakChipsShop, PanelTabType.PeakWorship],
		//1VN竞技
		[ModuleEnum.Contest] :[PanelTabType.ContestQualification, PanelTabType.ContestMain, PanelTabType.ContestReward, PanelTabType.ContestShop, PanelTabType.ContestExchange],
		//法阵幻化
		[ModuleEnum.magicArrayChange]: [PanelTabType.MagicArrayChange],
		//法宝幻化
		[ModuleEnum.MagicWeaponChange]: [PanelTabType.MagicWeaponChange],
		//外观
		[ModuleEnum.Shape]: [PanelTabType.Pet, PanelTabType.Wing, PanelTabType.Mount,PanelTabType.ShapeSwordPool, PanelTabType.ShapeBattle, PanelTabType.MagicLaw],
		//战阵幻化
		[ModuleEnum.ShapeBattleChange]: [PanelTabType.ShapeBattleChange],
		//剑池幻化
		[ModuleEnum.SwordPoolChange]: [PanelTabType.SwordPoolChange],
		//坐骑幻化
		[ModuleEnum.MountChange]: [PanelTabType.MountChange],
		//翅膀幻化
		[ModuleEnum.MagicWingChange]:[PanelTabType.MagicWingChange],

		/**（非页签模块用于功能开启统一判断） */
		/**boss来袭 */
		[ModuleEnum.BossComing]:[PanelTabType.BossComing],
		[ModuleEnum.ActivityLimitRecharge]:[PanelTabType.ActivityLimitRecharge],

	};
	public constructor() {
	}

	/**
     * 面板注册
     * @param key 面板唯一标识
     * @param view 面板
     * @param viewIndex 面板自定义层级，UI默认为One
     */
	public static register(key: number, view: any, viewIndex: number = ViewIndex.One): void {
		if (view == null) {
			return;
		}
		this.viewIndexMap[key] = viewIndex;
		this.views[key] = view;
	}

    /**
     * 面板解除注册
     * @param key
     */
	public static unregister(key: number): void {
		if (!this.views[key]) {
			return;
		}
		this.views[key] = null;
		delete this.views[key];
		delete this.viewIndexMap[key];
	}

	/**
	 * 加入显示列表
	 */
	public static addToShow(key: number): void {
		Log.trace(Log.MODULE, `addToShow:${ModuleEnum[key]}`);
		if (this.showedViews.indexOf(key) == -1) {
			this.showedViews.push(key);
		}

		let viewIndex = this.viewIndexMap[key];
		if (viewIndex >= ViewIndex.One) {
			if (viewIndex == ViewIndex.One) {
				//打开1级界面，关闭之前所有栈里的界面
				for (let i: number = this.viewsStack.length - 1; i >= 0; i--) {
					let vKey: ModuleEnum = this.viewsStack[i];
					if (vKey != key && !UIManager.isCoexist(key, vKey)) {
						this.hide(vKey);
					}
				}
			}
			if (this.viewsStack.indexOf(key) < 0) {
				this.viewsStack.push(key);
			}

		}
		EventManager.dispatch(UIEventEnum.ModuleOpened, key, viewIndex);
	}

	/**
	 * 判断是否可以共存
	 */
	public static isCoexist(key: number, exitsKey: number): boolean {
		var arr: number[] = UIManager.coexist[key];
		if (arr && arr.length > 0) {
			return arr.indexOf(exitsKey) > -1;
		}
		return false;
	}
	/**
	 * 从显示列表移除
	 */
	public static removeFromShow(key: number): boolean {
		var flag: boolean = false;
		var viewIndex = this.showedViews.indexOf(key);
		if (viewIndex >= 0) {
			this.showedViews.splice(viewIndex, 1);
			if (this.viewsStack.indexOf(key) != -1) {
				this.viewsStack.splice(this.viewsStack.indexOf(key), 1);
			}
			flag = true;
		}

		viewIndex = this.viewIndexMap[key];//自定义层级
		EventManager.dispatch(UIEventEnum.ModuleClosed, key, viewIndex);
		Log.trace(Log.MODULE, `removeFromShow:${ModuleEnum[key]}`);
		return flag;
	}

	/**
     * 显示前一层视图
     * @returns 上一次UI的key。-1表示不存在
     */
	public static showPreView(): number {
		let curKey: number = this.viewsStack.pop();
		if (curKey != undefined) {
			this.hide(curKey);
		}
		let preKey: number = this.viewsStack.pop();
		if (preKey != undefined) {
			this.show(preKey);
			return preKey;
		}
		return -1;
	}

    /**
     * 如果没显示，则显示，否则关闭
     */
	public static toggle(key: number): void {
		if (this.isShow(key)) {
			this.hide(key);
		} else {
			this.show(key);
		}
	}

    /**
     * 是否打开了一级面板
     */
	public static isOpenOneIndexView(): boolean {
		for (let key of this.showedViews) {
			if (this.viewIndexMap[key] == ViewIndex.One) {
				return true;
			}
		}
		return false;
	}
	

	public static isOneIndexView(key: any): boolean {
		return this.viewIndexMap[key] == ViewIndex.One;
	}

    /**
     * 是否打开了module/window
     */
	public static isOpenView(): boolean {
		return UIManager.isOpenModule() || UIManager.isOpenPopup();
	}

    /**
     * 是否打开了module
     */
	public static isOpenModule(): boolean {
		let vId:number = 0;
		let layerMain:fairygui.GComponent = LayerManager.UI_Main;
		
		while (vId < layerMain.numChildren) {
			if (layerMain.getChildAt(vId) instanceof BaseModule) {
				return true;
			}
            vId++;
		}
		return false;
	}

	/**是否打开了二级界面 */
	public static isOpenPopup():boolean {
		let vId:number = 0;
		let layerPopup:fairygui.GComponent = LayerManager.UI_Popup;
		let win:fairygui.GObject;
        while (vId < layerPopup.numChildren) {
            win = layerPopup.getChildAt(vId);
            if (win instanceof BaseWindow && win.modal && win.isShow) {
                return true;
            }
            vId++;
        }
		return false;
	}

	/**
     * 检测一个UI是否开启中
     * @param key
     * @returns {boolean}
     */
	public static isShow(key: number): boolean {
		return this.showedViews.indexOf(key) != -1;
	}

	public static show(key: number): void {
		if (!this.isShow(key)) {
			let view: any = this.getView(key);
			if (view != null) {
				view.show();
			}
		}
		this.addToShow(key);
	}

	public static hide(key: number): boolean {
		// if (this.isShow(key)) {
		// 	let view: any = this.getView(key);
		// 	if (view != null) {
		// 		view.hide();
		// 	}
		// }
		// return this.removeFromShow(key);
		//关闭统一走模块关闭，不然出现回调不会被调用的问题
		EventManager.dispatch(UIEventEnum.ModuleClose, key);
		return true;
	}

	/**
     * 根据唯一标识获取一个UI对象
     * @param key
     * @returns {any}
     */
	public static getView(key: number): any {
		return this.views[key];
	}


	/**
	 * 关闭界面
	 * @param viewIndex 默认关闭所有打开的。前提是要先注册
	 */
	public static closeAll(minViewIndex: ViewIndex = 1, maxViewIndex: ViewIndex = 2): void {
		for (var i: number = 0; i < this.showedViews.length; i++) {
			var key: number = this.showedViews[i];
			let vIndex: number = this.viewIndexMap[key];
			if (vIndex >= minViewIndex && vIndex <= maxViewIndex) {
				if (this.hide(key)) {
					i--;
				}
			}
		}
		if (minViewIndex == 1 && maxViewIndex == 2) {
			let layerPopup: fairygui.GComponent = LayerManager.UI_Popup;
			let popup: fairygui.GComponent;
			while (layerPopup.numChildren) {
				popup = layerPopup.removeChildAt(0) as fairygui.GComponent;
				(popup instanceof BaseWindow) && popup.hide();
			}
		}
	}

	/**
	 * 获取包资源数
	 */
	public static getPackNum(pkgName: string): number {
		let n: number = 2;
		if (UIManager.packNumDict[pkgName]) {
			n = UIManager.packNumDict[pkgName];
		}
		return n;
	}

	/**
	 * 获取最后打开的界面
	 */
	public static getLastKey(): ModuleEnum {
		let key: number = this.viewsStack[this.viewsStack.length - 1];
		if (key != null) {
			return key;
		}
		return -1;
	}
}