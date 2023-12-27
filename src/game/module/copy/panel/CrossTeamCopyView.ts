class CrossTeamCopyView extends BaseCopyPanel {
    private headList: List;
    private stepCount: number = 0;
    private _starView: CopyStarPanel;
    private lookupBtn : fairygui.GButton;
    public constructor(copyInfo: any) {
        super(copyInfo, "CrossTeamCopyView");
        this.isCenter = true;
        this.thisParent = LayerManager.UI_Home;
    }

    public initOptUI(): void {
        super.initOptUI();
        this._starView = new CopyStarPanel(this.getGObject("cnt").asCom);
        this.headList = new List(this.getGObject("list_head").asList);
        this.headList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
        this.lookupBtn = this.getGObject("btn_lookup").asButton;
        this.lookupBtn.addClickListener(this.onClickLookup, this);
        this.XPSetBtn.visible = true;
    }

    protected addListenerOnShow(): void {
        super.addListenerOnShow();
        App.TimerManager.doTimer(1000, 0, this.step, this);
        this.addListen1(LocalEventEnum.MonsterDied, this.onMonsterDied, this);
        this.addListen1(LocalEventEnum.SceneClickEntity, this.openAuto, this);
        CacheManager.team2.setEnterCopyAutoCount(Team2Cache.COUNT_NO_TEAM);
    }

    public hide(param: any = null, callBack: CallBack = null): void {
        super.hide(param, callBack);
        App.TimerManager.removeAll(this);
        EventManager.removeListener(LocalEventEnum.MonsterDied, this.onMonsterDied, this);
        this.stepCount = 0;

        if(this._starView){
            this._starView.hide();
        }
        this.headList.data = [];
    }

    protected dealLeft():void{
        super.dealLeft();
        //跨服组队退出副本的同时退出组队
        EventManager.dispatch(LocalEventEnum.ExitTeamCross);
    }

    public updateAll(data : any):void {
        super.updateAll(data);
        if(!this._starView.isShow){
            this._starView.show(this.copyInf);
        }
        this.forceStep();
    }

    private forceStep():void {
        this.step(true);
    }

    private step(force:boolean = false) {
        if (ControllerManager.scene.sceneState != SceneStateEnum.AllReady) return;
        this.stepCount++;
        if (force || this.stepCount % 2 == 0) {//更新怪物列表
            let monsters:RpgGameObject[] = CacheManager.map.getTargetsSortByDis();
            let eliteAndBossList:RpgGameObject[] = [];
            let eliteList:RpgGameObject[] = [];
            let bossList:RpgGameObject[] = [];
            for (let obj of monsters) {//筛选出精英和BOSS
                if (EntityUtil.isBoss(obj.entityInfo) ) {
                    bossList.push(obj);
                }
                if(EntityUtil.isEliteBoss(obj.entityInfo)) {
                    eliteList.push(obj);
                    //eliteAndBossList.push(obj);
                }
            }
            bossList.sort(function(a, b){
                return a.entityInfo.code_I - b.entityInfo.code_I;
            });

            eliteList.sort(function(a, b){
                return a.entityInfo.code_I - b.entityInfo.code_I;
            });

            for(let obj of eliteList) {
                bossList.push(obj);
            }



            //let first4:RpgGameObject[];
            //if (eliteAndBossList.length <= 4) first4 = eliteAndBossList;
            //else first4 = eliteAndBossList.splice(0, 4);
            this.headList.data = bossList;
            if(bossList.length >= 4) {
                this.headList.list.resizeToFit(4);
            }
            else {
                this.headList.list.resizeToFit(bossList.length);
            }
        }
    }

    private onClickItem(evt:fairygui.ItemEvent) {
        let item:LegendBossHeadItem = (evt.itemObject as LegendBossHeadItem);
        // EventManager.dispatch(LocalEventEnum.FocusAttack, item.getData());
        CacheManager.bossNew.battleObj = item.getData();
        this.headList.data = this.headList.data;
        this.headList.list.resizeToFit(4);
        //EventManager.dispatch(LocalEventEnum.SceneClickEntity, item.getData(), false, true, true);

    }

    private onMonsterDied() {
        App.TimerManager.doFrame(20, 1, this.forceStep, this);
    }


    private onClickLookup() {
        EventManager.dispatch(UIEventEnum.CopyLegendStrategedOpen, this.copyInf.code);
    }

    private openAuto() {
        EventManager.dispatch(LocalEventEnum.AutoStartFight);
    }
}