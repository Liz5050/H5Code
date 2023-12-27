class BossNewCache implements ICache {
	private bossList:{[bossCode:number]:any} = {};
	private bossComingInfos:{[bossCode:number]:any} = {};
	/**野外boss配置 */
	private bossConfigList:any[];
	/**神域boss配置 */
	private godBossCfgs:any[];
	public reviveCityEnd:number = 0;
	private _followBoss: number[] = [];
	//boss刷新是否自动挑战(野外boss自动挑战)
	private _autoFight:boolean = false;
	/**自动挑战的boss列表 */
	private _autoFightCode:number[] = [];

	/**神域boss自动挑战 */
	private _autoFight2:boolean = false;
	private _autoFightCode2:number[] = [];

	/**掷骰子信息 SSecretBossGift */
	private _diceInfo:any;
	/**秘境boss增加挑战次数的物品信息 */
	private _secretAddItemInfo:any;

	/**当前归属者 */
	private _ownerInfo:any;

	/**隐藏boss消失时间戳 */
	private _hideBossDt:number = 0;
	private _hideBossCopyCode:number=0;

	private _battleObj:RpgGameObject;	
	private isFrist:boolean = true;
	private checkAutoTime:number;
	/**boss之家刷新时间 */
	public bossHomeRefresh:number = 0;
	
	/**是否需要重新获取秘境boss(转生改变时设置为true) */
	public isSecret:boolean = true;

	/**已使用刷新次数 */
	private _refreshedNum:number = 0;
	/**本次登陆已提示过的boss */
	public refreshedDict:{[bossCode:number]:boolean} = {};
	public constructor() {
		
	}

	public get autoFight():boolean {
		if(!CacheManager.sysSet.autoCopy) return false;
		return this._autoFight && CacheManager.welfare2.isPrivilegeCard;
	}

	public set autoFight(value:boolean) {
		this._autoFight = value;
	}

	public get autoFight2():boolean {
		if(!CacheManager.sysSet.autoCopy) return false;
		return this._autoFight2 && CacheManager.welfare2.isPrivilegeCard;
	}

	public set autoFight2(value:boolean) {
		this._autoFight2 = value;
	}

	private checkFollow(): void {
		if(this.autoFight || this.autoFight2) {
			if(CacheManager.copy.checkCanEnterCopy(false)) {
				let time:number = egret.getTimer();
				if(time - this.checkAutoTime >= 10000){
					this.checkAutoTime = time;
					//10秒检测一次,防止野外副本CD中，没检测到自动进入Boss副本
					EventManager.dispatch(LocalEventEnum.WorldBossAutoFight);
				}
			}
		}
	}

	/**是我可以关注的秘境boss */
	private isMySecretBoss(bossCode:number):boolean{
		let flag:boolean = false;
		let secretBoss:any[] = CopyUtils.getSecretBossList();
		for(let info of secretBoss){
			if(info.bossCode==bossCode){
				flag = true;
				continue;
			}
		}
		return flag;
	}
	

	/**
	 * 关注某个boss
	 */
	public setFollowBoss(bossId: number, isFollow: boolean): void {
		if (isFollow) {
			if(this._followBoss.indexOf(bossId) == -1) {
				this._followBoss.push(bossId);
			}
			if(this._autoFightCode.indexOf(bossId) == -1 && this.checkBossCopy(bossId,CopyEnum.CopyWorldBoss)) {
				this._autoFightCode.push(bossId);
			}
			else if(this._autoFightCode2.indexOf(bossId) == -1 && this.checkBossCopy(bossId,CopyEnum.CopyGodBoss)) {
				this._autoFightCode2.push(bossId);
			}
		} else {
			let index: number = this._followBoss.indexOf(bossId);
			if(index != -1) this._followBoss.splice(index, 1);
			index = this._autoFightCode.indexOf(bossId);
			if(index != -1) this._autoFightCode.splice(index, 1);
			index = this._autoFightCode2.indexOf(bossId);
			if(index != -1) this._autoFightCode2.splice(index, 1);
		}

		if(UIManager.isShow(ModuleEnum.QiongCang)) {
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
		}

		let isRun: boolean = App.TimerManager.isExists(this.checkFollow, this);
		if (this._followBoss.length > 0) {
			this.checkAutoTime = egret.getTimer();
			!isRun ? App.TimerManager.doTimer(1000, 0, this.checkFollow, this) : null;
		} else if (isRun) {
			App.TimerManager.remove(this.checkFollow, this);
		}
	}

	public isFollowBoss(bossCode: number): boolean {
		return this._followBoss.indexOf(bossCode) > -1;
	}

	/**
	 * 是否需要弹通用刷新提示
	 */
	public needRefreshTips(bossCode:number):boolean {
		if(CacheManager.role.getRoleLevel() < 52) return false;//策划需求，角色52级以下不弹刷新提示，影响新手流程
		if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Boss,false) || !CacheManager.copy.checkCanEnterCopy(false)) return false;
		if(this.checkBossCopy(bossCode,CopyEnum.CopyWorldBoss)) {
			if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.WorldBoss],false)) return false;
		}
		else if(this.checkBossCopy(bossCode,CopyEnum.CopyGodBoss)) {
			if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.GodBoss],false)) return false;
		}

		if(!this.isFollowBoss(bossCode)) return false;
		let bossCfg:any = ConfigManager.boss.getByPk(bossCode);
		if(bossCfg.level <= 50) {
			//策划需求 50级以下的boss每次登陆不管关注与否只弹一次刷新提示
			if(this.refreshedDict[bossCode]) return false;
		}
		let mgGameBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
		let leftCount:number = CacheManager.copy.getEnterLeftNum(mgGameBoss.copyCode);
		if(leftCount <= 0) return false;//没有剩余挑战次数，不弹刷新提示
		return !this.checkBossCopy(bossCode,null,ECopyType.ECopyMgQiongCangHall) && !this.checkBossCopy(bossCode,null,ECopyType.ECopyMgQiongCangAttic);
	}

	public get followBoss():number[] {
		return this._followBoss;
	}

	public get autoFightBossList():number[] {
		return this._autoFightCode;
	}

	public get autoFightBossList2():number[] {
		return this._autoFightCode2;
	}

	public set hideBossDt(value:number){
		this._hideBossDt = value; 
	}

	public get hideBossDt():number{
		return this._hideBossDt;
	}

	public set hideBossCopyCode(value:number){
		this._hideBossCopyCode = value;
	}

	public get hideBossCopyCode():number{
		return this._hideBossCopyCode;
	}

	public isShowHideBoss():boolean{
		let st:number = CacheManager.serverTime.getServerTime();
		return this._hideBossDt>st;
	}

	/**
	 * 检测boss副本
	 */
	public checkBossCopy(code:number,copyCode:number = CopyEnum.CopyWorldBoss,copyType:ECopyType = null):boolean {
		let gameBossCfg:any = ConfigManager.mgGameBoss.getByPk(code);
		if(copyType != null) {
			//传了副本类型的优先按类型检测
			if(!gameBossCfg) {
				return false;
			}
			let copyCfg:any = ConfigManager.copy.getByPk(gameBossCfg.copyCode);
			return copyCfg && copyCfg.copyType == copyType;
		}
		return gameBossCfg && gameBossCfg.copyCode == copyCode;
	}

	/**
	 * 是否可自动挑战
	 */
	public checkAutoFight(bossCode:number):boolean {
		if(this.checkBossCopy(bossCode,CopyEnum.CopyWorldBoss)) {
			return CacheManager.bossNew.autoFight && CacheManager.copy.getEnterLeftNum(CopyEnum.CopyWorldBoss) > 0;
		}
		else if(this.checkBossCopy(bossCode,CopyEnum.CopyGodBoss)) {
			return CacheManager.bossNew.autoFight2 && CacheManager.copy.getEnterLeftNum(CopyEnum.CopyGodBoss) > 0;
		}
		return false;
	}

	/**
	 * 更新boss列表
	 */
	private isFirst:boolean = true;
	public updateBossList(data:any):void {
		let codes:number[] = data.key_I;
		let maxLv:number = 0;
		let loginCode:number = 0;//登陆需要弹一次刷新提示
		for(let i:number = 0; i < codes.length; i++) {
			this.bossList[codes[i]] = data.value[i];
			// this.judgeSecretTips(codes[i]);
			if(this.isFirst) {
				if(loginCode != 0 && this.checkBossCopy(codes[i],CopyEnum.CopyGodBoss)) continue;//优先弹野外boss
				if(this.checkBossCopy(codes[i],null,ECopyType.ECopyMgNewWorldBoss) && this.isFollowBoss(codes[i])) {
					let bossCfg:any = ConfigManager.boss.getByPk(codes[i]);
					if(bossCfg && bossCfg.level >= maxLv) {
						maxLv = bossCfg.level;
						loginCode = bossCfg.code;
					}
				}
			}
		}
		if(this.isFirst) {
			this.isFirst = false;
			if(loginCode != 0) {
				EventManager.dispatch(LocalEventEnum.BossRefrishNotice,loginCode);
			}
		}
	}

	/**
	 * 更新单个boss信息 SIntBoolDate
	 */
	public updateBossInfo(data:any):void {
		this.bossList[data.val_I] = data;
		// this.judgeSecretTips(data.val_I);
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Boss,CacheManager.bossNew.checkTips());
	}

	public updateBossComingInfo(data:any[]):void {
		for(let i:number = 0; i < data.length; i++) {
			let info:any = this.bossComingInfos[data[i].bossCode_I];
			if(!info) {
				info = data[i];
				this.bossComingInfos[data[i].bossCode_I] = info;
			}
			info.progress_I = data[i].progress_I;
			info.beKilledTimes_I = data[i].beKilledTimes_I;
			info.refreshDt_DT = data[i].refreshDt_DT;
		}
		EventManager.dispatch(NetEventEnum.BossComingInfoUpdate,data);
	}

	public judgeSecretTips(bossCode:number):boolean{
		let flag:boolean = false;
		let mgBossInf:any = ConfigManager.mgGameBoss.getByPk(bossCode);
		let copyInfo:any = ConfigManager.copy.getByPk(mgBossInf.copyCode);
		if(copyInfo.copyType==ECopyType.ECopyMgSecretBoss){
			flag = this.isSecetBossTips();
		}
		if(flag){
			EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Boss,CacheManager.bossNew.checkTips());
		}		
		return flag;
	}
	
	/**
	 * 更新归属者
	 */
	public updateBossOwner(data:any):void {
		this._ownerInfo = data;
	}

	/**
	 * 获取boss数据
	 */
	public getBossInfoByCode(code:number):any {
		return this.bossList[code];
	}

	/**
	 * 获取boss来袭数据
	 */
	public getBossComingInfo(bossCode:number):any {
		return this.bossComingInfos[bossCode];
	}

	/**
	 * 获取即将刷新或已刷新的boss
	 */
	public getRefreshBossComingInfo():any {
		let leftCount:number = 99999999;
		let resultInfo:any;
		for(let bossCode in this.bossComingInfos) {
			let info:any = this.bossComingInfos[bossCode];
			let bossComingCfg:any = ConfigManager.mgGameBoss.getBossComingCfg(Number(bossCode));
			let needKillCount:string[] = bossComingCfg.killBossCounts.split(",");
			let killIndex:number = info.beKilledTimes_I > 0 ? info.beKilledTimes_I : 0;
			if(killIndex >= needKillCount.length) {
				killIndex = needKillCount.length - 1;
			}
			let leftKills:number = Number(needKillCount[killIndex]) - info.progress_I;
			if(leftKills < leftCount) {
				leftCount = leftKills;
				resultInfo = info;
			}
		}
		return resultInfo;
	}

	/**
	 * 判断某个boss 是否在刷新cd中
	 */
	public isBossCd(bossId: number): boolean {
		// bVal_B 是否存活
		let bossInfo:any = this.bossList[bossId];
		if(!bossInfo || !bossInfo.bVal_B) return true;
		let gameBossCfg:any = ConfigManager.mgGameBoss.getByPk(bossId);
		if(gameBossCfg.floor && gameBossCfg.copyCode == CopyEnum.CopyWorldBoss) {
			//野外boss新刷新规则
			let copyInfo:any = CacheManager.copy.getPlayerCopyInf(CopyEnum.CopyWorldBoss);
			let index:number = copyInfo.starDict.key_I.indexOf(gameBossCfg.mapId);
			if(index == -1) {
				//我没有进入过该副本bVal_B又为true，该boss为存活状态
				return false;
			}
			let myEnterTime:number = copyInfo.starDict.value_I[index];//我进入该副本的时间戳
			let startTime:number = Number(bossInfo.valEx1_L64);//第一个玩家进入该副本的时间
			return startTime > 0 && startTime <= myEnterTime;//只要进入过，该boss就开始显示刷新倒计时
		}
		return false;
	}

	/**
	 * boss来袭是否在刷新CD中
	 */
	public isBossComingCd(bossCode:number):boolean {
		let comingInfo:any = this.bossComingInfos[bossCode];
		if(this.isBossCd(bossCode)) return true;
		let bossComingCfg:any = ConfigManager.mgGameBoss.getBossComingCfg(bossCode);
		let needKills:string[] = bossComingCfg.killBossCounts.split(",");//需要击杀数
		let index:number = 0;
		let kills:number = 0;//已击杀进度
		if(comingInfo) {
			index = comingInfo.beKilledTimes_I > 0 ? comingInfo.beKilledTimes_I : 0;
			if(index >= needKills.length) {
				index = needKills.length - 1;
			}
			kills = comingInfo.progress_I;
		}
		return kills < Number(needKills[index]);
	}

	/**
	 * 获取boss刷新时间
	 */
	public getBossDt(bossId: number): number {
		if (this.bossList[bossId]) {
			let dt: number = this.bossList[bossId].dateVal_DT;
			return dt;
		}
		return 0;
	}

	/**
	 * 获取boss来袭刷新时间
	 */
	public getBossComingDt(bossCode:number):number {
		if(!this.bossComingInfos[bossCode]) return 0;
		return this.bossComingInfos[bossCode].refreshDt_DT;
	}

	/**回城复活cd中 */
	public isCityReviveCd():boolean{
		let sec:number = this.reviveCityEnd - egret.getTimer();
		return sec > 0;
	}

	/**是否存在归属者 */
	public get hasOwner():boolean {
		return this._ownerInfo && this._ownerInfo.ownerMiniPlayer.entityId.id_I > 0;
	}

	public get ownerInfo():any {
		if(!this.hasOwner) return null;
		return this._ownerInfo.ownerMiniPlayer;
	}

	public set battleObj(obj:RpgGameObject) {
		if(this._battleObj == obj) {
            if(EntityUtil.isCollectionMonster(obj))//采集物，继续发
                EventManager.dispatch(LocalEventEnum.FocusAttack,obj,true);
            return;
        }
		this._battleObj = obj;
		if(!CacheManager.king.isAutoFighting && obj) {
			EventManager.dispatch(LocalEventEnum.AutoStartFight);
		}
		EventManager.dispatch(LocalEventEnum.FocusAttack,obj);
	}

	/**只设置，不发事件 */
	public setBattleObj(obj:RpgGameObject):void {
		this._battleObj = obj;
	}

	public get battleObj():RpgGameObject {
		return this._battleObj;
	}
	/**掷骰子信息 SSecretBossGift  */
	public get diceInfo():any{
		return this._diceInfo;
	}
	public setDiceInfo(data:any):void{
		this._diceInfo = data;
		let sevt:number = CacheManager.serverTime.getServerTime();
		let dt:number = sevt + data.leftTime_I;
		this._diceInfo.leftTimeDt = dt;
		delete this._diceInfo.leftTime_I;
	}
	/**
	 * 骰子界面是否过期了（也就是不能显示了）
	 */
	public isDiceInfoExpire():boolean{
		let dt:number = this._diceInfo.leftTimeDt;
		let sevt:number = CacheManager.serverTime.getServerTime();
		return dt<sevt;
	}

	public get secretAddItemInfo():any{
		if(!this._secretAddItemInfo){
			let addCopyItems:any[] = ConfigManager.item.selectByCT(ECategory.ECategoryProp,EProp.EPropAddCopyNum);
			for(let inf of addCopyItems){
				if(inf.effect && inf.effect ==ECopyType.ECopyMgSecretBoss){
					this._secretAddItemInfo = inf;
					break;
				}
			}
		}
		return this._secretAddItemInfo;
	}

	/**野外已刷新次数更新 */
	public updateRefreshedNum(num:number):void {
		this._refreshedNum = num;
	}

	/**获取剩余刷新次数 */
	public get leftRefreshNum():number {
		let vipAddCfg:any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddTypeRefreshNewWorldBoss);
        let totalNum:number = vipAddCfg[CacheManager.vip.vipLevel];
		if(CacheManager.welfare2.isPrivilegeCard) {
			//特权月卡
			totalNum += ConfigManager.const.getConstValue("PrivilegeRefreshWorldBossTimes");
		}
		if(CacheManager.welfare2.isGoldCard) {
			totalNum += ConfigManager.const.getConstValue("GoldRefreshWorldBossTimes");
		}
		return totalNum - this._refreshedNum;
	}
	
	/**
	 * 根据副本code获取boss列表（已排序）
	 * 由于界面涉及boss状态排序，排序后会改变原始配置数据的顺序，所以用一份新数组
	 * 神域boss和野外boss副本类型相同
	 * @param isShowGuideBoss 是否显示指引boss
	 */
	private lv40Boss: any;
	private priBoss: any;
	public getWorldBossList(isShowGuideBoss: boolean = false):any[] {
		if(!this.bossConfigList) {
			this.bossConfigList = [];
			let cfgList:any[] = ConfigManager.mgGameBoss.getByCopyCode(CopyEnum.CopyWorldBoss);
			for(let i:number = 0; i < cfgList.length; i++) {
				this.bossConfigList.push(cfgList[i]);
			}
		}

		if (isShowGuideBoss) {
			if (!this.lv40Boss) {
				//去掉40级boss，加上私有boss
				let gameBoss:any;
				let bossConfig:any;
				let bossCode: number;
				for(let i: number = 0; i < this.bossConfigList.length; i++) {
					bossCode = this.bossConfigList[i].bossCode;
					bossConfig = ConfigManager.boss.getByPk(bossCode);
					gameBoss = ConfigManager.mgGameBoss.getByPk(bossCode);
					if(gameBoss && !gameBoss.roleState && gameBoss.copyCode != CopyEnum.WorldBossGuide) {
						if (bossConfig.level == 40) {
							this.lv40Boss = gameBoss;
							this.bossConfigList.splice(i, 1);
							break;
						}
					}
				}
				let priBoss: Array<any> = ConfigManager.mgGameBoss.getByCopyCode(CopyEnum.WorldBossGuide);
				if (priBoss && priBoss.length > 0) {
					this.priBoss = priBoss[0];
				}
			}
		} else {
			if (this.lv40Boss && this.bossConfigList.indexOf(this.lv40Boss) == -1) {
				this.bossConfigList.push(this.lv40Boss);
			}
			if (this.priBoss) {
				let priBossIndex: number = this.bossConfigList.indexOf(this.priBoss);
				if (priBossIndex != -1) {
					this.bossConfigList.splice(priBossIndex, 1);
				}
			}
		}


		this.bossConfigList.sort(this.bossSort);

		if (isShowGuideBoss) {
			if (this.priBoss) {//加入到最开始
				let priBossIndex: number = this.bossConfigList.indexOf(this.priBoss);
				if (priBossIndex != -1) {
					this.bossConfigList.splice(priBossIndex, 1);
				}
				this.bossConfigList.unshift(this.priBoss)
			}
		}
		return this.bossConfigList;
	}

	/**
	 * 神域boss列表（已排序）
	 */
	public getGodBossList():any[] {
		if(!this.godBossCfgs) {
			this.godBossCfgs = [];
			let cfgList:any[] = ConfigManager.mgGameBoss.getByCopyCode(CopyEnum.CopyGodBoss);
			for(let i:number = 0; i < cfgList.length; i++) {
				this.godBossCfgs.push(cfgList[i]);
			}
		}
		this.godBossCfgs.sort(this.bossSort);
		return this.godBossCfgs;
	}

	public getBossHomeSortCfgs(floor:number):any[] {
		let bossList:any[] = ConfigManager.mgGameBoss.getHomeBossByFloor(floor);
		let result:any[] = [];
		for(let i:number = 0; i < bossList.length; i++) {
			result.push(bossList[i]);
		}
		result.sort(this.bossSort);
		return result;
	}

	private bossSort(value1:any,value2:any):number {
		let this_:BossNewCache = CacheManager.bossNew;
		let isOpen1:boolean = this_.getBossIsOpened(value1.bossCode);
		let isOpen2:boolean = this_.getBossIsOpened(value2.bossCode);
		if(isOpen1 && !isOpen2) return -1;
		if(!isOpen1 && isOpen2) return 1;
		if(!this_.isBossCd(value1.bossCode) && this_.isBossCd(value2.bossCode)) return -1;
		if(this_.isBossCd(value1.bossCode) && !this_.isBossCd(value2.bossCode)) return 1;
		if(this_.isFollowBoss(value1.bossCode) && !this_.isFollowBoss(value2.bossCode)) return -1;
		if(!this_.isFollowBoss(value1.bossCode) && this_.isFollowBoss(value2.bossCode)) return 1;
		let boss1:any = ConfigManager.boss.getByPk(value1.bossCode);
		let boss2:any = ConfigManager.boss.getByPk(value2.bossCode);
		if(isOpen1 && isOpen2) {
			//已开启的boss等级从高到低排序
			if(boss1.level > boss2.level) return -1;
			if(boss1.level < boss2.level) return 1;
		}
		//未开启的boss等级从低到高排序
		if(boss1.level < boss2.level) return -1;
		if(boss1.level > boss2.level) return 1;
		return 0;
	}

	/**Boss是否已经开启 */
	public getBossIsOpened(code:number):boolean {
		let gameBoss:any = ConfigManager.mgGameBoss.getByPk(code);				
		if(gameBoss.freeVip && CacheManager.vip.vipLevel < gameBoss.freeVip) {
			return false;
		}
		let roleState:number = CacheManager.role.getRoleState();		
		if(gameBoss && gameBoss.roleState) {
			//如有配置转生限制，仅判断转生等级
			let maxRoleState:number = ObjectUtil.getConfigVal(gameBoss,"maxRoleState",0);
			return gameBoss.roleState <= roleState && (maxRoleState==0 || roleState<=maxRoleState);
		}
		let bossConfig:any = ConfigManager.boss.getByPk(code);
		return bossConfig && bossConfig.level <= CacheManager.role.getRoleLevel();
	}

	/**
	 * 判断个人boss是否开启
	 * @param bossInf mgGameBoss配置或者bossCode
	 */
	public isPersonalOpen(bossInf:any):boolean{
		if(typeof(bossInf)=="number"){
			bossInf = ConfigManager.mgGameBoss.getByPk(bossInf);
		}		
		let isOpen:boolean = false;
		let privilegeCardLimit:number = bossInf.privilegeCardLimit?bossInf.privilegeCardLimit:0;
		let goldCardLimit:number = bossInf.goldCardLimit?bossInf.goldCardLimit:0;
		let freeVip:number = bossInf.freeVip?bossInf.freeVip:0;
		if(privilegeCardLimit){ //特权月卡
			isOpen = CacheManager.welfare2.isPrivilegeCard;
		}else if(goldCardLimit){ //元宝月卡
			isOpen = CacheManager.welfare2.isGoldCard;
		}else if(freeVip>0){
			isOpen = CacheManager.vip.checkVipLevel(freeVip); //优先判断VIP		
		}else{
			isOpen = this.getBossIsOpened(bossInf.bossCode); //CacheManager.role.checkLevel(enterMinLevel);
		}				
		return isOpen;
	}
	/**
	 * 是否可击杀个人boss
	 */
	public isPersonalCanKill(bossInf:any):boolean{
		let flag:boolean = false;
		if(typeof(bossInf)=="number"){
			bossInf = ConfigManager.mgGameBoss.getByPk(bossInf);
		}	
		let isCopyNumOk:boolean = CacheManager.copy.isEnterNumOk(bossInf.copyCode);
		flag = isCopyNumOk && this.isPersonalOpen(bossInf);
		return flag;
	}
	/**
	 * 个人boss是否有红点
	 */
	public isPeronalBossTips():boolean{
		let flag:boolean = false;
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.PersonalBoss,false);
		if(isOpen){
			let bossInfs:any[] = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgPersonalBoss);
			for(let inf of bossInfs){
				flag = this.isPersonalCanKill(inf);
				if(flag){
					break;
				}
			}
		}		
		return flag;
	}

	/**
	 * 野外boss红点、神域boss红点
	 */
	public checkWorldBossTips(copyCode:number):boolean {
		if(CacheManager.copy.getEnterLeftNum(copyCode) <= 0) return false;
		let openKey:string = MgOpenEnum.WorldBoss;
		if(copyCode == CopyEnum.CopyGodBoss) {
			openKey = MgOpenEnum.GodBoss;
		}
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(openKey,false);
		if(isOpen){
			let bossList:any[] = ConfigManager.mgGameBoss.getByCopyCode(copyCode);
			for(let i:number = 0; i < bossList.length; i++) {
				if(this.followBoss.indexOf(bossList[i].bossCode) == -1) continue;//未关注不给红点
				if(this.getBossIsOpened(bossList[i].bossCode) && !this.isBossCd(bossList[i].bossCode)){
					return true;
				}
			}
		}
		return false;
	}
	
	public checkSecretTips():boolean{
		return this.isSecetBossTips() || this.isDarkBossTips();
	}

	/**秘境boss是否有红点 */
	public isSecetBossTips():boolean{			
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.SecretBoss],false)){
			return false;
		}		
		let bossList:any[] = CopyUtils.getSecretBossList();
		let flag:boolean = this.isHasBossCanKill(bossList);		
		return flag;
	}


	public isDarkBossTips():boolean{
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.darkSecret],false)){
			return false;
		}
		let bossList:any[] = CopyUtils.getDarkSecretBoss();
		let flag:boolean = this.isHasBossCanKill(bossList);
		return flag;
	}

	private isHasBossCanKill(bossList:any[]):boolean{
		let flag:boolean = false;
		if(bossList && bossList.length>0){
			let inf:any = bossList[0];
			let n:number = CacheManager.copy.getEnterLeftNum(inf.copyCode);
			if(n>0){
				for(let bossInfo of bossList ){
					let isCD:boolean = this.isBossCd(bossInfo.bossCode);
					if(this.isFollowBoss(bossInfo.bossCode) && !isCD){
						flag = true;
						break;
					}
				}
			}
		}		
		return flag;
	}

	public checkBossHomeTips():boolean {
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.BossHome],false);
		if(isOpen){
			let bossList:any[] = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgNewBossHome);
			for(let i:number = 0; i < bossList.length; i++) {
				if(this.followBoss.indexOf(bossList[i].bossCode) == -1) continue;//未关注不给红点
				if(this.getBossIsOpened(bossList[i].bossCode) && !this.isBossCd(bossList[i].bossCode)) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 穹苍boss红点检测
	 */
	public checkQiongCangBossTips():boolean {
		let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.QiongCangBoss],false);
		if(!isOpen) return false;
		let bossList:any[] = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgQiongCangHall);
		let bossCfg:any;
		for(let i:number = 0; i < bossList.length; i ++) {
			if(CacheManager.bossNew.getBossIsOpened(bossList[i].bossCode)) {
				bossCfg = bossList[i];
				break;
			}
		}
		if(bossCfg && this.isFollowBoss(bossCfg.bossCode) && !this.isBossCd(bossCfg.bossCode)) {
			let copyCfg:any = ConfigManager.copy.getByPk(bossCfg.copyCode);
			let needNum:number = 1;
			let needGold:number = 500;
			if(copyCfg.propNum > 0) {
				needNum = copyCfg.propNum;
			}
			let shopCfg:any = ConfigManager.shopSell.getByPk(ShopType.SHOP_QUICK + "," + copyCfg.needProp);
			if(shopCfg) {
				needGold = shopCfg.price;
			}
			let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(copyCfg.needProp);
			if((bagCount >= needNum || MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,needGold,false))) {
				return true;
			}
		}

		if(CacheManager.role.role.qiongCangOwnerTimes_BY <= 0) return false;//无归属次数
		bossList = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgQiongCangAttic);
		for(let i:number = 0; i < bossList.length; i++) {
			if(!this.isFollowBoss(bossList[i].bossCode)) continue;//未关注不给红点
			if(this.getBossIsOpened(bossList[i].bossCode) && !this.isBossCd(bossList[i].bossCode)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 判断boss模块是否有红点
	 */
	public checkTips():boolean{
		let flag:boolean = this.isPeronalBossTips();
		if(!flag) {
			flag = this.checkWorldBossTips(CopyEnum.CopyWorldBoss);
		}
		if(!flag) {
			flag = this.checkWorldBossTips(CopyEnum.CopyGodBoss);
		}
		if(!flag){
			flag = this.checkSecretTips();
		}
		if(!flag) {
			flag = this.checkBossHomeTips();
		}
		return flag;
	}

	public clear():void {
		this.bossList = {};
	}
}