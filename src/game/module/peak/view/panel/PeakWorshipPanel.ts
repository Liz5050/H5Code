class PeakWorshipPanel extends BaseTabView {
    private container0: egret.DisplayObjectContainer;
    private container1: egret.DisplayObjectContainer;
    private container2: egret.DisplayObjectContainer;
    private champNameTxt: fairygui.GTextField;
    private rewardNumTxt: fairygui.GTextField;
    private worshipTimeTxt: fairygui.GTextField;
    private worshipBtn: fairygui.GButton;
    private _data: any;
    private playerModel0: PlayerModel;
    private playerModel1: PlayerModel;
    private playerModel2: PlayerModel;
    private c1: fairygui.Controller;
    private entityId: any;
    private containerTitle: egret.DisplayObjectContainer;
    private titleMc: MovieClip;
    private c2: fairygui.Controller;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        //称号固定显示跨服冠军称号
        this.container0 = this.getGObject("model_container0").asCom.displayObject as egret.DisplayObjectContainer;
        this.container1 = this.getGObject("model_container1").asCom.displayObject as egret.DisplayObjectContainer;
        this.container2 = this.getGObject("model_container2").asCom.displayObject as egret.DisplayObjectContainer;

        this.playerModel0 = new PlayerModel();
        this.container0.addChild(this.playerModel0);
        this.playerModel1 = new PlayerModel();
        this.container1.addChild(this.playerModel1);
        this.playerModel2 = new PlayerModel();
        this.container2.addChild(this.playerModel2);

        this.containerTitle = this.getGObject("title_container").asCom.displayObject as egret.DisplayObjectContainer;

        this.champNameTxt = this.getGObject("txt_champ_name").asTextField;
        this.rewardNumTxt = this.getGObject("txt_reward_num").asTextField;
        this.worshipTimeTxt = this.getGObject("txt_time").asTextField;
        this.worshipBtn = this.getGObject("btn_worship").asButton;
        this.worshipBtn.addClickListener(this.onClick, this);
    }

    public updateAll(data?: any): void {

        this.c1.selectedIndex = 0;
        this.c2.selectedIndex = 0;

        let info:simple.SMgPeakArenaInfo = CacheManager.peak.info;
        if (info && CacheManager.peak.isCrossOpen) {
            this.c1.selectedIndex = 1;

            let champion:simple.ISPublicMiniPlayer = info.champion;
            if (champion && champion.entityId && champion.entityId.id_I != 0) {
                App.DisplayUtils.grayButton(this.worshipBtn, false, false);
                this.c2.selectedIndex = 1;

                this.champNameTxt.text = EntityUtil.getEntityServerName(champion);
                this.entityId = champion.entityId;

                let msgWeapons:any;
                for (let i:number=0;i<champion.roleWeapons.key_I.length;i++) {
                    msgWeapons = champion.roleWeapons.value[i];
                    this["playerModel"+i].updatePlayerModelAll(msgWeapons, champion.roleCareer.value_I[i]);
                }
                this.updateWorshipCount();
            } else {
                App.DisplayUtils.grayButton(this.worshipBtn, true, true);
            }
        }

        if (!this.titleMc) {
            this.titleMc = ObjectPool.pop("MovieClip");
            this.titleMc.x = 0;
            this.titleMc.y = 0;
            // this.titleMc.setScale(1.7);
            this.containerTitle.addChild(this.titleMc);
        }
        if (!this.titleMc.isPlaying) this.titleMc.playFile(ResourcePathUtils.getRPGGame_Title() + "200077", -1, ELoaderPriority.UI_EFFECT);
    }

    public updateWorshipCount():void {
        let count:number = CacheManager.peak.worshipCount;

        // this.rewardNumTxt.text = App.StringUtils.substitude(LangPeak.WORSHIP1, count * 1000);
        this.worshipTimeTxt.text = App.StringUtils.substitude(LangPeak.WORSHIP2, count, 3);//取最大值
    }

    private onClick() {
        if (this.entityId)
            EventManager.dispatch(LocalEventEnum.PeakWorship, this.entityId);
    }

    public hide():void {
        super.hide();
        if (this.titleMc) {
            this.titleMc.destroy();
            this.titleMc = null;
        }
    }
}