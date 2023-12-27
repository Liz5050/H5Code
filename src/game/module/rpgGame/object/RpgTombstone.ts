/**坟墓怪 不可攻击有名字 有boss刷新倒计时*/
class RpgTombstone extends RpgGameObject {
	public constructor() {
		super();
		this.objType = RpgObjectType.Tomstone;
	}
	public init(data: EntityInfo): void {
		super.init(data);
		this.addComponent(ComponentType.Aoi);
		//this.addComponent(ComponentType.Head);
        this._hasInit = true;
	}
	public setInCamera(value: boolean) {
		super.setInCamera(value);
		if (value) {
            this.addComponent(ComponentType.Avatar);
            this.addComponent(ComponentType.TomstoneHead);         
        } else {
            this.removeComponent(ComponentType.Avatar);
            this.removeComponent(ComponentType.TomstoneHead);
		}
	}

	public get mcName():string
    {
        return ConfigManager.boss.getModelId(this.entityInfo.code_I);
    }
}