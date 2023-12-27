class BossItem extends ListRenderer{
	private iconLoader: GLoader;
	private bossData: any;
	private toolTipData: ToolTipData;
	private beatBossController: fairygui.Controller;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.beatBossController = this.getController("c1");
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		let iconUrl: string = "";
		this._data = data;
		this.bossData = ConfigManager.boss.getByPk(data["code"]);
		if(this.bossData){
			iconUrl = URLManager.getIconUrl(this.bossData.avatarId, URLManager.AVATAR_ICON);
		}
		this.iconLoader.load(iconUrl);
		// this._data = icon;
		// this.iconLoader.load(itemData.getIconRes());
	}

	/**点击弹出tooltip */
	private click(): void {
		if (this._data) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			// this.toolTipData.data = this._itemCode;
			this.toolTipData.data = this._data;
			this.toolTipData.type = ToolTipTypeEnum.Boss;
			ToolTipManager.show(this.toolTipData);
		}
	}

	public setGray(value: boolean): void{
		this.iconLoader.grayed = value;
	}

	public setBossStatus(value: boolean): void{
		if(value){
			this.beatBossController.selectedIndex = 1;
		}else{
			this.beatBossController.selectedIndex = 0;
		}
	}
}