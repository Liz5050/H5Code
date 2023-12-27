class MiningHireController extends BaseController {
    private module: MiningHireModule;
    private resultWin: MiningResultWindow;
    private robWin: MiningRobWindow;
    private revengeWin: MiningRevengeWindow;
    private recordWin: MiningRecordWindow;
    private canGetWin: MiningCanGetWindow;

    public constructor() {
        super(ModuleEnum.MiningHire);
    }

    public initView(): BaseModule {
        this.module = new MiningHireModule();
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addListen0(UIEventEnum.OpenMiningResult, this.onOpenResult, this);
        this.addListen0(UIEventEnum.OpenMiningRob, this.onOpenRob, this);
        this.addListen0(UIEventEnum.OpenMiningRevenge, this.onOpenRevenge, this);
        this.addListen0(UIEventEnum.OpenMiningRecord, this.onOpenRecord, this);
        // this.addListen0(UIEventEnum.SceneClickNpc, this.onClickNpc, this);

        this.addListen0(LocalEventEnum.MiningResult, this.onMiningResult, this);
        this.addListen0(LocalEventEnum.MiningResultClose, this.onMiningResultClose, this);
        this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdated,this);
        this.addListen0(LocalEventEnum.UpdateMyMiningHireInfo,this.onHireInfoUpdated,this);
        this.addListen0(LocalEventEnum.StartMyNewMine, this.onStartMyNewMine, this);
    }

    public addListenerOnShow():void {
        this.addListen1(NetEventEnum.packPosTypePropChange, this.onPackItemUpdate, this);
    }

    private onOpenResult() {
        if (!this.resultWin) {
            this.resultWin = new MiningResultWindow();
        }
        this.resultWin.show();
    }

    private onCanGetMiningReward() {
        if(!CacheManager.mining.needGetReward) {
            return;
        }
        if(!this.canGetWin) {
            this.canGetWin = new MiningCanGetWindow();
        }
        if (ResourceManager.isPackageLoaded(PackNameEnum.Common)) {
            this.canGetWin.show();
        }
    }

    private onOpenRob(minerPos:number) {
        if (!this.robWin) {
            this.robWin = new MiningRobWindow();
        }
        this.robWin.show(minerPos);
    }

    private onOpenRevenge(data:any) {
        if (!this.revengeWin) {
            this.revengeWin = new MiningRevengeWindow();
        }
        this.revengeWin.show(data);
    }

    private onOpenRecord() {
        if (!this.recordWin) {
            this.recordWin = new MiningRecordWindow();
        }
        this.recordWin.show();
    }

    // private onClickNpc(npcId:number) {
    //     if (npcId == RpgGameConst.NPC_ID_MINING) {
    //         this.show();
    //     }
    // }

    private onMiningResult() {
        if (CacheManager.mining.canGetReward && CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)) {
            this.onOpenResult();
        }
        else if(CacheManager.mining.canGetReward && !CacheManager.copy.isInCopy) {
            this.onCanGetMiningReward();
        }
        else {
            this.onMiningResultClose();
        }
    }

    private onSceneMapUpdated() {
        this.onMiningResult();
        CacheManager.mining.checkOpenHire();
    }

    private onMiningResultClose() {
        if (this.resultWin && this.resultWin.isShow) {
            this.resultWin.hide();
        }
    }

    private onHireInfoUpdated() {
        if (this.isShow) {
            this.module.updateRefreshInfo();
        }
    }

    private onStartMyNewMine() {
        if (this.isShow) {
            this.hide();
        }
    }

    private onPackItemUpdate() {
        if (this.isShow) {
            this.module.updateItemCost();
        }
    }
}
