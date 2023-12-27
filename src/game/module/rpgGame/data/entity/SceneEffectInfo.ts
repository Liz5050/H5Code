/**
 * 场景特效数据
 * @author Chris
 */
class SceneEffectInfo extends EntityBaseInfo {
    public mapId:number;
    public scaleX:number;
    public scaleY:number;

    public constructor() {
        super();
        this.gType = EEntityType.EEntityTypeSceneEffect;
    }

    public setData(gridX:number, gridY:number, mapId:number, effectName:string, scaleX:number = 1, scaleY:number = 1): void {
        this.col = gridX;
        this.row = gridY;
        this.mapId = mapId;
        this.gName = effectName;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    public get name(): string {
        return this.gName;
    }
}