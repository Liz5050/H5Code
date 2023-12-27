/**
 * 地图boss列表项
 */
class MapBossListItem extends ListRenderer {
	private controller: fairygui.Controller;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.nameTxt = this.getChild("txt_monstername").asTextField;
		this.levelTxt = this.getChild("txt_monsterlevel").asTextField;
	}

	public setData(data: any): void {
		if (data != null) {
			let boss: any = ConfigManager.boss.getByPk(data.bossCode);
			if (boss != null) {
				this.nameTxt.text = `<font color='${data.color}'>${boss.name}</font>`;
				this.levelTxt.text = `Lv.${data.proposeLevel}-${boss.level}`;
			}
		} else {
			this.nameTxt.text = "";
			this.levelTxt.text = "";
		}
	}

	public set isRecommend(isRecommend: boolean) {
		if (isRecommend) {
			this.controller.selectedIndex = 1;
		} else {
			this.controller.selectedIndex = 0;
		}
	}
}