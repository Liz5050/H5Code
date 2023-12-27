/**
 * 提示文本
 */
class TipText extends fairygui.GComponent {
	public addTime: number = 0;//加入时间
	private com: fairygui.GComponent;
	private bg: fairygui.GImage;
	private tipText: fairygui.GRichTextField;
	private defFont: string = "微软雅黑";

	public constructor() {
		super();
		this.com = FuiUtil.createComponent(PackNameEnum.Common, "TipText");
		this.addChild(this.com);
		this.bg = this.com.getChild("img_bg").asImage;
		this.tipText = this.com.getChild("txt_tip").asRichTextField;
		this.isShowBg = false;
		this.defFont = this.defFont;
		this.touchable = false;
	}

	public set text(text: string) {
		this.tipText.text = text;
	}

	public set isShowBg(isShowBg: boolean) {
		this.bg.visible = isShowBg;
	}

	public addToParent(): void {
		LayerManager.UI_Tips.addChild(this);
	}

	public get width(): number {
		return this.bg.width;
	}

	public get height(): number {
		return this.bg.height;
	}

	public get textField(): fairygui.GRichTextField {
		return this.tipText;
	}

	public resetFont(): void {
		this.tipText.font = this.defFont;
	}

    public set textAlign(at: fairygui.AlignType) {
        this.tipText.align = at;
    }

	public doRemove(): void {
		this.removeFromParent();
		this.addTime = 0;
		this.x = 0;
		this.y = 0;
		this.tipText.font = this.defFont;
		ObjectPool.push(this);
	}
}