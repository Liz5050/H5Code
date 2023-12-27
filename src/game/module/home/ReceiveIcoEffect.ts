class ReceiveIcoEffect extends BaseContentView {
	private static _inst: ReceiveIcoEffect;
	private loaderPiece: GLoader;
	private loaderBg: GLoader;
	private txtName: fairygui.GTextField;

	public constructor() {
		super(PackNameEnum.Home, "PieceReceive",null,LayerManager.UI_Message);

	}

	public static get inst(): ReceiveIcoEffect {
		if (!ReceiveIcoEffect._inst) {
			ReceiveIcoEffect._inst = new ReceiveIcoEffect();
		}
		return ReceiveIcoEffect._inst;
	}

	public initOptUI(): void {
		this.loaderPiece = <GLoader>this.getGObject("loader_piece");
		this.loaderBg = <GLoader>this.getGObject("loader_bg");
		this.loaderBg.load(URLManager.getItemColorUrl("color_5"))
		this.txtName = this.getGObject("txt_name").asTextField;
	}

	public updateAll(data?: any): void {
		this.loaderPiece.load(data.url);
		this.txtName.text = data.name;
		this.x = data.x + (data.width - this.width) / 2;
		this.y = data.y;
		this.doTween();
	}

	private doTween(): void {
		egret.Tween.get(this).to({ y: this.y - 162 }, 1000, egret.Ease.circOut).to({}, 1000).call(() => {
			this.hide();
		}, this);
	}
}