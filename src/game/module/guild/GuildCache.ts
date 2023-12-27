class GuildCache implements ICache {
	/**
	 * 已发布通知次数
	 */
	public noticeNum: number = 0;
	/**人物基础属性，仙盟心法显示的 */
	public roleBaseAttrDict: any;
	/**仙盟神兽信息 S2C_SGetBeastGodInfo */
	public beastGodInfo: any;
	/**神兽开启信息 SGuildBeastGodOpen */
	public beastGodOpenInfo: any;
	/**兽粮code */
	public beastFoodCode: number;
	/**
	 * 我的仙盟信息
	 */
	private _playerGuildInfo: any;

	private _guildInfo: any;
	/**SVeinInfo */
	private _vienInfo: any;
	private _vienLevelDict: any;
	/**
	 * 仓库容量
	 */
	private _warehouseSize: number = 100;
	/**
	 * 仓库物品
	 */
	private _warehouseItems: Array<ItemData>;
	/**
	 * 仓库记录
	 */
	private _warehouseRecords: Array<any>;


	public constructor() {
		this._vienLevelDict = {};
		this.beastFoodCode = ConfigManager.const.getConstValue("GuildBeastGodFoodCode");
	}

	public set playerGuildInfo(playerGuildInfo: any) {
		this._playerGuildInfo = playerGuildInfo;
	}

	public get playerGuildInfo(): any {
		return this._playerGuildInfo;
	}

	public set guildInfo(guildInfo: any) {
		this._guildInfo = guildInfo;
	}

	public get guildInfo(): any {
		return this._guildInfo;
	}

	public isJoinedGuild(): boolean {
		return this.playerGuildInfo != null && this.playerGuildInfo.guildId_I != 0;
	}

	/**
	 * 是否为盟主
	 */
	public get isLeader(): boolean {
		return this.position == EGuildPosition.EGuildLeader;
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
	 * 长老以上可以处理申请
	 */
	public get isCanDealApply(): boolean {
		return this.position >= EGuildPosition.EGuildPresbyter;
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

	public get warehouseItems(): Array<ItemData> {
		return this._warehouseItems;
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

	public get warehouseRecords(): Array<any> {
		return this._warehouseRecords;
	}

	/**
	 * 更新仓库记录
	 * @param isInit true初始化，false增加
	 */
	public updateWarehouseRecords(records: Array<any>, isInit: boolean = false): void {
		if (isInit) {
			this._warehouseRecords = records;
		} else {
			if (this._warehouseRecords == null) {
				this._warehouseRecords = [];
			}
			this._warehouseRecords = this._warehouseRecords.concat(records);
		}
	}

	/**
	 * 获取所有可捐献的装备。最少显示15个格子
	 * 紫色四阶1星以上装备
	 */
	public getCanDonateEquips(): Array<ItemData> {
		let equips: Array<any> = CacheManager.pack.backPackCache.getItemsByFun(ItemsUtil.isCanDonateToGuildWarehouse, ItemsUtil);
		return equips;
	}

	/**
	 * 仙盟是否需要红点提示
	 */
	public get isNeedNotice(): boolean {
		return !this.isJoinedGuild() || this.playerGuildInfo.hasDailyReward_B || this.isCanLevelUpVien || this.isActiveNotice;
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

	/**活动按钮是否提示 */
	public get isActiveNotice(): boolean {
		let hasBeastFood: boolean = this.getBeastFoodNum() > 0;
		return hasBeastFood;
	}

	/**获取兽梁数量 */
	public getBeastFoodNum(): number {
		return CacheManager.pack.backPackCache.getItemCountByCode(this.beastFoodCode);
	}

	public clear(): void {

	}
}