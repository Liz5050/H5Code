class ItemsUtil {
    private static baseAttrAddRate: number = 0;
    private static ColorName: string[] = ["", "白", "", "紫", "橙", "红", "金"];
	private static ColorExName: string[] = ["", "神", "圣"];


    /**
     * 是否为非空物品数据
     */
    public static isTrueItemData(itemData: ItemData) {
        return itemData && itemData.data && itemData.getItemInfo();
    }

    public static isTaskItem(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryTask;
    }

    public static isMountItem(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryMount;
    }

    public static isPropItem(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp;
    }

    /**
     * 是否为必杀碎片
     */
    public static isKillItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && this.isEquipItem(itemData)) {
            if (itemData.getType() == EEquip.EEquipKill) {
                return true;
            }
        }
        return false;
    }

    public static isEquipItem(itemData: ItemData): boolean {
        let category: number;
        if (this.isTrueItemData(itemData)) {
            category = itemData.getCategory();
            if (category == ECategory.ECategoryEquip || category == ECategory.ECategoryPetEquip) {
                return true;
            }
        }
        return false;
    }

    public static isEquipSpritItem(itemData: ItemData): boolean {
        let category: number;
        if (this.isTrueItemData(itemData)) {
            category = itemData.getCategory();
            if (category == ECategory.ECategoryEquip && itemData.getType() == EEquip.EEquipSpirit) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否为图鉴道具
     */
    public static isIllustrateItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData)) {
            if (itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropIllustratedCard) {
                return true;
            }
        }
        return false;
    }
    /**首充特惠礼包 */
    public static isVipLimitedGiftBag(itemData: ItemData):boolean{
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropVipLimitedGiftBag;
    }

    /**是否为等级礼包 */
    public static isLevelGift(itemData:ItemData):boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropLevelGiftBag;
    }

    /**
     * 检测道具类型的物品小类
     */
    public static checkPropType(itemData:ItemData,type:EProp):boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == type;
    }

    /**
     * 是否为小鬼怪
     */
    public static isSpiritExp(itemData: ItemData): boolean {
        return ItemsUtil.isEquipSpritItem(itemData) && (itemData.getCode() == 10113001 || itemData.getCode() == 10113011);
    }

    /**
     * 是否为小仙女
     */
    public static isSpiritFairy(itemData: ItemData): boolean {
        return ItemsUtil.isEquipSpritItem(itemData) && (itemData.getCode() == 10113002 || itemData.getCode() == 10113012);
    }

    /**
     * 是否为同心锁/官印
     */
    public static isHeartLock(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryEquip && itemData.getType() == EEquip.EEquipHeartLock;
    }

    public static isSkillBook(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropSkillBook;
    }

    public static isShapeItem(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryMaterial && itemData.getShape() > 0;
    }

    public static isPetMountActiveItem(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getShape() > 0;
    }

    public static isFashionItem(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getType() == EProp.EPropFashion;
    }

    public static isJewelItem(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryJewel;
    }

    public static isCopyExpPass(itemData: ItemData): boolean {
        var code: number = itemData.getCode();
        var isExpCopyItem: boolean = code == CopyEnum.ExpCopyItem;
        if (!isExpCopyItem) {
            var item: any = ConfigManager.item.getByPk(CopyEnum.ExpCopyItem);
            isExpCopyItem = item.codeUnbind && item.codeUnbind == code;
        }
        return this.isTrueItemData(itemData) && isExpCopyItem;
    }

    /**
     * 是否为宠物经验丹
     */
    public static isPetExpDrug(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryDrug && itemData.getType() == EDrug.EDrugPetExp;
    }

    /**
     * 是否为符文
     */
    public static isRune(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryRune;
    }

    /**是否秘境 */
    public static isChects(itemData:ItemData):boolean{
        return itemData.getCategory() == ECategory.ECategoryCheats;
    }

    /**
     * 是否为符文精华
     */
    public static isRuneZero(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryRune && itemData.getType() == ERune.ERuneZero;
    }

    /**
     * 获取物品tooltip类型
     */
    public static getToolTipType(itemData: ItemData): ToolTipTypeEnum {
        let tt: ToolTipTypeEnum = ToolTipTypeEnum.Item;
        let category: number = itemData.getCategory();
        if (ItemsUtil.isEquipSpritItem(itemData)) {
            tt = ToolTipTypeEnum.Spirit;
        } else if (ItemsUtil.isKillItem(itemData)) {
            tt = ToolTipTypeEnum.Kill;
        } else if (ItemsUtil.isEquipItem(itemData)) {
            if (WeaponUtil.isSpecialTipsEquip(itemData.getType())) {
                tt = ToolTipTypeEnum.EquipSpecial;
            } else if (WeaponUtil.isEquipHeartLock(itemData.getType())) {
                tt = ToolTipTypeEnum.Equip3;
            } else {
                tt = ToolTipTypeEnum.Equip;
            }
        } else if (ItemsUtil.isMountItem(itemData)) {
            tt = ToolTipTypeEnum.Mount;
        } else if (ItemsUtil.isRune(itemData)) {
            tt = ToolTipTypeEnum.Rune;
        } else if (ItemsUtil.isFashionItem(itemData)) {
            tt = ToolTipTypeEnum.Fashion;
        } else if (ItemsUtil.isIllustrateItem(itemData)) {
            tt = ToolTipTypeEnum.Illustrate;
        } else if (ItemsUtil.isGodWing(itemData)) {
            tt = ToolTipTypeEnum.GodWing;
        } else if (ItemsUtil.isImmPiece(itemData)) {
            tt = ToolTipTypeEnum.ImmPiece;
        } else if (ItemsUtil.isAncientEquip(itemData)) {
            tt = ToolTipTypeEnum.AncientEquip;
        } else if (ItemsUtil.isPetEquip(itemData)) {
            tt = ToolTipTypeEnum.PetEquip;
        } else if (ItemsUtil.isHeartMethod(itemData)) {
            tt = ToolTipTypeEnum.HeartMethod;
        } else if (ItemsUtil.isTalentEquip(itemData)) {
            tt = ToolTipTypeEnum.TalentEquip;
        } else if (ItemsUtil.isShapeChangeProp(itemData)) {
            tt = ToolTipTypeEnum.ShapeChangeProp;
        } else if (ItemsUtil.isLawEquip(itemData)) {
            tt = ToolTipTypeEnum.PetEquip;
        }else if(ItemsUtil.isChects(itemData)){
            tt = ToolTipTypeEnum.CheatPreview;
        }else if(ItemsUtil.isVipLimitedGiftBag(itemData)){
            tt = ToolTipTypeEnum.RechargeFirstGift;
        }else if(ItemsUtil.isBeastEquip(itemData)) {
            tt = ToolTipTypeEnum.BeastEquip;
        }else if(ItemsUtil.isCanDonateItem(itemData)) {
            tt = ToolTipTypeEnum.DonateProp;
        }
        return tt;
    }

    public static isShapeChangeProp(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && (itemData.getType() == EProp.EPropShapeChangeEx || itemData.getType() == EProp.EPropShapeChangeActive);
    }

    public static isTalentEquip(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryTalentEquip;
    }

    public static isPetEquip(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeEquip;
    }

    public static isLawEquip(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp) {
            var equip = ConfigManager.mgShapeEquip.getByItemCode(itemData.getCode());
            if (equip) {
                if (equip.shape == EShape.EShapeLaw) {
                    return true;
                }
            }
        }
        return false;
    }

    public static isAncientEquip(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropForeverEquipProp;
    }

    /**是否神兵碎片 */
    public static isImmPiece(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropImmortalsFragment;
    }

    public static isHeartMethod(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryHeartMethod;
    }
    /**是否神羽 */
    public static isGodWing(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropStrengthenExAccessory;
    }

    public static isCanSell(itemData: ItemData): boolean {
        if (ItemsUtil.isTrueItemData(itemData)) {
            let sell: any = itemData.getItemInfo().sell;
            if (sell != null && sell == 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否为可以一键出售的装备
     * 白-蓝装备，非守护、心锁等
     */
    public static isCanOneKeySellEquip(itemData: ItemData): boolean {
        let protectTypes: Array<EEquip> = [EEquip.EEquipSpirit, EEquip.EEquipJewelry, EEquip.EEquipRing, EEquip.EEquipHeartLock, EEquip.EEquipWristlet];
        if (ItemsUtil.isEquipItem(itemData) && ItemsUtil.isCanSell(itemData)) {
            let color: number = itemData.getColor();
            if (color >= EColor.EColorWhite && color <= EColor.EColorBlue) {
                if (protectTypes.indexOf(itemData.getType()) == -1) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 是否为可以一键熔炼的装备
     * 白-蓝装备，非守护、心锁等
     */
    public static isCanOneKeySmeltEquip(itemData: ItemData): boolean {
        let protectTypes: Array<EEquip> = [EEquip.EEquipSpirit, EEquip.EEquipJewelry, EEquip.EEquipRing, EEquip.EEquipHeartLock, EEquip.EEquipWristlet];
        if (ItemsUtil.isEquipItem(itemData) && ItemsUtil.isCanSell(itemData)) {
            let color: number = itemData.getColor();
            if (color >= EColor.EColorWhite && color <= EColor.EColorBlue) {
                if (protectTypes.indexOf(itemData.getType()) == -1) {
                    return true;
                }
            }
        }
        return false;
    }

    public static isCanOverlay(itemData: ItemData): boolean {
        if (ItemsUtil.isTrueItemData(itemData)) {
            return itemData.getItemInfo().overlay > 1;
        }
        return false;
    }

    public static isCanSplit(itemData: ItemData): Boolean {
        return ItemsUtil.isCanOverlay(itemData) && itemData.getItemAmount() > 1;
    }

    /**
     * 是否境界提升道具
     */
    public static isRealmItem(itemData: ItemData): boolean {
        return itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropUpgradeRealmLevel;
    }

    /**
     * 是否为传送道具
     */
    public static isConvey(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropPassToTarget;
    }

    /**根据大类小类获取其对应的装备位置 */
    public static getEqiupPos(itemData: ItemData): number {
        let pos: number = -1;
        if (itemData.getCategory() == ECategory.ECategoryEquip) {
            pos = ItemsUtil.getEquipPosByType(itemData.getType());
        }
        else if (itemData.getCategory() == ECategory.ECategoryMount) {
            pos = EDressPos.EDressPosMount;
        }
        return pos;
    }

    public static getEquipPosByType(type: number): number {
        let pos: number = -1;
        switch (type) {
            case EEquip.EEquipWeapon:
                pos = EDressPos.EDressPosWeapon;//武器
                break;
            case EEquip.EEquipJewelry:
                pos = EDressPos.EDressPosJewelry;//项链
                break;
            case EEquip.EEquipHelmet:
                pos = EDressPos.EDressPosHelmet;//手镯
                break;
            case EEquip.EEquipRing:
                pos = EDressPos.EDressPosRing;//戒指
                break;
            case EEquip.EEquipWristlet:
                pos = EDressPos.EDressPosWristlet;//仙符
                break;
            case EEquip.EEquipShoulder:
                pos = EDressPos.EDressPosShoulder;//护手
                break;
            case EEquip.EEquipClothes:
                pos = EDressPos.EDressPosClothes;//衣服
                break;
            case EEquip.EEquipBelt:
                pos = EDressPos.EDressPosBelt;//护腿
                break;
            case EEquip.EEquipGloves:
                pos = EDressPos.EDressPosGloves;//头盔
                break;
            case EEquip.EEquipShoes:
                pos = EDressPos.EDressPosShoes;//鞋
                break;
            case EEquip.EEquipSpirit:
                pos = EDressPos.EDressPosSpirit;//守护
                break;
            case EEquip.EEquipHeartLock:
                pos = EDressPos.EDressPosHeartLock;//同心锁
                break;
        }
        return pos;
    }

    /**
     * vip体验卡
     */
    public static isVipExperience(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropVIPCard) {
            if (itemData.getEffect() == -1) {
                return true;
            }
        }
        return false;
    }

    /**是否boss经验丹 */
    public static isBossExpDrug(itemData: ItemData):boolean{
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryDrug && itemData.getType() == EProp.EPropEquipStrengthenLuckRune;
    }

    /**
     * 离线挂机卡
     */
    public static isOfflineWork(itemData: ItemData): boolean {
        return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropOfflineWork;
    }

    /**
     * 获取绑定code
     */
    public static getbindCode(code: number): number {
        let itemInfo: any = ConfigManager.item.getByPk(code);
        if (itemInfo && itemInfo.bind != 1 && itemInfo.codeUnbind) {
            return itemInfo.codeUnbind;
        }
        return code;
    }

    /**
     * 获取非绑定code
     */
    public static getUnbindCode(code: number): number {
        let itemInfo: any = ConfigManager.item.getByPk(code);
        if (itemInfo && itemInfo.bind == 1 && itemInfo.codeUnbind) {
            return itemInfo.codeUnbind;
        }
        return code;
    }

    /**
     * 获取非绑定或绑定code
     */
    public static getBindOrUnBindCode(code: number): number {
        let itemInfo: any = ConfigManager.item.getByPk(code);
        if (itemInfo && itemInfo.codeUnbind) {
            return itemInfo.codeUnbind;
        }
        return code;
    }

    /**
     * 获取时装数据
     */
    public static getFashionData(itemData: ItemData): any {
        let fashionData: Array<any>;
        fashionData = ConfigManager.mgFashion.select({ "propCode": itemData.getCode() });
        fashionData = fashionData.length ? fashionData : ConfigManager.mgFashion.select({ "propCode": ItemsUtil.getUnbindCode(itemData.getCode()) });
        return fashionData[0];
    }

    /**
     * 把根据itemData创建一个 SPlayerItem
     */
    public static itemToSPlayerItem(itemData: ItemData): any {
        var SPlayerItem: any = {}
        SPlayerItem.playerId_I = CacheManager.role.player.playerId_I;
        SPlayerItem.uid_S = itemData.getUid();
        SPlayerItem.itemCode_I = itemData.getCode()
        SPlayerItem.posType_I = itemData.getPosType();
        SPlayerItem.itemAmount_I = itemData.getItemAmount();
        SPlayerItem.jsStr_S = itemData.data.jsStr_S;
        return SPlayerItem;
    }

    /**
     * 把一个SPlayerItem的属性转换成字符串
     */
    public static sPlayerItemToStr(SPItem: any): string {
        var retStr: string = "";
        var js: string = SPItem.jsStr_S ? SPItem.jsStr_S : "";
        js = ChatUtils.stripMsg(js);
        retStr += `${SPItem.playerId_I}|${SPItem.uid_S}|${SPItem.itemCode_I}|${SPItem.posType_I}|${SPItem.itemAmount_I}|${js}`;
        return retStr;
    }

    /**字符串转换成 SPlayerItem */
    public static strToSPlayerItem(str: string): any {
        var props: string[] = str.split("|");
        var SPlayerItem: any = {}
        SPlayerItem.playerId_I = Number(props[0]);
        SPlayerItem.uid_S = props[1];
        SPlayerItem.itemCode_I = Number(props[2]);
        SPlayerItem.posType_I = Number(props[3]);
        SPlayerItem.itemAmount_I = Number(props[4]);
        SPlayerItem.jsStr_S = props[5];
        return SPlayerItem;
    }

    /**
     * 判断某个code是否是某个名字
     */
    public static checkName(itemCode: number, itemName: string): boolean {
        var item: any = ConfigManager.item.getByPk(itemCode);
        return item.name == itemName;
    }

    public static getColorBySPlayerItem(SPItem: any): string {
        var item: ItemData = new ItemData(SPItem);
        return Color.ItemColor[item.getColor()];
    }

    /**
     * 是否可以捐献给仙盟仓库
     */
    public static isCanDonateToGuildWarehouse(itemData: ItemData): boolean {
        if (ItemsUtil.isEquipItem(itemData)) {
            if (itemData.getItemLevel() >= 4 && WeaponUtil.getStar(itemData) >= 1 && !itemData.isBind && !itemData.isExpire) {
                if (itemData.getStrengthenLevel() == 0 && itemData.getStoneLevel() == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 装备等级key，转生次数-等级
     */
    public static getEquipLevelKey(itemData: ItemData): string {
        let career: number = itemData.getCareer();
        let level: number = itemData.getLevel();
        let rebirthTimes: number = CareerUtil.getRebirthTimes(career);
        return `${rebirthTimes}-${level}`;
    }

    /**
     * 根据物品大类获取物品存放的位置
     */
    public static getPosTypeByCategory(category: ECategory): EPlayerItemPosType {
        switch (category) {
            case ECategory.ECategoryEquip:
                return EPlayerItemPosType.EPlayerItemPosTypeBag;
            case ECategory.ECategoryRune:
                return EPlayerItemPosType.EPlayerItemPosTypeRune;
            default:
                return EPlayerItemPosType.EPlayerItemPosTypeProp;
        }
    }

    /**
     * 是否为等级直升丹
     */
    public static isUpLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropUpgradeLevel) {
            return true;
        }
        return false;
    }

    /**
     * 是否为翅膀等级直升丹
     * 直升丹有2个
     */
    public static isWingUpLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp
            && (itemData.getType() == EProp.EPropUpgradeStrengthenEx && itemData.getEffectEx() == EStrengthenExType.EStrengthenExTypeWing)) {
            return true;
        }
        return false;
    }

    /**
     * 是否为翅膀老的等级直升丹。无有效期
     */
    public static isOldWingUpLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropUpgradeWing) {
            return true;
        }
        return false;
    }

    /**
     * 是否为翅膀进阶直升丹
     */
    public static isWingUpgradeItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropUpgradeStrengthenEx2
        && itemData.getEffectEx() == EStrengthenExType.EStrengthenExTypeWing) {
            return true;
        }
        return false;
    }

    /**
     * 是否为翅膀直升丹。包含新、老等级直升丹和进阶直升丹
     */
    public static isWingUpItem(itemData: ItemData): boolean {
        return ItemsUtil.isWingUpLevelItem(itemData) || ItemsUtil.isOldWingUpLevelItem(itemData) || ItemsUtil.isWingUpgradeItem(itemData);
    }

    /**
     * 是否为龙炎甲等级直升丹
     */
    public static isDragonScaleLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropUpgradeStrengthenEx
            && itemData.getEffectEx() == EStrengthenExType.EStrengthenExTypeDragonSoul) {
            return true;
        }
        return false;
    }

    /**
     * 是否为龙炎甲进阶直升丹
     */
    public static isDragonScaleUpgradeItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropUpgradeStrengthenEx2
            && itemData.getEffectEx() == EStrengthenExType.EStrengthenExTypeDragonSoul) {
            return true;
        }
        return false;
    }

    /**
     * 是否为龙炎甲直升丹。包含直升丹和进阶直升丹
     */
    public static isDragonScaleUpItem(itemData: ItemData): boolean {
        return ItemsUtil.isDragonScaleLevelItem(itemData) || ItemsUtil.isDragonScaleUpgradeItem(itemData);
    }

    /**
     * 是否为宠物等级直升丹
     */
    public static isPetUpLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvance
            && itemData.getShape() == EShape.EShapePet) {
            return true;
        }
        return false;
    }

    /**
     * 是否为宠物进阶直升丹
     */
    public static isPetUpgradeItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvanceEx
            && itemData.getShape() == EShape.EShapePet) {
            return true;
        }
        return false;
    }

    /**
     * 是否为宠物直升丹
     */
    public static isPetUpItem(itemData: ItemData): boolean {
        return ItemsUtil.isPetUpLevelItem(itemData) || ItemsUtil.isPetUpgradeItem(itemData);
    }


    /**
     * 是否为法阵等级直升丹
     */
    public static isLawUpLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvance
            && itemData.getShape() == EShape.EShapeLaw) {
            return true;
        }
        return false;
    }

    /**
     * 是否为法阵进阶直升丹
     */
    public static isLawUpUpgradeItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvanceEx
            && itemData.getShape() == EShape.EShapeLaw) {
            return true;
        }
        return false;
    }

    /**穹苍领 */
    public static isQiongCangToken(itemData: ItemData):boolean{
       return this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropQiongCangToken;
    }
    /**
     * 是否为战阵等级直升丹
     */
    public static isBattleUpLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvance
            && itemData.getShape() == EShape.EShapeBattle) {
            return true;
        }
        return false;
    }

    /**
     * 是否为战阵进阶直升丹
     */
    public static isBattleUpUpgradeItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvanceEx
            && itemData.getShape() == EShape.EShapeBattle) {
            return true;
        }
        return false;
    }


    /**
     * 是否为剑池等级直升丹
     */
    public static isSwordPoolUpLevelItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvance
            && itemData.getShape() == EShape.EShapeSwordPool) {
            return true;
        }
        return false;
    }

    /**
     * 是否为剑池进阶直升丹
     */
    public static isSwordPoolUpUpgradeItem(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropShapeAdvanceEx
            && itemData.getShape() == EShape.EShapeSwordPool) {
            return true;
        }
        return false;
    }

    /**
     * 是否为法阵直升丹
     */
    public static isLawUpItem(itemData: ItemData): boolean {
        return ItemsUtil.isLawUpLevelItem(itemData) || ItemsUtil.isLawUpUpgradeItem(itemData);
    }

    /**
     * 是否为战阵直升丹
     */
    public static isBattleUpItem(itemData: ItemData): boolean {
        return ItemsUtil.isBattleUpLevelItem(itemData) || ItemsUtil.isBattleUpUpgradeItem(itemData);
    }

    public static isSwordPoolUpItem(itemData: ItemData): boolean {
        return ItemsUtil.isSwordPoolUpLevelItem(itemData) || ItemsUtil.isSwordPoolUpUpgradeItem(itemData);
    }


    /**
     * 是否直升丹或进阶丹
     */
    public static isShapeUpgradeItem(itemData: ItemData):boolean {
        return ItemsUtil.isWingUpItem(itemData) || ItemsUtil.isDragonScaleUpItem(itemData) || ItemsUtil.isPetUpItem(itemData) || ItemsUtil.isLawUpItem(itemData);
    }



    /**
     * 增加副本次数道具，如野外BOSS
     */
    public static isAddCopyNumProp(itemData: ItemData): boolean {
        if (this.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropAddCopyNum) {
            return true;
        }
        return false;
    }

    /** 检查背包是否是否弹熔炼提示 返回true表示会弹熔炼提示 */
    public static checkSmeltTips(isShowTips: boolean = true, limitNumPack: number = -1): boolean {
        // let limitNumPack: number = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
        if (limitNumPack == -1) {
            limitNumPack = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
        }
        let flag: boolean = CacheManager.pack.backPackCache.isHasCapacity(limitNumPack);
        if (!flag && isShowTips) {
            EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
        }
        return !flag;
    }

    /**
     * 是否为仙盟柴火
     * @param {ItemData} itemData
     * @returns {boolean}
     */
    public static isGuildFireWood(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropFireWood;
    }

    /**
     * 是否为仙盟礼包
     */
    public static isGuildFixGiftBag(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropGuildFixGiftBag;
    }

    /**
     * 是否为激活码礼包
     */
    public static isActivationGiftBag(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropActivedGiftBag;
    }

    /**
     * 是否为巅峰令
     */
    public static isPeakItem(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropPeakArena;
    }

    /**
     * 是否需要可使用红点
     * @param {ItemData} itemData
     * @returns {boolean}
     */
    public static isRedTipCanUse(itemData: ItemData): boolean {

        if (itemData && ItemsUtil.isImmPiece(itemData)) { //神兵礼包碎片
            let itemInfo: any = itemData.getItemInfo();
            let meterialItem: ItemData = ConfigManager.smeltPlan.getMeterialItem(itemInfo.effect);
            return itemData.getItemAmount() >= meterialItem.getItemAmount();
        }

        if(ItemsUtil.isVipLimitedGiftBag(itemData)){ //首充特惠礼包
            let itemInfo:any = itemData.getItemInfo();            
            let vipLimit:number = itemInfo.effectEx; //免费打开的VIP等级限制
            let costYB:number = itemInfo.effectEx2; //VIP不足打开需要花费的元宝
            if(CacheManager.vip.checkVipLevel(vipLimit)){
                return true;
            }else{
                return MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,costYB,false) && !CacheManager.pack.isVipLimitedGiftBagClick;
            }
        }

        if(ItemsUtil.isRechargeGiftBag(itemData)){
            return !CacheManager.pack.isRechargeGiftBag;
        }

        if(ItemsUtil.isLevelGift(itemData)) {//等级礼包
            let itemInfo:any = itemData.getItemInfo();            
            let level:number = itemInfo.effectEx; //打开礼包所需等级限制
            let roleState:number = itemInfo.effectEx2; //打开礼包所需转生限制
            //优先判断转生等级
            if(roleState <= CacheManager.role.getRoleState()) return true;
            if(level <= CacheManager.role.getRoleLevel()) return true;
            return false;
        }

        if(ItemsUtil.isAddCopyNumProp(itemData) && itemData.getEffect() == ECopyType.ECopyMgNewExperience){
            let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CopyHallDaily],false);
            if(itemData.isDayNumLimit()){
                let ln:number = CacheManager.pack.getItemLeftUseCount(itemData.getCode());
                return isOpen && ln>0;//经验副本道具
            }else{
                return isOpen;
            }            
        }

        if(ItemsUtil.isMonthTempPrivilegeCard(itemData)) {
            return true;
        }
        
        if (itemData && itemData.isCanUseInPack && ItemsUtil.checkItemUseLevel(itemData) &&
            !ItemsUtil.isAddCopyNumProp(itemData) &&
            !ItemsUtil.isModifyNameItem(itemData) &&
            !ItemsUtil.isCheatsItem(itemData) 
            // !ItemsUtil.isPetUpLevelItem(itemData) &&
            // !ItemsUtil.isWingUpLevelItem(itemData) &&
            // !ItemsUtil.isOldWingUpLevelItem(itemData) &&
            // !ItemsUtil.isDragonScaleLevelItem(itemData)
        ) {

            if (ItemsUtil.isGuildFixGiftBag(itemData)) {
                return CacheManager.guildNew.isJoinedGuild();
            } else if (ItemsUtil.isActivationGiftBag(itemData)) {
                return CacheManager.vip.vipLevel >= itemData.getEffectEx();
            }
            if(!CacheManager.pack.getItemLeftUseCount(itemData.getCode())){
                return false;//没有剩余次数
            }

            return true;
        }
        return false;
    }

    /**
	 * 获取属性字典{"1": 10001, "2": 20001}
	 * @param str 1,10001#2,20001#
	 */
    public static getModelIdDict(str: string): any {
        let dict: any = {};
        if (str != null && str != "") {
            let arr = str.split("#");
            for (let a of arr) {
                if (a != "") {
                    let attrArr = a.split(",");
                    dict[Number(attrArr[0])] = Number(attrArr[1]);
                }
            }
        }
        return dict;
    }
    /**
     * 是否秘境
     */
    public static isCheatsItem(itemData: ItemData): boolean {
        return ItemsUtil.isTrueItemData(itemData) && itemData.getCategory() == ECategory.ECategoryCheats;
    }

    /**
     * 是否为改名卡
     */
    public static isModifyNameItem(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropModifyRoleName;
    }

    /**
     * 是否为一元夺宝礼包
     */
    public static isRechargeGiftBag(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropRechargeGiftBag;
    }

    /**
     * 是否为神兽装备
     */
    public static isBeastEquip(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryBeastEquip;
    }

    /**
     * 是否为可捐献物品 
     */
    public static isCanDonateItem(itemData: ItemData):boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropGuildWareHouse;
    }

    /**
     * 自身等级是否符合物品使用等级
     */
    public static checkItemUseLevel(itemData: ItemData):boolean {
        return itemData && CacheManager.role.getRoleLevel() >= itemData.getLevel();
    }

    /**获取最大浮动值 */
    public static getBaseAttrAddRate(): number {
        if (ItemsUtil.baseAttrAddRate == 0) {
            ItemsUtil.baseAttrAddRate = ConfigManager.const.getConstValue("RedEquipAttrAddRandomZone");
        }
        return ItemsUtil.baseAttrAddRate;
    }

    /**
     * 是否为自选礼包
     */
    public static isChooseGiftBag(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropChoseGiftBag;
    }

    /**
     * 是否是特权体验卡
     */

    public static isMonthTempPrivilegeCard(itemData: ItemData): boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropTempRechargeCard;
    }
    

    public static usellustrate(itemData:ItemData, isDeco : boolean = false):boolean{
        let flag:boolean = false;
        if(ItemsUtil.isIllustrateItem(itemData)){
            let datas: Array<any> = ConfigManager.cultivate.getConfigsByMaterial(itemData.getCode());
            if(datas.length > 0) {
                let illusData:any = datas[0];
                if(CacheManager.cultivate.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, illusData.position) == -1) {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Pack, { "tabType": PanelTabType.TrainIllustrate, "subType": illusData.subtype, "isDeco" : isDeco});
                } else {
                    EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Pack, { "tabType": PanelTabType.TrainIllustrate, "isDeco" : isDeco});
                }
                flag = true;
            }
        }
        return flag;
    }

    public static openFashion(fashionData:any,viewIndex:number):boolean{
        let flag:boolean = false;
        if(!fashionData){
            return false;
        }
        let toPanelTabType: PanelTabType;
        switch (fashionData.type) {
            case EFashionType.EFashionClothes:
                toPanelTabType = PanelTabType.FashionClothes;
                break;
            case EFashionType.EFashionWeapon:
                toPanelTabType = PanelTabType.FashionWeapon;
                break;
            case EFashionType.EFashionWing:
                toPanelTabType = PanelTabType.FashionWing;
                break;
            default:
                toPanelTabType = PanelTabType.FashionClothes;
        }
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.FashionII, {
            "tabType": toPanelTabType,
            "fashionData": fashionData
        }, viewIndex);

        return flag;
    }

    public static getBeastColor(id : number) : string {
        var itemcfg = ConfigManager.item.getByPk(id);
        if(!itemcfg) {
            return "";
        }
        var cfg = ConfigManager.mgBeastEquip.getByPk(itemcfg.effect);
        var colorex = 0;
        if(cfg.colorEx) {
            colorex = cfg.colorEx;
        }
        let name: string = `${this.ColorName[cfg.color]}色`
        name = `<font color = ${Color.ItemColor[cfg.color]}>${name}</font>`;
        return name;
    }

    /**
     * 是否为掉落展示物品。不进入背包
     */
    public static isOnlyShowItem(itemData: ItemData):boolean {
        return itemData && itemData.getCategory() == ECategory.ECategoryProp && itemData.getType() == EProp.EPropWingShow;
    }

}