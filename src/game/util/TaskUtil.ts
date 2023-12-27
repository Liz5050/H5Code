class TaskUtil {

	/**是否为主线任务 */
	public static isMain(group: number): boolean {
		return group == ETaskGroup.ETaskGroupMain;
	}

	/**是否为支线线任务 */
	public static isBranch(group: number): boolean {
		return group == ETaskGroup.ETaskGroupBranch;
	}

	/**是否为循环任务 */
	public static isRing(group: number): boolean {
		//赏金任务和仙盟任务
		return group == ETaskGroup.ETaskGroupMgRing || group == ETaskGroup.ETaskGroupMgGuild;
	}

	/**
	 * 是否为赏金任务
	 */
	public static isMoneyRing(group: number): boolean {
		return group == ETaskGroup.ETaskGroupMgRing;
	}

	/**
	 * 是否为仙盟任务
	 */
	public static isGuildRing(group: number): boolean {
		return group == ETaskGroup.ETaskGroupMgGuild;
	}

	/**
	 * 是否可以自动领取
	 * @param task 任务配置
	 */
	public static isCanAutoGet(task: any): boolean {
		return task != null && task.clientAutoGet == 1;
	}

	/**
	 * 是否为杀怪任务
	 * @param task 任务配置
	 */
	public static isKillBoss(taskType: any): boolean {
		return taskType == ETaskType.ETaskTypeKillBoss;
	}

	/**
	 * 是否为转职任务
	 */
	public static isChangeCareer(taskGroup: number): boolean {
		return taskGroup == ETaskGroup.ETaskGroupChangeCareer;
	}

	/**
	 * 是否可以自动提交
	 */
	public static isCanAutoSubmit(taskType: any): boolean {
		return this.isKillBoss(taskType);
	}

	/**
	 * 获取任务奖励
	 */
	public static getTaskRewards(rewards: Array<any>): Array<ItemData> {
		let itemDatas: Array<ItemData> = [];
		if (rewards != null) {
			let itemData: ItemData;
			let itemAmount: number = 1;
			for (let r of rewards) {
				itemAmount = Number(r.num_L64);
				switch (r.type_I) {
					case ETaskRewardType.Exp:
						itemData = new ItemData(ItemCodeConst.Exp);
						break;
					case ETaskRewardType.Money:
						let unit: number = r.code_I;
						if (unit == EPriceUnit.EPriceUnitCoinBind) {
							itemData = new ItemData(ItemCodeConst.Coin);
						} else if (unit == EPriceUnit.EPriceUnitGuild) {
							itemData = new ItemData(ItemCodeConst.GuildMoney);
						}
						break;
					case ETaskRewardType.Item:
						itemData = new ItemData(r.code_I);
						//装备特殊处理，因为有分职业
						let careerMap: any = itemData.getCareerMap();//有配职业映射
						if (careerMap != null) {
							let codes: Array<string> = (careerMap as string).split("#");
							let baseCareer: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareer());
							if (baseCareer == 1) {
								itemData = new ItemData(Number(codes[0]));
							} else if (baseCareer == 2) {
								itemData = new ItemData(Number(codes[1]));
							} else {
								itemData = new ItemData(Number(codes[2]));
							}
						}
						break;
					case ETaskRewardType.CalExp:
						itemData = new ItemData(ItemCodeConst.Exp);
						//公式计算
						let expCfg: any = ConfigManager.exp.getByPk(CacheManager.role.getRoleLevel());
						itemAmount = Math.floor(expCfg.baseExp * 1.0 * Number(r.num_L64) / 100);
						break;
				}
				if (itemData == null) {
					Log.trace(Log.TASK, "未处理的任务奖励类型ETaskRewardType", r.type_I);
					continue;
				}

				itemData.itemAmount = itemAmount;
				itemDatas.push(itemData);
			}
		}
		return itemDatas;
	}

	/**
	 * 获取任务奖励
	 * type,code,num
	 * @param rewardsStr [1,0,992][2,1,25000][3,10051001,1]
	 */
	public static getTaskRewardsByStr(rewardsStr: string): Array<ItemData> {
		let rewards: Array<any> = [];
		let a: Array<string> = rewardsStr.split("]");
		for (let t1 of a) {
			t1 = t1.replace("[", "");
			if (t1 != "") {//[1,0,992
				let a2: Array<string> = t1.split(",");
				rewards.push({ "type_I": Number(a2[0]), "code_I": Number(a2[1]), "num_L64": Number(a2[2]) });
			}
		}
		return TaskUtil.getTaskRewards(rewards);
	}

	/**
	 * 获取奖励
	 */
	public static getRewardsByStr(rewardsStr: string): Array<ItemData> {
		if (rewardsStr == null || rewardsStr.length == 0) {
			return [];
		}
		let rewards: Array<ItemData> = [];
		let codes: Array<string> = rewardsStr.split("#");
		for (let code of codes) {
			if (code != "") {
				rewards.push(new ItemData(code));
			}
		}
		return rewards;

	}

	/**
	 * 获取玩家任务
	 * @returns PlayerTask
	 */
	public static getPlayerTask(sPlayerTask: any): TaskBase {
		let playerTask: TaskBase;
		if (sPlayerTask != null) {
			let taskType: number = sPlayerTask.task.type_I;
			switch (taskType) {
				case ETaskType.ETaskTypeTalk:
					playerTask = new TaskTalk(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillBoss:
					playerTask = new TaskKillBoss(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillBossCount:
					playerTask = new TaskKillBossCount(sPlayerTask);
					break;
				case ETaskType.ETaskTypeCollect:
					playerTask = new TaskCollect(sPlayerTask);
					break;
				case ETaskType.ETaskTypeEscort:
					playerTask = new TaskEscort(sPlayerTask);
					break;
				case ETaskType.ETaskTypeTaskCount:
					playerTask = new TaskCount(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillBossFirstDrop:
					playerTask = new TaskKillBossFirstDrop(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillBossDropEx:
					playerTask = new TaskKillBossDropEx(sPlayerTask);
					break;
				case ETaskType.ETaskTypeHandEquip:
					playerTask = new TaskHandEquip(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStrengthenLevel:
					playerTask = new TaskStrengthen(sPlayerTask);
					break;
				case ETaskType.ETaskTypePassNewPlayerCopy:
					playerTask = new TaskPassNewPlayerCopy(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStarPassCopy:
					playerTask = new TaskStarPassCopy(sPlayerTask);
					break;
				case ETaskType.ETaskTypeCopyExpTarget:
					playerTask = new TaskCopyExpTarget(sPlayerTask);
					break;
				case ETaskType.ETaskTypeGuide:
					playerTask = new TaskGuide(sPlayerTask);
					break;
				case ETaskType.ETaskTypeItemSmelt:
					playerTask = new TaskSmelt(sPlayerTask);
					break;
				case ETaskType.ETaskTypeDressEquip:
				case ETaskType.ETaskTypeDressedHighQualityEquipCount:
					playerTask = new TaskDressEquip(sPlayerTask);
					break;
				case ETaskType.ETaskTypeReachMap:
					playerTask = new TaskReachMap(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStrengthenExActivate:
					playerTask = new TaskStrengthenExActivate(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStrengthenExCount:
					playerTask = new TaskStrengthenExCount(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStrengthenExLevel:
					playerTask = new TaskStrengthenExLevel(sPlayerTask);
					break;
				case ETaskType.ETaskTypeGodWeaponActivate:
					playerTask = new TaskGodWeaponActivate(sPlayerTask);
					break;
				case ETaskType.ETaskTypeEnterCopyCount:
					playerTask = new TaskEnterCopyCount(sPlayerTask);
					break;
				case ETaskType.ETaskTypeHistoryEnterCopyCount:
				case ETaskType.ETaskTypeHistoryFinishCopyCount:
				case ETaskType.ETaskTypePassCopyWithRateCount:
					playerTask = new TaskHistoryEnterCopyCount(sPlayerTask);
					break;
				case ETaskType.ETaskTypePassCopyCount:
					playerTask = new TaskPassCopyCount(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillNewWorldBoss:
					playerTask = new TaskKillNewWorldBoss(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillNewWorldBoss:
					playerTask = new TaskHireMining(sPlayerTask);
					break;
				case ETaskType.ETaskTypeShapeActivate:
				case ETaskType.ETaskTypeShapeCount:
				case ETaskType.ETaskTypeShapeLevel:
				case ETaskType.ETaskTypeShapeState:
					playerTask = new TaskShape(sPlayerTask);
					break;
				case ETaskType.ETaskTypeSevenDayMagicWeaponActivate:
					playerTask = new TaskSevenDayMagicWeaponActivate(sPlayerTask);
					break;
				case ETaskType.ETaskTypeUseItemCount:
					playerTask = new TaskUseItemCount(sPlayerTask);
					break;
					
			}
			if (playerTask == null) {
				playerTask = new TaskBase(sPlayerTask);
				Log.trace(Log.TASK, "任务类型默认处理", taskType);
			}
		}

		return playerTask;
	}

	/**
	 * 玩家任务排序规则
	 * 支线可提交、主线可提交、主线可接、支线可接、主线未完成、支线未完成、任务没到达等级要求
	 * 值越小越靠前
	 * @param playerTask 支持SPlayerTask、PlayerTask
	 */
	public static getPlayerTaskSort(playerTask: any): number {
		let sort: number = 999;
		let sTask: any = playerTask.task;
		if (playerTask instanceof TaskBase) {
			sTask = playerTask.sTask;
		}
		if (TaskUtil.isChangeCareer(sTask.group_I)) {
			return 0;
		}
		if (!TaskUtil.isTaskCanComplete(sTask)) {
			return 7;
		}
		let status: number = playerTask.status_I;
		if (TaskUtil.isMain(sTask.group_I)) {
			if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 2;
			} else if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 3;
			} else if (status == ETaskStatus.ETaskStatusNotCompleted) {
				sort = 5;
			}
		} else {
			if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 1;
			} else if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 4;
			} else if (status == ETaskStatus.ETaskStatusNotCompleted) {
				sort = 6;
			}
		}
		return sort;
	}

	/**
	 * npc任务排序规则
	 * 支线可提交、主线可提交、主线可接、支线可接
	 * 值越小越靠前
	 */
	public static getNpcTaskSort(sNpcTask: any): number {
		let sort: number = 999;
		let task: any = sNpcTask.task;
		let status: number = sNpcTask.status_I;
		if (TaskUtil.isMain(task.group_I)) {
			if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 2;
			} else if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 3;
			}
		} else {
			if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 1;
			} else if (status == ETaskStatus.ETaskStatusHadCompleted) {
				sort = 4;
			}
		}
		return sort;
	}

	/**
	 * 任务是否可以完成。人物等级是否到达提交任务要求
	 */
	public static isTaskCanComplete(sTask: any, roleLevel: number = -1): boolean {
		if (roleLevel == -1) {
			roleLevel = CacheManager.role.getRoleLevel();
		}
		if (sTask.completedConditions != null) {
			let completedConditions: Array<any> = sTask.completedConditions.data;
			for (let con of completedConditions) {
				if (con.type_I == ECondition.EConditionLevel && roleLevel < con.num_I) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * 获取任务完成限制等级
	 * @returns 0表示无限制
	 */
	public static getCompleteConditionLevel(sTask: any): number {
		let completedConditions: Array<any> = sTask.completedConditions.data;
		for (let con of completedConditions) {
			if (con.type_I == ECondition.EConditionLevel) {
				return con.num_I;
			}
		}
		return 0;
	}

	/**
	 * 获取循环任务对应的npcid
	 */
	public static getRingTaskNpcId(sPlayerTask: any): number {
		let npcId: number;
		if (sPlayerTask.task.processes.data.length > 0) {
			npcId = sPlayerTask.task.processes.data[0].contents.data_I[0];
		} else {
			npcId = sPlayerTask.task.endNpc_I;
		}
		return npcId;
	}

	/**
	 * 任务等级是否符合要求
	 */
	public static isLevelMatch(sTask: any): boolean {
		let conditionLevel: number = TaskUtil.getCompleteConditionLevel(sTask);
		return CacheManager.role.isLevelMatch(conditionLevel);
	}

	/**
	 * 任务是否需要寻路
	 */
	public static isNeedFindPath(taskType: ETaskType): boolean {
		let types: Array<ETaskType> = [ETaskType.ETaskTypeTalk, ETaskType.ETaskTypeKillBoss, ETaskType.ETaskTypeKillBossDrop, ETaskType.ETaskTypeCollect, ETaskType.ETaskTypeReachMap
		];
		return types.indexOf(taskType) != -1;
	}
}