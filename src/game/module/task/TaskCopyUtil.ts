/**
 * 任务副本工具类
 */
class TaskCopyUtil {
	public constructor() {
	}

	/**
	 * 执行
	 */
	public static execute(copyType: ECopyType, copyCode: number = -1, viewIndex: ViewIndex = ViewIndex.One): void {
		switch (copyType) {
			case ECopyType.ECopyMgPersonalBoss:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.PersonalBoss, "copyCode": copyCode }, viewIndex);
				break;
			case ECopyType.ECopyMgNewWorldBoss:
				let panelTabType: PanelTabType = PanelTabType.WorldBoss;
				if (copyCode == CopyEnum.CopyGodBoss) {
					panelTabType = PanelTabType.GodBoss;
				}
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": panelTabType, "copyCode": copyCode }, viewIndex);
				break;
			case ECopyType.ECopyMgSecretBoss:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.SecretBoss, "copyCode": copyCode }, viewIndex);
				break;
			case ECopyType.ECopyMgKingStife:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.KingBattle }, viewIndex);
				break;
			case ECopyType.ECopyMgMaterial:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallMaterial }, viewIndex);
				break;
			case ECopyType.ECopyMgNewExperience:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallDaily }, viewIndex);
				break;
			case ECopyType.ECopyMgBossLead:
			case ECopyType.ECopyPunchLead:
				EventManager.dispatch(LocalEventEnum.CopyReqEnter, copyCode);
				break;
			case ECopyType.ECopyEncounter://遭遇战
				if (CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
					Tip.showOptTip(LangArena.LANG33);
					return;
				}
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.Encounter }, viewIndex);
				break;
			case ECopyType.ECopyCrossTeam:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.Team2, "copyCode": copyCode }, viewIndex);
				break;
			default:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, null, viewIndex);
		}
	}
}