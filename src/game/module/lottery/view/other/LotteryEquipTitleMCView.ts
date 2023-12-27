class LotteryEquipTitleMCView extends BaseContentView {
	private mc1:UIMovieClip;
	private mc2:UIMovieClip;
	// private titleMc:UIMovieClip;
	public constructor(component:fairygui.GComponent) {
		super(PackNameEnum.LotteryAsset,"TitleMCView",null,component);
	}
	public initOptUI():void {
		this.mc1 = UIMovieManager.get(PackNameEnum.MCEquipBest);
		this.mc1.x = 242;
		this.mc1.y = 50;
		this.addChild(this.mc1);

		this.mc2 = UIMovieManager.get(PackNameEnum.MCEquipBest);
		this.mc2.x = 242;
		this.mc2.y = 590;
		this.addChild(this.mc2);

		// this.titleMc = UIMovieManager.get(PackNameEnum.MCLotteryTitleTxt);
		// this.titleMc.scaleX = this.titleMc.scaleY = 1.2;
		// this.titleMc.x = -136;
		// this.titleMc.y = -354;
		// this.addChild(this.titleMc);
	}

	public updateAll():void {
		this.mc1.playing = true;
		this.mc2.playing = true;
		// this.titleMc.playing = true;
	}

	public hide():void {
		super.hide();
		this.mc1.playing = false;
		this.mc2.playing = false;
		// this.titleMc.playing = false;
	}
}