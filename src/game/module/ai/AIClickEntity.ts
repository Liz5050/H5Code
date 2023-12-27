/**
 * 点击实体
 */
class AIClickEntity extends AIBase {
    private entityId: string;

    public constructor(data?: any) {
        super(data);
        this.entityId = data.entityId;
    }

    public isComplete(data?: any): boolean {
        return false;
    }

    public update(data?: any): boolean {
        if (super.update())
        {
            let entity: RpgGameObject = CacheManager.map.getEntity(this.entityId);
            if (entity != null) {
                entity.onClick();
                return true;
            }
        }
        return false;
    }
}