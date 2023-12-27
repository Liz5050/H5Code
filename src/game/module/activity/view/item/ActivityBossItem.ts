class ActivityBossItem extends ListRenderer {
	private c1:fairygui.Controller;
	private headIcon:GLoader;
	private txt_name:fairygui.GTextField;
	private txt_level:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.headIcon = this.getChild("icon_loader") as GLoader;
		this.txt_name = this.getChild("txt_name").asTextField;
		this.txt_level = this.getChild("txt_level").asTextField;
		this.headIcon.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		let info:any = CacheManager.activity.bossInfos[data.group];
		this.c1.selectedIndex = info.processDetail.data_I.indexOf(data.bossCode) == -1 && info.status_I == EDeityBookStatus.EDeityBookStatusNotComplete ? 0 : 1;
		let bossCfg:any = ConfigManager.boss.getByPk(data.bossCode);
		let gameBoss:any = ConfigManager.mgGameBoss.getByPk(data.bossCode);
		this.txt_name.text = bossCfg.name;
		this.headIcon.load(URLManager.getIconUrl(bossCfg.avatarId,URLManager.AVATAR_ICON));
		if(gameBoss && gameBoss.roleState) {
            //转生等级限制
            this.txt_level.text = gameBoss.roleState + "转";
        }
        else {
            this.txt_level.text = "Lv." + bossCfg.level;
        }
	}

	private onClickHandler():void {
		let tabType:PanelTabType = PanelTabType.WorldBoss;
		if(this._data.group == 0) {
			tabType = PanelTabType.PersonalBoss;
		}
		EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:tabType,bossCode:this._data.bossCode},ViewIndex.Two);
	}
}