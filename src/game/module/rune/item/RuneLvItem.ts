/**
 * 符文总览的符文项 
 */
class RuneLvItem extends fairygui.GButton{
	private runeItem: RuneItem;

	private toolTipData: ToolTipData;
	private itemData: ItemData;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.runeItem = <RuneItem>this.getChild("runeItem");
	}

	public setData(runeData: any):void{
		this.itemData = new ItemData(runeData.code);
		this.itemData.itemAmount = 1;
		this.runeItem.setData(this.itemData);
	}
}