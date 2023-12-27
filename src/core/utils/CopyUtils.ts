class CopyUtils {

	/**进副本前需要缩小放大的效果的副本 */
	private static _SCALE_ROLE_COPYS: number[] = [
		CopyEnum.CopyLeader,
		CopyEnum.CopyGhosts,
		CopyEnum.CopyDisorderly
	];
	/**进副本前需要缩小放大的效果的副本地图 */
	private static _SCALE_ROLE_MAPS: number[] = [
		CopyEnum.CopyLeaderMapId,
		CopyEnum.CopyGhostsMapId,
		CopyEnum.CopyDisorderlyMapId
	];

	private static GUILD_COPY: number[] = [
		CopyEnum.CopyLeader,
		CopyEnum.CopyGhosts,
		CopyEnum.CopyDisorderly
	];
	/**捡完掉落才弹结算的副本 */
	private static DELAY_DROP_RESULT:number[] = [
		ECopyType.ECopyMgPersonalBoss,
		ECopyType.ECopyMgSecretBoss,
		ECopyType.ECopyMgDarkSecretBoss,
		ECopyType.ECopyMgQiongCangHall,
		ECopyType.ECopyMgRune,
        ECopyType.ECopyMgParadiesLost,
        ECopyType.ECopyPunchLead,
        ECopyType.ECopyMgHideBoss,
        ECopyType.ECopyMgMaterial
	];

	/**副本内没有搜索到可攻击的怪时，自动回到等待点 */
	private static Copy_Wait_Point: any = {
		[CopyEnum.CopyDefend]: { x: 12, y: 36 },
		[CopyEnum.TimeLimitBoss]: { x: 18, y: 23 }
	};

	private static Copy_search_dis:any = {
		[ECopyType.ECopyMgNormalDefense]: 10,
	};

	/**boss血条需要显示成百分比的副本 */
	private  static pct_boss_cpy:number[] = [
		ECopyType.ECopyMgNewGuildWar,
	];

	/**进入该副本场景不自动挂机的副本类型 */
	private static NOT_AUTO_COPY:number[]=[
		ECopyType.ECopyMgGuildDefense
	];

	/**挂机优先找BOSS攻击的副本 */
	private static COPY_FIND_BOSS: number[] = [CopyEnum.CopyYuQing];

	private static BOSS_HOMES: Array<any>;

	/**关联副本信息 (通过copycode获取需要满星的前一个副本) */
	private static RELATION_COPY_INF: any = {};

	/**守护仙灵所有副本 */
	private static DEFEND_COPYS: any[];
	/**仙帝宝库 副本 */
	private static MONEY_COPYS: any[];
	private static COPYS_MODEL_NAME: string[] = ["简单", "普通", "困难", "噩梦", "地狱", "炼狱", "深渊"];
	private static MODEL_NAME_DICT: any = {};

	public static isScaleRoleCopy(code: number): boolean {
		return CopyUtils._SCALE_ROLE_COPYS.indexOf(code) > -1;
	}

	public static isScaleRoleCopyMap(code: number): boolean {
		return CopyUtils._SCALE_ROLE_MAPS.indexOf(code) > -1;
	}

	public static isInGuildCopy(code: number): boolean {
		return CopyUtils.GUILD_COPY.indexOf(code) > -1;
	}
	private static _expStars:fairygui.GImage[];

	private static _secretBossList:any[];

	/**获取世界boss层数 */
	public static getBossHomeFloor(): Array<any> {
		if (!CopyUtils.BOSS_HOMES) {
			CopyUtils.BOSS_HOMES = [];
			var floorName: string[] = ["一层", "二层", "三层", "四层", "五层"];
			var copys: Array<any> = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgBossHome);

			copys.sort(function (a: any, b: any): number {
				if (a.code < b.code) {
					return -1;
				} else if (a.code > b.code) {
					return 1;
				}
				return 0;
			});

			for (var i: number = 0; i < copys.length; i++) {
				CopyUtils.BOSS_HOMES.push({ copyCode: copys[i].code, floor: floorName[i] })
			}

		}
		return CopyUtils.BOSS_HOMES;
	}

	/**获取九幽通行证的数量 */
	public static getExpCopyItemCount(code: number): number {
		var count: number = 0;
		var item: any = ConfigManager.item.getByPk(code);
		count = CacheManager.pack.backPackCache.getItemCountByCode(CopyEnum.ExpCopyItem);
		item.codeUnbind ? count = CacheManager.pack.backPackCache.getItemCountByCode(item.codeUnbind) : null;
		return count;
	}
	/**
	 * 根据要进入的副本 判断是否能进入
	 */
	public static isCanEnter(enterCopyCode:number,isTips:boolean=true):boolean{
		let flag:boolean = true;
		let tips:string = "";
		let inf:any = ConfigManager.copy.getByPk(enterCopyCode);
		if(CacheManager.copy.isInCopy
			&& !CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)
			&& !CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)
            && !CacheManager.copy.isInCopyByType(ECopyType.ECopyLegend)) {
			flag = false;
			tips = "您已在副本中，不能再开启副本";
			if(inf){
				if(CopyUtils.isBossCopy(inf.copyType)){
					tips = "您已在副本中，无法参与BOSS玩法";
				}else if(CopyUtils.isCheckPoint(inf.copyType)){
					tips = "您已在副本中，无法挑战关卡BOSS";
				}
			}						
		}else if(inf.copyType==ECopyType.ECopyMgNewExperience){
			if(CacheManager.copy.isHasExpReward()){
				flag = false;
				tips = "请先领取上次经验";
			}
		}
		if(isTips&&tips!=""){
			Tip.showTip(tips);
		}
		return flag;
	}
	/**是否默认关注的boss (不在关注列表，刷新自动有提示) */
	public static isDefaultFollow(bossCode:number):boolean{
		let flag:boolean = CopyUtils.isSecretBoss(bossCode);
		return flag;
	}
	/**是否在跨服副本(场景) */
	/*
	public static isInCross():boolean{
		let flag:boolean = false;
		let bc:number = CacheManager.crossBoss.curBossCode; //跨服boss的code
		let copyInf:any = ConfigManager.copy.getByPk(CacheManager.copy.curCopyCode);
        if (copyInf) { //宠物岛
            let localLevel:number = CacheManager.crossBoss.getLocalBossLevel(bc);
			flag = localLevel==0;
		}
		if(!flag){
			flag = CacheManager.copy.isInCopyByType(ECopyType.ECopyCrossTeam) || 
			CacheManager.copy.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder) || 
			CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich) ||
			CacheManager.copy.isInCopyByType(ECopyType.ECopyCrossStair) ||
			CacheManager.copy.isInCopyByType(ECopyType.ECopyPosition);
		}
		return flag;
	}
	*/
	
	public static isInCrossChat():boolean{
		let info:any = CacheManager.copy.getCurCopyInfo();
		return info && info.chatCross;
	}

	public static isSecretBoss(bossCode:number):boolean{
		let flag:boolean = false;
		let mgBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
		if(mgBoss){
			let copyInf:any =  ConfigManager.copy.getByPk(mgBoss.copyCode);
			flag = copyInf.copyType==ECopyType.ECopyMgSecretBoss;
		}		
		return flag;
	}

	/**
	 * 判断副本是否开启 (等级以及上一个的星级)
	 */
	public static isRelateCopyOpen(copyInf: any, recordCode: number): boolean {
		var flag: boolean = CopyUtils.isLvOk(copyInf) && CopyUtils.isPreCopyStarOk(copyInf, recordCode);
		return flag;
	}
	/**获取某个副本的记录信息code */
	public static getRecordCode(copyInf: any): number {
		if (typeof (copyInf) == "number") {
			copyInf = ConfigManager.copy.getByPk(copyInf);
		}
		var ret: number = copyInf.code;
		switch (copyInf.copyType) {
			case ECopyType.ECopyMgRingBoss:
				ret = CopyEnum.CopyMoney;
				break;
			case ECopyType.ECopyMgNormalDefense:
				ret = CopyEnum.CopyDefend;
				break;

		}
		return ret;
	}
	/**
	 * 等级条件是否满足
	 */
	public static isLvOk(copyInf: any): boolean {
		var roleLv: number = CacheManager.role.role.level_I;
		return roleLv >= copyInf.enterMinLevel;
	}
	/**
	 * 上一个副本星级条件是否满足
	 */
	public static isPreCopyStarOk(copyInf: any, recordCode: number): boolean {
		var flag: boolean = true;
		var preInf: any = CopyUtils.getPreCopyInf(copyInf)
		if (preInf) {
			flag = CacheManager.copy.isCopyFullStar(preInf.code, recordCode);
		}
		return flag;
	}

	public static getPreCopyInf(curCopyInf: any): void {
		var preInf: any = CopyUtils.RELATION_COPY_INF[curCopyInf.code];
		return preInf;
	}

	/**获取守护仙灵所有副本 */
	public static getDefendCopys(): any[] {
		if (!CopyUtils.DEFEND_COPYS) {
			var ids: number[] = [1009, 11009, 21009, 31009, 41009, 51009, 61009];
			CopyUtils.DEFEND_COPYS = [];
			CopyUtils.initRlationCopy(CopyUtils.DEFEND_COPYS, ids);
		}
		return CopyUtils.DEFEND_COPYS;
	}

	/**获取仙帝宝库所有副本 */
	public static getMoneyCopys(): any[] {
		if (!CopyUtils.MONEY_COPYS) {
			CopyUtils.MONEY_COPYS = [];
			CopyUtils.initRlationCopy(CopyUtils.MONEY_COPYS, [1008, 11008, 21008, 31008, 41008]);
		}
		return CopyUtils.MONEY_COPYS;
	}

	/**初始化关联副本 */
	private static initRlationCopy(cntArr: any[], ids: number[]): void {
		for (var i: number = 0; i < ids.length; i++) {
			cntArr.push(ConfigManager.copy.getByPk(ids[i]));
			CopyUtils.MODEL_NAME_DICT[ids[i]] = CopyUtils.COPYS_MODEL_NAME[i];
			if (i > 0) {
				CopyUtils.RELATION_COPY_INF[ids[i]] = cntArr[i - 1];
			}
		}
	}
	/**
	 * 获取经验副本奖励列表数据 [{exp:,multiple:}]
	 */
	public static getNewExpCopyExpRewardList(): any[] {
		let data: any[] = [];
		let info:any = CopyUtils.getExpCopyRewardExp(CacheManager.copy.newExpCopyInf);
		let retExp: number = info.totalExp;
		let levelExp:number = info.levelExp;
		if (retExp > 0) {			
			let roleState_I:number = CacheManager.copy.newExpCopyInf.roleState_I;	 
			// let b:boolean = roleState_I>0; //1转前都是只显示1倍
			let fn:number = CacheManager.copy.getFinishNum(CopyEnum.CopyExpNew);//第二次打就可以显示多倍了
			let b:boolean = fn>1; //改成只要是第二次打就显示多倍 2019年1月24日17:07:07
			let count:number = b?3:1;
			for (let i: number = 0; i < count; i++) {
				let multiple: number = i + 1;
				data.push({ exp: retExp * multiple, multiple: multiple,levelExp:levelExp*multiple });
			}
		}
		return data;
	}
	/**
	 * 根据结构体获取经验奖励的经验值和修为值
	 * SNewExperienceCopyInfo
	 */
	public static getExpCopyRewardExp(sData: any): {'totalExp':number,'levelExp':number} {
		let totalExp: number = 0;		
		let levelExp: number = 0;		
		if (sData && sData.createPlayerCheckpoint_I > 0) {
			//createPlayerCheckpoint_I
			totalExp = ConfigManager.expCopy.getCopyExp(sData.createPlayerCheckpoint_I);
			let copyInf:any = ConfigManager.copy.getByPk(sData.copyCode_I);
			let bossNum:number = copyInf.bossNum?copyInf.bossNum:100;
			totalExp = Math.floor(totalExp/bossNum * sData.killBossNum_I);
			levelExp = ConfigManager.expCopy.getCopyLevelExp(sData.createPlayerCheckpoint_I);
			levelExp = Math.floor(levelExp/bossNum * sData.killBossNum_I);

		}
		return {totalExp:totalExp,levelExp:levelExp};
	}


	/**
	 * 获取模式名
	 */
	public static getModelName(copyInf: any): string {
		return CopyUtils.MODEL_NAME_DICT[copyInf.code];
	}

	/**队伍进入副本的判断逻辑 */
	public static teamEnter(copyCode: number): void {
		// if (CacheManager.team.teamMembersId.length > 1) {
			EventManager.dispatch(LocalEventEnum.CopyReqEnter, copyCode);
		// } else {
		// 	Alert.alert(LangCopyHall.L1, () => {
		// 		EventManager.dispatch(LocalEventEnum.CopyReqEnter, copyCode);
		// 	}, this);
		// }
	}

	/**
	 * 获取一个等级点
	 */
	public static getWaitPoint(code: number): any {
		let recordCode:number = CopyUtils.getRecordCode(code);
		return CopyUtils.Copy_Wait_Point[recordCode];
	}

	/**根据副本类型获取挂机距离 */
	public static getSearchDis(copyType:number):number{
		return CopyUtils.Copy_search_dis[copyType];
	}

	/**
	 * 是否是挂机优先选中boss的副本
	 */
	public static isFindBossCopy(code: number): boolean {
		return CopyUtils.COPY_FIND_BOSS.indexOf(code) >= 0;
	}

	public static isCheckPoint(type: number): boolean {
		return type == ECopyType.ECopyCheckPoint;
	}

	public static isBossCopy(type: number):boolean{
		return type == ECopyType.ECopyMgNewWorldBoss;
	}
	
	public static isMaterialRoleState():boolean{
		let roleState:number = CacheManager.role.getRoleState();
		return roleState>=CopyEnum.MATERIAL_ROLE_STATE;
	}
	
	public static isCrossBoss(type: number):boolean{
		return type == ECopyType.ECopyNewCrossBoss;
	}

	public static isLegend(type: number):boolean{
		return type == ECopyType.ECopyLegend;
	}

	public static isCrossTeam(type: number):boolean{
		return type == ECopyType.ECopyCrossTeam;
	}

    public static isPeak(type: number):boolean{
        return type == ECopyType.ECopyMgPeakArena;
    }

    public static isContest(type: number):boolean{
        return type == ECopyType.ECopyContest;
    }

    public static isQualifying(type: number):boolean{
        return type == ECopyType.ECopyQualifying;
    }

	/**是否是在boss血条显示成百分比的副本 */
	public static isPerBossCopy():boolean{
		let flag:boolean = false;
		for(let type of CopyUtils.pct_boss_cpy){
			if(CacheManager.copy.isInCopyByType(type)){
				flag = true;
				break;
			}
		}
		return flag;
	}

	
	/**
	 * 判断某个副本是否可以扫荡
	 */
	public static isCanDelegate(code:number,isShowTips:boolean=true,isRoleState:boolean=false):boolean{
		let flag:boolean = false;
		let copyInf:any = ConfigManager.copy.getByPk(code);
		let deleteInf:any = ConfigManager.mgDelegate.getByPk(code);
		let isPrivilegeCard:boolean = CacheManager.welfare2.isPrivilegeCard;//开通特权月卡可以扫荡
		if(copyInf && deleteInf){
			
			switch(copyInf.copyType){
				case ECopyType.ECopyMgMaterial: //材料副本		
					let todayNum:number = CacheManager.copy.getTodayEnterNum(code);
					let isNotPass:boolean = todayNum==0; 	
					if(isRoleState && isNotPass){ //今天没有打过 转生满足也可以扫荡
						flag = CopyUtils.isMaterialRoleState() || isPrivilegeCard;
					}else{
						if (isPrivilegeCard && isNotPass) {//月卡，今天没有打过 跳过其他判断
							flag = true;
							break;
                        }
						flag = CopyUtils.isDelegateCondition(deleteInf,isShowTips);
						flag = todayNum>0 && flag; //今天打过 表示可以元宝扫荡；有月卡可以直接扫荡，只要有次数就能扫荡(后面加)
					}					
					break;
				case ECopyType.ECopyMgPersonalBoss:					
					let finishNum:number = CacheManager.copy.getFinishNum(code); //已通关
					let roleState:number = CacheManager.role.getRoleState();
					let enterMinRoleState:number = copyInf.enterMinRoleState?copyInf.enterMinRoleState:0;
					let isSate:boolean = roleState>=ConfigManager.const.perBossDlgState && (roleState - enterMinRoleState>=3);					
					flag = finishNum>0 && (isPrivilegeCard || isSate); //已通关 有月卡或转生足够
					break;
				default:
			}
			
		}else if(isShowTips){			
			Tip.showTip("该副本不能扫荡");
		}
		return flag;
	}

	public static isDelegateCondition(deleteInf:any,isShowTips:boolean=true):boolean{
		if(typeof(deleteInf)=="number"){
			deleteInf = ConfigManager.mgDelegate.getByPk(deleteInf);
		}		
		let flag:boolean = false;
		let type:number = ObjectUtil.getConfigVal(deleteInf,"type");

		// let vipLevel:number = ObjectUtil.getConfigVal(deleteInf,"vipLevel");
		let needLevel:number = ObjectUtil.getConfigVal(deleteInf,"needLevel");
		let feeeTime:number = ObjectUtil.getConfigVal(deleteInf,"feeeTime"); //免费扫荡的次数;今天进入次数小于该值 则不需要消耗物品和元宝
		let itemCode:number = ObjectUtil.getConfigVal(deleteInf,"itemCode");
		let itemAmount:number = ObjectUtil.getConfigVal(deleteInf,"itemAmount");
		let needGold:number = ObjectUtil.getConfigVal(deleteInf,"needGold");
		let preCopyCode:number = ObjectUtil.getConfigVal(deleteInf,"preCopyCode");

		// let isVip:boolean = CacheManager.vip.checkVipLevel(vipLevel);
		let isLevel:boolean = CacheManager.role.checkLevel(needLevel);
		let isItem:boolean = CacheManager.pack.backPackCache.getItemCountByCode2(itemCode) >= itemAmount;
		let isGold:boolean;
		if(isShowTips){
			isGold =  MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,needGold,true);
			if(!isGold){
				return false;
			}
		}else{
			isGold =  MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,needGold,false);
		}
		 
		let isPreCopy:boolean = preCopyCode > 0?CacheManager.copy.getFinishNum(preCopyCode) > 0:true;

		let tips:string = "";
		if(!isLevel){
			tips = "你的等级不足";
		}else if(!isItem){
			tips = "你的扫荡卷不足";
		}else if(!isPreCopy){
			tips = "尚未通关前置副本";
		}/*else if(!isVip){
			tips = "你的VIP等级不足";
		}*/
		
		flag = tips=="";

		if(!flag && isShowTips){
			Tip.showTip(tips);
		}

		return flag;
	}

	/**扫荡是否有结算界面的副本 */
	public static isDeleagteResult(copyCode:number):boolean{
		let copyInf:any = ConfigManager.copy.getByPk(copyCode);
		return copyInf.copyType==ECopyType.ECopyMgNormalDefense;
	}

	/**
	 * 是否自动退出倒计时副本
	 */
	public static isAutoLeaveCopy():boolean{
		let flag:boolean = !CacheManager.copy.isInCopyByType(ECopyType.ECopyMgRune);
		return flag;
	}

	/**
	 * 播放领取经验的动画
	 * @param startPoint 起始坐标(全局)
	 * @param endPoint 终点坐标(全局)
	 * @param count 粒子数量
	 * @param duration 每个粒子运动时长(毫秒)
	 * @param perDelay 每个粒子延时系数(毫秒)
	 * @param radius 起始点随机半径
	 * @param parent 父级 
	 * @param isNew 是否每次都创建新的 
	 */
	public static startExpEffect(startPoint:egret.Point,endPoint:egret.Point,count:number=20,duration:number=800,perDelay:number=30,radius:number = 40,parent:fairygui.GComponent=LayerManager.UI_Tips,isNew:Boolean=false):void{
		if(!this._expStars){
			this._expStars = [];
		}
		let that:any = this;
		for(let i:number = 0;i<count;i++){
			let img:fairygui.GImage = this._expStars[i];
			if(!img || isNew){
				img = FuiUtil.createObject(PackNameEnum.Common,"img_expStar").asImage;
				this._expStars[i] = img;
			}			
			let ranPoint:egret.Point = App.MathUtils.getRoundRandPoint(startPoint.x,startPoint.y,radius);
			img.x = ranPoint.x;
			img.y = ranPoint.y;
			let delay:number = perDelay*i;
			let endX:number = App.MathUtils.getRandom(endPoint.x-radius/2,endPoint.x+radius/2);			
			TweenUtils.kill(img);
			App.TimerManager.doDelay(delay,()=>{				
				parent.addChild(img);
				var t:egret.Tween = egret.Tween.get(img);
				t.to({x:endX,y:endPoint.y},duration);		
				t.call(function (argImg:fairygui.GImage):void{					
					if(argImg){
						argImg.removeFromParent();
					}
				},that,[img]);

			},that) //end of doDelay
			
		}
	}
	/**
	 * 获取副本胜利结算出来后需要打开的模块信息
	 */
	public static getSuccessOpenInf(copyCode:number):any{
		let inf:any = null;
		let copyInf:any = ConfigManager.copy.getByPk(copyCode);
		if(copyInf){
			switch(copyInf.copyType){
				case ECopyType.ECopyMgRune:
					inf = {mId:ModuleEnum.CopyHall,args:{tabType:PanelTabType.CopyHallTower}};
					if(CacheManager.towerTurnable.isCanLottry()){
						inf.subMId = ModuleEnum.TowerTurntable;
					}
					break;
				case ECopyType.ECopyMgMaterial:
					inf = {mId:ModuleEnum.CopyHall,args:{tabType:PanelTabType.CopyHallMaterial}};
					break;
				case ECopyType.ECopyMgPersonalBoss:					
					if(CopyEnum.PERSONAL_BOSS_LV20==copyCode){
						let fn:number = CacheManager.copy.getFinishNum(copyCode);
						if(fn==1){ //第一次通关20级个人boss是做任务 不需要打开界面
							return;
						}
					}
					inf = {mId:ModuleEnum.Boss,args:{tabType:PanelTabType.PersonalBoss,isAuto:true}};
					break;
				case ECopyType.ECopyGuildTeam:
					inf = {mId:ModuleEnum.GuildCopy,tabType:PanelTabType.GuildTeam};
					break;
				
			}
		}
		return inf;
	}
	public static isInBossCopy():boolean{
		return CacheManager.copy.isInCopyByType(ECopyType.ECopyMgPersonalBoss) || 
		CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewWorldBoss) || 
		CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSecretBoss);
	}
	public static isInNotOptCopy():boolean{
		return CopyUtils.isInBossCopy() || 
		CacheManager.copy.isInCopyByType(ECopyType.ECopyMgKingStife) || CacheManager.copy.isInCopyByType(ECopyType.ECopyMgRune);
	}

	/**是否在退出不需要弹框提示的副本 */
	public static isInLeftNoTipCopy():boolean{
		return CacheManager.copy.isInCopyByType(ECopyType.ECopyMgPersonalBoss) || 
		CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewWorldBoss) || 
		CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewBossHome) || 
		CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss) ||
		CacheManager.copy.isInCopyByType(ECopyType.ECopyMgSecretBoss);
	}

	/**捡完掉落再弹结算的副本 */
	public static isDelayDropRetCopy(type:number):boolean{
		return CopyUtils.DELAY_DROP_RESULT.indexOf(type)>-1;
	}
	/**是否切换场景不自动挂机的副本 */
	public static isNotAutoCopy(copyType:ECopyType):boolean{
		return CopyUtils.NOT_AUTO_COPY.indexOf(copyType)>-1;
	}

	/**是否是有归属者信息的副本;(副本内有：归属者信息、攻击列表信息、切换攻击对象操作;打完boss后停止挂机、的副本)) */
	public static isOwnerCopy():boolean{
		let cc:CopyCache = CacheManager.copy;
		let flag:boolean = cc.isInCopyByType(ECopyType.ECopyMgNewWorldBoss)
			|| cc.isInCopyByType(ECopyType.ECopyMgSecretBoss)
			|| cc.isInCopyByType(ECopyType.ECopyMgDarkSecretBoss)
			|| cc.isInCopyByType(ECopyType.ECopyMgBossLead)
			|| cc.isInCopyByType(ECopyType.ECopyMgNewBossHome)
			|| cc.isInCopyByType(ECopyType.ECopyMgQiongCangHall)
			|| cc.isInCopyByType(ECopyType.ECopyMgQiongCangAttic)
			|| cc.isInCopyByType(ECopyType.ECopyMgBossIntruder)
			|| cc.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder)
			|| cc.isInCopyByType(ECopyType.ECopyMgWildBossEntranceLead)
			|| cc.isInCopyByType(ECopyType.ECopyNewCrossBoss);
		return flag;
	}

	public static getSecretBossList():any[]{
		if(!CopyUtils._secretBossList || CacheManager.bossNew.isSecret){
			CacheManager.bossNew.isSecret = false;
			let infs:any[] = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgSecretBoss).concat();
			let retInfs:any[] = [];
			//max_role_state
			//筛选符合条件的boss显示,等级和转数,vip限制
			let roleLv:number = CacheManager.role.getRoleLevel();
			let roleState:number = CacheManager.role.getRoleState();
			for(let i:number =0;i<infs.length;i++){				
				if(CacheManager.bossNew.getBossIsOpened(infs[i].bossCode)){
					retInfs.push(infs[i]);
				}
			}	
			CopyUtils._secretBossList = retInfs;
		}
			
		return CopyUtils._secretBossList;
	}

	/**获取我可以挑战的暗之boss */
	public static getDarkSecretBoss():any[]{
		let darkBoss:any[] = ConfigManager.mgGameBoss.getByCopyCode(CopyEnum.DarkSecret).concat();
		for(let i:number = 0;i<darkBoss.length;i++){
			if(!CacheManager.bossNew.getBossIsOpened(darkBoss[i].bossCode)){
				darkBoss.splice(i,1);
				i--;
			}			
		}
		return darkBoss;
	}

	public static getMaterialsCopyUnOpenText(copyInfo:any):string{
        let tipText:string = "";
        let roleLv:number = CacheManager.role.getRoleLevel();
        let roleStatu:number = CacheManager.role.getRoleState();
        let enterMinRoleState:number = ObjectUtil.getConfigVal(copyInfo,"enterMinRoleState",0);
        let enterMinLevel:number = ObjectUtil.getConfigVal(copyInfo,"enterMinLevel",0);
		let isPet:boolean = copyInfo.code==CopyEnum.CopyPet;
		let txt:string = enterMinRoleState>0?enterMinRoleState+"转开启":enterMinLevel+"级开启";
		if(enterMinRoleState>0){
			tipText = roleStatu>=enterMinRoleState?"":txt;
		}else{
			tipText = roleLv>=enterMinLevel?"":txt;
		}        
        return tipText;
    }
	public static isMaterialsCopyOpen(copyInfo:any):boolean{
		let text:string = CopyUtils.getMaterialsCopyUnOpenText(copyInfo);
		return text=="";
	}

	/**根据副本类型获取VIP增加的次数 */
	public static getVipAddNum(copyType:number):number{
		let n:number = 0;
		let vipLv:number = CacheManager.vip.vipLevel;
		let addType:number = CopyUtils.getVipAddType(copyType);
		let info:any = ConfigManager.vip.getVipAddDict(addType);
		if(info && info[vipLv]!=null){
			n = info[vipLv];
		}
		return n;
	}

	/**获取副本结算时间 */
	public static getCopyResultSec(copyInfo:any,isSuccess:boolean):number{
		let field:string = (isSuccess?"sucessLeaveSec":"failLeaveSec");
		let sec:number = ObjectUtil.getConfigVal(copyInfo,field,10);
		return sec;
	}

	public static isGuildDefenderEntity(entityInfo:any):boolean{
		return CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense) && CacheManager.guildDefend.isDefender(entityInfo.code_I)
	}

	public static getVipAddType(copyType:number):number{

		/*
		EVipAddMaterialCopyNum = 118,           //材料副本进入次数加成
		EVipAddNewExperienceCopyNum = 119,      //新经验副本进入次数加成
		EVipAddNewWorldBossCopyNum = 120,       //世界boss进入次数加成
		EVipAddSecretBossCopyNum = 121,         //秘境boss进入次数加成
		*/

		let type:number = 0;
		switch(copyType){
			case ECopyType.ECopyMgMaterial:
				type = EVipAddType.EVipAddMaterialCopyNum;
				break;
			case ECopyType.ECopyMgNewExperience:
				type = EVipAddType.EVipAddNewExperienceCopyNum;
				break;
			case ECopyType.ECopyMgNewWorldBoss:
				type = EVipAddType.EVipAddNewWorldBossCopyNum;
				break;
			case ECopyType.ECopyMgSecretBoss:
				type = EVipAddType.EVipAddSecretBossCopyNum;
				break;
		}
		return type;
	}

    /**
	 * 查找第一个不达标的副本code
     * @param {CopyEnum} eCopy
     * @returns {number}
     */
	public static getFirstStarNoFullCopyCode(eCopy:CopyEnum, eCopyType:ECopyType):number {
        let legendCopy:any = CacheManager.copy.getPlayerCopyInf(eCopy);
        let keys:number[] = legendCopy.starDict.key_I;
        let stars:number[] = legendCopy.starDict.value_I;
        let i;
        for (i=0;i < stars.length;i++) {
        	if (stars[i] < 3) return keys[i];
		}
        let copys:any[] = ConfigManager.copy.getCopysByType(eCopyType);
        if (CopyHallLegendPanel.SHIELD) copys && (copys = copys.slice(0, 4));
		return copys && copys[i] ? copys[i].code : 0;
	}

}