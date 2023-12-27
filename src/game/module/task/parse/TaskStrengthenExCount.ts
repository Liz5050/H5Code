/**
 * 新强化系统升级次数（xx强化类型yy强化次数）
 * 
 */
class TaskStrengthenExCount extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        let type: EStrengthenExType = this.processContent[0];
        switch (type) {
            case EStrengthenExType.EStrengthenExTypeUpgrade:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.Strengthen });
                break;
            case EStrengthenExType.EStrengthenExTypeCast:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.Casting });
                break;
            case EStrengthenExType.EStrengthenExTypeNerve:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.Nerve });
                break;
            case EStrengthenExType.EStrengthenExTypeInternalForce:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.InnerPower });
                break;
            case EStrengthenExType.EStrengthenExTypeDragonSoul:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWare, { "tabType": PanelTabType.DragonSoul }, ViewIndex.One);
                break;
            case EStrengthenExType.EStrengthenExTypeWing:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Wing }, ViewIndex.One);
                break;
        }
    }
}