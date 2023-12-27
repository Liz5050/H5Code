class GuildBattleProgressView extends BaseView {
	private img_progress:fairygui.GImage;
	private maskObj:fairygui.GGraph;
	private progressWidth:number[];
	public constructor(view:fairygui.GComponent) {
		super(view);
	}

	protected initOptUI():void {
		this.img_progress = this.getGObject("img_progress").asImage;
		this.maskObj = this.getGObject("mask_obj").asGraph;
		this.img_progress.displayObject.mask = this.maskObj.displayObject;
		this.progressWidth = [28,72,121];
		//28,72,121
	}

	public updateAll():void {
		this.updatePosition();
	}

	public updatePosition():void {
		let position:number = CacheManager.guildBattle.position;
		if(position != -1) {
			this.maskObj.width = this.progressWidth[position];
		}
	}
}