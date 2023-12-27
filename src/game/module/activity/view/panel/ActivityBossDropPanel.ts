class ActivityBossDropPanel extends ActivityBaseTabPanel {
	private loader_bg:GLoader;
	private btn_gotoKill:fairygui.GButton;
	private list_item:List;
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeBossExtraDrop;
		this.desTitleStr = "";
	}

	public initOptUI():void {
		super.initOptUI();
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("activity_bg_7.jpg",PackNameEnum.Activity));
		this.list_item = new List(this.getGObject("list_item").asList);
		this.btn_gotoKill = this.getGObject("btn_gotoKill").asButton;
		this.btn_gotoKill.addClickListener(this.onClickHandler,this);
	}

	private onClickHandler():void {
		EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:PanelTabType.WorldBoss},ViewIndex.Two);
	}

	public updateAll():void {
		super.updateAll();
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
		this.list_item.data = info.rewardInfos[0].getItemDatas();
	}
}