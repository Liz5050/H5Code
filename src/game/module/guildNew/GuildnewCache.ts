/**
 * 模块数据缓存
 * @author zhh
 * @time 2018-07-16 21:51:45
 */
class GuildnewCache implements ICache
{   
	/**仙盟公告长度 */
	public static NOTICE_LEN:number = 200;
  	/**
	 * 已发布通知次数
	 */
	public noticeNum: number = 0;
	/**人物基础属性，仙盟心法显示的 */
	public roleBaseAttrDict: any;

	/**
	 * 我的仙盟信息
	 */
	private _playerGuildInfo: any;
	/**SGuildInfo */
	private _guildInfo: any;
	/**SVeinInfo */
	private _vienInfo: any;
	private _vienLevelDict: any;

	/**已经申请的仙盟id */
	private _aplyJoinList:number[];

	/**仙盟日志 [SGuildLog] */
	private _guildLogs:any[];
	/**仙盟申请的人数 */
	private _guildApplyNum:number = 0;

	private _isCheckOpenRedTip:boolean = false;
	/**是否需要仙盟开启提示 */
	private _isNeedOpenRedTip:boolean = false;
	private _isOpenRedTip:boolean = false;

	/**
	 * 仓库物品
	 */
	private _warehouseItems: Array<ItemData> = [];
	private _allocateInfo:{[uid:string]:any[]} = {};//分配数据
	public allocateUid:string;//当前操作分配的uid

	/**
	 * 仙盟积分兑换仓库
	 */
	private _scoreWarehouse:ItemData[] = [];
	private _recordInfos:any[];//积分仓库操作记录
	public constructor() {
		this._vienLevelDict = {};
		this._guildLogs = [];
	}

	public set playerGuildInfo(playerGuildInfo: any) {
		this._playerGuildInfo = playerGuildInfo;
		if(!this._isCheckOpenRedTip){
			this._isCheckOpenRedTip = true;
			//登录时 没有加入仙盟;需要检查红点和特效
			this._isNeedOpenRedTip = !this.isJoinedGuild();
		}
	}
	/**玩家仙盟信息 SPlayerGuildInfo */
	public get playerGuildInfo(): any {
		return this._playerGuildInfo;
	}
	/**SGuildInfo */
	public set guildInfo(guildInfo: any) {
		this._guildInfo = guildInfo;		
	}
	/**
	 * 根据货币类型 获取玩家已经捐献的次数
	 */
	public getDonateTimes(unit:EPriceUnit):number{
		let t:number = 0;
		if(this._playerGuildInfo){
			if(unit==EPriceUnit.EPriceUnitCoinBind){
				t = this._playerGuildInfo.donateTimes_SH;
			}else if(unit==EPriceUnit.EPriceUnitGold){
				t = this._playerGuildInfo.donateGoldTimes_SH;
			}
		}
		return t;
	}

	public get guildInfo(): any {
		return this._guildInfo;
	}

