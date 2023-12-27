/**
 * 升级引导
 */
class UpgradeItem extends ListRenderer {
	private starList: fairygui.GList;
	private nameTxt: fairygui.GRichTextField;
	private statusTxt: fairygui.GRichTextField;
	private arrowsImg: fairygui.GImage;

	private grayColor: string = Color.Color_7;
	private isOpen: boolean;
	private openstr: string;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.starList = this.getChild("list_star").asList;
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.statusTxt = this.getChild("txt_status").asRichTextField;
		this.arrowsImg = this.getChild("img_arrows").asImage;
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void {
		this._data = data;
		this.nameTxt.text = data.name;
		this.isOpen = true;
		this.openstr = "";
		if (data.openkey) {
			this.isOpen = ConfigManager.mgOpen.isOpenedByKey(data.openkey, false);
			if (!this.isOpen) {
				this.openstr = ConfigManager.mgOpen.getOpenCondDesc(data.openkey);
			}
		}
		if (!this.isOpen) {
			this.nameTxt.text = `<font color = ${this.grayColor}>${data.name}</font>`;
			this.statusTxt.text = `<font color = ${this.grayColor}>${this.openstr}</font>`;
			this.arrowsImg.visible = false;
		} else {
			this.nameTxt.text = `${data.name}`;
			this.statusTxt.text = `前往`;
			this.arrowsImg.visible = true;
		}

		this.starList.removeChildrenToPool();
		for (let i = 0; i < data.star; i++) {
			this.starList.addItemFromPool();
		}
	}

	private click(): void {
		if (!this.isOpen) {
			Tip.showLeftTip(this.openstr);
			return;
		}
		switch (this._data.type) {
			case EUpgradeGuideType.PointChallenge:
				EventManager.dispatch(LocalEventEnum.EnterPointChallenge);
				break;
			case EUpgradeGuideType.CopyHallTower:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallTower });
				break;
			case EUpgradeGuideType.CopyHallDaily:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallDaily });
				break;
			case EUpgradeGuideType.Encounter:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, { "tabType": PanelTabType.Encounter });
				break;
			case EUpgradeGuideType.Team2:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.Team2 });
				break;
			case EUpgradeGuideType.WorldBoss:
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { "tabType": PanelTabType.WorldBoss });
				break;
		}
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.UpgradeGuide);
	}
}