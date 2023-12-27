/**
 * 新强化激活
 * "contents":[新强化类型]
 */
class TaskStrengthenExActivate extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        let type: EStrengthenExType = this.processContent[0];
        switch (type) {
            case EStrengthenExType.EStrengthenExTypeDragonSoul:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWare, { "tabType": PanelTabType.DragonSoul }, ViewIndex.One);
                break;
            case EStrengthenExType.EStrengthenExTypeWing:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Wing }, ViewIndex.One);
                break;
            case EStrengthenExType.EStrengthenExTypeInternalForce:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.InnerPower });
                break;
        }
    }
}