/**
 * 获取新技能提示窗口
 */
class SkillNewGetWindow extends BaseWindow {
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private skillIcon: string;
	private skillName: string;
	private delay: number = 3000;

	public constructor() {
		super(PackNameEnum.GetNewSkill, "Main", null, LayerManager.UI_Tips);
	}

	public initOptUI(): void {
		this.iconLoader = this.getGObject("loader_skill") as GLoader;
		this.nameTxt = this.getGObject("txt_skillName").asTextField;
		this.addClickListener(this.hideAndFly, this);
	}

	public onShow(): void {
		super.onShow();
		this.update();
		App.TimerManager.doDelay(this.delay, this.hideAndFly, this);
	}

	public updateSkill(skill: any): void {
		this.skillIcon = `resource/assets/icon/skill/${skill.skillIcon}.png`;
		this.skillName = skill.skillName;
		if (this.isShow) {
			this.update();
		}
	}

	private update(): void {
		this.iconLoader.load(this.skillIcon);
		this.nameTxt.text = this.skillName;
	}

	private hideAndFly(): void {
		App.TimerManager.remove(this.hideAndFly, this);
		this.hide();
		this.flyToPlayer();
	}

	private flyToPlayer(): void {
		let image: GLoader = ObjectPool.pop("GLoader");
		image.load(this.skillIcon);
		let start: egret.Point = this.iconLoader.localToGlobal()
		image.x = start.x;
		image.y = start.y;
		let end: egret.Point = OpenButtonCfg.getPlayerBtnPos();
		let endX:number = end.x;
		let endY:number = end.y;
		LayerManager.UI_Cultivate.displayListContainer.addChild(image.displayObject);
		egret.Tween.get(image).to({ x: endX, y: endY }, 1000).call(function () {
			image.destroy();
			image = null;
			//特效完成，重新开始任务
			CacheManager.task.gotoTaskFlag = true;
			EventManager.dispatch(LocalEventEnum.TaskGoto);
		});
	}
}