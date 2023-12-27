class PunchLeadSummonView extends BaseGUIView {

	private _time:number = 5;
	private _timerRun:boolean = false;

	private _txtCountDown:fairygui.GTextField;
	private _loaderGirl:GLoader;

	public constructor() {
		super(LayerManager.UI_Popup);
		this.packageName = PackNameEnum.Copy;
		this.viewName = "PunchLeadSummonView";
		this.modal = true;
		this.isCenter = true;
	}

	public initUI(): void {
		super.initUI();

		this._txtCountDown = this.getGObject("txt_countdown").asRichTextField;

		let btn = this.getGObject("btn_opt").asButton;
		btn.addClickListener(this.onOptBtnClick, this);

		this._loaderGirl = <GLoader>this.getGObject("loader_girl");
		this._loaderGirl.load(URLManager.getModuleImgUrl("copy_showgirl.png",PackNameEnum.Copy));
	}

	public onShow(data: any = null): void {
		super.onShow(data);
		this.startTimer();
		this.updateCountDownText();
	}

	public onHide(data: any = null): void {
		super.onHide(data);
		this.stopTimer();
	}

	private updateCountDownText():void {
		this._txtCountDown.text = App.StringUtils.substitude("<font color='#0df14b'>{0}秒</font>后自动召唤", this._time);

	}

	private onTimer():void {
		this._time = this._time - 1;
		if (this._time <= 0) {
			this.stopTimer();
			this.doSummon();
			this.hide();
		}
		else {
			this.updateCountDownText();
		}
	}

	private doSummon():void {
		ProxyManager.copy.punchLeadCopySummon();
		EventManager.dispatch(LocalEventEnum.PunchLeadCopyResetFlag);
	}

	private onOptBtnClick():void {
		this.doSummon();
		this.hide();
	}

	private startTimer():void {
		if(!this._timerRun) {
			this._timerRun = true;
			this._time = 5;
			App.TimerManager.doTimer(1000, 0, this.onTimer, this);
		}
	}

	private stopTimer():void {
		if(this._timerRun) {
			this._timerRun = false;
			App.TimerManager.remove(this.onTimer, this);
		}
	}


}