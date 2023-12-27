class CheckPointCache implements ICache {

    /**能量（杀怪数量） */
    private _energe:number = 0;
    /**是否自动挑战 */
    private _isAuto:boolean = false;

    //上一次通关第几关
    private _lastFloor:number = 0;

    //当前通关第几关
    private _curFloor:number = 0;

    /**客户端动画表现能量 */
    private _clientEnerge:number = 0;

    /**当前关卡挑战Boss所需能量值 */
    private _maxEnerge:number = 0;

    //是否可进入挑战当前关卡boss
    private _canChallenge:boolean = false;

    /**是否进入遭遇战了 */
    public enterEncounter:boolean = false;
    //是否闯关成功
    private _isSuccess:boolean = false;
    private _isShowBossLife:boolean = true;
    private _isComplete:boolean = false;//进关卡动效是否播放完毕
    public constructor() {
    }

    public set isComplete(value:boolean) {
        this._isComplete = value;
        EventManager.dispatch(LocalEventEnum.SwitchBossLifeBarVisible);
    }

    public set isShowBossLife(value:boolean) {
        this._isShowBossLife = value;
        EventManager.dispatch(LocalEventEnum.SwitchBossLifeBarVisible);
    }

    public get isShowBossLife():boolean {
        return this._isShowBossLife && this._isComplete;
    }

    public set isAuto(value:boolean) {
        this._isAuto = value;
    }

    public get isAuto():boolean {
        return this._isAuto;
    }

    public set energe(value:number) {
        this._energe = value;
    }

    public get energe():number {
        return this._energe;
    }

    public set curFloor(value:number) {
        this._curFloor = value;
    }

    public get curFloor(): number {
        return this._curFloor;
    }

    public set lastFloor(value:number) {
        if (value != this._curFloor)
            this._lastFloor = value;
    }

    public get lastFloor(): number {
        return this._lastFloor;
    }

    public isNextFloor():boolean {
        return this.curFloor - this.lastFloor == 1;
    }

    public set clientEnerge(value:number) {
        this._clientEnerge = value;

        //更新是否可挑战
        this.updateCanChallenge();
    }

    public get clientEnerge(): number {
        return this._clientEnerge;
    }

    public set maxEnerge(value:number) {
        this._maxEnerge = value;

        //更新是否可挑战
        this.updateCanChallenge();
    }

    public get maxEnerge(): number {
        return this._maxEnerge;
    }

    public set canChallenge(value:boolean) {
        if(this._canChallenge != value) {
            this._canChallenge = value;
            EventManager.dispatch(LocalEventEnum.CheckPointCanChellengeUpdate);
        }
    }

    public get canChallenge():boolean {
        return this._canChallenge;
    }

    //更新当前通关情况
    public updateCheckPointData(): void {
        //已通关数+1代表当前将要挑战的关卡
        let floor:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint) + 1;
        this.isChallengeSuccess = floor > this.curFloor && CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint);
        let last:number = this.curFloor;
        this.curFloor = floor;
        this.lastFloor = last;
        //console.log("通关======",this.lastFloor + "->" + this.curFloor)

        //更新当前关卡所需能量值
        let checkPointCfg:any = ConfigManager.checkPoint.getCheckPoint(this.curFloor);
        if(checkPointCfg) {
            this.maxEnerge = checkPointCfg.energe ? checkPointCfg.energe : 0;
        }
        else {
            this.maxEnerge = 99999999999;
        }
    }

    public get isChallengeSuccess():boolean {
        return this._isSuccess;
    }

    public set isChallengeSuccess(value:boolean) {
        this._isSuccess = value;
    }

    private updateCanChallenge(): void {
        this.canChallenge = this.clientEnerge >= this.maxEnerge;
    }

    /**当前通关数量 */
    public get passPointNum():number {
        let floor:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint);
        return floor;
    }

    /**获取当前关卡副本code */
    public get curCopy():any {
        let mapMaping:any = ConfigManager.mapMaping.getByPk(CacheManager.map.mapId);
        if(!mapMaping) return null;
        let copyMapId:number = mapMaping.toMapId;
        let copy:any = ConfigManager.copy.getCopysByMapId(copyMapId,ECopyType.ECopyCheckPoint);
        return copy;
    }

    public isInCheckPointBossCopy():boolean {
        return CacheManager.map.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint)
            && CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint);
    }

    /**
     * 背包是否有足够空间
     */
    public canChallengeEx(showTips:boolean = false):boolean {
        let limitNumPack: number = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
        let hasCapacity:boolean = CacheManager.pack.backPackCache.isHasCapacity(limitNumPack);
        if(showTips && !hasCapacity) {
            EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
        }
        return hasCapacity && !UIManager.isShow(ModuleEnum.Team);
    }
    
    /**
     * 当前关卡是否可以捡完掉落自动退出
     * 翅膀关卡不能自动退出，由外观开启那手动退出
     */
    public get isCanAutoLeft(): boolean {
        return this.curFloor != 16;
    }

    /**
     * 当前关卡是否为解救关卡。宠物和坐骑
     */
    public get isCollectCheckpoint(): boolean {
        return this.passPointNum == 9 || this.passPointNum == 18;
    }

    /**
     * 是否显示关卡进度
     */
    public get isCheckPointViewShow(): boolean {
        let floor: number = this.passPointNum;
		return floor >= 11 && (ConfigManager.checkPoint.isCheckPointMap(floor + 1, CacheManager.map.mapId) || CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter));
    }

    /**是否在关卡副本中 */
    public get isInCopy(): boolean {
        return CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint);
    }

    public clear() {
        this._isShowBossLife = true;
    }
}