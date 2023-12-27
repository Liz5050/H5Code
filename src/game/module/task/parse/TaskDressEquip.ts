/**
 * 装备武器
 * contents":[颜色,物品等级]  -- 颜色和等级填 0 即可
 */
class TaskDressEquip extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player);
    }
}