/**
 * 地图npc列表项
 */
class MapNpcListItem extends ListRenderer {
	private nameTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.nameTxt = this.getChild("txt_npcname").asTextField;
	}

	public setData(data: any): void {
		this.nameTxt.text = data.name;
	}
}