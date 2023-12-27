class CopyHallBloodPanel extends BaseCopyTabPanel {
	private list_item: List;
	private btn_helpStart: fairygui.GButton;	
	private leftNum: number;
	private c1: fairygui.Controller;
	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}
	public initOptUI(): void {
		super.initOptUI();
		this.list_item = new List(this.getGObject("list_item").asList);
		this.btn_helpStart = this.getGObject("btn_helpStart").asButton;
		this.btn_helpStart.addClickListener(this.onClickBtn, this);
		this.c1 = this.getController("c1");

		this.copyInfArr = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgBloodMatrix);
	}
	public updateAll() {
		super.updateAll();
		this.copyInf = ConfigManager.copy.getByPk(CopyEnum.CopyBlood);
		this.leftNum = this.updateEnterCount(this.copyInf);
		var idx: number = this.leftNum > 0 ? 0 : 1;
		this.c1.selectedIndex = idx;
		this.setVirtualList();
		this.initSelect();
		this.selectModel(true);
	}

	protected onClickBtn(e: egret.TouchEvent): void {
		Alert.alert(LangCopyHall.L_BLOOD_OUT, () => {			
			this.dealTeamEnter(false);
		}, this, null, "今日不再提示", AlertCheckEnum.KEY_BLOOD_OUT_TIME);
	}
	
	protected checkModelCopyOpen(inf:any):boolean{
		return CopyUtils.isLvOk(inf);
	}
	protected selectModel(scrollToSelected:boolean): void {
		super.selectModel(scrollToSelected);
		this.list_item.data = CommonUtils.configStrToArr(this.curSelectModeItem.getData().reward);
	}
	protected getCurCopyCode(): number {
		return this.curSelectModeItem.getData().code;
	}

}