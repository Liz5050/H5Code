/**
 * 通关新手副本
 */
class TaskPassNewPlayerCopy extends TaskBase {
	private copyCode: number;

	public getSubTraceDesc(targetColor: string = "#01ab24", showMap: boolean = false): string {
		let desc: string = "";
		this.copyCode = this.task.copyCode;
		let copy: any = ConfigManager.copy.getByPk(this.copyCode);
		desc = `通关<font color="${targetColor}">${copy.name}</font>`;
		return desc;
	}

	public executeTask(isConvey: boolean = false): void {
		if (TaskUtil.isRing(this.group)) {//循环任务特殊处理
			let npcId: number = this.task.endNpc;
			if (isConvey) {
				this.conveyToNpc(npcId);
			} else {
				this.routeToNpc(npcId);
			}
			return;
		}
		let copyCode: number = this.task.copyCode;
		let copy: any = ConfigManager.copy.getByPk(copyCode);
		let copyType: ECopyType = copy.copyType;
		switch (copyType) {
			case ECopyType.ECopyMgBossLead:
				if (!CacheManager.guide.isGuideTarget(GuideTargetName.HomeBossBtn)) {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.WorldBoss, "copyCode": copyCode });
                }
				break;
			// case ECopyType.ECopyMgPersonalBoss:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.PersonalBoss, "copyCode": copyCode });
			// 	break;
			// case ECopyType.ECopyMgKingStife:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.KingBattle });
			// 	break;
			// case ECopyType.ECopyMgMaterial:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallMaterial });
			// 	break;
			// case ECopyType.ECopyMgNewExperience:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallDaily });
			// 	break;
			// default:
			// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall);
		}
		// TaskCopyUtil.execute(copyType, copyCode);
	}
}