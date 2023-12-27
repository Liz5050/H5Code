/**
 * 任务追踪上方的提示
 */
class TipTaskTop {
    private tipRollItem: TipRollItem;

    public showTip(tip: string): void {
        if (this.tipRollItem == null) {
            this.tipRollItem = FuiUtil.createComponent(PackNameEnum.Common,"TipRollItem") as TipRollItem;
            this.tipRollItem.y = GuideTargetManager.getObj(GuideTargetName.TaskTracePanel).y - 60;
        }
        this.tipRollItem.setText(tip);
        LayerManager.UI_Popup.addChild(this.tipRollItem);
        this.tipRollItem.x = (fairygui.GRoot.inst.width - this.tipRollItem.width) / 2;
        egret.Tween.get(this.tipRollItem).wait(1000).call(() => {
            this.tipRollItem.removeFromParent();
        }, this);
    }
}