	public getNotice():string{
		let notice:string = "";
		if(this.guildInfo){
			notice = (this.guildInfo.purpose_S as string).replace(/\\n/gi, "\n"); 
		}
		return notice;
	}
	public get isNeedOpenRedTip():boolean{
		return this._isNeedOpenRedTip;
	}
	public set isNeedOpenRedTip(value:boolean){
		this._isNeedOpenRedTip = value;
	}
	public setOpenRedTip(value:boolean,isEvent:boolean):void{
		this._isOpenRedTip = value;
		if(isEvent){
			//iconId: number, showTips: boolean
			EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.GuildNew,this.checkTips()); //设置红点
			EventManager.dispatch(LocalEventEnum.HomeIconUpdateEffect,IconResId.GuildNew,this._isOpenRedTip); //设置特效
		}
	}

	public isJoinedGuild(): boolean {
		return this.playerGuildInfo != null && this.playerGuildInfo.guildId_I != 0;
	}
	
	public isMyGuild(guildId:number):boolean{
		return this._playerGuildInfo && this.isJoinedGuild() && this._playerGuildInfo.guildId_I==guildId;
	}

	public setGuildApplyNum(value:number){
		this._guildApplyNum = value;
	}

	public checkTips():boolean{
		return this.checkGuildLobbyTip() || CacheManager.guildActivity.isActivityRedTip || this._isOpenRedTip || CacheManager.guildBattle.checkTips() || CacheManager.guildCopy.checkTips() || this.showRewardAllot;
	}

	public checkApplyTip():boolean{
		return this._guildApplyNum>0;
	}

	public checkGuildLobbyTip():boolean {
		return this.checkApplyTip() || this.checkCanDonateCoin();
	}

	public checkCanDonateCoin():boolean {
		let donateCfg:any = ConfigManager.guildDonate.getDonateCfgByType(1);
		let curTime:number = this.getDonateTimes(donateCfg.costUnit);
		let money:number = CacheManager.role.money.coinBind_L64;
		return curTime < donateCfg.donateTimes && money >= donateCfg.costNum;
	}

	/**
	 * 是否为盟主
	 */
	public get isLeader(): boolean {
		return this.position == EGuildPosition.EGuildLeader;
	}

	/**
	 * 检测玩家是否是盟主
	 */
	public checkIsLeader(entityId:any):boolean {
		if(!entityId) return false;
		return entityId.id_I == this._playerGuildInfo.leaderId_I;
	}

	/**我的职位 */
	public get position(): EGuildPosition {
		let position: EGuildPosition = EGuildPosition.EGuildNotMember;
		if (this.isJoinedGuild()) {
			position = this.playerGuildInfo.position_BY;
		}
		return position;
	}

	/**
	 * 是否可以升级仙盟
	 */
	public get isCanLevelUp(): boolean {
		return this.position >= EGuildPosition.EGuildDeputyLeader;
	}

	/**
	 * 副盟主以上可以处理申请
	 */
	public get isCanDealApply(): boolean {
		return this.position > EGuildPosition.EGuildPresbyter;
	}
	/**添加一个申请id */
	public addAplyJoinId(guildId:number):void{
		if(!this._aplyJoinList){
			this._aplyJoinList = [];
		}
		this._aplyJoinList.push(guildId);
	}
	/**清空所有申请过的列表 */
	public clearAplyJoin():void{
		this._aplyJoinList = null;
	}
	/**是否已经申请 */
	public isAplyJoin(guildId:number):boolean{
		let b:boolean = false;
		this._aplyJoinList? b = this._aplyJoinList.indexOf(guildId)>-1:null;
		return b;
	}

	/**
	 * 副盟主以上可以修改公告
	 */
	public get isCanEditNotice(): boolean {
		return this.position >= EGuildPosition.EGuildDeputyLeader;
	}

	/**
	 * 长老以上可以踢人
	 */
	public get isCanKickOut(): boolean {
		return this.position >= EGuildPosition.EGuildPresbyter;
	}

	/**
	 * 是否可以管理仓库
	 */
	public get isCanManageWarehouse(): boolean {
		return this.position >= EGuildPosition.EGuildDeputyLeader;
	}

	public setGuildLog(data:any[]):void{
		this._guildLogs = data;
	}
	public appendLog(data:any):void{
		this._guildLogs.push(data);
	}
	public get guildLogs():any[]{
		
		return this._guildLogs;
	}

	public getPosName(position: EGuildPosition):string {
		if (position == EGuildPosition.EGuildLeader) {
			return "盟主";
		} else if (position == EGuildPosition.EGuildDeputyLeader) {
			return "副盟主";
		} else if (position == EGuildPosition.EGuildPresbyter) {
			return "长老";
		}
		return "成员";
	}

	public getOptInfo(myPosition:EGuildPosition,tarPos:EGuildPosition):any{
		let info:any;
		if(myPosition==tarPos){
			return null;
		}
		if (myPosition == EGuildPosition.EGuildLeader) {
			info = {};
			if(tarPos==EGuildPosition.EGuildDeputyLeader){
				info.lbl1 = "禅 让";
				info.lbl2 = "降 职";
				info.opt1 = EGuildPosition.EGuildLeader;
				info.opt2 = EGuildPosition.EGuildMember;
			}else{
				info.lbl1 = "提 升";
				info.lbl2 = "踢 出";
				info.opt1 = EGuildPosition.EGuildDeputyLeader;
				info.opt2 = EGuildPosition.EGuildNotMember;
			}
		} else if (myPosition == EGuildPosition.EGuildDeputyLeader) {
			info = {};
			if(tarPos==EGuildPosition.EGuildLeader){
				info.lbl1 = "";
				info.lbl2 = "";
			}else{
				info.lbl1 = "踢 出"; //副盟主看到踢出 副盟主不能禅让 只有踢出
				info.lbl2 = "";
				info.opt1 = EGuildPosition.EGuildNotMember;
			}
		} else if (myPosition == EGuildPosition.EGuildPresbyter) { //没有长老

		}
		return info;
	}

	/**
	 * 获取成员操作列表
	 * @param toGuildPlayer SGuildPlayer
	 */
	public getMemberOptList(toGuildPlayer: any): Array<any> {
		let opts: Array<ToolTipOptEnum> = [];
		if (!CacheManager.role.isMyself(toGuildPlayer.miniPlayer.entityId)) {
			let toPosition: EGuildPosition = toGuildPlayer.position_I;
			if (this.isCanKickOut && this.position > toPosition) {
				opts.push(ToolTipOptEnum.GuildKickOut);
			}

			if (this.isLeader) {//自己为盟主
				if (toPosition == EGuildPosition.EGuildDeputyLeader) {//副盟主
					opts.push(ToolTipOptEnum.GuildTransferLeader);
					opts.push(ToolTipOptEnum.GuildRelieveDeputyLeader);
				} else if (toPosition == EGuildPosition.EGuildPresbyter) {//长老
					opts.push(ToolTipOptEnum.GuildPromoteDeputyLeader);
					opts.push(ToolTipOptEnum.GuildRelievePresbyter);
				} else if (toPosition == EGuildPosition.EGuildMember) {//成员
					opts.push(ToolTipOptEnum.GuildPromoteDeputyLeader);
					// opts.push(ToolTipOptEnum.GuildPromotePresbyter);//长老职业已经取消了
				}
			}

			//都有的。TODO 好友、队伍
			opts.push(ToolTipOptEnum.ViewPlayerInfo);
			opts.push(ToolTipOptEnum.SendFlower);
			opts.push(ToolTipOptEnum.ChatStart);

			let isMyFriend: boolean = true;
			let isHadGroup: boolean = true;

			if (isMyFriend) {
				opts.push(ToolTipOptEnum.FriendDel);
			} else {
				opts.push(ToolTipOptEnum.FriendAdd);
			}

			if (isHadGroup) {
				opts.push(ToolTipOptEnum.GroupInvite);
			} else {
				opts.push(ToolTipOptEnum.GroupApply);
			}

			if (isMyFriend) {
				opts.push(ToolTipOptEnum.FriendBlack);
			}

		}

		let optDatas: Array<any> = [];
		for (let opt of opts) {
			optDatas.push({ "type": opt, "data": toGuildPlayer });
		}
		return optDatas;
	}

	/**
	 * 仙盟心法信息
	 */
	public set vienInfo(vienInfo: any) {
		this._vienInfo = vienInfo;
		for (let i in vienInfo.attrLevelDict.key_I) {
			this._vienLevelDict[vienInfo.attrLevelDict.key_I[i]] = vienInfo.attrLevelDict.value_I[i];
		}
	}

	/**
	 * 仙盟心法等级更新
	 * @param SDictIntInt
	 */
	public set vienNew(data: any) {
		for (let i in data.intIntDict.key_I) {
			this._vienLevelDict[data.intIntDict.key_I[i]] = data.intIntDict.value_I[i];
		}
	}

	/**
	 * 获取心法等级
	 * @param attrType属性类型
	 */
	public getVienLevel(attrType: number): number {
		let level: number = 0;
		if (this._vienLevelDict[attrType] != null) {
			level = this._vienLevelDict[attrType];
		}
		return level;
	}


	/**
	 * 仙盟是否需要红点提示
	 */
	public get isNeedNotice(): boolean {
		return !this.isJoinedGuild() || this.playerGuildInfo.hasDailyReward_B || this.isCanLevelUpVien;
	}

	/**
	 * 是否可以升级心法
	 */
	public get isCanLevelUpVien(): boolean {
		if (this.isJoinedGuild()) {
			let veines: Array<any> = ConfigManager.guildVein.getVeines();
			let attrType: number;
			let level: number;
			let cfg: any;
			for (let v of veines) {
				attrType = v.attrType;
				level = this.getVienLevel(attrType);
				cfg = ConfigManager.guildVein.getByPKParams(attrType, level)
				if (this.playerGuildInfo.contribution_I >= cfg.costContribution) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 更新仓库物品
	 * @param isAdd true增加， false删除
	 * @param isInit true初始化
	 */
	public updateWarehouseItems(sPlayerItems: Array<any>, isAdd: boolean, isInit: boolean = false): void {
		if (isInit) {
			this._warehouseItems = [];
			for (let i: number = 0; i < sPlayerItems.length; i++) {
				this._warehouseItems[i] = new ItemData(sPlayerItems[i]);
			}
		} else {
			let index: number;
			for (let item of sPlayerItems) {
				if (isAdd) {
					this._warehouseItems.push(new ItemData(item));
				} else {
					index = this.getWatehouseItemIndex(item);
					if (index != -1) {
						this._warehouseItems.splice(index, 1);
					}
				}
			}
		}
		//按照code由小到大排序，仓库是存在位置数据，以后如果和服务端交互有用到位置索引，这里不能由客户端来排序
		this._warehouseItems.sort(function(value1:ItemData,value2:ItemData):number{
			return value1.getCode() - value2.getCode();
		})
		EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.GuildNew, CacheManager.guildNew.checkTips());
	}

	/**
	 *	更新积分仓库物品
	 */
	public updateScoreWarehouseItems(sPlayerItems: Array<any>, isAdd: boolean, isInit: boolean = false):void {
		if (isInit) {
			this._scoreWarehouse = [];
			for (let i: number = 0; i < sPlayerItems.length; i++) {
				this._scoreWarehouse[i] = new ItemData(sPlayerItems[i]);
			}
		} else {
			let index: number;
			for (let item of sPlayerItems) {
				if (isAdd) {
					this._scoreWarehouse.push(new ItemData(item));
				} else {
					index = this.getScoreWarehouseItemIndex(item);
					if (index != -1) {
						this._scoreWarehouse.splice(index, 1);
					}
				}
			}
		}
		EventManager.dispatch(NetEventEnum.GuildScoreWarehouseItemUpdate);
	}

	public updateScoreWarehouseItem(sPlayerItems: Array<any>):void {
		if(!sPlayerItems || !sPlayerItems.length) return;
		let index:number = this.getScoreWarehouseItemIndex(sPlayerItems[0]);
		if (index != -1) {
			this._scoreWarehouse[index] = new ItemData(sPlayerItems[0]);
			EventManager.dispatch(NetEventEnum.GuildScoreWarehouseItemUpdate);
		}
	}

	/**
	 * 操作记录更新
	 */
	public updateScoreWarehouseRecord(records:any[],isAdd:boolean = false):void {
		if(isAdd) {
			if(!this._recordInfos) {
				this._recordInfos = [];
			}
			this._recordInfos.unshift(records[0]);
		}
		else {
			this._recordInfos = records;
		}
		EventManager.dispatch(NetEventEnum.GuildScoreWarehouseRecordUpdate);
	}

	/**
	 * 获取仓库物品所在序号
	 */
	private getWatehouseItemIndex(sPlayerItem: any): number {
		let itemData: ItemData;
		for (let i: number = 0; i < this._warehouseItems.length; i++) {
			itemData = this._warehouseItems[i];
			if (ItemsUtil.isTrueItemData(itemData) && sPlayerItem.uid_S == itemData.getUid()) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 获取仓库物品所在序号
	 */
	private getScoreWarehouseItemIndex(sPlayerItem: any): number {
		let itemData: ItemData;
		for (let i: number = 0; i < this._scoreWarehouse.length; i++) {
			itemData = this._scoreWarehouse[i];
			if (ItemsUtil.isTrueItemData(itemData) && sPlayerItem.uid_S == itemData.getUid()) {
				return i;
			}
		}
		return -1;
	}

	public get warehouseItems(): Array<ItemData> {
		return this._warehouseItems;
	}

	public get scoreWarehouseItems():ItemData[] {
		return this._scoreWarehouse;
	}

	public get showRewardAllot():boolean {
		return this.warehouseItems.length > 0 && this.isLeader;
	}

	/**
	 * 积分仓库操作记录
	 */
	public get warehouseRecords():any[] {
		return this._recordInfos;
	}

	/**仓库积分 */
	public get warehouseScore():number {
		if(!this.playerGuildInfo) {
			return 0;
		}
		return Number(this.playerGuildInfo.warehouseCredit_L64);
	}

	public getStoreItemByUid(uid:string):ItemData {
		for(let i:number = 0; i < this._warehouseItems.length; i++) {
			let itemData:ItemData = this._warehouseItems[i];
			if(ItemsUtil.isTrueItemData(itemData) && uid == itemData.getUid()) {
				return itemData;
			}
		}
		return null;
	}

	/**
	 * 更新分配数据
	 */
	public updateAllocateInfo(player:any,count:number):void {
		let allocateList:any[] = this._allocateInfo[this.allocateUid];
		if(!allocateList) {
			allocateList = [];
			this._allocateInfo[this.allocateUid] = allocateList;
		}
		for(let i:number = 0; i < allocateList.length; i++) {
			if(allocateList[i].playerId_I == player.entityId.id_I) {
				if(count == 0) {
					allocateList.splice(i,1);
				}
				else {
					allocateList[i].count_I = count;
				}
				return;
			}
		}
		if(count > 0) {
			allocateList.push({player : player, playerId_I : player.entityId.id_I, uid_S : this.allocateUid, count_I : count})
		}
	}

	public getAllocateInfo(uid:string):any {
		return this._allocateInfo[uid];
	}

	/**
	 * 获取仓库物品已选分配数量
	 */
	public getStoreItemAllocateCount(uid:string = ""):number {
		if(uid == "") uid = this.allocateUid;
		let allocateList:any[] = this._allocateInfo[uid];
		if(!allocateList) {
			return 0;
		}
		let count:number = 0;
		for(let i:number = 0; i < allocateList.length; i++) {
			count += allocateList[i].count_I;
		}
		return count;
	}

	/**
	 * 获取已选择的玩家分配数量
	 */
	public getAllocatePlayerCount(playerId:number,uid:string = ""):number {
		if(uid == "") uid = this.allocateUid;
		let allocateList:any[] = this._allocateInfo[uid];
		if(!allocateList) {
			return 0;
		}
		for(let i:number = 0; i < allocateList.length; i++) {
			if(playerId == allocateList[i].playerId_I) {
				return allocateList[i].count_I;
			}
		}
		return 0;
	}

	/**
	 * 获取仓库物品剩余可分配数量
	 * @param isMax 是否获取实际剩余数量
	 */
	public getStoreItemLeftCount(uid:string = "",isMax:boolean = true):number {
		if(uid == "") uid = this.allocateUid;
		let allocateNum:number = this.getStoreItemAllocateCount(uid);
		for(let itemData of this._warehouseItems) {
			if(ItemsUtil.isTrueItemData(itemData) && uid == itemData.getUid()) {
				if(isMax) return itemData.getItemAmount();
				return itemData.getItemAmount() - allocateNum;
			}
		}
		return 0;
	}

	public get allocateInfos():any[] {
		let infos:any[] = [];
		for(let uid in this._allocateInfo) {
			let allocates:any[] = this._allocateInfo[uid];
			for(let i:number = 0; i < allocates.length; i++) {
				if(!allocates[i].count_I) continue;
				infos.push({playerId_I : allocates[i].playerId_I, uid_S : allocates[i].uid_S, count_I : allocates[i].count_I});
			}
		}
		return infos;
	}

	/**
	 * 清空分配数据
	 */
	public clearAllocateInfo():void {
		this._allocateInfo = {};
		this.allocateUid = "";
	}

	public clear(): void {

	}
}