class TimeLimitTaskOpened extends BaseWindow
{
	public constructor()
	{
		super(PackNameEnum.TimeLimitTaskOpen, "Main"); //null,LayerManager.UI_Tips
	}

	public initOptUI(): void
	{
		let optBtn:fairygui.GButton = this.getGObject("btn_opt").asButton;
		optBtn.addClickListener(this.onOptBtnClickHandler, this);
	}

	public onOptBtnClickHandler(): void {
		this.hide();
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.TimeLimitTask);
	}

	public onHide(data?: any): void {
        super.onHide(data);
        EventManager.dispatch(UIEventEnum.TempCardCheckWinClose);
    }
}