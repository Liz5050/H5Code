/**
 * 神器激活(piece 参数不为 0 表示激活指定神器碎片）
 * 
 */
class TaskGodWeaponActivate extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        let code: number = this.processContent[0];//神器code
        let piece: number = this.processContent[1];//神器piece
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.TrainGodWeapon });
    }
}