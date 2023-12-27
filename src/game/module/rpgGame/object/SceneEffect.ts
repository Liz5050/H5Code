/**
 * 场景特效
 * @author Chris
 * */
class SceneEffect extends RpgGameObject {
    public constructor() {
        super();
        this.objType = RpgObjectType.SceneEffect;
    }

    public init(data: EntityInfo): void {
        super.init(data);
        this._hasInit = true;
        this.addComponent(ComponentType.Aoi);
    }

    public setInCamera(value: boolean) {
        super.setInCamera(value);
        if (value) {
            this.addComponent(ComponentType.EffectMc);
        } else {
            this.removeComponent(ComponentType.EffectMc);
        }
    }

    public get mcPath():string {
        return this.rootPath + "sceneEffect/";
    }

    public get mcName():string {
        return this.entityInfo.name;
    }
}