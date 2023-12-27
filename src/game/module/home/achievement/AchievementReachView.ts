class AchievementReachView extends BaseContentView {
	// private static _instance:AchievementReachView;
	// public static get instance():AchievementReachView {
	// 	if(AchievementReachView._instance == null) {
	// 		AchievementReachView._instance = fairygui.UIPackage.createObject(PackNameEnum.Home, "AchievementReach") as AchievementReachView;
	// 	}
	// 	return AchievementReachView._instance;
	// }

	private titleTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;

	// private isShow:boolean;
	private codes:number[];
	private curShowCode:number = 0;
	public constructor() {
		super(PackNameEnum.Home,"AchievementReach");
		this.codes = [];
	}

	public initOptUI():void {
		this.titleTxt = this.getGObject("txt_title").asTextField;
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.addClickListener(this.onTouchHandler,this);
	}

	public updateAll(codes:number[]):void {

		this.curShowCode = this.codes.shift();
		if(this.curShowCode) {
			this.showNext(this.curShowCode);
		}
	}

	public show(codes:number[]):void {
		this.codes = this.codes.concat(codes);
		if(this.isShow) {
			return;
		}
		super.show(codes);

	}

	private showNext(code:number):void {
		let config:any = ConfigManager.achievement.getByPk(code);
		this.nameTxt.text = config.name;
		LayerManager.UI_Tips.addChild(this);
		this.alpha = 0;
		this.x = fairygui.GRoot.inst.width;
		this.y = fairygui.GRoot.inst.height - 550;
		let posX:number = (this.x - 441)/2;
		egret.Tween.get(this).to({x : posX, alpha : 1},300).wait(2000).to({alpha:0},1000).call(this.hideComplete,this);
	}

	private hideComplete():void {
		this.curShowCode = this.codes.shift();
		if(this.curShowCode) {
			this.showNext(this.curShowCode);
		}
		else {
			this.hide();
		}
	}

	private onTouchHandler():void
	{
		EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Achievement,{code:this.curShowCode});
	}
}
