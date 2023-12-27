/**
 * 怪物模型显示
 */
class BossModelPanel extends fairygui.GComponent {
	private mc: RpgMovieClip;
	private lastModelId: string;

	public constructor() {
		super();
	}

	public updateByBossCode(bossCode: number): void {
		let modelId: string = ConfigManager.boss.getModelId(bossCode);
		if (modelId == this.lastModelId) {
			return;
		}
		if (this.mc != null) {
			this.mc.reset();
            App.DisplayUtils.removeFromParent(this.mc);
		}
		this.mc = ObjectPool.pop("RpgMovieClip");
		(this.displayObject as egret.DisplayObjectContainer).addChild(this.mc);
		this.mc.setData(ResourcePathUtils.getRPGGameMonster(), modelId + "", AvatarType.Player, ELoaderPriority.UI_EFFECT);
		this.mc.gotoAction(Action.Stand, Dir.Bottom);
		this.lastModelId = modelId;
		this.mc.x = 500;
		this.mc.y = 500;
	}

}