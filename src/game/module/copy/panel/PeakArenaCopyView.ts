class PeakArenaCopyView extends BaseCopyPanel {
    public constructor(copyInfo:any) {
        super(copyInfo,"KingBattleCopyView");
        this.isCenter = true;
    }

    public initOptUI():void {
        super.initOptUI();
        this.XPSetBtn.visible = true;
    }
}