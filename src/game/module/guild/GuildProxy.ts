class GuildProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 默认获取我的仙盟信息
	 */
	public getGuildInfo(guildId: number = 0): void {
		if (guildId == 0) {
			CacheManager.guildNew.playerGuildInfo.guildId_I;
		}
		this.send("ECmdGameGetGuildInfo", { "guildId": guildId });
	}

	/**创建仙盟 */
	public create(name: string, flag: number,option:number, purpose: string = ""): void {
		let playerId: number = CacheManager.role.player.playerId_I;
		this.send("ECmdGameCreateGuild", { "playerId": 0, "flag": flag, "option": option, "name": name, "purpose": purpose, });
	}

	/**获取申请列表 */
	public getApplyList(guildId: number = 0): void {
		if (guildId == 0) {
			guildId = CacheManager.guildNew.playerGuildInfo.guildId_I;
		}
		this.send("ECmdGameGetApplyList", { "guildId": guildId });
	}

	/**获取成员列表 */
	public getMemberList(guildId: number = 0): void {
		if (guildId == 0) {
			guildId = CacheManager.guildNew.playerGuildInfo.guildId_I;
		}
		this.send("ECmdGameGetGuildPlayerInfo", { "guildId": guildId });
	}

	/**
	 * 搜索仙盟
	 * notFull 不包含满人仙盟
	 * @param includeFull 包含满人的仙盟
	 */
	public search(name: string, includeFull: boolean = true): void {
		let playerId: number = CacheManager.role.player.playerId_I;
		this.send("ECmdGameSearchGuilds", { "camp": 0, "guildName": name, "startIndex": 0, "notFull": !includeFull, "playerId": playerId });
	}

	/**申请仙盟 */
	public apply(guildId: number, playerId: number = 0): void {
		this.send("ECmdGameApplyGuild", { "guildId": guildId, "playerId": playerId });
	}

	/**一键申请仙盟 */
	public applyOneKey(playerId: number = 0): void {
		this.send("ECmdGameBatchApplyGuild", { "playerId": playerId });

	}

	/**保存公告 */
	public saveNotice(content: string, isNotice: boolean = false, isCost: boolean = false, playerId: number = 0): void {
		this.send("ECmdGameChangeGuildPurpose", { "purpose": content, "doNotice": isNotice, "doCost": isCost, "playerId": playerId });
	}

	/**
	 * 获取通知次数
	 */
	public getNoticeNum(playerId: number = 0): void {
		this.send("ECmdGameGetGuildPurposeNoticeNum", { "playerId": playerId });
	}

	/**
	 * 处理申请
	 * @param isAgree 是否同意
	 */
	public dealApply(toPlayerId: number, isAgree: boolean): void {
		this.send("ECmdGameDealApply", { "toPlayerId": toPlayerId, "oper": isAgree, "fromPlayerId": 0 });
	}

	/**
	 * 获取仙盟日志
	 * @param pageSize 页大小（每页多少条记录）
	 * @param pageIndex 页索引（从 0 开始）
	 */
	public getGuildLogs(pageSize:number,pageIndex:number):void{
		this.send("ECmdGameGetGuildLogs",{pageSize:pageSize,pageIndex:pageIndex}) //C2S_SGetGuildLogs
	}

	/**
	 * 成员操作，包含退出仙盟
	 * @param toPosition 目标职位(EPositionNotMember 开除)
	 */
	public memberOper(toPlayerId: number, toPosition: EGuildPosition): void {
		this.send("ECmdGameMemberOper", { "toPlayerId": toPlayerId, "toPosition": toPosition, "fromPlayerId": 0 });
	}

	/**
	 * 退出仙盟
	 */
	public exit(): void {
		let toPlayerId: number = CacheManager.role.player.playerId_I;
		this.send("ECmdGameMemberOper", { "toPlayerId": toPlayerId, "toPosition": EGuildPosition.EGuildNotMember, "fromPlayerId": 0 });
	}

	/**
	 * 解散仙盟
	 */
	public disband(): void {
		this.send("ECmdGameDisbandGuild", { "playerId": 0 });
	}

	/**
	 * 保存申请设置
	 */
	public saveApplySet(level: number, fight: number): void {
		let dict: any = { "applyLevel": level, "applyWarfare": fight };
		this.send("ECmdGameChangeYYQQ", { "option": EOperOption.EOperOptionApplyCondition, "number": JSON.stringify(dict), "playerId": 0 });
	}

	/**
	 * 保存自动批准
	 * @param isAutoAgree 是否自动批准
	 */
	public saveAutoAgree(isAutoAgree: boolean): void {
		let dict: any = { "con": isAutoAgree ? EGuildEnterCondition.EGuildEnterConditionCondition : EGuildEnterCondition.EGuildEnterConditionEvery };
		this.send("ECmdGameChangeYYQQ", { "option": EOperOption.EOperOptionEnterCondition, "number": JSON.stringify(dict), "playerId": 0 });
	}

	/**
	 * 升级仙盟
	 */
	public upgradeGuild(): void {
		this.send("ECmdGameUpdateGuild", { "playerId": 0 });
	}
	/**
	 * 领取每日奖励
	 */
	public getDailyReward(): void {
		this.send("ECmdGameGetDailyReward", { "playerId": 0 });
	}

	/**
	 * 升级心法
	 * @param level 心法等级
	 */
	public upgradeVein(level: number, attrType: number): void {
		this.send("ECmdGameUpgradeGuildVein", { "playerId": 0, "guildVeinLevel": level, "guildVeinAttrType": attrType });
	}

	/**
	 * 获取仓库数据
	 */
	public getWarehouseData(): void {
		this.send("ECmdGameOpenWareHouse", { "playerId": 0 });
	}

	/**
	 * 捐献装备
	 */
	public donateEquip(itemData: ItemData): void {
		this.send("ECmdGameDonateEquip", { "playerId": 0, "uid": itemData.getUid(), "itemCode": itemData.getCode(), "itemJsStr": "" });
	}

	/**
	 * 兑换装备
	 */
	public changeEquip(itemData: ItemData): void {
		this.send("ECmdGameChangeEquip", { "playerId": 0, "uid": itemData.getUid() });
	}

	/**
	 * 兑换物品
	 */
	public changeItem(itemData: ItemData, num: number): void {
		this.send("ECmdGameChangeItem", { "playerId": 0, "itemCode": itemData.getCode(), "num": num });
	}

	/**
	 * 销毁物品
	 */
	public destroyEquip(uids: Array<string>): void {
		this.send("ECmdGameDestroyEquip", { "playerId": 0, "uids": { "data_S": uids } });
	}

	/**
	 * 获取神兽信息
	 */
	public getBeastGodInfo(): void {
		this.send("ECmdGameGetBeastGodInfo", { "playerId": 0 });
	}

	/**
	 * 捐献兽粮
	 */
	public donateBeastGodFood(num: number): void {
		this.send("ECmdGameDonateBeastGodFood", { "playerId": 0, "num": num });
	}
	/**
	 * 捐献金钱
	 */
	public donateMoney(option:EOperOption,num:number,playerId:number=0):void{
		this.send("ECmdGameDonateMoney", { "option": option, "num": num,playerId:playerId });
	}

	/**
	 * 挑战神兽
	 */
	public openGuildBeastGod(): void {
		this.send("ECmdGameOpenGuildBeastGod", { "playerId": 0 });
	}

    /**
     * 捐献柴火
     */
    public donateFirewood(num: number): void {
        this.send("ECmdGameGuildDonateFirewood", { "playerId": 0, "num": num });
    }

    /**
     * 升级心法
     */
    public upgradeVeinNew(level: number, veinType: EGuildVeinType, roleIndex:number): void {
        this.send("ECmdGameUpgradeGuildVein", { "playerId": 0, "guildVeinLevel": level, "guildVeinType": veinType, "roleIndex": roleIndex });
    }

	/**
	 * 分配物品
	 */
	public allocateItem(allocateInfos:any[]):void {
		this.send("ECmdGameAllocateWareHouseItem",{items:{data:allocateInfos}});
	}

	/**
	 * 捐献物品
	 * C2S_SDonateEquip
	 */
	public donateItem(itemCode:number,uid:string,itemNum:number):void {
		this.send("ECmdGameDonateEquip",{playerId:0,uid:uid,itemCode:itemCode,itemNum:itemNum});
	}

	/**
	 * 兑换物品 
	 * C2S_SChangeEquip
	 */
	public exchangeItem(uid:string,itemNum:number):void {
		this.send("ECmdGameChangeEquip",{playerId:0,uid:uid,itemNum:itemNum});
	}

	/**
	 * 打开仓库请求数据
	 */
	public warehouseOpen():void {
		this.send("ECmdGameOpenCreditWareHouse",{});
	}
}