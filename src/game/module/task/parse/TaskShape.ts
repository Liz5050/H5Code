/**
 * 外观激活
 * "contents":[外观类型]
 */
class TaskShape extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        let panelTabType: PanelTabType;
        let type: EShape = this.processContent[0];
        switch (type) {
            case EShape.EShapePet:
                panelTabType = PanelTabType.Pet;
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Pet }, ViewIndex.One);
                break;
            case EShape.EShapeMount:
                panelTabType = PanelTabType.Mount;
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Mount }, ViewIndex.One);
                break;
            case EShape.EShapeSwordPool:
                panelTabType = PanelTabType.ShapeSwordPool;
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.ShapeSwordPool });
                break;
            case EShape.EShapeBattle:
                panelTabType = PanelTabType.ShapeBattle;
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.ShapeBattle });
                break;
        }
        if (panelTabType) {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": panelTabType });
        }
    }
}