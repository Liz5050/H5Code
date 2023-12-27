class PackBaseCache implements ICache {
    /**
     * 配置容量
     */
    public capacity: number;
    /**
     * 已使用容量
     */
    private _usedCapacity: number;
    /**背包类型 */
    protected posType: number;
    protected sbag: any;

    /**
     * index:ItemData
     */
    protected itemsDict: { [index: number]: ItemData };
    /**
     * uid:index
     */
    protected itemsIndexDict: { [uid: string]: number };

    public constructor(params: any) {
        this.posType = params["posType"];
        this.sbag = null;
        this.capacity = 0;
        this._usedCapacity = 0;
        this.itemsDict = {};
        this.itemsIndexDict = {};
    }

    public setSbag(value: any): void {
        if (value) {
            this.sbag = value;
            this.capacity = value.capacity_I ? value.capacity_I : 0;
            this.resetAllItems();
        }
    }

    /**
     * 添加物品
     * @param index 服务器背包位置从1开始，客户端从0开始
     */
    public addItemToIndex(index: number, itemData: ItemData): boolean {
        if (!itemData || index < 1 || index > this.capacity) {
            return false;
        }
        let tmpItemData: ItemData = this.getItemAtIndex(index);
        if (ItemsUtil.isTrueItemData(tmpItemData)) {
            return false;
        }
        itemData.setPosType(this.posType);
        this._usedCapacity++;
        this.itemsDict[index] = itemData;
        this.itemsIndexDict[itemData.getUid()] = index;
        return true;
    }

    public getItemAtIndex(index: number): ItemData {
        return this.itemsDict[index];
    }

    public getItemIndexByUid(uid: string): number {
        let index: number = -1;
        if (this.itemsIndexDict[uid] != null) {
            index = this.itemsIndexDict[uid];
        }
        return index;
    }

    public getItemByUid(uid: string): ItemData {
        let itemData: ItemData;
        let index: number = this.getItemIndex(uid);
        if (index != -1) {
            itemData = this.itemsDict[index];
        }
        return itemData;
    }

    public getItemByCode(code: number): ItemData {
        let itemData: ItemData;
        for (let index in this.itemsDict) {
            itemData = this.itemsDict[Number(index)];
            if (itemData.getCode() == code) {
                return itemData;
            }
        }
        return null;
    }

    /**
     * 获取物品的位置，与服务器的保持一致
     */
    public getPosIndexInServer(uid: string): number {
        return this.getItemIndexByUid(uid);
    }

    /**
     * 所有物品数和格子数一致，因此不能直接删除，用Empty替换。
     * @param uid 物品唯一标识
     */
    public removeItemByUid(uid: string): boolean {
        let index: number = this.getItemIndexByUid(uid);
        if (index != -1) {
            delete this.itemsDict[index];
            delete this.itemsIndexDict[uid];
            this._usedCapacity--;
        }
        return true;

    }

    public removeItemAtIndex(index: number): boolean {
        if (index < 1 || index > this.capacity) {
            return false;
        }
        let itemData: ItemData = this.getItemAtIndex(index);
        if (itemData != null) {
            delete this.itemsIndexDict[itemData.getUid()];
            delete this.itemsDict[index];
            this._usedCapacity--;
            return true;
        }
        return false;
    }

    /**
     * 更新指定位置上的物品
     * @returns 增加的数量
     */
    public updateItemAtIndex(index: number, itemData: ItemData): number {
        itemData.setPosType(this.posType);
        let addNum: number = itemData.getItemAmount();
        let old: ItemData = this.itemsDict[index];
        if (old) {
            addNum -= old.getItemAmount();
            //替换旧物品，旧物品需要删除
            delete this.itemsDict[index];
            delete this.itemsIndexDict[old.getUid()];
        }
        this.itemsDict[index] = itemData;
        this.itemsIndexDict[itemData.getUid()] = index;
        return addNum;
    }

    /**
     * 更新物品
     * @param playerItem SPlayerItem
     * @returns 更新后的物品
     */
    public updateItemBySPlayerItem(playerItem: any): ItemData {
        if (playerItem != null) {
            let uid: string = playerItem.uid_S;
            let itemData: ItemData = this.getItemByUid(uid);
            if (itemData != null) {
                itemData.data = playerItem;
                return itemData;
            }
        }
        return null;
    }

    /**
     * 是否拥有该物品
     */
    public hasItem(itemData: ItemData): boolean {
        if (itemData == null) {
            return false;
        }
        let index: number = this.getItemIndex(itemData.getUid());
        return this.itemsDict[index] != null;
    }

    protected resetAllItems(): void {
        let index: number = this.sbag.index_I;
        if (index == 0) {
            this._usedCapacity = 0;
            this.itemsDict = {};
            this.itemsIndexDict = {};
        }

        for (let i in this.sbag.dictIntStr.value_S) {
            this.itemsIndexDict[this.sbag.dictIntStr.value_S[i]] = this.sbag.dictIntStr.key_I[i];
        }
        for (let data of this.sbag.playerItems.data) {
            let itemData: ItemData = new ItemData(data);
            // if (ItemsUtil.isTaskItem(itemData)) {//任务物品不放进背包
            //     this.taskItems.push(itemData);
            // } else {
            //     let index: number = this.itemsIndexDict[data.uid_S];
            //     if (index != null) {
            //         this.itemsDict[index - 1] = itemData;
            //     }
            // }
            let index: number = this.itemsIndexDict[data.uid_S];
            if (index != null) {
                this.itemsDict[index] = itemData;
                this._usedCapacity++;
            }
        }
    }

    /**
     * 判断背包是否有足够的容量
     * @param capacity 需要的容量；0表示背包是否满了
     */
    public isHasCapacity(capacity: number = 0): boolean {
        if (this.capacity == 0) {
            return true;
        }
        return this.capacity - this.usedCapacity >= capacity;
    }

    /**
     * 背包是否满了
     */
    public get isFull() {
        return this.capacity - this.usedCapacity <= 0;
    }

    /**获取已使用的容量 */
    public get usedCapacity(): number {
        return this._usedCapacity;
    }

    public getByC(category: number): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == category) {
                data.push(itemData);
            }
        }
        return data;
    }

    public getByCT(category: number, type: number): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == category && itemData.getType() == type) {
                data.push(itemData);
            }
        }
        return data;
    }

    public getByCTAndShape(category: number, type: number, shape: EShape): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == category && itemData.getType() == type && itemData.getShape() == shape) {
                data.push(itemData);
            }
        }
        return data;
    }

    /**获取指定等级的同类型物品 */
    public getByCTAndTheSameItemLv(category: number, type: number, itemLv: number): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == category && itemData.getType() == type && itemData.getItemLevel() == itemLv) {
                data.push(itemData);
            }
        }
        return data;
    }

    public getByColor(minColor: EColor = EColor.EColorGray, maxColor: EColor = EColor.EColorGold): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getColor() >= minColor && itemData.getColor() <= maxColor) {
                data.push(itemData);
            }
        }
        return data;
    }

    public getByCTAndColor(category: number, type: number = -1, minColor: EColor = EColor.EColorGray, maxColor: EColor = EColor.EColorGold): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == category) {
                if (type != -1) {
                    if (itemData.getType() != type) {
                        continue;
                    }
                }
                if (itemData.getColor() >= minColor && itemData.getColor() <= maxColor) {
                    data.push(itemData);
                }
            }
        }
        return data;
    }

    public getByCTAndShapeColor(category: number, type: number = -1, shape: number, minColor: EColor = EColor.EColorGray, maxColor: EColor = EColor.EColorGold): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == category) {
                if (type != -1) {
                    if (itemData.getType() != type) {
                        continue;
                    }
                }
                if (itemData.getItemInfo()['shape'] != shape) {
                    continue;
                }
                if (itemData.getColor() >= minColor && itemData.getColor() <= maxColor) {
                    data.push(itemData);
                }
            }
        }
        return data;
    }

    public isHasByCTAndShapeColor(category: number, type: number = -1, shape: number, minColor: EColor = EColor.EColorGray, maxColor: EColor = EColor.EColorGold): boolean {
        let flag: boolean = false;
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == category) {
                if (type != -1) {
                    if (itemData.getType() != type) {
                        continue;
                    }
                }
                if (itemData.getItemInfo()['shape'] != shape) {
                    continue;
                }
                if (itemData.getColor() >= minColor && itemData.getColor() <= maxColor) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**
     * 获取指定物品的数量
     * @param includeUnBind 是否包含非绑定
     */
    public getItemCountByCode(code: number, includeUnBind: boolean = true): number {
        let count: number = 0;
        let unbindCode: number = ItemsUtil.getUnbindCode(code);
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData)) {
                if (code == itemData.getCode() || (includeUnBind && unbindCode == itemData.getCode())) {
                    count += itemData.getItemAmount();
                }
            }
        }
        return count;
    }

    /**
     * 获取指定物品的数量。包含绑定和非绑定
     */
    public getItemCountByCode2(code: number): number {
        let count: number = 0;
        let unbindCode: number = ItemsUtil.getBindOrUnBindCode(code);
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (ItemsUtil.isTrueItemData(itemData)) {
                if (code == itemData.getCode() || unbindCode == itemData.getCode()) {
                    count += itemData.getItemAmount();
                }
            }
        }
        return count;
    }

    /**
     * 获取指定物品的数量
     */
    public getItemCountByFun(fun: Function, caller: any): number {
        let count: number = 0;
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (itemData) {
                if (fun.call(caller, itemData)) {
                    count += itemData.getItemAmount();
                }
            }
        }
        return count;
    }

    /**
     * 获取指定物品
     */
    public getItemsByFun(fun: Function, caller: any): Array<ItemData> {
        let items: Array<ItemData> = [];
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if (itemData) {
                if (fun.call(caller, itemData)) {
                    items.push(itemData);
                }
            }
        }
        return items;
    }

    /**
     * 获取物品等级大于该物品的同类物品
     */
    public getByCTAndItemLv(category: number, type: number, itemLevel: number): Array<ItemData> {
        let data: Array<ItemData> = [];
        for (let itemData of this.getByCT(category, type)) {
            if (itemData.getItemLevel() > itemLevel) {
                data.push(itemData);
            }
        }
        return data;
    }

    /**获取所有非空物品 */
    public getTrueItems(): Array<any> {
        return this.itemDatas;
    }

    /**
     * 是否有更好的装备可替换
     */
    public get isHasBetterEquip(): boolean {
        for (let itemData of this.itemDatas) {
            if (ItemsUtil.isEquipItem(itemData)) {
                if (itemData.isBestEquipInPack) {
                    return true;
                }
            }
        }
        return false;
    }

    public get itemDatas(): Array<ItemData> {
        let itemDatas: Array<ItemData> = [];
        let itemData: ItemData;
        for (let index in this.itemsDict) {
            itemData = this.itemsDict[Number(index)];
            if (!ItemsUtil.isTaskItem(itemData)) {//不显示任务物品
                itemDatas.push(itemData);
            }
        }
        return itemDatas;
    }

    /**
     * 获取该背包中所有物品分类列表
     * @param limitNum 限制每个大类列表数量 -1无限制
     */
    public getAllPosTypeItems(limitNum: number = -1): { [posType: number]: ItemData[] } {
        let result: { [posType: number]: ItemData[] } = {};
        for (let key in this.itemsDict) {
            let item: ItemData = this.itemsDict[key];
            if (!ItemsUtil.isTrueItemData(item)) continue;
            let category: ECategory = item.getCategory();
            let posType:EPlayerItemPosType = ItemsUtil.getPosTypeByCategory(Number(category));
            let items: ItemData[] = result[posType];
            if (!items) {
                items = [];
                result[posType] = items;
            }
            if (limitNum != -1 && items.length >= limitNum) continue;
            items.push(item);
        }
        return result;
    }

    /**
     * 是否有可使用的物品
     */
    public get isHadCanUseItem(): boolean {
        for (let key in this.itemsDict) {
            let itemData: ItemData = this.itemsDict[key];
            if(ItemsUtil.isRedTipCanUse(itemData)) {
                return true;
            }
        }
        return false;
    }

    /**背包中是否存在物品 */
    public getHadTrueItem(): boolean {
        // for (let i: number = 0; i < this.allItems.length; i++) {
        //     if (ItemsUtil.isTrueItemData(this.allItems[i])) return true;
        // }
        return this.usedCapacity > 0;
    }

    public addItemIndex(sItem: any): void {
        let uid: string = sItem.playerItem.uid_S;
        let index: number = sItem.posIndex_I;
        this.itemsIndexDict[uid] = index;
    }

    public getItemIndex(uid: string): number {
        if (this.itemsIndexDict[uid] == null) {
            return -1;
        }
        return this.itemsIndexDict[uid];
    }

    public clear(): void {

    }
}