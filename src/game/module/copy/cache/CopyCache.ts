class CopyCache implements ICache {
	public static COPY_MAX_STAR:number = 3;
	/**守护神剑使用技能的cd时间 秒 */
	public static DF_SKILL_CD:number = 20;//
	/**
	 * 需要显示进入下一层倒计时的副本
	 */
	private _NEXT_RING_SHOW_COPIES:number[];

	/**副本倒计时(结束时间点(与引擎时间比较) 毫秒) */
	public copyEndTime: number = 0;
	/**副本开启等待时间(结束时间点(与引擎时间比较) 毫秒) */
	public copyOpenLefTime: number = 0;
	/**副本环数相关信息 { curRing:num(当前环数),ringTime:num(下一步刷新时间),maxRing:num(最大环数) } */
	public copyRingInf: any;
	
	/**副本进度信息 {valueNum:0,valueStrNum:''} */
	public copyProcessInf: any;
	/**九幽副本内的面板信息 SExperienceCopyInfo */
	public expCopyInf:any;

	/**新的经验副本信息 SNewExperienceCopyInfo */
	public newExpCopyInf:any;

	/**当前副本id  0表示不在副本内*/
	public curCopyCode: number = 0;

	/**是否登录就在副本内 */
	public isRePassInCopy:boolean;

	/**
	 * 是否点击退出按钮主动退出副本
	 */
	public isActiveLeft:boolean;
	/**不关闭关闭所有界面标志 */
	public isNotCloseAllFlag: boolean = false;
	/**
	 * 玩家副本信息 (根据 SDictPlayerCopy 构造)
	 */
	private _playerCopiesInf: any;

	private _killBossDetail:any;

	private _isRunTowerReward:boolean = false;

	public isLookupTowerRank:boolean = false;

	private openKeyDict:any;
	/**法宝副本是否有奖励可领取 */
	private _isSpiritReward:boolean;

	private _combo:number = 0;//连斩数

	/**SMgDefenseCopyInfo */
	private _luckUseCount:number = 0;
	private _defendScore:number = 0;
	private _defendRoleBuff:any;
	private _dfSkillCD:any;
	private _dfReliveCD:any;

	private _myHurt:number = 0;
	private _firstHurt:any;
	private _hurtList:any[];

	/**经验副本增加挑战次数的物品信息 */
	private _expCopyAddItemInfo:any;
	
	public enterCopyTime:number = 0;
	public constructor() {
		this.copyProcessInf = { valueNum: 0, valueStrNum: '' };
		this._dfSkillCD = {};
		this._dfReliveCD = {};

		this._NEXT_RING_SHOW_COPIES = []; //在这里添加
		this._defendRoleBuff = {};
		this.openKeyDict = {
			[CopyEnum.CopyDefend]:PanelTabType.CopyDefend
		};
	}

	public isExpHasMutiple():boolean{
		let flag:boolean = false;
		let notice:number = 0;
		if(CacheManager.copy.newExpCopyInf && CacheManager.copy.newExpCopyInf.roleState_I>0){
			let info:any = ConfigManager.expCopy.getByPk(CacheManager.copy.newExpCopyInf.createPlayerLevel_I+","+CacheManager.copy.newExpCopyInf.roleState_I);			
			notice = ObjectUtil.getConfigVal(info,"notice",0);		
			let curCopyInf:any = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgNewExperience)[0];
			let todayNum:number = this.getTodayEnterNum(curCopyInf.code);
			flag = notice==1 && todayNum<1;
		}
		return flag;
	}

	/**判断是否在副本内 */
	public get isInCopy(): boolean {
		return this.curCopyCode > 0;
	}

	/**
	 * 是否在某个副本内
	 * @param code 副本code
	 */
	public isInCopyByCode(code: number): boolean {
		return this.curCopyCode == code;
	}

	public get curCopyType():ECopyType {
        if(this.isInCopy){
            var copyInf:any = ConfigManager.copy.getByPk(this.curCopyCode);
            return copyInf.copyType;
        }
        return null;
	}

	public isInAssitCopy():boolean{
		if(this.isInCopy){
            var copyInf:any = ConfigManager.copy.getByPk(this.curCopyCode);
            return copyInf.isAssist;
        }
		return false;
	}

	/**
	 * 是否在某一类型副本内
	 */
	public isInCopyByType(type:number):boolean{
		if(this.isInCopy){
			var copyInf:any = ConfigManager.copy.getByPk(this.curCopyCode);
			return copyInf.copyType==type;
		}
		return false;
	}

	/**获取当前所在副本的信息 */
	public getCurCopyInfo():any{
		if(this.isInCopy){
			var copyInf:any = ConfigManager.copy.getByPk(this.curCopyCode);
			return copyInf;
		}
		return null;
	}

	public isInOpenCd():boolean{
		let now: number = egret.getTimer();
		return CacheManager.copy.copyOpenLefTime > now;
	}

    /**
     * 是否在副本类型列表内
     */
    public isInCopyList(typeList:Array<ECopyType>):boolean{
        if(this.isInCopy){
            let copyInf:any = ConfigManager.copy.getByPk(this.curCopyCode);
            if(typeList.indexOf(copyInf.copyType) != -1) {
                return true;
            }
        }
        return false;
    }

	/**
	 * 判断当前副本是否需要显示进入下一层的倒计时
	 */
	public isShowRing():boolean{
		var idx:number = -1;
		if(this.isInCopy){
			idx = this._NEXT_RING_SHOW_COPIES.indexOf(this.curCopyCode);
		}
		return idx>-1 || this.isInCopyByType(ECopyType.ECopyMgNormalDefense) || this.isInCopyByType(ECopyType.ECopyMgGuildDefense);//
	}

	/**是否显示第X波怪的歌词秀 */
	public isRingTips():boolean{
		return this.isInCopyByType(ECopyType.ECopyMgGuildDefense);
	}

	public get playerCopiesInf(): any {
		return this._playerCopiesInf;
	}

	
	public get ringEndTime():number{
		if(this.copyRingInf){
			return this.copyRingInf.ringTime;
		}
		return 0;
	}

	/**
	 * 设置守卫神剑副本的积分
	 * @param score 当前总积分
	 * @param isTips 增加积分时 是否弹提示
	 *  */
	public setDefendScore(score:number,isTips:boolean):void{
		if(isTips){
			let add:number = score - this._defendScore;
			if(add>0){
				Tip.showLeftTip(`积分+`+add);
			}
		}
		this._defendScore = score;
	}

	public setDfCopySkillCd(data:any):void{
		this._dfSkillCD[data.skillId] = data; 
	}
	/**守护副本某个技能cd信息 {skillId:valueNum,total:总时间(毫秒),endTime:结束时间戳} */
	public getDfSkillCd(skillId:number):any{
		return this._dfSkillCD[skillId];
	}

	/**设置复活时间 */
	public setDfReliveCd(roleIndex:number):void{
		let cdSec:number = 10;		
		if(roleIndex==-1){ //所有角色死亡
			for(let i:number = 0;i<CacheManager.role.roles.length;i++){
				let role:any = CacheManager.role.roles[i];
				let idx:number = role.index_I?role.index_I:0;
				if(this._dfReliveCD[idx]==null || this._dfReliveCD[idx]==0){
					this._dfReliveCD[idx] = cdSec;
				}				
			}
			
		}else{	
			this._dfReliveCD[roleIndex] = cdSec;
		}		
	}
	/**获取守护神剑复活cd */
	public isDfReliveCd(roleIndex:number):boolean{
		return this._dfReliveCD[roleIndex]!=null && this._dfReliveCD[roleIndex]>0;
	}

	public clearDfRelive(roleIndex:number):void{		
		this._dfReliveCD[roleIndex] = 0;
	}

	public get dfReliveCD():any{
		return this._dfReliveCD;
	}

	public isDfSkillCd(skillId:number):boolean{
		let info:any = this._dfSkillCD[skillId];
		return info && info.endTime > egret.getTimer();
	}

	/**
	 * 守卫神剑副本的积分
	 */
	public get defendScore():number{
		return this._defendScore;
	}

	/**设置的是已经使用的次数 */
	public set luckUseCount(value:number){
		this._luckUseCount = value;
	}

	/**召唤boss的次数 */
	public get luckCount():number{
		let ln:number = 0;
		if(this.copyRingInf){
			let tn:number = 0; //第6 11波各增加一次召唤			
			if(this.copyRingInf.curRing>5 && this.copyRingInf.curRing<=10){
				tn = 1;
			}else if(this.copyRingInf.curRing>10){
				tn = 2;
			}
			ln = tn - this._luckUseCount + 1; //默认有一次
		}		
		ln = Math.max(0,ln);
		ln = Math.min(ln,CopyEnum.DLG_DF_CP); //最大三次
		return ln;
	}

	/**
	 * 获取副本进度值
	 * copyCode
	 */
	public getCopyProcess(copyCode: number): number {
		if (this._playerCopiesInf) {
			let copy:any = this._playerCopiesInf.playerCopys[copyCode];
			return copy ? copy.process_SH : 0;
		}
		return 0;
	}

	/**设置副本的环数信息 SCopyMsgInfo*/
	public setRingInf(data: any): void {

		if(!this.copyRingInf){
			this.copyRingInf = {};
		}
		this.copyRingInf.curRing = data.num1_I;
		this.copyRingInf.maxRing = data.num5_I;		
		if(!this.isInCopyByType(ECopyType.ECopyMgGuildDefense)){ //守护仙盟副本 有独立计算波数倒计时的消息
			var et:number = egret.getTimer() + data.num2_I*1000;
			this.copyRingInf.ringTime = et;
		}
	}

	public setDefendBuff(roleIndex:number,isBuff:boolean):void{
		this._defendRoleBuff[roleIndex] = isBuff;
	}

	public isDefendBuff(roleIndex:number):boolean{
		return this._defendRoleBuff[roleIndex];
	}

	/**设置法宝是否有奖励的状态 */
	public setSpiritReward(sbool:any):void{
		this._isSpiritReward =  sbool.bVal_B;
	}

	/**法宝副本是否有奖励 */
	public get isSpiritReward():boolean{
		return this._isSpiritReward;
	}
	/**法宝副本是否有次数 */
	public isSpiritNumOK():boolean{
		let t:number = this.getEnterLeftNum(CopyEnum.CopySpirit);
		return t > 0; 
	}
	
	/**法宝副本红点 */
	public isSpiritTip():boolean{
		return ControllerManager.sevenDayMagicWeapon.isFused && (this.isSpiritReward || this.isSpiritNumOK());
	}

	public setRuneTowerRewardStatus(value:boolean):void{
		this._isRunTowerReward = value;
	}

	/**
	 * 获取 冷却时间(下一次可以进入的时间戳)
	 */
	public getCopyCdTime(code:number):number{
		var splayerCopy:any = this.getPlayerCopyInf(code);
		return splayerCopy && splayerCopy.cdTime_I?splayerCopy.cdTime_I:0;
	}

	/**金钱剩余鼓舞次数 */
	public get coinInspireNum():number{
		var ret:number = 0;
		if(this.expCopyInf){
			ret = CopyEnum.COPY_INSPIRE_MAX - this.expCopyInf.coinInspireNum_I;
		}
		return ret;
	}

	/**元宝剩余鼓舞次数 */
	public get goldInspireNum():number{
		var ret:number = 0;
		if(this.expCopyInf){
			ret = CopyEnum.COPY_INSPIRE_MAX - this.expCopyInf.goldInspireNum_I;
		}
		return ret;
	}

	/**是否鼓舞过 */
	public isInspired():boolean{
		return this.goldInspireNum>0 || this.coinInspireNum>0;
	}
	/**是否还有鼓舞次数 */
	public isHasInspireTime():boolean{
		return this.coinInspireNum>0 || this.goldInspireNum>0;
	}

	/**
	 * 判断某个副本是否在冷却中
	 */
	public isCopyInCd(code:number):boolean{
		var cdT:number = this.getCopyCdTime(code);
		var svt:number = CacheManager.serverTime.getServerTime();
		return cdT>=svt;
	}

	public getPlayerCopyInf(code):any{
		if(this._playerCopiesInf && this._playerCopiesInf.playerCopys[code]){
			return this._playerCopiesInf.playerCopys[code];
		}
		return null;
	}
	/**
	 * 经验副本是否有经验没领取
	 */
	public isHasExpReward():boolean{
		let totalExp:number = CopyUtils.getExpCopyRewardExp(this.newExpCopyInf).totalExp;
		return totalExp>0;
	}
	/**
	 * 获取副本剩余进入次数
	 * @param copyInf副本code或者副本配置数据
	 */
	public getEnterLeftNum(copyInf:any):number{
		if(typeof(copyInf)=="number"){
			copyInf = ConfigManager.copy.getByPk(copyInf);
		}	
		
		var numByDay: number = this.getCopyNumByDay(copyInf);
		var todayEnterNum: number = this.getTodayEnterNum(copyInf.code);
		var leftNum: number = Math.max(0, (numByDay - todayEnterNum));
		return leftNum;
	}

	/**经验副本是否还有免费次数 */
	public isExpHasFreeTime():boolean{		
		let numByDay: number = this.getCopyNumByDay(CopyEnum.CopyExpNew);
		let todayEnterNum: number = this.getTodayEnterNum(CopyEnum.CopyExpNew);
		return todayEnterNum<numByDay;
	}

	/**
	 * 获取副本每天可以进入的总次数
	 */
	public getCopyNumByDay(copyInf:any):number{
		var code:number = 0;
		if(typeof(copyInf)=="number"){
			copyInf = ConfigManager.copy.getByPk(copyInf);
		}
		code = copyInf.code;
		var splayerCopy: any = CacheManager.copy.getPlayerCopyInf(code);
		var addNum:number = 0;
		if(splayerCopy){
			addNum = splayerCopy.addNum_I;
		}
		var numByDay: number = copyInf.numByDay ? copyInf.numByDay : 0;
		numByDay+=addNum;
		numByDay+=CopyUtils.getVipAddNum(copyInf.copyType);
		if((copyInf.copyType==ECopyType.ECopyMgSpirit || copyInf.copyType==ECopyType.ECopyMgNewExperience) && CacheManager.welfare2.isPrivilegeCard){
			numByDay+=1; //法宝副本/经验副本 月卡+1次
		}
		return numByDay;
	}
	
	/**
	 * 获取副本完成次数
	 */
	public getFinishNum(copyCode:number):number{
		var splayerCopy: any = CacheManager.copy.getPlayerCopyInf(copyCode);
		var finishNum:number = splayerCopy && splayerCopy.finishNum_I?splayerCopy.finishNum_I:0;
		return finishNum;
	}

	public getTodayEnterNum(copyCode:number):number{
		var splayerCopy: any = CacheManager.copy.getPlayerCopyInf(copyCode);
		var todayEnterNum_I:number = splayerCopy && splayerCopy.todayEnterNum_I?splayerCopy.todayEnterNum_I:0;
		return todayEnterNum_I;
	}

	public getEnterNum(copyCode:number):number{
		var splayerCopy: any = CacheManager.copy.getPlayerCopyInf(copyCode);
		var enterNum_I:number = splayerCopy && splayerCopy.enterNum_I?splayerCopy.enterNum_I:0;
		return enterNum_I;
	}

	/***
	 * 根据副本id 判断材料是否可以扫荡
	 * @param copyCode 副本code
	 * @param isCard   是否判断月卡（判断红点时忽略月卡）
	 */
	public isCanDelegate(copyCode:number,isCard:boolean=true):boolean{		
		var flag:boolean = false;		
		let todayNum:number = this.getTodayEnterNum(copyCode);
        let isPrivilegeCard:boolean = CacheManager.welfare2.isPrivilegeCard;//开通特权月卡可以扫荡
		flag = todayNum>0 || (isCard && isPrivilegeCard); //今天打过 表示可以元宝扫荡；有月卡可以直接扫荡，只要有次数就能扫荡		
		return flag;
	}

	/**材料副本是否有免费次数 */
	public isMatCopyFreeTimes():boolean{
		let copyInfos:any[] = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgMaterial);
		let b:boolean = false;
		for(let info of copyInfos){
			let text:string = CopyUtils.getMaterialsCopyUnOpenText(info);
			let todayNum:number = this.getTodayEnterNum(info.code);
			b = todayNum==0 && text=="";
			if(b){
				break;
			}
		}
		return b; 
	}

	/**判断守护神剑副本是否可扫荡 */
	public isDefendDlg():boolean{
		let flag:boolean = false;
		let fn:number = this.getFinishNum(CopyEnum.CopyDefend); //完成次数;
		let ln:number = this.getEnterLeftNum(CopyEnum.CopyDefend);
		let roleState:number = CacheManager.role.getRoleState();
		flag = roleState>=9 && fn>0 && ln>0; 
		return flag;
	}

	/**
	 * 是否还有可进入次数
	 * @param copyInf 副本code或者副本配置数据
	 */
	public isEnterNumOk(copyInf:any):boolean{
		var code:number = 0;
		if(typeof(copyInf)=="number"){
			code = copyInf;
		}else{
			code = copyInf.code;
		}
		var flag:boolean = false;
		var key:string = this.openKeyDict[code];
		var isCopyOpen:boolean = key?ConfigManager.mgOpen.isOpenedByKey(key,false):true;
		if(isCopyOpen){
			var leftNum:number = this.getEnterLeftNum(copyInf);
			flag = leftNum>0;
		}		
		return flag;
	}

	/**
	 * 判断购买副本次数是否达到上限
	 */
	public isAddNumLimit(code:number):boolean{
		var flag:boolean = false;
		var splayerCopy:any = this.getPlayerCopyInf(code);
		if(splayerCopy){
			flag = splayerCopy.addNumByVip_I >= ConfigManager.copyAddNum.getCanAddNum(code);
		}
		return flag;
	}

	/**设置副本击杀信息 */
	public setKillBossDetail(data:any):void{
		if(data){
			if(!this._killBossDetail){ //在一个副本内 只实例化一个
				this._killBossDetail = {};
			}			
			ObjectUtil.dictToJsObj(data,this._killBossDetail,"value_I");
		}else{
			this._killBossDetail = null;
		}
		
	}
	/**获取副本击杀信息 */
	public getKillBossDetail(index:number):number{
		if(this._killBossDetail && this._killBossDetail[index]){
			return this._killBossDetail[index];
		}
		return 0;
	}	

	/**
	 * 更新用户副本信息
	 * @params SDictPlayerCopy
	 */
	public setCopiesInf(infMsg: any,isUpdate:boolean):void {
		let preCheckPointProcess: number = this.getCopyProcess(CopyEnum.CopyCheckPoint);//上次关卡数
		if (!this._playerCopiesInf) {
			this._playerCopiesInf = {};
			this._playerCopiesInf.copyMarks = {};
			this._playerCopiesInf.getRewardIds = {};
			this._playerCopiesInf.playerCopys = {};		// SPlayerCopy,并非每个副本都有独立的记录 很多同类型副本是共享记录的
		}
		this._playerCopiesInf.assistCount_I = infMsg.assistCount_I;
		let checkBossTips:boolean = false; //是否需要检查boss的红点
		let checkTrainTips:boolean = false; //是否需要检查历练的红点
		let updateTypeDic:any = {};
		if(isUpdate){
			var obj:any = {copyMarks:{},playerCopys:{}};
			ObjectUtil.dictToJsObj(infMsg.copyMarks, obj.copyMarks,"value");		
			ObjectUtil.dictToJsObj(infMsg.playerCopys, obj.playerCopys,"value");
			ObjectUtil.copyProToRef(obj.copyMarks,this._playerCopiesInf.copyMarks);

			updateTypeDic.all = false;

			//更新 playerCopys 数组只有一个元素
			let isMsg:boolean = false;
			let godWPPieceInfo:any;
			for(var key in obj.playerCopys){
				var oldCopy:any = this.getPlayerCopyInf(Number(key));
				if(oldCopy && obj.playerCopys[key].addNumByVip_I > oldCopy.addNumByVip_I && !isMsg){ //由于购买副本次数更新
					Tip.showTip(LangCopyHall.L5);					
					isMsg = true;
				}
				let copyInf:any = ConfigManager.copy.getByPk(obj.playerCopys[key].copyCode_I);
				if(copyInf) {
					updateTypeDic[copyInf.copyType] = true;
				}

				if(copyInf && this.isBossTipCopyType(copyInf) && !checkBossTips){
					checkBossTips = true;
				}

				//第一次打完20级个人boss飘提示
				/*
				if(copyInf && copyInf.copyType==ECopyType.ECopyMgPersonalBoss && copyInf.code==CopyEnum.PERSONAL_BOSS_LV20 && obj.playerCopys[key].finishNum_I==1){					
					EventManager.dispatch(LocalEventEnum.ShowBroadStory,{msg:LangCopyHall.L22,isFirst:true});
				}
				*/
				
				if(copyInf && copyInf.copyType==ECopyType.ECopyCheckPoint && !checkTrainTips){
					checkTrainTips = true;
					let oldProcess:number = this.getCopyProcess(obj.playerCopys[key].copyCode_I);
					if(obj.playerCopys[key].process_SH!=oldProcess){
						godWPPieceInfo = ConfigManager.godWeapon.getByCheckPoint(obj.playerCopys[key].process_SH);
					}		
				}
				this._playerCopiesInf.playerCopys[key] = obj.playerCopys[key];
			}
			//ObjectUtil.copyProToRef(obj.playerCopys,this._playerCopiesInf.playerCopys);
			if(godWPPieceInfo){ //通关关卡后判断是否有激活碎片
				let url:string = ConfigManager.godWeapon.getPieceUrl(godWPPieceInfo);
				EventManager.dispatch(LocalEventEnum.HomeShowReceiveIcoEff,url,godWPPieceInfo.pieceName);
				EventManager.dispatch(LocalEventEnum.PackGetItemTip,{item:godWPPieceInfo,isPiece:true});
			}
		}else{	
			updateTypeDic.all = true;

			ObjectUtil.dictToJsObj(infMsg.copyMarks, this._playerCopiesInf.copyMarks,"value");		
			ObjectUtil.dictToJsObj(infMsg.playerCopys, this._playerCopiesInf.playerCopys,"value");
		}
		// let bossCopyIndex:number = infMsg.playerCopys.key_I.indexOf(CopyEnum.CopyWorldBoss);
		// if(bossCopyIndex != -1) {
		// 	//野外boss更新时间
		// 	this._playerCopiesInf.playerCopys[CopyEnum.CopyWorldBoss].updateTime = egret.getTimer();
		// }
		let updateTime:number = egret.getTimer();
		for(let i:number = 0; i < infMsg.playerCopys.key_I.length; i++) {
			let code:number = infMsg.playerCopys.key_I[i];
			if(!this._playerCopiesInf.playerCopys[code]) continue;
			this._playerCopiesInf.playerCopys[code].updateTime = updateTime;
		}
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.CopyHall,this.checkTips());
		if(checkBossTips){
			EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Boss,CacheManager.bossNew.checkTips());
		}
		
		//更新关卡相关数据
		if(!isUpdate || checkTrainTips){
			CacheManager.checkPoint.updateCheckPointData();
			EventManager.dispatch(LocalEventEnum.CheckPointUpdate);
			EventManager.dispatch(LocalEventEnum.HomeSetTrainRedTip, CacheManager.train.checkTips());
		}
		if(updateTypeDic.all || updateTypeDic[ECopyType.ECopyMgQiongCangDreamland]){
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
		}
		EventManager.dispatch(LocalEventEnum.PlayerCopyInfoUpdate, updateTypeDic);

		if(updateTypeDic[ECopyType.ECopyCheckPoint]){ //关卡更新
			let checkPointProcess: number = this.getCopyProcess(CopyEnum.CopyCheckPoint);//上次关卡数
			if (checkPointProcess != preCheckPointProcess) {//关卡数改变了
				EventManager.dispatch(LocalEventEnum.PlayerCopyCheckPoint);
			}
		}

	}

	private isBossTipCopyType(copyInf:any):boolean{
		return copyInf.copyType==ECopyType.ECopyMgPersonalBoss  || copyInf.copyType==ECopyType.ECopyMgSecretBoss;
	}


	/**判断某个副本是否满星挑战了 */
	public isCopyFullStar(code:number,recordCode:number):boolean{
		var max:number = CopyCache.COPY_MAX_STAR;
		var star:number = this.getCopyStar(recordCode,code);
		return star==max;
	}

	/**
	 * 获取某个副本的挑战星级
	 */
	public getCopyStar(recordCode:number,code:number):number{
		var sPlayerCopy:any = this.getPlayerCopyInf(recordCode);
		var starDict:any = ObjectUtil.dictToJsObj(sPlayerCopy.starDict);
		var star:number = starDict[code]?starDict[code]:0;
		return 	star;
	}
	/**
	 * 副本购买次数详情
	 * {addNum:总购买次数,addNumByVip:vip购买次数}
	 */
	public getAddNumInf(code:number):any{
		var ret:any = {addNum:0,addNumByVip:0};
		var sp:any = this.getPlayerCopyInf(code);
		if(sp){
			ret.addNum = sp.addNum_I;
			ret.addNumByVip = sp.addNumByVip_I;
		}
		return ret;
	}

	/**
	 * 经验副本增加次数道具
	 */
	public getExpCopyAddItemInfo():any{
		if(!this._expCopyAddItemInfo){
			let addCopyItems:any[] = ConfigManager.item.selectByCT(ECategory.ECategoryProp,EProp.EPropAddCopyNum);
			for(let inf of addCopyItems){
				if(inf.effect && inf.effect ==ECopyType.ECopyMgNewExperience){
					this._expCopyAddItemInfo = inf;
					break;
				}
			}
		}
		return this._expCopyAddItemInfo;
	}

	/**
	 * 检查副本是否需要tips
	 */
	public checkTips():boolean{
		return this.checkExpCopyTips()
			|| this.checkMaterialsCopyTips()
			|| this.checkTowerTips()
			|| this.checkDefendTips()
			|| CacheManager.team2.checkTips()
			/*|| this.checkLegendCopyTips()*/;
	}
	/**
	 * 材料副本是否有红点提示
	 */
	public checkMaterialsCopyTips():boolean{
		let flag:boolean = false;
		let leftNum:number;
		if(ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CopyHallMaterial],false)){
			let copyInfos:any[] = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgMaterial);
			for(let info of copyInfos){
				if(info && CopyUtils.isMaterialsCopyOpen(info)){
					leftNum = this.getEnterLeftNum(info.code);
					if(leftNum <= 0) { //有红点的前提是有次数
						continue;
					}					
					if(this.isMaterialsCopyTipLevel) {//70级以前可挑战就显示红点	
						let cost: number = 0;
						cost = ConfigManager.mgDelegate.getCostGold(info.code);		
						if (MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, cost, false)) {
							flag = true;
							break;
						}
					} else {
						let isOk:boolean = this.isCanDelegate(info.code,false);
						if(!isOk){
							flag = true;
							break;
						}
					}
				}
			}
		}		
		return flag;
	}

	public checkExpCopyTips():boolean{
		let flag:boolean = false;
		if(ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CopyHallDaily],false)){
			let expCopy:any = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgNewExperience)[0];
			flag = this.isEnterNumOk(expCopy);
		}
		return flag;
	}	

	public checkDefendTips():boolean{
		let flag:boolean = false;
		if(ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CopyDefend],false)){
			let n:number = this.getEnterLeftNum(CopyEnum.CopyDefend);
			flag = n>0; 
		}
		return flag;
	}

	public checkTowerTips():boolean{
		let flag:boolean = this._isRunTowerReward || CacheManager.towerTurnable.isCanLottry(); 
		return flag;
	}

	public checkLegendCopyTips():boolean{
		let flag:boolean = false;
        if(ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CopyHallLegend],false)) {
            flag = CopyUtils.getFirstStarNoFullCopyCode(CopyEnum.CopyLegend, ECopyType.ECopyLegend) > 0;
        }
		return flag;
	}
	public get isRunTowerReward():boolean{
		return this._isRunTowerReward;
	}

	public isCopysCanEnter(codes:number[]):boolean{
		var isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.CopyHall,false);
		var flag:boolean = false;
		if(isOpen){					
			for(let code of codes){
				if(this.isEnterNumOk(code)){
					flag = true;
					break;
				}
			}
		}	
		return flag;
	}

	/**是否为材料副本按可挑战次数显示红点的等级 */
	public get isMaterialsCopyTipLevel(): boolean {
		return CacheManager.role.getRoleLevel() <= 70;
	}

	/**
	 * 更新副本中伤害排名
	 */
	public updateHurtList(hurtList:any[]):void {
		this._hurtList = hurtList;
		if(!this._hurtList || this._hurtList.length == 0) {
			this._firstHurt = null;
			return;
		}
		this._firstHurt = this._hurtList.shift();
		// EventManager.dispatch(NetEventEnum.CopyHurtListUpdate);
	}

	public get hurtList():any {
		return this._hurtList;
	}

	/**
	 * 伤害排名第一数据
	 */
	public get firstHurt():any {
		return this._firstHurt;
	}

	public set myHurt(value:number) {
		this._myHurt = value;
	}

	public get myHurt():number {
		return this._myHurt;
	}

	public set combo(value:number) {
		if(this._combo == value) return;
		this._combo = value;
		if(!value) {
			return;
		}
		EventManager.dispatch(LocalEventEnum.ComboViewUpdate);
	}

	public get combo():number {
		return this._combo;
	}

    /**
     * 是否吸附拾取所有物品
     */
	public get isPickupAll(): boolean {
        if(this.isInCopy) {
            let copyInfo:any = ConfigManager.copy.getByPk(this.curCopyCode);
            if(copyInfo.singlePickup == 1) {
                return false;
            }
        }
        return true;
    }

	/**
	 * 是否在进入副本时关闭所有界面
	 */
	public get isCloseAllOnEnterCopy(): boolean {
		if(this.isInCopyByType(ECopyType.ECopyMgRune) ||this.isInCopyByType(ECopyType.ECopyCheckPoint) || this.isNotCloseAllFlag) {//诛仙塔或外部标志
			this.isNotCloseAllFlag = false;
			return false;
		}
		return true;
	}

	/**
	 * 检测是否能进入副本，只用于当前在副本中的拦截判断
	 */
	public checkCanEnterCopy(isNeedTip: boolean = true, tip: string = "已经在副本中"): boolean {
		if(this.isInCopy) {
			if(this.isInCopyByType(ECopyType.ECopyCheckPoint) || this.isInCopyByType(ECopyType.ECopyEncounter)) {
				return true;
			}
			if(isNeedTip) {
				Tip.showLeftTip(tip);
			}
			return false;
		}
		return true;
	}

	//获取进入跨服组队选中的副本code
	public getTeamCopyToSelect(copy : number = 0) : number{
		var info = this.getPlayerCopyInf(CopyEnum.CopyCrossTeam);
		if(!info) {
			return 0;
		}
		var copys = ConfigManager.copy.getCrossTeamCopyList();
		for(let i=0; i < copys.length; i++) {
			if(!this.canCopy(copys[i])) {
				if(i==0) {
					return i;
				}
				else {
					return i - 1;
				}
			}
			else 
			{		
					if(copy) {
						if(copy == copys[i].code) {
							return i;
						}
					}
					if (info) {
						var hasS = false;
            			if (info.starDict && info.starDict.key_I) {
							let copyCode:number;
                			for (let j = 0; j < info.starDict.key_I.length; j++) {
                    			copyCode = info.starDict.key_I[j];
                    			if (copyCode == copys[i].code && info.starDict.value_I[j] == 3) {
									hasS = true;
									break;
								}
							}
							if(!hasS) {
								return i;
							}
						}
					}
				
			}
		}
		return copys.length - 1;
	}

	public clear():void {
		Log.trace(Log.UI,"副本清理");
		if(this.isInCopy) {
			EventManager.dispatch(LocalEventEnum.CloseCopyView);
		}
		this.curCopyCode = 0;
	}


	private canCopy(copy:any):boolean {
        let roleLevel:number = CacheManager.role.getRoleLevel();
        let roleState:number = CacheManager.role.getRoleState();
        if (copy.enterMinRoleState ) {
            if (copy.enterMinRoleState <= roleState) return true;
        } else if (copy.enterMinLevel <= roleLevel) {
            return true;
        }
        return false;
    }
}