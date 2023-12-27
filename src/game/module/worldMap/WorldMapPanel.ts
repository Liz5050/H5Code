/**
 * 世界地图面板
 */
class WorldMapPanel extends BaseTabPanel {
	private mapContainer: fairygui.GComponent;
	private worldMap: fairygui.GComponent;
	private localityMark: fairygui.GComponent;

	public initOptUI(): void {
		this.mapContainer = this.getGObject("container_map").asCom
		this.worldMap = this.mapContainer.getChild("worldMap").asCom;
		this.localityMark = this.worldMap.getChild("localityMark").asCom;
		for (let child of this.worldMap._children) {
			if (child instanceof fairygui.GButton) {
				child.addClickListener(this.onClick, this);
			}
		}
	}

	public updateAll(): void {
		let mapId: number = CacheManager.map.mapId;
		let mapItem: fairygui.GObject = this.worldMap.getChild(`map_${mapId}`);
		if (mapItem != null) {
			this.localityMark.setXY(mapItem.x + mapItem.width / 2 - 35, mapItem.y + mapItem.height / 2 - 40);
		}
		this.localityMark.visible = mapItem != null;
	}

	private onClick(e: egret.TouchEvent): void {
		let button: fairygui.GButton = e.target;
		if (button != null && button.name.indexOf("map_") != -1) {
			let mapId: number = Number(button.name.split("_")[1]);
			if (mapId > 0) {
				EventManager.dispatch(LocalEventEnum.SceneChangeMap, mapId);
			}
		}
	}
}