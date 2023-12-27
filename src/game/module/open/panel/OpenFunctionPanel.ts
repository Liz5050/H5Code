/**
 * 功能开启
 */
class OpenFunctionPanel extends BaseTabPanel {
	private iconLoader: GLoader;

	public initOptUI(): void {
		this.iconLoader = <GLoader>this.getGObject("loader_icon");
	}

	public updateAll(): void {

	}

	public update(cfg: any): void {
		if (cfg != null) {
			this.iconLoader.load(`ui://${PackNameEnum.Open}/preview_${cfg.openId}`);
		}
	}

	public getIconPos(): egret.Point {
		let pos: egret.Point = this.iconLoader.localToGlobal()
		return new egret.Point(pos.x + 61, pos.y + 61);
	}
}