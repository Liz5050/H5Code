/**
 * 符文总览物品项 
 */
class RunePandectItem extends fairygui.GComponent{
	private levelTxt: fairygui.GTextField; 
	private runeList: List;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.levelTxt = this.getChild("txt_title").asTextField;
		this.runeList = new List(this.getChild("list_pandect").asList);
	}

	public setData(runeData: any):void{
		let towerOpenType: Array<string> = runeData.openType.split("#");
		this.runeList.list.removeChildrenToPool();
		for(let type of towerOpenType){
			if(type != "" && RuneUtil.isShowRune(Number(type))){
				let itemDatas: Array<any> = ConfigManager.item.selectCTAndColor(ECategory.ECategoryRune, parseInt(type), EColor.EColorBlue, EColor.EColorGold);
				let runeRowItem: fairygui.GComponent = this.runeList.list.addItemFromPool().asCom;
				let rowList: List = new List(runeRowItem.getChild("list_row").asList);
				rowList.data = itemDatas;
				rowList.list.resizeToFit();
			}
		}
		this.runeList.list.resizeToFit();
		this.levelTxt.text = runeData.floor ? `${runeData.floor}层解锁` : "默认解锁";
	}

	public get height():number{
		if(this.runeList != null){
			return this.runeList.list.height + 50;
		}
		return 214;
	}
}