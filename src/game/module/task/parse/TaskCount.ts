/**
 * 任务计数任务
 * 任务计数（ETaskTypeTaskCount）:
	contents[0] - 计数的任务类型（ETaskCountType枚举值）
	contents[1] - 当前完成次数（接任务是为0）
	contents[2] - 目标完成次数
"contents":[ETaskCountType枚举值,0,目标完成次数]
 */
class TaskCount extends TaskBase {
	private countType: ETaskCountType;

	public getSubTraceDesc(): string {
		let desc: string = "";
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			this.countType = contents[0];
			let num: number = contents[1];
			let target: number = contents[2];
			let talk: string = ConfigManager.client.getTaskTalk(this.task.code, this.status);
			if (talk != null) {
				return App.StringUtils.substitude(talk, num, target);
			}
			desc = this.getCountDesc(this.countType, num, target);
		}
		return desc;
	}

	/**执行任务所在任务点 */
	public getExecuteTaskPoint(): TaskPoint {
		let taskPoint: TaskPoint;
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			let mapId: number = contents[4];
			let x: number = contents[5];//怪物所在坐标x
			let y: number = contents[6];//怪物所在坐标y
			taskPoint = new TaskPoint();
			taskPoint.x = x;
			taskPoint.y = y;
			taskPoint.mapId = mapId;
		}
		return taskPoint;
	}

	private getCountDesc(countType: ETaskCountType, num: number, target: number): string {
		let tpl: string;
		switch (countType) {
			case ETaskCountType.ETaskCountTypeFriend:
				tpl = `添加${target}个好友`;
				break;
			case ETaskCountType.ETaskCountTypeTransport:
				tpl = `护送${target}次美女</font>`;
				break;
			case ETaskCountType.ETaskCountTypePetSwallow:
				tpl = `宠物吞噬${target}次`;
				break;
			case ETaskCountType.ETaskCountTypeSwordPool:
				tpl = `完成日常${target}次`;
				break;
			case ETaskCountType.ETaskCountTypeWorldBoss:
				tpl = `击杀${target}次世界BOSS`;
				break;
			case ETaskCountType.ETaskCountTypeStrengthen:
				tpl = `强化达到${target}级`;
				break;
			case ETaskCountType.ETaskCountTypeStarBest:
				tpl = `强化达到${target}星`;
				break;
			case ETaskCountType.ETaskCountTypeRuneCopyFloor:
				tpl = `诛仙塔到第${target}层`;
				break;
			case ETaskCountType.ETaskCountTypeSwordPoolActivity:
				tpl = `日常活跃达到${target}`;
				break;
		}
		return `${tpl}  <font color="#d36d00">(${num}/${target})</font>`;
	}

	public executeTask(): void {
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			this.countType = contents[0];
		}
		switch (this.countType) {
			// case ETaskCountType.ETaskCountTypeFriend:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Mail);
			// 	break;
			case ETaskCountType.ETaskCountTypeTransport:
				EventManager.dispatch(LocalEventEnum.TaskGotoEscort);
				break;
			// case ETaskCountType.ETaskCountTypePetSwallow:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount);
			// 	break;
			case ETaskCountType.ETaskCountTypeSwordPool:
			case ETaskCountType.ETaskCountTypeSwordPoolActivity:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Daily);
				break;
			case ETaskCountType.ETaskCountTypeWorldBoss:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.WorldBoss);
				break;
			case ETaskCountType.ETaskCountTypeStrengthen:
			case ETaskCountType.ETaskCountTypeStarBest:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine);
				break;
			case ETaskCountType.ETaskCountTypeRuneCopyFloor:
				if (!CacheManager.guide.isGuideTarget(GuideTargetName.HomeCopyHallBtn)) {
					if (CacheManager.guide.isGuideTarget(GuideTargetName.CopyHallModuleCopyHallTowerTab)) {
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall);
					} else {
						EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallTower });
					}
                }
				break;
			case ETaskCountType.ETaskCountTypeCopyCheckPointOne:
				if (CacheManager.checkPoint.isCheckPointViewShow) {
					EventManager.dispatch(LocalEventEnum.GuideCheckPoint);
				} else {
					EventManager.dispatch(LocalEventEnum.EnterPointChallenge);
				}
				break;
			case ETaskCountType.ETaskCountTypeSkillUpgrade:
				// EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.Skill });
				break;
			case ETaskCountType.ETaskCountTypeMeltEquip:
				EventManager.dispatch(UIEventEnum.PackSmeltOpen);
				break;
			case ETaskCountType.ETaskCountTypeDressEquipCount://装备
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.Player });
				break;
			case ETaskCountType.ETaskCountTypePlayerLevel://玩家等级
				if(this.code == 300063 || this.code == 300067 || this.code == 300081){//30级任务(300063)、32级任务(300067)、38级任务(300081)
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.Encounter });
				}else if(this.code == 300094){//60级任务(300094)
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallTower });
				}else{
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.UpgradeGuide);
				}
				// Tip.showTip(`等级达到${this.getProcess().total}开启`, Color.Red);
				break;
            case ETaskCountType.ETaskCountTypeKillFragmentGet://必杀碎片
                if(CacheManager.timeLimitTask.needShowIcon()) {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.TimeLimitTask);
                } else {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.UniqueSkill });
                }
                break;
			case ETaskCountType.ETaskCountTypeMining:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.Mining });
				break;
			case ETaskCountType.ETaskCountTypeRuneNum:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Rune, { "tabType": PanelTabType.RuneInlay }, ViewIndex.One);
				break;
			case ETaskCountType.ETaskCountTypeEquipLottery:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Lottery, { "tabType": PanelTabType.LotteryEquip });
				break;
			case ETaskCountType.ETaskCountTypeGetCheckPointRoleExpHis:
				if (!CacheManager.guide.isGuideTarget(GuideTargetName.NavbarPlayerBtn)) {
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.RoleState });
				}
				break;
				
		}
	}

	/**
	 * 是否为挑战关卡任务
	 */
	public get isChallengeCheckPointTask(): boolean {
		let countType: ETaskCountType;
		let contents: Array<any> = this.processContent;
		if (contents != null) {
			countType = contents[0];
		}
		return countType == ETaskCountType.ETaskCountTypeCopyCheckPointOne;
	}
}