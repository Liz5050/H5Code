/**
 * 通用战斗力显示面板
 */
class FightPanel extends fairygui.GComponent {
	public imgBg: fairygui.GImage;
	private fightTxt: fairygui.GTextField;
	private imgFight: fairygui.GImage;
	private mc: UIMovieClip;

	public constructor() {
		super();
		this.touchable = false;
		this.displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.imgBg = this.getChild("img_bg").asImage;
		this.imgFight = this.getChild("img_fight").asImage;
		this.fightTxt = this.getChild("txt_fight").asTextField;
		this.mc = UIMovieManager.get(PackNameEnum.MCFightFire);
		this.addChild(this.mc);
		this.mc.x = -217;
		this.mc.y = -350;

		this.swapChildren(this.imgFight, this.mc);
	}

	public set align(align: fairygui.AlignType) {
		this.fightTxt.align = align;
	}

	public updateValue(value: number): void {
		this.fightTxt.text = value.toString();
	}

	public set mcX(x: number) {
		this.mc.x = x;
	}

	public playMc(value: boolean): void {
		this.mc && (this.mc.playing = value);
	}

	public dispose(): void {
		this.displayObject.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		this.displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		super.dispose();
	}

	private onAddedToStage() {
		this.mc && this.playMc(true);
	}

	private onRemoveFromStage() {
		this.mc && this.playMc(false);
	}
}