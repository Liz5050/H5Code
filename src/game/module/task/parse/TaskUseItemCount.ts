/**
 * 使用指定物品 x 次/个（ETaskTypeUseItemCount）
  contents[0] - 物品 code
  contents[1] - 当前计数（初始为0）
  contents[2] - 目标计数
  contents":[物品code,当前计数,目标计数]
 */
class TaskUseItemCount extends TaskBase {

    /**执行任务 */
    public executeTask(isConvey: boolean = false): void {
        let itemCode: number = this.processContent[0];
        if (itemCode) {
            let itemData: ItemData = new ItemData(itemCode);
            if (ItemsUtil.isMonthTempPrivilegeCard(itemData)) {
                EventManager.dispatch(UIEventEnum.ShowPrivilegeCardExpWindow);
            }
        }
    }
}