class MiningController {
    private _module: ArenaModule;

    public constructor() {
    }

    public set module(value:ArenaModule){
        this._module = value;
    }

    public addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.ReqEnterMiningCopy, this.onReqEnterMiningCopy, this);
        this.addListen0(LocalEventEnum.ReqEnterMiningChallengeCopy, this.onReqEnterMiningChallengeCopy, this);
        this.addListen0(LocalEventEnum.ReqOperateMining, this.onReqOperateMining, this);
        this.addListen0(LocalEventEnum.ReqUpgradeMining, this.onReqUpgradeMining, this);
        this.addListen0(LocalEventEnum.ReqFastMining, this.onReqFastMining, this);
        this.addListen0(LocalEventEnum.ReqGetMiningReward, this.onReqGetMiningReward, this);
        this.addListen0(LocalEventEnum.ReqGetMiningRecord, this.onReqGetMiningRecord, this);
        this.addListen0(UIEventEnum.SceneMapUpdated,this.onSceneMapUpdated,this);

        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMiningCopyInfo], this.onMiningCopyInfo, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicUpdatePlayerMiningInfo], this.onMiningUpdatePlayerInfo, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicUpdateMiningCopyMaxFloor], this.onMiningUpdateMaxFloor, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicMiningRecord], this.onMiningRecord, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicUpdatePlayerMiningRecord], this.onMiningUpdateRecord, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicPlayerMinerRefrshInfo], this.onMiningHireInfo, this);
    }

    protected addListen0(name: any, listener: Function, listenerObj: any): void {
        EventManager.addListener(name, listener, listenerObj);
    }

    /**
     * 添加服务器消息监听
     */
    protected addMsgListener(type: string, listener: Function, listenerObj: any): void {
        App.MessageCenter.addListener(type, listener, listenerObj);
    }

    /**
     * 挖矿信息
     * @param msg:SMiningCopyInfo
     */
    private onMiningCopyInfo(msg:any) {
        CacheManager.mining.updateSceneMiningInfo(msg);
    }

    /**
     * 更新挖矿信息 - 上线时会推送一次
     * @param msg:SPlayerMiningInfo
     */
    private onMiningUpdatePlayerInfo(msg:any) {
        CacheManager.mining.updatePlayerMiningInfo(msg);
    }

    /**
     * 更新挖矿最大层
     * @param msg:SDictIntInt
     */
    private onMiningUpdateMaxFloor(msg:any) {
        CacheManager.mining.updateMaxFloor(msg.intIntDict);
    }

    /**
     * 挖矿记录
     * @param msg:SMiningRecord
     */
    private onMiningRecord(msg:any) {
        CacheManager.mining.updateMiningRecord(msg);
    }

    /**
     * 更新挖矿记录
     * @param msg:SPlayerMiningRecord
     */
    private onMiningUpdateRecord(msg:any) {
        CacheManager.mining.updatePlayerMiningRecord(msg);
    }

    /**
     * 矿工刷新信息
     * @param msg:SMinerRefreshInfo
     */
    private onMiningHireInfo(msg:any) {
        CacheManager.mining.updateMyMiningHireInfo(msg);
    }

    /**
     * 进入挖矿副本	   C2S_SEnterMiningCopy
     */
    private onReqEnterMiningCopy(copyCode:number, floor:number) {
        Log.trace(Log.MINING, `当前层:${CacheManager.mining.curFloor}->请求进入:${floor}`);
        ProxyManager.arena.reqEnterMiningCopy(copyCode, floor)
    }

    /**
     * 进入挖矿挑战副本   C2S_SEnterMiningChallengeCopy
     */
    private onReqEnterMiningChallengeCopy(copyCode:number, sEntityId:any, recordId:number) {
        ProxyManager.arena.reqEnterMiningChallengeCopy(copyCode, sEntityId, recordId);
    }

    /**
     * 开始挖矿 		SInt 矿工id
     */
    private onReqOperateMining(minerId:number, autoBuy:number) {
        ProxyManager.arena.reqOperateMining(minerId, autoBuy);
        CacheManager.mining.needGetReward = true;
    }

    /**
     * 提升挖矿品质
     */
    private onReqUpgradeMining(useItem:number) {
        ProxyManager.arena.reqUpgradeMining(useItem);
    }

    /**
     * 快速完成挖矿
     */
    private onReqFastMining() {
        ProxyManager.arena.reqFastMining();
    }

    /**
     * 领取挖矿奖励 	Message::Public::SInt 0.普通1.双倍
     */
    private onReqGetMiningReward(isDouble:boolean) {
        ProxyManager.arena.reqGetMiningReward(isDouble?1:0);
    }

    /**
     * 获取挖矿记录
     */
    private onReqGetMiningRecord() {
        ProxyManager.arena.reqGetMiningRecord();
    }

    private onSceneMapUpdated() {
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)) {
            CacheManager.mining.updatePassPoints();
        }
    }
}