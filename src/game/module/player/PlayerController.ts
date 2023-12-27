/**
 * 人物
 */
class PlayerController extends BaseController {
	private module: PlayerModule;
	/**更换装备的窗口 */
	private replaceWin: PlayerReplaceEquipWindow;
	private playerProxy: PlayerProxy;
	private playerCache: PlayerCache;
	private roleCache: RoleCache;
	/** 结构：message SEntityInfo */
	private entityInfo: any;
	private shape: any;
	// private panel: any;

	private exchangeWindow: WindowRoleStateExchange;
	private modifyNameWindow: PlayerModifyNameWindow;
	private isFirst: boolean = true;
	public constructor() {
		super(ModuleEnum.Player);

		this.playerProxy = ProxyManager.player;
		this.playerCache = CacheManager.player;
		this.roleCache = CacheManager.role;
		this.entityInfo = this.roleCache.entityInfo;
	}

	public initView(): BaseModule {
		this.module = new PlayerModule();
		return this.module;
	}

	public addListenerOnInit(): void {

		this.addListen0(LocalEventEnum.EquipToRole, this.equipToRole, this);//装备到角色身上
		this.addListen0(LocalEventEnum.EquipUndressRole, this.equipUndressRole, this);//卸下装备

		this.addListen0(LocalEventEnum.PlayerStrengthExActive, this.playerStrengthExActive, this);
		this.addListen0(LocalEventEnum.PlayerStrengthExUpgrade, this.playerStrengthExUpgrade, this);
		this.addListen0(LocalEventEnum.PlayerStrengthExUseDrug, this.playerStrengthExUseDrug, this);

		this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePushPlayerStrengthenExInfo], this.onPlayerStrengthenExInfo, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameActivateStrengthenEx], this.onActiveStrengthenEx, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameUpgradeStrengthenEx], this.onUpgradeStrengthenEx, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameUpdatePlayerStrengthenExInfo], this.onUpdatePlayerStrengthenExInfo, this);

		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameModifyRoleName], this.onModifyRoleName, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameAcceptLevelRoleExp], this.onRoleXWExp, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameAcceptCheckPointRoleExp], this.onCheckPointXWExp, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRoleExpAcceptInfo], this.onRoleExpAcceptInfo, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRoleExp], this.onRoleStateExpUpdate, this);

		this.addListen0(LocalEventEnum.Reincarnation, this.onReincarnationHandler, this);
		this.addListen0(LocalEventEnum.UseRoleExp, this.onUseRoleExpHandler, this);
		this.addListen0(LocalEventEnum.UseCheckPointExp, this.onUseCheckPointHandler, this);
		this.addListen0(NetEventEnum.roleCareerChanged, this.onRoleStateLvChange, this);
		this.addListen0(NetEventEnum.packRolePackItemsChange, this.packRolePackItemsChange, this);//角色背包有变动
		this.addListen0(UIEventEnum.OpenRoleStateExpExchange, this.onOpenExchangeWindow, this);
		this.addListen0(UIEventEnum.CloseRoleStateExpExchange, this.onCloseExchangeWindow, this);
		this.addListen0(UIEventEnum.PlayerModifyNameWindowShow, this.playerModifyNameWindowShow, this);
		this.addListen0(LocalEventEnum.PlayerModifyName, this.playerModifyName, this);
		this.addListen0(UIEventEnum.PlayerOnekeyEquip, this.onOneKeyEquip, this);

	}

	public addListenerOnShow(): void {
		this.addListen1(NetEventEnum.moneyBeastEquipExp, this.beastEquipExpUpdate, this);
		this.addListen1(NetEventEnum.roleLevelUpdate, this.onRoleLevelUpdate, this);
		this.addListen1(LocalEventEnum.MagicUIClose, this.onMagicUIClose, this);
		// this.addListen1(NetEventEnum.roleRealmUpdateed, this.onRoleRealmUpdate, this);

		this.addListen1(NetEventEnum.roleCombatCapabilitiesUpdate, this.roleCombatCapabilitiesUpdate, this);


		this.addListen1(NetEventEnum.packBackPackItemsChange, this.backpackChange, this);
		this.addListen1(NetEventEnum.packPosTypeBagChange, this.backpackChange, this);
		this.addListen1(NetEventEnum.packPosTypePropChange, this.onPropPackChangeHandler, this);
		this.addListen1(NetEventEnum.ItemUsedCountUpdate, this.onUsedNumUpdate, this);

		this.addListen0(NetEventEnum.moneyRuneCoin, this.updateRune, this);
		this.addListen0(NetEventEnum.moneyRuneExp, this.updateRune, this);
		this.addListen1(NetEventEnum.packPosTypeRuneChange, this.updateRune, this);
		this.addListen0(NetEventEnum.RuneInlayUpdate, this.updateRune, this);

		this.addListen1(NetEventEnum.entityAvatarUpdate, this.playerModelUpdated, this); //武器/时装模型等改变


		this.addListen1(LocalEventEnum.PlayerOpenReplaceEquip, this.openReplaceWin, this);
		this.addListen1(LocalEventEnum.EquipReplaceRole, this.onReplaceEquip, this);

		this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenExUpgraded, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExUpdated, this.onPlayerStrengthenExUpdated, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExActived, this.onPlayerStrengthenExActived, this);
		this.addListen1(NetEventEnum.CultivateInfoUpdateHeartMethod, this.onHeartMethodUpdate, this);

		this.addListen1(NetEventEnum.KillDecomposeSuccess, this.onKillDecomposeSuccess, this);
		this.addListen1(NetEventEnum.moneyKillFragmentJunior, this.onUpdateKillFragment, this);//低级必杀精华更新
		this.addListen1(NetEventEnum.moneyKillFragmentSenior, this.onUpdateKillFragment, this);//高级必杀精华更新

		this.addListen1(NetEventEnum.SevenDayMagicWeaponUpdate, this.onMagicWeaponUpdate, this);//法宝信息更新
		this.addListen1(LocalEventEnum.PlayerCopyInfoUpdate, this.onPlayerCopy, this);//副本信息更新
		this.addListen1(NetEventEnum.OnlineDaysUpdate, this.onMagicWeaponUpdate, this);//在线天数更新
		this.addListen1(LocalEventEnum.VipUpdate, this.onMagicWeaponUpdate, this);//vip更新
		this.addListen1(LocalEventEnum.MagicShapeDataUpdate, this.onMagicShapeDataUpdate, this);
	}

	private onMagicUIClose() {
		if (this.module) {
			this.module.updateMagicWeaponTips();
		}
	}

	private beastEquipExpUpdate(): void {
		this.module.updateBeastEquipExp();
	}

	private onRoleLevelUpdate(): void {
		this.module.updateLevel();
		if (this.exchangeWindow && this.exchangeWindow.isShow) {
			this.exchangeWindow.updateUsedNumItem();
		}
	}
	// private onRoleRealmUpdate(): void {
	// 	this.module.playerPanel.updateRealmTips();
	// }
	private roleCombatCapabilitiesUpdate(): void {
		this.module.updateFight();
		// this.module.playerPanel.updateRealmTips();
	}

	private packRolePackItemsChange(params): void {
		CacheManager.player.isReplaceRet = true;
		if (this.isShow) {
			this.module.updateEquips(true);
			this.module.updatePlayerPanelTips();
		}
	}

	public afterModuleShow(data: any): void {
		super.afterModuleShow(data);
	}

	public afterModuleHide(): void {
		CacheManager.wing.isAutoPromote = false;
	}

	private backpackChange(): void {
		this.module.updateEquips();
		this.module.updatePlayerPanelTips();
		this.module.updateUniqueSkillTips();
	}

	/**
	 * 穿装备
	 */
	private equipToRole(itemData: ItemData, roleIndex: number): void {
		//TODO 穿戴判断
		if (!CacheManager.player.isReplaceRet) {
			Log.trace(Log.TEST, '...穿戴装备操作过快,上次穿戴装备服务器还没返回...');
			return;
		}
		if (itemData) {
			if (this.roleCache.role.level_I < itemData.getLevel()) {
				Tip.showTip("角色等级不足");
				return;
			}
			let career: number = itemData.getCareer();
			if (!CareerUtil.isCareerMatch(career, roleIndex)) {
				Tip.showTip("角色职业不符合");
				return;
			}
			ProxyManager.player.dress(itemData.getUid(), itemData.getType(), roleIndex);
			if (this.replaceWin) {
				this.replaceWin.hide();
			}
		}
	}

	/**
	 * 卸下装备
	 */
	private equipUndressRole(itemData: ItemData): void {
		ProxyManager.player.unDress(itemData.getUid());
	}

	/**
	 * 人物模型改变
	 */
	private playerModelUpdated(attr: EEntityAttribute): void {
		this.module.updatePlayerModel(attr);
	}
	/**
	 * 一键换装
	 */
	private onOneKeyEquip(data: any): void {
		if (!CacheManager.player.isReplaceRet) {
			return;
		}
		//执行一键换装
		let derssPosAll: number[] = data.derssPosAll; //装备所有位置
		let roleIndex: number = data.roleIndex;
		var dressInfos: any[] = [];
		for (let pos of derssPosAll) {
			let item: ItemData;
			let backItem: ItemData = CacheManager.pack.backPackCache.getBestScoreEquip(pos, roleIndex, true);
			//有更好评分的装备
			if (WeaponUtil.isCanReplacePos(pos) ||
				(!CacheManager.pack.rolePackCache.getDressEquipByPos(pos, roleIndex) && CacheManager.pack.backPackCache.isHasEquipByDressPos(pos, roleIndex))) {
				item = backItem;
			}
			if (ItemsUtil.isTrueItemData(item)) {
				dressInfos.push({ uid: item.getUid(), rolePosIndex: item.getType() });
			}
		}
		if (dressInfos.length > 0) {
			ProxyManager.player.dressByOneKey(dressInfos, roleIndex);
		}

	}

	/**
	 * 玩家属性激活
	 */
	private playerStrengthExActive(type: EStrengthenExType, roleIndex: number): void {
		ProxyManager.player.activateStrengthenEx(type, roleIndex);
	}

	/**
	 * 玩家属性强化
	 */
	private playerStrengthExUpgrade(type: EStrengthenExType, roleIndex: number, isAutoBuy: boolean = false, chooseItemCode: number = 0, oneKeyUpgrade: boolean = false): void {
		ProxyManager.player.upgradeStrengthenEx(type, roleIndex, isAutoBuy, chooseItemCode, oneKeyUpgrade);
	}

	/**
	 * 使用属性药
	 */
	private playerStrengthExUseDrug(type: EStrengthenExType, roleIndex: number, drugType: number, useNum: number): void {
		ProxyManager.player.strengthenExUseDrug(type, roleIndex, drugType, useNum);
	}

	private openReplaceWin(itemData: ItemData): void {
		if (!this.replaceWin) {
			this.replaceWin = new PlayerReplaceEquipWindow();
		}
		this.replaceWin.show(itemData);
	}

	private onReplaceEquip(item: ItemData): void {
		if (this.isShow) {
			this.module.setReplaceEquipEff(item);
		}
	}

	/**
	 * 登录推送玩家新强化系统信息
	 * @param data S2C_SPlayerStrengthenExInfo
	 */
	private onPlayerStrengthenExInfo(data: any): void {
		CacheManager.role.sPlayerStrengthenExInfo = data;
		EventManager.dispatch(NetEventEnum.PlayerStrengthenExLoginInfo);
		if (this.isShow) {//强化信息推送前检测红的问题，推送后需要再检测一遍
			this.module.onStrengthenExUpdated();
		}
	}

	/**
	 * 强化升级返回
	 * @param data S2C_SUpgradeStrengthenEx
	 */
	private onUpgradeStrengthenEx(data: any): void {
		CacheManager.role.updateStrengthenEx(data);
		let info: SUpgradeStrengthenEx = new SUpgradeStrengthenEx();
		info.result = data.result;
		info.roleIndex = data.index;
		info.type = data.info.type;
		info.data = data;
		EventManager.dispatch(NetEventEnum.PlayerStrengthenExUpgraded, info);
	}

	/**
	 * 激活新强化系统返回
	 * @param data S2C_SActivateStrengthenEx
	 */
	private onActiveStrengthenEx(data: any): void {
		CacheManager.role.updateStrengthenEx(data);
		let info: SUpgradeStrengthenEx = new SUpgradeStrengthenEx();//TODO 先用强化升级的，使用时看看是否需要修改
		info.roleIndex = data.index;
		info.type = data.info.type;
		info.data = data;
		EventManager.dispatch(NetEventEnum.PlayerStrengthenExActived, info);
	}

	/**
	 * 更新推送玩家新强化系统信息。激活操作也会更新这个
	 * @param data S2C_SPlayerStrengthenExUpdate
	 */
	private onUpdatePlayerStrengthenExInfo(data: any): void {
		CacheManager.role.sPlayerStrengthenExUpdate = data;
		EventManager.dispatch(NetEventEnum.PlayerStrengthenExUpdated, data);
	}

	private onRoleExpAcceptInfo(data: any): void {
		//S2C_SRoleExpAcceptInfo
		CacheManager.player.roleExpAcceptInfo = data;

	}

	private onRoleXWExp(): void {
		if (CacheManager.player.roleExpAcceptInfo.lastAcceptLevel == 0) {
			CacheManager.player.roleExpAcceptInfo.lastAcceptLevel = ConfigManager.exp.minLevelExpLv;//CacheManager.role.getRoleLevel();
		} else {
			CacheManager.player.roleExpAcceptInfo.lastAcceptLevel++;
		}
		this.updateReincarnation();
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Player,CacheManager.player.checkTips());
	}

	private onCheckPointXWExp(): void {
		this.updateReincarnation();
	}

	private updateReincarnation(): void {
		if (this.isShow) {
			this.module.onUsedNumUpdate();
		}
		if (this.exchangeWindow && this.exchangeWindow.isShow) {
			this.exchangeWindow.updateUsedNumItem();
		}
	}

	/**
	 * 改名结果
	 */
	private onModifyRoleName(data: any): void {
		if (data && data.result) {
			Tip.showRollTip("改名成功");
		}
	}

	/**必杀碎片分解成功 */
	private onKillDecomposeSuccess(): void {
		this.module.updateUniqueSkillTips();
	}

	/**必杀精华更新 */
	private onUpdateKillFragment(): void {
		this.module.updateUniqueSkillTips();
	}
	private onPlayerCopy(updateTypeDic: number): void {
		if (updateTypeDic[ECopyType.ECopyMgSpirit]) {
			this.module.playerCopyUpdate();
		}
	}
	/**更新法宝 */
	private onMagicWeaponUpdate(): void {
		this.module.magicWeaponUpdate();
	}

	private onMagicShapeDataUpdate(): void {
		this.module.updateMagicWeaponTips();

	}

	/**
	 * 强化成功
	 */
	private onPlayerStrengthenExUpgraded(info: SUpgradeStrengthenEx): void {
		this.module.onStrengthenExUpgraded(info);
	}

	/**
	 * 强化更新
	 */
	private onPlayerStrengthenExUpdated(data: any): void {
		this.module.onStrengthenExUpdated(data);
	}

	private onHeartMethodUpdate(): void {
		this.module.onHeartMethodUpData();
	}

	/**
	 * 激活成功
	 */
	private onPlayerStrengthenExActived(info: SUpgradeStrengthenEx): void {
		this.module.onnStrengthenExActived(info);
		if (info != null) {
			if (info.type == EStrengthenExType.EStrengthenExTypeWing) {
				EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": "翅膀", "model": info.data.info.useModelId, "modelType": EShape.EShapeWing });
			}
		}
	}

	/**打开获取修为界面 */
	private onOpenExchangeWindow(): void {
		if (this.exchangeWindow == null) {
			this.exchangeWindow = new WindowRoleStateExchange();
		}
		this.exchangeWindow.show();
	}

	private onCloseExchangeWindow(): void {
		if (this.exchangeWindow && this.exchangeWindow.isShow) {
			this.exchangeWindow.hide();
		}
	}

	private playerModifyNameWindowShow(): void {
		if (this.modifyNameWindow == null) {
			this.modifyNameWindow = new PlayerModifyNameWindow();
		}
		this.modifyNameWindow.show();
	}

	private playerModifyName(name: string): void {
		ProxyManager.player.modifyRoleName(name);
	}

	public updateRoleStateTips(): void {
		if (this.isShow) {
			this.module.updateReincarnationTips();
		}
	}

	/**
	 * 修为更新 
	 * S2C_SRoleExp
	 */
	private onRoleStateExpUpdate(data: any): void {
		let value: number = data.roleExp;
		let add = value - this.roleCache.money.roleExp_I;
		this.roleCache.money.roleExp_I = value;
		EventManager.dispatch(NetEventEnum.moneyRoleStateExp, value);
		if (add > 0 && !this.isFirst) {
			EventManager.dispatch(NetEventEnum.moenyAdd, GameDef.EPriceUnitName[EPriceUnit.EPriceUnitRoleExp], add);
		}

		if (this.module && this.module.isShow) {
			this.module.updateStateValue();
		}
		this.isFirst = false;
	}

	/**转生等级改变 */
	private onRoleStateLvChange(): void {
		if (this.module && this.module.isShow) {
			this.module.updateRoleStateLevel();
		}
	}

	/**道具背包发生改变 */
	private onPropPackChangeHandler(): void {
		this.module.onPropPackChange();
		if (this.exchangeWindow && this.exchangeWindow.isShow) {
			this.exchangeWindow.updateUsedNumItem();
		}
	}

	/**符文更新 */
	private updateRune(): void {
		this.module.updateRuneTips();
	}

	/**物品使用次数更新 */
	private onUsedNumUpdate(): void {
		if (this.module && this.module.isShow) {
			this.module.onUsedNumUpdate();
		}
		if (this.exchangeWindow && this.exchangeWindow.isShow) {
			this.exchangeWindow.updateUsedNumItem();
		}
	}

	/**转生请求 */
	private onReincarnationHandler(): void {
		ProxyManager.reincarnation.reincarnationRequest();
	}

	/**降级获取修为 */
	private onUseRoleExpHandler(): void {
		ProxyManager.reincarnation.roleLevelExp();
	}

	private onUseCheckPointHandler(): void {
		ProxyManager.reincarnation.checkPointExp();
	}

	public hide(data?: any): void {
		super.hide(data);
		this.onCloseExchangeWindow();
	}
}