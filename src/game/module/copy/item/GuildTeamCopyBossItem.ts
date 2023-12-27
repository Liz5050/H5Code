class GuildTeamCopyBossItem extends ListRenderer {
	private txt_bossScore:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.txt_bossScore = this.getChild("txt_bossScore").asRichTextField;
	}

	public setData(data:any):void {
		this._data = data;
		let bossCfg:any = ConfigManager.boss.getByPk(data.bossCode);
		this.txt_bossScore.text = bossCfg.name + "：" + HtmlUtil.html(bossCfg.reserveValue + "分",Color.Color_2);
	}
}