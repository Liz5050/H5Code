class SettingWindow extends BaseWindow
{
	private controller: fairygui.Controller;
	private basicPanel: SettingBasicPanel;
	private hangupPanel: SettingHangupPanel;
	private hangupLeftTimeTxt: fairygui.GRichTextField;
	private hangupAddTimeBtn: fairygui.GButton;

	private gCurIndex:number = -1;
	public constructor(moduleId: ModuleEnum) 
	{
		super(PackNameEnum.Setup,"Main",moduleId);
	}

	public initOptUI(): void 
	{
		this.controller = this.getController("c1");
		this.basicPanel = new SettingBasicPanel(this.getGObject("panel_basic").asCom, this.controller, 0);
		this.hangupPanel = new SettingHangupPanel(this.getGObject("panel_hangup").asCom, this.controller, 1);
        this.hangupLeftTimeTxt = this.getGObject("txt_resttime").asRichTextField;
        this.hangupAddTimeBtn = this.getGObject("btn_addtime").asButton;
        this.hangupAddTimeBtn.addClickListener(this.onClickAddTime, this);
	}

	public updateAll(data:any=null): void {
		this.controller.selectedIndex = 0;
		this.basicPanel.updateAll(data);
        this.updateHangLeftTime();
	}

    private onClickAddTime(): void {
        let sellItemCode:number = CacheManager.sysSet.getAdviceOfflineWorkItemCode();
        if (sellItemCode) EventManager.dispatch(UIEventEnum.ShopBuyOpen, new ItemData(sellItemCode));
    }

    public updateHangLeftTime(): void {
	    let leftTime:number = CacheManager.sysSet.offlineWorkLeftTime;
        this.hangupLeftTimeTxt.text = App.DateUtils.getFormatBySecond(leftTime, 7);
    }
}