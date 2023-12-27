class PersonalBossCopyView extends BaseCopyPanel {
    public constructor(copyInf:any) {
        super(copyInf,"KingBattleCopyView");
    }

    public initOptUI():void {
        super.initOptUI();
        this.XPSetBtn.visible = true;
    }
}