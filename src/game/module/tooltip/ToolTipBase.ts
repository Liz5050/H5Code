class ToolTipBase extends BasePopupView {
	private _toolTipData: ToolTipData;
	private _debug: ToolTipDebugBuy;
	public constructor(packageName: string, viewName: string,parent:fairygui.GComponent=LayerManager.UI_Tips) {
		super(packageName, viewName,parent);
		this.isAnimateShow = true;
	}

	public initUI(): void {
		super.initUI();
		let closeObj: fairygui.GObject = this.getChild("btn_close");
		if (closeObj != null) {
			closeObj.addClickListener(this.hide, this);
		}
	}

	public setToolTipData(toolTipData: ToolTipData) {
		this._toolTipData = toolTipData;
		if (App.GlobalData.IsDebug) {
			if (!this._debug) {
				this._debug = new ToolTipDebugBuy();
			}
			this.addChild(this._debug);

			if (this.isAnimateShow) {
				this._debug.x = this.width;
				this._debug.y = 0;
			} else {
				let img: fairygui.GImage = this._view.getChildAt(0).asImage;
				this._debug.x = img ? img.width : this.width;
				this._debug.y = img ? (img.height - this._debug.height) / 2 : (this.height - this._debug.height) / 2;
			}
			this._debug.update(toolTipData.data, this.hide, this);
		}
	}

	public get toolTipData(): ToolTipData {
		return this._toolTipData;
	}

	/**
	 * 启用操作按钮列表
	 */
	public enableOptList(enable: boolean): void {

	}
}