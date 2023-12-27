class PackBackCache extends PackBaseCache {
    public constructor(params: any) {
        super(params);
    }

    /**
     * 获取背包中指定装备位置最高评分装备
     * @param posType
     * @param roleIndex 角色下标
     * @param isCheckDress 是否对比身上的(要比身上的评分高)
     */
    public getBestScoreEquip(posType: EDressPos, roleIndex: number, isCheckDress: boolean = false): ItemData {
        let maxScoreItemData: ItemData;
        let maxScore: number = 0;
        for (let itemData of this.itemDatas) {
            if (ItemsUtil.isEquipItem(itemData) && ItemsUtil.getEqiupPos(itemData) == posType && WeaponUtil.isCanEquip(itemData, roleIndex)) {
                let curScore: number = WeaponUtil.getScoreBase(itemData);
                if (maxScoreItemData == null) {
                    maxScoreItemData = itemData;
                    maxScore = curScore;
                } else if (curScore > maxScore) {
                    maxScoreItemData = itemData;
                    maxScore = curScore;
                }
            }
        }
        if (isCheckDress) {
            let dressScore: number = CacheManager.pack.rolePackCache.getDressEquipScoreByPos(posType, roleIndex);
            if (dressScore >= maxScore) { //低于身上的评分 返回null
                maxScoreItemData = null;
            }
        }
        return maxScoreItemData;
    }

    /**
     * 获取背包中最高评分装备
     */
    public getBestScoreEquipByCareer(posType: EDressPos, career: number): ItemData {
        let maxScoreItemData: ItemData;
        var maxScore: number = 0;

        for (let itemData of this.itemDatas) {
            let curScore: number = WeaponUtil.getScoreBase(itemData);
            if (ItemsUtil.isEquipItem(itemData) && ItemsUtil.getEqiupPos(itemData) == posType && CacheManager.role.isLevelMatch(itemData.getLevel()) && CareerUtil.getBaseCareer(itemData.getCareer()) == career) {
                if (maxScoreItemData == null) {
                    maxScoreItemData = itemData;
                    maxScore = curScore;
                } else if (curScore > maxScore) {
                    maxScoreItemData = itemData;
                    maxScore = WeaponUtil.getScoreBase(maxScoreItemData);
                }
            }
        }
        return maxScoreItemData;
    }

    /**
     * 根据穿戴位置 获取背包中所有可穿戴或职业符合等级高的装备
     */
    public getEquipByDressPos(posType: EDressPos, roleIndex: number, isNotEquip: boolean = false): ItemData[] {
        var result: ItemData[] = [];
        for (let itemData of this.itemDatas) {
            let isCanEquip: boolean = WeaponUtil.isCanEquip(itemData, roleIndex);
            if (isNotEquip) {
                isCanEquip = WeaponUtil.isLevelUnMatch(itemData, roleIndex);
            }
            if (ItemsUtil.isEquipItem(itemData) && ItemsUtil.getEqiupPos(itemData) == posType && isCanEquip) {
                result.push(itemData);
            }
        }
        return result;
    }

    

    /**
     * 根据穿戴位置和角色下标 判断背包是否有该位置的装备
     */
    public isHasEquipByDressPos(posType: EDressPos, roleIndex: number): boolean {
        for (let itemData of this.itemDatas) {
            if (ItemsUtil.isEquipItem(itemData) && ItemsUtil.getEqiupPos(itemData) == posType && WeaponUtil.isCanEquip(itemData, roleIndex)) {
                return true;
            }
        }
        return false;
    }


    /**
     * 根据穿戴位置判断背包中是否评分更高的装备 （对比身上的装备）
     */
    public isHasBestScoreEquipByPos(posType: EDressPos, roleIndex: number): boolean {
        var maxItem: ItemData = this.getBestScoreEquip(posType, roleIndex, true); //WeaponUtil.getItemBestScoreBase(posType)
        return maxItem != null;
    }

    /**
     * 获取所有道具，即排除装备和符文
     */
    // public getProps(): Array<ItemData> {
    //     let itemDatas: Array<ItemData> = [];
    //     for (let itemData of this.allItems) {
    //         if (ItemsUtil.isTrueItemData(itemData)) {
    //             if (!ItemsUtil.isEquipItem(itemData)) {
    //                 itemDatas.push(itemData);
    //             }
    //         }
    //     }
    //     return itemDatas;
    // }

    /**
     * 获取背包中可熔炼的装备
     * 不能熔炼的装备：所有装备评分比人物身上对应部位高的前提下，等级比人物低的保留一套最高评分的，等级比人物高的，各等级保留一套。
     * 通用装备，每个角色每个类型保留一个最高评分的
     * 能熔炼的=所有装备-不能熔炼的
     */
    public getEquipsCanSmelt(): Array<ItemData> {
        let canEquipItems: any = {};
        let canNotEquipItems: any = {};
        //保留的装备uid
        let keepUids: any = {};
        let itemScore: number;
        let itemLevel: number;
        let itemCareer: number;
        let itemType: number;
        let itemUid: string;
        let equipedScore: number = 0;//对应部位装备的评分
        let canEquipKey: string;
        let canEquipMaxScore: number = 0;
        let canNotEquipKey: string;
        let canNotEquipMaxScore: number = 0;
        let levelKey: string;
        let equipedScoreDict: any = CacheManager.pack.rolePackCache.getEquipsScoreDict();
        let carer0EquipedScoreDict: any = CacheManager.pack.rolePackCache.getCareer0EquipsScoreDict();
        let roleIndex: number;
        let itemDatas: Array<ItemData> = this.itemDatas;
        let gEquipDict: { [type: number]: Array<ItemData> } = {};//通用装备，键为装备类型。
        let gMinScore: number = 0;//通用装备最低评分
        for (let itemData of itemDatas) {
            equipedScore = 0;
            canEquipMaxScore = 0;
            canNotEquipMaxScore = 0;
            if (!ItemsUtil.isEquipSpritItem(itemData)) {
                itemUid = itemData.getUid();
                roleIndex = itemData.getRoleIndex();
                if (itemData.getColor() >= EColor.EColorRed) {
                    keepUids[itemUid] = 1;
                    continue;
                }
                itemScore = WeaponUtil.getCombatByItemData(itemData);
                itemCareer = CareerUtil.getBaseCareer(itemData.getCareer());
                itemType = itemData.getType();

                if (equipedScoreDict[itemCareer] && equipedScoreDict[itemCareer][itemType]) {
                    equipedScore = equipedScoreDict[itemCareer][itemType];
                }

                //通用职业
                if (itemCareer == 0) {
                    if (carer0EquipedScoreDict[itemType] != null && carer0EquipedScoreDict[itemType].length == 3) {//三角色都穿戴了
                        gMinScore = carer0EquipedScoreDict[itemType][0];
                    }
                    if (WeaponUtil.getScoreBase(itemData) > gMinScore) {
                        if (gEquipDict[itemType] == null) {
                            gEquipDict[itemType] = [];
                        }
                        gEquipDict[itemType].push(itemData);
                    }
                } else {
                    if (itemScore > equipedScore) {
                        if (WeaponUtil.isCanEquipByItemData(itemData)) {
                            canEquipKey = `${itemCareer}-${itemType}`;
                            if (canEquipItems[canEquipKey] != null) {
                                canEquipMaxScore = canEquipItems[canEquipKey]["score"];
                            }
                            if (itemScore > canEquipMaxScore) {
                                canEquipItems[canEquipKey] = { "uid": itemUid, "score": itemScore };
                            }
                        } else {
                            levelKey = ItemsUtil.getEquipLevelKey(itemData);
                            canNotEquipKey = `${itemCareer}-${levelKey}-${itemType}`;
                            if (canNotEquipItems[canNotEquipKey] != null) {
                                canNotEquipMaxScore = canNotEquipItems[canNotEquipKey]["score"];
                            }
                            if (itemScore > canNotEquipMaxScore) {
                                canNotEquipItems[canNotEquipKey] = { "uid": itemUid, "score": itemScore };
                            }
                        }
                    }
                }
            }
        }

        //背包中通用装备+人物已穿戴的装备，按评分高低排序。
        let equipedDict: { [type: number]: Array<ItemData> } = CacheManager.pack.rolePackCache.getEquipsDict();
        let gItemDatas: Array<ItemData>;
        for (let type in gEquipDict) {
            gItemDatas = gEquipDict[type];
            if (equipedDict[type] != null) {
                gItemDatas = gItemDatas.concat(equipedDict[type]);
            }
            gItemDatas.sort((a: ItemData, b: ItemData): number => {
                let scoreA: number = WeaponUtil.getScoreBase(a);
                let scoreB: number = WeaponUtil.getScoreBase(b);
                if (scoreA == scoreB) {
                    return b.getPosType() - a.getPosType();//优先保留角色身上的，角色背包类型比装备背包大
                } else {
                    return scoreB - scoreA;
                }
            });

            //每个最多保留3个
            let itemData: ItemData;
            for (let i: number = 0; i < gItemDatas.length; i++) {
                itemData = gItemDatas[i];
                if (i <= 2) {
                    keepUids[itemData.getUid()] = 1;
                }
            }
        }

        let uid: string;
        for (let key in canEquipItems) {
            uid = canEquipItems[key]["uid"];
            keepUids[uid] = 1;
        }
        for (let key in canNotEquipItems) {
            uid = canNotEquipItems[key]["uid"];
            keepUids[uid] = 1;
        }

        //刷选出能熔炼的装备
        let smeltItems: Array<ItemData> = [];
        for (let itemData of itemDatas) {
            if (!keepUids[itemData.getUid()] && !ItemsUtil.isKillItem(itemData)) {
                smeltItems.push(itemData);
            }
        }
        return smeltItems;
    }

    public getChipsCanDecompose(): Array<ItemData> {
        let decomposeItems: Array<ItemData> = [];
        let structInfo: any = CacheManager.uniqueSkill.getUniqueSkillInfo();
        let info: any = structInfo ? structInfo.levelInfo : null;
        let cultivateDatas: Array<any>;
        for (let itemData of this.itemDatas) {
            if (ItemsUtil.isTrueItemData(itemData) && itemData.getType() == EEquip.EEquipKill) {
                cultivateDatas = ConfigManager.cultivate.select({ "itemCode": itemData.getCode() });
                if (cultivateDatas.length > 0) {
                    let chipData: any = cultivateDatas[0];
                    if (info && info[chipData.position] && chipData.level <= info[chipData.position]) {//已激活的可以分解
                        decomposeItems.push(itemData);
                    } else if (chipData.level > 5) {//五转以上的可以分解
                        decomposeItems.push(itemData);
                    }
                }
            }
        }
        return decomposeItems;
    }

    /**
     * 获取装备背包可扩展容量
     */
    public getExtendCapacity(): number {
        let capacity: number = 0;
        let vipAddDict: any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddBagCapacity);
        capacity = CacheManager.pack.backPackCache.capacity - 200 - vipAddDict[`${CacheManager.vip.vipLevel}`];
        if (CacheManager.welfare2.isGoldCard) {
            capacity -= 100;
        }
        if (CacheManager.welfare2.isPrivilegeCard) {
            capacity -= 100;
        }
        return 500 - capacity;
    }

    /**
     * 获取vip增加的格子
     */
    public getAddCapacity(): number {
        let add: number = 0;
        let vipAddDict: any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddBagCapacity);
        if (vipAddDict[CacheManager.vip.vipLevel]) {
            add = vipAddDict[CacheManager.vip.vipLevel];
        }
        if (CacheManager.welfare2.isGoldCard) {
            add += 100;
        }
        if (CacheManager.welfare2.isPrivilegeCard) {
            add += 100;
        }
        return add;
    }

    public clear(): void {

    }


}