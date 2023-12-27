class ContestRewardPanel extends BaseTabView {
    private static TITLE_IDs:number[] = [200087, 200079, 200088];
    private contain0: fairygui.GComponent;
    private contain1: fairygui.GComponent;
    private contain2: fairygui.GComponent;
    private rewardList: List;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.contain0 = this.getGObject("contain_0").asCom;
        this.contain1 = this.getGObject("contain_1").asCom;
        this.contain2 = this.getGObject("contain_2").asCom;
        this.rewardList = new List(this.getGObject("list_item").asList);
    }

    public updateAll(data?: any): void {
        if (!this.rewardList.data) {
            let rewards:any[] = ConfigManager.contest.getRewards(EContestConfigType.EliminateReward);
            this.rewardList.setVirtual(rewards);
        }
        this.playTitles(true);
    }

    private playTitles(value:boolean):void {
        if (value) {
            let mc:MovieClip;
            for (let i = 0;i < 3; i++) {
                mc = this["titleMc" + i];
                if (!mc) {
                    mc = ObjectPool.pop("MovieClip");
                    mc.x = 0;
                    mc.y = 0;
                    this["contain" + i].displayListContainer.addChild(mc);
                    this["titleMc" + i] = mc;
                }
                if (!mc.isPlaying) mc.playFile(ResourcePathUtils.getRPGGame_Title() + ContestRewardPanel.TITLE_IDs[i], -1, ELoaderPriority.UI_EFFECT);
            }
        } else {
            let mc:MovieClip;
            for (let i = 0;i < 3; i++) {
                mc = this["titleMc" + i];
                if (mc) {
                    mc.destroy();
                    mc = null;
                }
            }
        }
    }

    public hide():void {
        super.hide();
        this.playTitles(false);
    }
}