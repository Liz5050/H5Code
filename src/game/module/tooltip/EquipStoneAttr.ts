/**
 * 装备tip的宝石属性
 */

class EquipStoneAttr extends fairygui.GComponent{
	private titleTxt: fairygui.GTextField;
	private stoneAttrList: List;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.titleTxt = this.getChild("txt_titel").asTextField;
		this.stoneAttrList = new List(this.getChild("list_stone").asList);
	}

	public setData(itemData: ItemData): void{
		this.titleTxt.text = "宝石属性";
		let items: Array<any> = [];
		let hole: Array<any> = itemData.getItemExtInfo().hole;
		// let hole
		let openNum: number = 2;
		if(itemData.getItemLevel() >= 11){
			openNum += 3;
		}else if(itemData.getItemLevel() >= 9){
			openNum += 2;
		}else if(itemData.getItemLevel() >= 7){
			openNum += 1;
		}

		for(let i = 0; i < openNum+1; i++){
			if(hole && hole[i]){
				items.push({"index": i, "itemData": new ItemData(hole[i])});
			}else{
				items.push({"index": i, "itemData": ItemDataEnum.empty});
			}
		}
		items = this.sortStone(items);
		this.stoneAttrList.data = items;

		// if(itemData.getItemExtInfo().hole){
		// 	for(let i = 0; i < itemData.getItemExtInfo().hole.length; i++){
		// 		if()
		// 	}
			
		// }

		// this.stoneAttrList.list.removeChildrenToPool();
		// this.stoneAttrList.list.addItemFromPool();
		// this.stoneAttrList.list.addItemFromPool();
		// this.stoneAttrList.list.addItemFromPool();
		// this.stoneAttrList.list.addItemFromPool();
		this.stoneAttrList.list.resizeToFit();
	}

	/**宝石排序 */
	public sortStone(items: Array<any>): Array<any>{
		if(items && items.length > 0){
			items.sort((a: any, b:any): number =>{
				return this.getStoneSort(a) - this.getStoneSort(b);
			});
		}
		return items;
	}

	private getStoneSort(data: any):number{
		let num: number = 0;
		if(data["index"] == 0){
			num += 5;
		}
		if(data["itemData"]){
			num += 1;
		}else{
			num += 10;
		}
		return num;
	}

	public get height():number{
		if(this.stoneAttrList != null){
			return this.stoneAttrList.list.height + 50;
		}
		return 120;
	}
}