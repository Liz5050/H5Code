/**
 * 每日必做列表项
 */
class DailyItem extends ListRenderer {
	private c1: fairygui.Controller;
	private iconLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private timeNameTxt: fairygui.GTextField;
	private timeTxt: fairygui.GTextField;
	private numTxt: fairygui.GTextField;
	private numNameTxt: fairygui.GTextField;
	private openTxt: fairygui.GTextField;
	private _goBtn: fairygui.GButton;

	private toolTipData: ToolTipData;
	private isClickGo: boolean;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.timeNameTxt = this.getChild("txt_timeName").asTextField;
		this.timeTxt = this.getChild("txt_time").asTextField;
		this.numNameTxt = this.getChild("txt_numName").asTextField;
		this.numTxt = this.getChild("txt_num").asTextField;
		this.openTxt = this.getChild("txt_open").asTextField;
		this._goBtn = this.getChild("btn_go").asButton;
		this._goBtn.addClickListener(this.clickGo, this);

		this.addClickListener(this.clickItem, this);
	}

	public setData(data: any, index: number = -1): void {
		this._data = data;
		if (data != null) {
			this.iconLoader.load(URLManager.getPackResUrl(PackNameEnum.Daily, `img_idx${data.idx}`));
			this.nameTxt.text = data.name;

			let isShowTime: boolean = data.time != null;
			let isShowNum: boolean = data.exp != null;
			this.timeNameTxt.visible = isShowTime;
			this.timeTxt.visible = isShowTime;
			this.numNameTxt.visible = isShowNum;
			this.numTxt.visible = isShowNum;
			let time: number = CacheManager.daily.getEventTime(data.event);
			if (isShowTime) {
				this.timeTxt.text = `${time}/${data.time}`;
			}
			if (isShowNum) {
				this.numTxt.text = `${time * data.exp}/${data.time * data.exp}`;
			}

			//处理开启
			if (data.openKey != null) {
				let isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(data.openKey, false);
				if (isOpen) {
					this.c1.selectedIndex = (time >= data.time) ? 2 : 1
				} else {
					this.c1.selectedIndex = 0;
				}

				let cfg: any = ConfigManager.mgOpen.getByOpenKey(data.openKey);
				this.openTxt.text = `${cfg.openLevel}级开启`;

				if (data.openKey == MgOpenEnum[MgOpenEnum.ETaskGroupMgRing]) {
					GuideTargetManager.reg(GuideTargetName.DailyMoneyRingGoBtn, this.goBtn);
				}
			} else {
				this.c1.selectedIndex = 1;
			}
		}
	}

	public get goBtn(): fairygui.GButton {
		return this._goBtn;
	}

	private clickItem(e: any): void {
		if (this.isClickGo) {
			this.isClickGo = false;
			return;
		}
		if (this._data) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.data = this._data;
			this.toolTipData.type = ToolTipTypeEnum.Daily;
			ToolTipManager.show(this.toolTipData);
		}
	}

	/**
	 * 点击前往
	 */
	private clickGo(): void {
		this.isClickGo = true;
		if (this._data) {
			let event: ESWordPoolEvent;
			switch (this._data.openKey) {
				case "ETaskGroupMgRing":
					event = ESWordPoolEvent.ESWordPoolEventTaskRing;
					break;
				case "ImagePK":
					event = ESWordPoolEvent.ESWordPoolEventImagePk;
					break;
				case "ETaskGroupMgGuild":
					event = ESWordPoolEvent.ESWordPoolEventTaskGuild;
					break;
				case "Transport":
					event = ESWordPoolEvent.ESWordPoolEventTransport;
					break;
				case "WeaponStrengthen":
					event = ESWordPoolEvent.ESWordPoolEventStrengthen;
					break;
				case "WorldBoss":
					event = ESWordPoolEvent.ESWordPoolEventGameBoss;
					break;
				case "RingBossSingleCopy":
					event = ESWordPoolEvent.ESWordPoolEventCopyMgRingBoss;
					break;
				case "NormalDefenseSingleCopy":
					event = ESWordPoolEvent.ESWordPoolEventCopyMgNormalDefense;
					break;
				case "ExperienceGroupCopy":
					event = ESWordPoolEvent.ESWordPoolEventCopyMgExperience;
					break;
				case "BloodMatrixGroupCopy":
					event = ESWordPoolEvent.ESWordPoolEventCopyMgBloodMatrix;
					break;
				case "FiveElementsCopy":
					event = ESWordPoolEvent.ESWordPoolEventMgFiveElements;
					break;
				case "TowerDefense":
					event = ESWordPoolEvent.ESWordPoolEventCopyMgTowerDefense;
					break;
				default:
					event = ESWordPoolEvent.ESWordPoolEventHook;
					break;
			}
			if (event != null) {
				EventManager.dispatch(LocalEventEnum.DailyGotoEvent, event);
			}
			EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.Daily);
			ToolTipManager.hide();
		}
	}
}