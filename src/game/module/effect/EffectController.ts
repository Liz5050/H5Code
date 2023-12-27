/**
 * 通用场景特效管理
 */
class EffectController extends BaseController {
	/*** 使用池*/
	private static POOL: Array<MovieClip> = [];
	
	private levelup_bottomMc: MovieClip;
	private levelup_middleMc: MovieClip;
	private levelup_topMc: MovieClip;
	private task_finishMc: MovieClip;

	public constructor() {
		super(ModuleEnum.Effect);
	}

	public initOptUI(): void {
	}

	public updateAll(): void {
	}

	public initView(): BaseModule {
		return null;
	}

	public addListenerOnInit(): void {
		this.addListen0(NetEventEnum.roleLevelUpdate, this.onRoleLevel, this);
		// this.addListen0(LocalEventEnum.TaskFinished, this.onTaskFinished, this);
        App.StageUtils.getStage().addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStage, this);
	}

	/**主角升级 */
	private onRoleLevel(data: any = null): void {
		if (!ControllerManager.scene.sceneReady) return;

		let kingEntity: MainPlayer = CacheManager.king.leaderEntity; //this.fromObj.avatar
		if (kingEntity != null && kingEntity.avatar) {
			if (!this.levelup_bottomMc) {
				this.levelup_bottomMc = ObjectPool.pop("MovieClip");
				if (EffectController.POOL.indexOf(this.levelup_bottomMc) == -1)
					EffectController.POOL.push(this.levelup_bottomMc);
			}
			this.levelup_bottomMc.playFile(ResourcePathUtils.getRPGGameCommon() + "levelup_bottom", 1, ELoaderPriority.UI_EFFECT);
			this.levelup_bottomMc.x = this.levelup_bottomMc.y = 0;
			kingEntity.avatar.effectDownLayer.addChild(this.levelup_bottomMc);

            if (!this.levelup_middleMc) {
                this.levelup_middleMc = ObjectPool.pop("MovieClip");
                if (EffectController.POOL.indexOf(this.levelup_middleMc) == -1)
                    EffectController.POOL.push(this.levelup_middleMc);
            }
            this.levelup_middleMc.playFile(ResourcePathUtils.getRPGGameCommon() + "levelup_middle", 1, ELoaderPriority.UI_EFFECT);
            this.levelup_middleMc.x = this.levelup_middleMc.y = 0;
            kingEntity.avatar.effectUpLayer.addChild(this.levelup_middleMc);

			if (!this.levelup_topMc) {
				this.levelup_topMc = ObjectPool.pop("MovieClip");
				if (EffectController.POOL.indexOf(this.levelup_topMc) == -1)
					EffectController.POOL.push(this.levelup_topMc);
			}
			this.levelup_topMc.playFile(ResourcePathUtils.getRPGGameCommon() + "levelup_top", 1, ELoaderPriority.UI_EFFECT);
			this.levelup_topMc.x = this.levelup_topMc.y = 0;
			kingEntity.avatar.effectUpLayer.addChild(this.levelup_topMc);

			//升级音效
			App.SoundManager.playEffect(SoundName.Effect_JueSeShengJi);
		}
	}

	/**任务完成 */
	private onTaskFinished(): void {
		if (!ControllerManager.scene.sceneReady) return;

		let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
		if (kingEntity != null && kingEntity.avatar) {
			if (!this.task_finishMc) {
				this.task_finishMc = ObjectPool.pop("MovieClip");
				if (EffectController.POOL.indexOf(this.task_finishMc) == -1)
					EffectController.POOL.push(this.task_finishMc);
			}
			this.task_finishMc.playFile(ResourcePathUtils.getRPGGameCommon() + "task_finish", 1, ELoaderPriority.UI_EFFECT);
			this.task_finishMc.x = fairygui.GRoot.inst.width / 2;
			this.task_finishMc.y = 300;
			LayerManager.UI_Cultivate.displayListContainer.addChild(this.task_finishMc);
		}
	}

    /**
     * 首次点击舞台播放一个音效
     */
    private onClickStage() {
    	console.log("直接打印:用户点击交互-播放一个测试音效~");
    	if (App.SoundManager.playFirstSound()) {
            App.StageUtils.getStage().removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickStage, this);
            App.SoundManager.hasInteract = true;
            App.SoundManager.setBgOn(true);
		}
    }

	public clearEffects(): void {
		for (let mc of EffectController.POOL) {
			mc.destroy();
			mc = null;
		}
		EffectController.POOL = [];
	}
}