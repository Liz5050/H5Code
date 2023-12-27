/**
 * 新强化系统升级等级（xx强化类型yy强化等级）
 * 
 */
class TaskStrengthenExLevel extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        let type: EStrengthenExType = this.processContent[0];
        switch (type) {
            case EStrengthenExType.EStrengthenExTypeUpgrade:
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.Strengthen });//由指引打开
                break;
            case EStrengthenExType.EStrengthenExTypeRefine:
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.Refine });//由指引打开
                break;
            case EStrengthenExType.EStrengthenExTypeCast:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.Casting });
                break;
            case EStrengthenExType.EStrengthenExTypeNerve:
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.Nerve }, ViewIndex.One);
                break;
            case EStrengthenExType.EStrengthenExTypeInternalForce:
                // EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.InnerPower }, ViewIndex.One);//由指引打开
                break;
            case EStrengthenExType.EStrengthenExTypeDragonSoul:
                if (!CacheManager.guide.isGuideTarget(GuideTargetName.NavbarShapeBtn)) {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWare, { "tabType": PanelTabType.DragonSoul }, ViewIndex.One);
                }
                break;
            case EStrengthenExType.EStrengthenExTypeWing:
                if (!CacheManager.guide.isGuideTarget(GuideTargetName.NavbarShapeBtn)) {//当前指引不是点击外观按钮，需要直接打开
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Wing }, ViewIndex.One);
                }
                break;
            case EStrengthenExType.EStrengthenExTypeLord://爵位
                // if (!CacheManager.guide.isGuideTarget(GuideTargetName.NavbarShapeBtn)) {
                //     EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Wing }, ViewIndex.One);
                // }
                EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Train, { "tabType": PanelTabType.TrainDaily }, ViewIndex.One);
                break;
        }
    }
}