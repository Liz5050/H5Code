class WorldMapModule extends BaseWindow {
	private controller: fairygui.Controller;
	private worldMapPanel: WorldMapPanel;
	private regionMapPanel: RegionMapPanel;
	private nameTxt: fairygui.GTextField;

	private mapInfo: MapInfo;

	public constructor(moduleId: ModuleEnum) {
		super(PackNameEnum.WorldMap, "Main", moduleId);
	}

	public initOptUI(): void {
		// this.controller = this.getController("c1");
		this.regionMapPanel = new RegionMapPanel(this.getGObject("panel_region").asCom, this.controller, 0, false);
		// this.worldMapPanel = new WorldMapPanel(this.getGObject("panel_world").asCom, this.controller, 1);
		this.nameTxt = this.getGObject("txt_name").asTextField;
	}

	public updateAll(data:any=null): void {
		// this.controller.selectedIndex = 0;
		this.regionMapPanel.updateAll(data);
		this.mapInfo = ConfigManager.map.getMapInfo(data);
        this.nameTxt.text = this.mapInfo.getByKey("name");
	}

	public onHide(): void {
		super.onHide();
		this.regionMapPanel.stopTimer();
		// this.regionMapPanel.clearClickBossTimes();
	}

	public updatePathNodes(pathNodes: PathNode[]): void {
		// if (this.controller.selectedIndex == 0) {
			this.regionMapPanel.drawPath(pathNodes);
		// }
	}

	public updateRegionPanel(mapId: number): void {
		this.regionMapPanel.updateAll(mapId);
	}

}