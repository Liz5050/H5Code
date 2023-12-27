/**
 * 星星
 */
class StarItem extends ListRenderer {
	private c1: fairygui.Controller;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
	}

	public setData(data: any, index: number): void {
		if (data) {
			this.c1.selectedIndex = 1;
		} else {
			this.c1.selectedIndex = 0;
		}
	}
}