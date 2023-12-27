class PackPropCache extends PackBaseCache {
	public constructor(params: any) {
		super(params);
	}

    /**获取某一类型的神羽 */
    public getGodWingItems(wingType: EWingAccessoryType): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropStrengthenExAccessory) {
                let cfg: any = ConfigManager.mgStrengthenExAccessory.getByPk(itemData.getCode());
                if (cfg && cfg.type == wingType) {
                    data.push(itemData);
                }
            }
        }
        return data;
    }

	public getAllHeartMethodByPos( pos : number) : Array<ItemData>  {
        var result: Array<ItemData> = [];
         for (let key in this.itemsDict) {
             let itemData: ItemData = this.itemsDict[key];
             var cfg = itemData.getItemInfo();
             if(cfg.category == 20 && cfg.equipType == pos) {
                 result.push(itemData);
             }
        }
        return  result;
    }

    public getAllEquipBySmallPos( pos : number) : Array<ItemData>  {
        var result: Array<ItemData> = [];
         for (let key in this.itemsDict) {
             let itemData: ItemData = this.itemsDict[key];
             var cfg = itemData.getItemInfo();
             if(cfg.category == 20) {
                 if((cfg.equipType - 1) * 5+cfg.type == pos)
                 result.push(itemData);
             }
        }
        return  result;
    }


    public getMatEquipByPosAndColor(pos : number , color : number) : Array<ItemData>  {
        var result: Array<ItemData> = [];
         for (let key in this.itemsDict) {
             let itemData: ItemData = this.itemsDict[key];
             var cfg = itemData.getItemInfo();
             if(cfg.category == 20) {
                 if((cfg.equipType - 1) * 5+cfg.type == pos && cfg.color == color) {
                    if(!cfg.newItemLevel) {
                        result.push(itemData);
                    }
                 }
             }
        }
        return  result;
    }


    public getTalentEquipByCareer(career: number): Array<ItemData>{
        let data: Array<ItemData> = [];
        for (let itemData of this.getByC(ECategory.ECategoryTalentEquip)){
            if(CareerUtil.getBaseCareer(itemData.getCareer()) == career){
                data.push(itemData);
            }
        }
        return data;
    }


    /**
     * 获取等级高于当前的宠物装备
     */
    public getPetEquipMaxLevel(itemLevel: number, petEquipType: number): ItemData {
        let maxItemData: ItemData = null;
        for (let itemData of this.getByCTAndShape(ECategory.ECategoryProp, EProp.EPropShapeEquip, EShape.EShapePet)) {
            if (petEquipType == itemData.getEffectEx2() && itemData.getItemLevel() > itemLevel) {
                if(!ItemsUtil.isTrueItemData(maxItemData)){
                    maxItemData = itemData;
                }else{
                    if(itemData.getItemLevel() > maxItemData.getItemLevel()){
                        maxItemData = itemData;
                    }
                }
            }
        }
        return maxItemData;
    }

    public getShapeEquipsByPos(shape:EShape, pos : number) : any[] {
		let equips: Array<ItemData> = [];
		for (let itemData of this.getByCTAndShape(ECategory.ECategoryProp, EProp.EPropShapeEquip, shape)) {
			 if (pos == itemData.getEffectEx2()){
				 equips.push(itemData);
			 }
		}
        return equips;
    } 

    public getBeastEquips(color: number, colorEx: number, star: number, type: number) : ItemData[] {
		let equips: Array<ItemData> = [];
		for (let itemData of this.getByCT(ECategory.ECategoryBeastEquip, type)) {
            let itemColorEx: number = ConfigManager.mgBeastEquip.getColorEx(itemData.getEffect());
            let itemStar: number = ConfigManager.mgBeastEquip.getStar(itemData.getEffect());
            if(itemData.getColor() > color){
                equips.push(itemData);
            }else if(itemData.getColor() == color){
                if(itemColorEx >= colorEx && itemStar >= star){
                    equips.push(itemData);
                }
            }
		}
        return equips;
    }


    public getMonthExpCard( type : number ) : ItemData {
        var items = this.getByCT(ECategory.ECategoryProp, EProp.EPropTempRechargeCard);
        for(let itemdata of items) {
            if(itemdata.getEffect() == 2) {
                return itemdata;
            }
        }
        return null;
    }

    public getAllBeastEquips() : ItemData[] {
        return this.getByC(ECategory.ECategoryBeastEquip);
    }

	
	public clear(): void {

	}
}