class UpgradeGuideWindow extends BaseWindow {
	private guideList: List;
	private guideDatas: Array<any>;

	public constructor(moduleId: ModuleEnum) {
		super(PackNameEnum.UpgradeGuide, "UpgradeWindow", moduleId);
	}

	public initOptUI(): void {
		this.guideList = new List(this.getGObject("list_guide").asList);
		this.guideDatas = ConfigManager.mgGuideLevel.getData();
	}

	public updateAll(): void {
		this.updateList();
	}

	private updateList(): void {
		this.guideDatas.sort((a: any, b: any) => {
			let isAOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(a.openkey, false);
			let isBOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(b.openkey, false);
			if (isAOpen && !isBOpen) {
				return -1;
			} else if (isAOpen && isBOpen) {
				return a.id - b.id;
			} else if (!isAOpen && isBOpen) {
				return 1;
			} else {
				return a.showIndex - b.showIndex;
			}
		});
		this.guideList.data = this.guideDatas;
	}
}