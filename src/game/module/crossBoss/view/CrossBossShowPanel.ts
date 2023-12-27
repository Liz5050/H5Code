class CrossBossShowPanel extends BaseWindow {
    private itemList: List;
    private fightBtn: fairygui.GButton;
    private modelContainer: fairygui.GComponent;
    private bossMc: RpgMovieClip;
    private bossCode: number;

    public constructor() {
        super(PackNameEnum.CrossBoss, "CrossBossShowPanel");
    }

    public initOptUI(): void {
        this.itemList = new List(this.getGObject("list_item").asList);
        this.fightBtn = this.getGObject("btn_fight").asButton;
        this.fightBtn.addClickListener(this.onClickFight, this);
        this.modelContainer = this.getGObject("model_container").asCom;
    }

    protected setBossMc(bossInf): void {
        let resId: string = bossInf.modelId;
        if (!this.bossMc) {
            this.bossMc = ObjectPool.pop('RpgMovieClip');
        }
        this.bossMc.setData(ResourcePathUtils.getRPGGameMonster(), resId, AvatarType.Monster, ELoaderPriority.UI_EFFECT); //9101002  9201203
        this.bossMc.gotoAction(Action.Stand, Dir.BottomLeft);
        let modelScale:number = bossInf?ObjectUtil.getConfigVal(bossInf,"modelScale",0):0;
        modelScale>0?modelScale /= 100:modelScale = 1;
        this.bossMc.scaleX = modelScale*this.bossMc.scaleX;
        this.bossMc.scaleY = modelScale;
        this.bossMc.x = 200;
        this.bossMc.y = 400;
        this.modelContainer.displayListContainer.addChild(this.bossMc);
    }

    public updateAll(data: any = null): void {
        this.bossCode = data.bossCode_I;
        let bossInf:any = ConfigManager.boss.getByPk(this.bossCode);
        this.setBossMc(bossInf);
        let gameBossInf:any = ConfigManager.mgGameBoss.getByPk(this.bossCode);
        let rewards:ItemData[] = RewardUtil.getRewards(gameBossInf.showReward);
        this.itemList.data = rewards;
    }

    public hide(param: any = null, callBack: CallBack = null):void {
        super.hide(param,callBack);
        if (this.bossMc) {
            this.bossMc.destroy();
            this.bossMc = null;
        }
    }

    private onClickFight() {
        // if(CacheManager.checkPoint.isInCheckPointBossCopy()) {
        //     Tip.showTip(LangCheckPoint.LANG1);
        //     return;
        // }
        // if (CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
        //     Tip.showTip(LangArena.LANG33, Color.Red);
        //     return;
        // }
        if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CrossBoss],false)) {
            return;
        }
        EventManager.dispatch(LocalEventEnum.CrossBossReqEnterCopy, this.bossCode);
    }
}