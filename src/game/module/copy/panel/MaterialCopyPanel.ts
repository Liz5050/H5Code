/**
 * 材料副本内的UI、  只有一个退出按钮
 */
class MaterialCopyPanel extends BaseCopyPanel {
	public constructor(copyInf:any) {
		super(copyInf,"MaterialCopyPanel");
	}

    public initOptUI():void {
        super.initOptUI();
        this.XPSetBtn.visible = true;
    }

    public updateAll(): void {
        if (this.isShow) {
            this.XPSetBtn.selected = !CacheManager.sysSet.materialCopyAutoXP;
        }
    }

    /**自动释放合击设置 */
    protected onXpSetChangeHandler():void {
        CacheManager.sysSet.materialCopyAutoXP = !CacheManager.sysSet.materialCopyAutoXP;
        this.XPSetBtn.selected = !CacheManager.sysSet.materialCopyAutoXP;
    }
}