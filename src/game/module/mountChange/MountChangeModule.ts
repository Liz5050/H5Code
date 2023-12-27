class MountChangeModule extends ShapeBaseChangeModule {
	public constructor() {
		super(ModuleEnum.MountChange, PackNameEnum.MountChange);
		this.shapeName = "坐骑";
	}

	public initOptUI(): void {
		super.initOptUI();
		this.className = {
			[PanelTabType.MountChange]: ["MountChangePanel", MountChangePanel],
		};
	}

	public getChangeCache(): ShapeBaseChangeCache {
		return CacheManager.mountChange;
	}

	public getShapeCache(): ShapeBaseCache {
		return CacheManager.mount;
	}

	public clickDesc(): void {
		let desc: string = LangShapeBase.LANG6;
        EventManager.dispatch(UIEventEnum.BossExplainShow, {desc:desc}); 
	}
}