class BossComingItem extends ListRenderer {
	private btn_bossName:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.btn_bossName = this.getChild("btn_bossName").asButton;
	}

	public setData(data:any):void {
		this._data = data;
		let bossCfg:any = ConfigManager.boss.getByPk(data.bossCode);
		this.btn_bossName.title = bossCfg.name;
		let isCd:boolean = CacheManager.bossNew.isBossComingCd(data.bossCode);
		CommonUtils.setBtnTips(this,!isCd);
	}

	public set btnSelected(value:boolean) {
		this.btn_bossName.selected = value;
	}
}