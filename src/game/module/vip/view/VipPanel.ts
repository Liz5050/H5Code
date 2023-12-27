class VipPanel extends BaseView {
    private activePanel: VipActivePanel;

    public initOptUI(): void {
        // this.activePanel = new VipActivePanel(this.getGObject("panel_active").asCom);
    }

    public updateAll(): void {
        this.activePanel.updateAll();
    }

    public updateRewardGet() {
        this.activePanel.updateRewardGet();
    }
}