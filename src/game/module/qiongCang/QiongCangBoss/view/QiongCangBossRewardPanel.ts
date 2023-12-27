class QiongCangBossRewardPanel extends BaseContentView {
    private itemList: List;
    private bossCode: number;

	private closeBtn:fairygui.GButton;
    public constructor() {
        super(PackNameEnum.QiongCangBoss, "QiongCangBossRewardPanel");
        this.modal = true;
		this.modalAlpha = 0;
		this.isCenter = true;
		this.isPopup = true;
    }

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
		
		this.closeBtn = this.getGObject("btn_close").asButton;
		this.closeBtn.addClickListener(this.hide,this);
    }

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.BossRewardResult,this.hide,this);
	}

    public updateAll(data: any = null): void {
        this.bossCode = <number>data;
        let gameBossInf:any = ConfigManager.mgGameBoss.getByPk(this.bossCode);
        let rewards:ItemData[] = RewardUtil.getRewards(gameBossInf.showReward);
        // let listData:any[] = [];
        // for (let data of rewards) {
        //     listData.push({itemData:data, none:1});
        // }
        this.itemList.data = rewards;
    }

}