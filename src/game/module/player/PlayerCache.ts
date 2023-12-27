/**
 * 玩家缓存信息
 */
class PlayerCache implements ICache {
	/**外形枚举 顺序不要变 */
	public shapes: number[];

	/**更换装备是否返回（防止鼠标点击过快出现发送多次消息） */
	public isReplaceRet:boolean = true;

	/**本次登陆是否是第一次打开转生界面 */
	public isFirstOpenRoleState:boolean = true;
	
	public stateInfo:any;

	/**等级和关卡兑换修为信息 */
	public roleExpAcceptInfo:any;

	public constructor() {
		this.shapes = [EShape.EShapeWing, EShape.EShapeSpirit, EShape.EShapeMagic, EShape.EShapeCloak];
		this.stateInfo = {};
	}

	/**
	 * 人物按钮红点
	 */
	public checkTips(): boolean {
		var flag: boolean = false;	
		
		if (!flag) {
			
			flag = this.checkReincarnationTips();
		}
		if (!flag) {
			flag = this.checkPlayerTip();
		}

		if (!flag) {
			flag = CacheManager.uniqueSkill.checkBtnTip();
		}

		if(!flag){
			flag = CacheManager.ancientEquip.checkTips();
		}

		if(!flag){
			flag = CacheManager.copy.isSpiritTip();
		}

		return flag;
	}

	
	/*
	//是否可以降级兑换
	public checkExRoleStateByLevel(): boolean {
		if(!this.isFirstOpenRoleState) return false;
		if(this.checkRoleStateFullLv()) return false;
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.RoleState],false)) {
			return false;
		}
		return CacheManager.pack.getItemLeftUseCount(30051011) > 0;
	}
	*/

	/**检测是否可使用修为丹兑换修为 */
	public checkExchangeRoleStateExp(): boolean {
		let props: ItemData[] = CacheManager.pack.propCache.getByCT(ECategory.ECategoryProp, EProp.EPropDynamicRoleStateProp);
		if(!props || !props.length) return false;
		for (let i: number = 0; i < props.length; i++) {
			let leftUseCount: number = CacheManager.pack.getItemLeftUseCount(props[i].getCode());
			if (leftUseCount > 0) return true;
		}
		return false;
	}

	/**转生等级是否已满级 */
	public checkRoleStateFullLv():boolean {
		let stateLv: number = CacheManager.role.getRoleState();
		let cfg: any = ConfigManager.roleStateNew.getByPk(stateLv + 1);//下一级配置取不到，说明已满级
		return cfg == null;
	}

	/**化形是否红点提示 */
	public isHasShapeTips(): boolean {
		var flag: boolean = false;
		var isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.ShapeChange, false);
		if (isOpen) {
			for (var i: number = 0; i < this.shapes.length; i++) {
				flag = ShapeUtils.isShapeUpgradeOrActive(this.shapes[i]);
				if (flag) {
					break;
				}
			}
		}

