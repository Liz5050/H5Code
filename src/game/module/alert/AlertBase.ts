class AlertBase extends BaseWindow {
	protected tipTxt: fairygui.GRichTextField;
	protected noBtn: fairygui.GObject;
	protected yesBtn: fairygui.GObject;
	protected _data: AlertData;

	public constructor(pkgName: string, contentName: string) {
		super(pkgName, contentName);
		this.isPopup = false;
	}

	public initOptUI(): void {
		this.tipTxt = this.getGObject("comp_tip").asCom.getChild("txt_tip").asRichTextField;
		this.noBtn = this.getGObject("btn_no");
		this.yesBtn = this.getGObject("btn_yes");
		if (this.noBtn != null) {
			this.noBtn.addClickListener(this.clickNo, this);
		}
		if (this.yesBtn != null) {
			this.yesBtn.addClickListener(this.clickYes, this);
		}
	}

	public setData(data: AlertData): void {
		this._data = data;
	}

	public onShow(): void {
		super.onShow();
		if (this._data != null) {
			this.tipTxt.text = this._data.tip;
		}
	}

	public getData(): AlertData {
		return this._data;
	}

	public updateAll(): void {

	}

	/**点击取消 */
	public clickNo(): void {
		this.hide();
		if (this._data != null) {
			if (this._data.noFun != null && this._data.caller != null) {
				this._data.noFun.apply(this._data.caller);
			}
		}

	}

	/**点击确认 */
	public clickYes(): void {
		this.hide();
		if (this._data != null) {
			if (this._data.yesFun != null) {
				this._data.yesFun.apply(this._data.caller);
			}
		}
	}

	protected getBtnLabel(isYes: boolean): string {
		let label: string = "";
		if (this._data.btnLabels && this._data.btnLabels.length > 0) {
			if (isYes) {
				label = this._data.btnLabels[0];
			} else {
				if (this._data.btnLabels.length > 1) {
					label = this._data.btnLabels[1];
				} else {
					label = Alert.NO_LABEL;
				}
			}
		} else {
			label = isYes ? Alert.YES_LABEL : Alert.NO_LABEL;
		}

		return label;
	}
}