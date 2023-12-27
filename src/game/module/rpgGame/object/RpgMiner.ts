/**
 * 矿工怪 不可攻击有名字 有倒计时等标识
 * @author Chris
 * */
class RpgMiner extends RpgGameObject {

    public constructor() {
        super();
        this.objType = RpgObjectType.Miner;
    }

    public init(data: EntityInfo): void {
        super.init(data);
        this.addComponent(ComponentType.Aoi);
        this._hasInit = true;
    }

    public setInCamera(value: boolean) {
        super.setInCamera(value);
        if (value) {
            this.addComponent(ComponentType.AvatarMc);
            this.addComponent(ComponentType.MinerHead);
        } else {
            this.removeComponent(ComponentType.AvatarMc);
            this.removeComponent(ComponentType.MinerHead);
        }
    }

    public onClick(...params):void {
        EventManager.dispatch(UIEventEnum.OpenMiningRob, this.entityInfo.minerPos_BY);
    }

    public get mcName():string {
        return ConfigManager.boss.getModelId(this.entityInfo.code_I);
    }
}