		return flag;
	}

	/**时装是否红点提示 */
	public isHasFashionTips(): boolean {
		var flag: boolean = false;
		var isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.ShapeChange, false);
		if (isOpen) {
			flag = CacheManager.clothesFashion.checkTips() || CacheManager.weaponFashion.checkTips();
		}
		return flag;
	}

	/**境界是否可以升级 */
	public isRealmTips(): boolean {
		var flag: boolean = false;
		var isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Realm, false);
		if (isOpen && !CacheManager.role.isRealmMax) {
			var nextLevel: number = CacheManager.role.role.realmLevel_BY + 1;
			var nextInf: any = ConfigManager.realm.getByPk(nextLevel);
			var hasNum: number = CacheManager.pack.backPackCache.getItemCountByCode2(nextInf.costItemCode);
			var costNum: number = nextInf.costItemNum || 0;
			var needFight: number = nextInf.warfareLimit || 0;
			flag = hasNum >= costNum && CacheManager.role.combatCapabilities >= needFight;
		}
		return flag;
	}

	/**神装是否可合成/升级/分解 */
	// public isGodEquipTips(): boolean {
	// 	let flag: boolean = false;
	// 	let isOpen: boolean = true;
	// 	if (isOpen) {
	// 		flag = CacheManager.godEquip.checkTips();
	// 	}
	// 	return flag;
	// }

	/**
	 * 角色面板红点
	 */
	public checkPlayerTip(): boolean {
		let flag: boolean = false;
		flag = CacheManager.role.checkEquipTips();
		if (!flag) {
			flag = CacheManager.role.isHasCanOpenRole();
		}
		if (!flag) {
			flag = CacheManager.sevenDayMagicWeapon.checkCanActived();
		}
		if(!flag){
			flag = CacheManager.copy.isSpiritTip();
		}
		if (!flag) {
			flag = CacheManager.godEquip.checkGodEquipModuleTips();
		}
		if (!flag) {
			flag = CacheManager.rune.checkTips();
		}
		if (!flag) {
			flag = CacheManager.magicWare.isMagicWareRedTip();
		}
		if (!flag) {
			flag = CacheManager.fashionPlayer.checkFashionTips();
		}
		if(!flag){
			flag = CacheManager.ancientEquip.checkTips();
		}
		if(!flag) {
			flag = CacheManager.magicWeaponStrengthen.checkTips();
		}
		return flag;
	}

	/**转生相关红点 */
	public checkReincarnationTips():boolean{
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.RoleState],false)) {
			return false;
		}
		let flag: boolean = this.isCurCheckPointGetXW() || (!this.checkRoleStateFullLv() && this.checkCanReincarnation()) || CacheManager.copy.checkExpCopyTips() || this.checkExchangeRoleStateExp();
		return flag;
	}

	/**检测是否可转生 */
	public checkCanReincarnation(): boolean {	
		//调用方法外部优先判断转生是否开启，不然每个检测中都要重复判断一次功能开启	
		let stateLv: number = CacheManager.role.getRoleState();
		let cfg: any = ConfigManager.roleStateNew.getByPk(stateLv + 1);
		if (!cfg) return false;
		return CacheManager.role.money.roleExp_I >= cfg.roleExp;
	}
	

	/**当前等级是否可领取修为 */
	public isCurLevelGetXW(lv:number=-1):boolean{
		let lastLv:number = 0;
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.RoleState],false)) {
			return false;
		}
		if(this.roleExpAcceptInfo){
			lastLv = this.roleExpAcceptInfo.lastAcceptLevel;
		}
		if(lv==-1){
			lv = CacheManager.role.getRoleLevel();
		}
		let info:any = ConfigManager.exp.getByPk(lv);
		return !this.checkRoleStateFullLv() && lv>lastLv && (info && info.getLevelExp);
	}

	/**判断当前关卡是否可领取修为 */
	public isCurCheckPointGetXW(curCheckpoint:number = -1):boolean{
		if(curCheckpoint==-1){
			curCheckpoint = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
		}
		//调用方法外部优先判断转生是否开启，不然每个检测中都要重复判断一次功能开启
		// if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.RoleState],false)) {
		// 	return false;
		// }		
		let info:any = ConfigManager.checkPoint.getByPk(curCheckpoint);
		return (info && info.levelExp) && !this.isGetCheckPointXW();
	}

	/**今天是否领取了关卡修为 */
	public isGetCheckPointXW():boolean{
		return CacheManager.pack.getItemUsedCountToday(ItemCodeConst.CheckPointLvExp)>0;
	}

	/**指引是否已完成 */
	public isGuideCompleted(code: GuideCode): boolean{
		if(this.stateInfo["guide"] != null && this.stateInfo["guide"][code]){
			return true;
		}
		return false;
	}

	/**指引已完成 --更新数据-- */
	public updateGuideStatus(code: GuideCode): void{
		if(!this.stateInfo["guide"]){
			this.stateInfo["guide"] = {};
		}
		this.stateInfo["guide"][code] = 1;
		ProxyManager.home.setShowStateInfo();
	}

	public updatePrivilegeTempCardStatus()  {
		if(!this.stateInfo["PrivilegeTempCard"]) {
			this.stateInfo["PrivilegeTempCard"] = 1;
		}
		ProxyManager.home.setShowStateInfo();
	}


	public updatePrivilegeCardEndTime(time : number)  {
		if(!this.stateInfo["PrivilegeEndTime"]) {
			this.stateInfo["PrivilegeEndTime"] = time;
		}
		else {
			this.stateInfo["PrivilegeEndTime"] = time;
		}
		ProxyManager.home.setShowStateInfo();
	}

	public clear(): void {

	}
}