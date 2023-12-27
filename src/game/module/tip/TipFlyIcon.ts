/**
 * 飘物品图标到背包
 */
class TipFlyIcon extends TipBase {
	private tips: Array<any>;
	private packPos: egret.Point;

	public constructor() {
		super();
		this.tips = [];
	}

	public do(tip: any): void {
		this.packPos = ControllerManager.home.getHomeBtnGlobalPos(ModuleEnum.Pack, false, true);
		if (this.packPos == null) {
			return;
		}
		let itemData: ItemData;
		itemData = new ItemData(tip["itemCode"]);
		let loader: GLoader = new GLoader();
		LayerManager.UI_Tips.addChild(loader);
		loader.x = tip["x"];
		loader.y = tip["y"];
		loader.load(itemData.getIconRes());
		egret.Tween.get(loader).to({ x: this.packPos.x, y: this.packPos.y },1000, egret.Ease.sineOut).call(function () {
			loader.dispose();
		});
	}
}