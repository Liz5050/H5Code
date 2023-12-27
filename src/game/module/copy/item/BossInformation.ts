class BossInformation extends ListRenderer {
	protected txt_boss: fairygui.GTextField;
	protected txt_time: fairygui.GTextField;
	public constructor() {
		super();

	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.txt_boss = this.getChild("txt_boss").asTextField;
		this.txt_time = this.getChild("txt_time").asTextField;
	}

	public setData(data: any): void {
		this._data = data;
		var bossCfg: any = ConfigManager.boss.getByPk(this._data.bossCode);
		this.txt_boss.text = HtmlUtil.html(bossCfg.name + "Lv." + bossCfg.level, Color.Yellow2);

		this.onTimer();
	}

	public onTimer(): void {
		var dt: number = CacheManager.boss.getBossDt(this._data.bossCode);
		var serTime: number = CacheManager.serverTime.getServerTime();
		var sec: number = dt - serTime;				
		if (sec > 0) {
			var str: string = App.DateUtils.getFormatBySecond(sec);
			this.txt_time.text = HtmlUtil.html(str, Color.Red);
		} else {
			this.txt_time.text = HtmlUtil.html("已刷新", Color.Green);
		}
	}

}