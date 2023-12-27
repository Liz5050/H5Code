class PackRuneCache extends PackBaseCache {
	public constructor(params: any) {
		super(params);
	}

	/**获取符文，排除符文精华 */
	public getRune(): Array<ItemData>{
		let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getType() != ERune.ERuneZero) {
                data.push(itemData);
            }
        }
        return data;
	}

	public getRuneDecompose(): Array<ItemData>{
		let decomItems: Array<ItemData> = [];
		for(let itemData of this.itemDatas){
			if(!ItemsUtil.isRuneZero(itemData)){
				decomItems.push(itemData);
			}
		}
		return decomItems;
	}
	
	public clear(): void {

	}
}