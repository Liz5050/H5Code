
class PassPointEntity extends RpgGameObject {
    public constructor() {
        super();
        this.objType = RpgObjectType.PassPoint;
    }

    public init(data: PassPointInfo): void {
        super.init(data);
        this.addComponent(ComponentType.Aoi);
        this._hasInit = true;
    }

    public setInCamera(value: boolean):void {
        super.setInCamera(value);
        if (value) {
            this.addComponent(ComponentType.AvatarMc);
            this.addComponent(ComponentType.Head);
        }
        else {
            this.removeComponent(ComponentType.AvatarMc);
            this.removeComponent(ComponentType.Head);
        }
    }

    public destory(): void {
        super.destory();
    }

    public onClick(...params): void {
        if(CacheManager.king.leaderEntity && CacheManager.king.leaderEntity.currentState == EntityModelStatus.ScaleTween)
            return;
        this.passPointToMap();
    }

    public passPointToMap():void
    {
        let passPoint:PassPointInfo = this.entityInfo;
        if (passPoint.passPointType == EPassType.EPassTypeByPassPoint) {//传送到地图
            EventManager.dispatch(LocalEventEnum.RoleScaleHide,{call:this.hideComplete, caller:this});
        } else if (passPoint.passPointType == EPassType.EPassTypeCopy) {//传送到副本
            let copyProcess:number;
            if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)) {//做传送阵显隐操作
                copyProcess = CacheManager.mining.curFloor + (passPoint.process==1?-1:1);
            }
            EventManager.dispatch(LocalEventEnum.ReqEnterMiningCopy, passPoint.passTo[0].passToId, copyProcess);
        }
    }

    private hideComplete():void
    {
        let passPoint:PassPointInfo = this.entityInfo;
        if(passPoint != null && passPoint.passTo != null && passPoint.passTo.length > 0){
            ProxyManager.operation.pass(passPoint.passPointType, passPoint.passPointId, passPoint.passTo[0].passToId);
        }
    }

    public get mcName():string
    {
        return "pass";
    }

    public get entityInfo():PassPointInfo
    {
        return this._entityInfo as PassPointInfo;
    }
}