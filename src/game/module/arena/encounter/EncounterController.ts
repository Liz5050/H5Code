class EncounterController extends ArenaSubController {
    private rewardWin: EncounterRewardWindow;
    private resultTip:string;
    private firstCheck: boolean;
    private tipTimeoutId:number;

    public constructor() {
        super();
    }

    protected addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.ReqEncounterInfo,this.onReqInfo,this);
        this.addListen0(LocalEventEnum.ReqEncounterRank,this.onReqRank,this);
        this.addListen0(LocalEventEnum.ReqEncounterChallenge,this.onReqChallenge,this);
        this.addListen0(UIEventEnum.OpenEncounterReward,this.onOpenRewardWin,this);
        // this.addListen0(LocalEventEnum.EncounterResult,this.onResult,this);
        this.addListen0(NetEventEnum.copySuccess,this.onCopySuccess,this);
        this.addListen0(NetEventEnum.copyFail,this.onCopyFail,this);
        this.addListen0(UIEventEnum.SceneMapUpdated,this.onFirstCheckTips,this);
        this.addListen0(LocalEventEnum.EncounterOpen,this.removeCheck,this);
        this.addListen0(LocalEventEnum.EncounterClose,this.startCheck,this);

        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetEncounterInfo],this.onEncounterInfo,this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicEncounterClose],this.onEncounterClose,this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameEncounterClearPk],this.onEncounterClearPk,this);
        // this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetEncounterRank],this.onEncounterRank,this);
    }

    private onReqInfo() {
        ProxyManager.arena.encounterInfo();
    }

    private onReqRank() {
        ProxyManager.arena.encounterRank();
    }

    private onReqChallenge(sEntityId:any, index:number) {
        CacheManager.checkPoint.enterEncounter = true;
        ProxyManager.arena.encounterChallenge(sEntityId, index);
    }

    /**
     * SEncounterInfo
     */
    private onEncounterInfo(msg:any) {
        CacheManager.encounter.updateInfo(msg);
        if (this.isShow) {
            this.module.updateEncounterInfo();
            this.module.setBtnTips(PanelTabType.Encounter,CacheManager.encounter.checkTips());
        }
        if (this.firstCheck) {
            this.startCheck();
            this.firstCheck = false;
        }
    }

    /**
     * SeqEncounterRank
     */
    private onEncounterRank(msg:any) {

    }

    /**
     * 结算
     */
    private onEncounterClose() {
        this.onReqInfo();
    }

    /**
     * 清除pk后返回清除的索引
     */
    private onEncounterClearPk(msg:any) {
        let info:any = CacheManager.encounter.getTarget(msg.value_I);
        if (info) {
            this.onReqChallenge(info.entityId, msg.value_I);
        }
    }

    private onCopyFail(copyCode:number) {
        if (CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
            this.onResult(false);
        }
    }

    private onCopySuccess(copyCode:number) {
        if (CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
            this.onResult(true);
        }
    }

    private onResult(isSuccess:boolean) {
        this.resultTip = isSuccess ? LangArena.LANG25 : LangArena.LANG26;
        this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdated,this);
        EventManager.dispatch(LocalEventEnum.ShowBroadStory, { msg: this.resultTip, isFirst: true, changeMapNoClear:true });
    }

    private onSceneMapUpdated() {
        EventManager.removeListener(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdated,this);
        if (this.resultTip) {
            // EventManager.dispatch(LocalEventEnum.ShowBroadStory, { msg: this.resultTip, isFirst: true, delay:1000 });
            this.resultTip = null;
            if (CacheManager.encounter.info.pkScore_I < EncounterCache.FULL_PK_SCORE && !TaskCache.isFirstEndEncounterTask) {
                if (!UIManager.isOpenView()) EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.Encounter });
            }
            
            if(TaskCache.isFirstEndEncounterTask) {
                TaskCache.isFirstEndEncounterTask = false;
            }
        }
    }

    private onFirstCheckTips() {
        if (ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Encounter],false)) {
            EventManager.removeListener(UIEventEnum.SceneMapUpdated,this.onFirstCheckTips,this);
            this.firstCheck = true;
            this.onReqInfo();
        }
    }

    private onOpenRewardWin() {
        if(!this.rewardWin) {
            this.rewardWin = new EncounterRewardWindow();
        }
        this.rewardWin.show();
    }
    
    private startCheck() {
        if (!CacheManager.encounter.checkTips() && ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Encounter],false)) { //当前没红点
            let delay:number;
            let pkScore:number = CacheManager.encounter.info.pkScore_I;
            if (pkScore > EncounterCache.FULL_PK_SCORE - 1) {
                let leftSyncSec:number = CacheManager.encounter.info.updateDt_I + 60 - CacheManager.serverTime.getServerTime();//更新剩余时间
                let eliminateScore: number = pkScore - EncounterCache.FULL_PK_SCORE + 1;
                delay = eliminateScore > 1 ? leftSyncSec * 1000 + (eliminateScore - 1) * 60000 : leftSyncSec * 1000;
            } else if (CacheManager.encounter.info.targets.data.length <= 0) {
                let leftSyncSec:number = CacheManager.encounter.info.updateDt_I + 60 - CacheManager.serverTime.getServerTime();//更新剩余时间
                delay = leftSyncSec * 1000;
            }
            Log.trace(Log.ENCOUNTER, "检查遭遇战红点定时器===>", delay + 'ms');
            this.tipTimeoutId = egret.setTimeout(this.onReqInfo, this, delay);
        }
    }

    private removeCheck() {
        if (this.tipTimeoutId > 0) {
            egret.clearTimeout(this.tipTimeoutId);
            this.tipTimeoutId = 0;
        }
    }
}