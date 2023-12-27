class AlertCheckBox extends AlertBase {
	protected isNoBtn: boolean;
	protected isYesBtn: boolean;
	protected ck_tip: fairygui.GButton;
	protected noBtnPoint: egret.Point;
	protected isCheckBox: boolean;
	public constructor() {
		super(PackNameEnum.Common, "AlertCheckBox");
	}
	public initOptUI(): void {
		super.initOptUI();
		this.ck_tip = this.getGObject("ck_tip").asButton;
		this.noBtnPoint = new egret.Point(this.noBtn.x, this.noBtn.y);
		
	}

	public onShow(): void {
		super.onShow();
		this.setData(this.getData());
	}

	public setData(data: AlertData): void {
		super.setData(data);
		if (!this.isShow) {
			return;
		}
		this.isNoBtn = ((1 << 1) & data.btns) > 0;
		this.isYesBtn = ((1 << 2) & data.btns) > 0;
		this.title = data.title;
		this.isCheckBox = data.checkLabel != "";
		this.ck_tip.visible = this.isCheckBox;
		if (this.isCheckBox) {
			this.ck_tip.selected = false;
			this.ck_tip.title = data.checkLabel;
		}
		this.yesBtn.text = this.getBtnLabel(true); 
		this.noBtn.text = this.getBtnLabel(false);
		this.resetBtn();

	}

	protected resetBtn(): void {
		// 要么一个 确定按钮 要么一个确定按钮，一个取消按钮 (应该没有只显示一个取消按钮这么傻逼的吧？)

		if (!this.isNoBtn) { //没有取消按钮 只有确定按钮
			//用取消按钮的样式作为确定按钮
			this.yesBtn.visible = false;
			this.noBtn.x = this.width - this.noBtn.width >> 1;
			this.noBtn.text = this.getBtnLabel(true); 
		} else {
			this.noBtn.x = this.noBtnPoint.x;
			this.noBtn.y = this.noBtnPoint.y;
			this.noBtn.visible = this.yesBtn.visible = true;
			this.noBtn.text = this.getBtnLabel(false);
		}
	}

	
	
	/**点击取消 */
	public clickNo(): void {
		if (!this.isNoBtn) {
			this.clickYes();
		} else {
			this.hide();
			if (this._data != null) {
				if (this._data.noFun != null) {
					this._data.noFun.call(this._data.caller,this.ck_tip.selected); //点击取消也传checkBox的状态 
				}
			}
		}
	}

	/**点击确认 */
	public clickYes(): void {
		this.hide();
		if (this._data != null) {
			if (this._data.yesFun != null) {
				this._data.yesFun.call(this._data.caller, this.ck_tip.selected);
			}
		}
		this.check();
	}

	protected check(): void {
		if (this.ck_tip.visible && this._data.checkKey != "" && this.ck_tip.selected) {
			var sec:number = CacheManager.serverTime.getServerTime();
			LocalStorageUtils.setKey(this._data.checkKey, ""+sec);
		}
	}

}