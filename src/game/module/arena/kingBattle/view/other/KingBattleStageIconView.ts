class KingBattleStageIconView extends BaseView {
	private stageIcon:GLoader;
	private stageTxt:fairygui.GTextField;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}

	public initOptUI():void {
		this.stageIcon = this.getGObject("stage_icon") as GLoader;
		this.stageTxt = this.getGObject("txt_stage").asTextField;
	}

	public updateAll():void {

	}

	public setLevel(level:number):void {
		let cfg:any = ConfigManager.mgKingStife.getByPk(level);
		if(!cfg) return;
		this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + cfg.stage + ".png",PackNameEnum.Arena));
		this.stageTxt.text = "" + cfg.advanceShow;
		this.stageTxt.visible = cfg.stage != 5;
	}

	public clear():void {
		this.stageIcon.clear();
		this.stageTxt.text = "";
	}
}