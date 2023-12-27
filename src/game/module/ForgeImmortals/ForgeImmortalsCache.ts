/**
 * 神兵模块数据缓存
 * @author zhh
 * @time 2018-08-20 10:47:19
 */
class ForgeImmortalsCache implements ICache {
    /**检查部位可激活或者可升级 */
    public static SUB_TYPE_POS_CAN_UP0: number = 0;
    /**检查部位可升级 */
    public static SUB_TYPE_POS_CAN_UP1: number = 1;
    /**检查部位可激活 */
    public static SUB_TYPE_POS_CAN_UP2: number = 2;

    public static BREAK_LV: number = 10;
    /**配置神兵名称，模型 属性字段的套装等级行 */
    public static IMMINFO_SUIT_LV: number = 1;

    /**部位升级点击cd */
    public static POS_UP_CD: number = 0;

    private _itemDict: any;
    private _suitNumDict: any;


    public constructor() {
        this._itemDict = {};
        this._suitNumDict = {};
    }

    public checkTip(): boolean {
        let flag: boolean = false;
        if (!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Immortals], false)) {
            return false;
        }
        let roles: any[] = CacheManager.role.roles;
        for (let i: number = 0; i < roles.length; i++) {
            let role: any = roles[i];
            let idx: number = role.index_I != null ? role.index_I : i;
            if (this.checkRoleTip(idx)) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    /**
     * 判断某个角色是否有红点
     * @param checkType 0表示检查激活和升级，1表示只检查升级,2表示只检查激活
     */
    public checkRoleTip(roleIndex: number, checkType: number = 0): boolean {
        let flag: boolean = false;
        let subTypes: number[] = ConfigManager.cultivate.getSubTypes(ECultivateType.ECultivateTypeImmortals);
        for (let sub of subTypes) {
            flag = this.isSubTypePosCanUp(roleIndex, sub, checkType);
            if (flag) {
                break;
            }
        }
        if (checkType == 0) {
            if (!flag) {
                flag = this.isHasUseImm(roleIndex);
            }
            if (!flag) {
                flag = this.isHasUnlock(roleIndex);
            }
        }
        return flag;
    }

    /**
     * 判断某个神兵是否有可升级的部件
     * @param checkType 0表示检查激活和升级，1表示只检查升级,2表示只检查激活
     *  */
    public isSubTypePosCanUp(roleIndex: number, subType: number, checkType: number = 0): boolean {
        let flag: boolean = false;
        let itemInfos: any[] = this.getPosItemInfo(subType);
        for (let info of itemInfos) {
            if (this.isPosCanUp(roleIndex, info.position)) {
                switch (checkType) {
                    case ForgeImmortalsCache.SUB_TYPE_POS_CAN_UP0:
                        flag = true; //可激活可升级都返回true
                        break;
                    case ForgeImmortalsCache.SUB_TYPE_POS_CAN_UP1:
                        flag = this.isPosAct(roleIndex, info.position); //可升级(已激活了)
                        break;
                    case ForgeImmortalsCache.SUB_TYPE_POS_CAN_UP2:
                        flag = !this.isPosAct(roleIndex, info.position); //可激活(够材料升级，未激活(当前是0级))
                        break;
                }
                if (flag) {
                    break;
                }
            }
        }
        return flag;
    }

    public checkSubTypeTips(roleIndex:number,subType):boolean{
        //有红点的情况:1.有部件可激活 2.已经激活 并且身上没有穿戴；3.该神兵可激活，
		let isTip:boolean = CacheManager.forgeImmortals.isSubTypePosCanUp(roleIndex,subType);
		let isAct:boolean = CacheManager.forgeImmortals.isImmortalAct(roleIndex,subType);
		let isCanAct = false;
		if(!isTip){
			//已经激活 并且身上没有穿戴
			isCanAct = !isAct && CacheManager.forgeImmortals.isImmortalCanAct(roleIndex,subType);
			isTip = (isAct && !CacheManager.forgeImmortals.isImmortalHasUse(roleIndex)) || isCanAct;
		}
        return isTip;
    }

    /**获取神兵所有部位的信息(获取1级的信息,因为主要是关注物品code,subType,position) */
    public getPosItemInfo(subType: number): any[] {
        if (!this._itemDict[subType]) {
            let infos: any[] = ConfigManager.cultivate.select({ cultivateType: ECultivateType.ECultivateTypeImmortals, subtype: subType, level: 1 });
            App.ArrayUtils.sortOn(infos, "position");
            this._itemDict[subType] = infos;
        }
        return this._itemDict[subType];
    }
    /**判断神兵某个部位是否激活 */
    public isPosAct(roleIndex: number, pos: number): boolean {
        let flag: boolean = this.getImmortalLevel(roleIndex, pos) > 0;
        return flag;
    }
    /**获取神兵某个位置的部件等级 */
    public getImmortalLevel(roleIndex: number, pos: number): number {
        let level: number = 0;
        let info: any = CacheManager.cultivate.getCultivateInfoByRoleAndType(roleIndex, ECultivateType.ECultivateTypeImmortals);
        if (info && info.levelInfo[pos] != null) {
            level = info.levelInfo[pos];
        }
        return level;
    }
    /**是否的刚好突破的等级 */
    public isBreakLv(lv: number): boolean {
        return lv > 0 && lv != 1 && lv % ForgeImmortalsCache.BREAK_LV == 1;
    }

    /**判断某个神兵是否已激活 */
    public isImmortalAct(roleIndex: number, subType: number): boolean {
        let flag: boolean = false;
        let info: any = CacheManager.cultivate.getCultivateInfoByRoleAndType(roleIndex, ECultivateType.ECultivateTypeImmortals);
        if (info && info.extStr) {
            let actList: number[] = JSON.parse(info.extStr);
            if (actList) {
                flag = actList.indexOf(subType) > -1;
            }
        }
        return flag;
    }
    /**判断某个神兵是否激活所有部位 */
    public isImmortalCanAct(roleIndex: number, subType: number): boolean {
        let flag: boolean = true;
        let infos: any[] = this.getPosItemInfo(subType);
        for (let inf of infos) {
            if (!this.isPosAct(roleIndex, inf.position)) {
                flag = false;
                break;
            }
        }
        return flag;
    }
    /**是否使用中的神兵 */
    public isImmortalUse(roleIndex: number, subType: number): boolean {
        let flag: boolean = false;
        let info: any = CacheManager.cultivate.getCultivateInfoByRoleAndType(roleIndex, ECultivateType.ECultivateTypeImmortals);
        flag = info && info.extNum == subType;
        return flag;
    }
    /**判断某个角色是否穿戴了神兵 */
    public isImmortalHasUse(roleIndex: number): boolean {
        let flag: boolean = false;
        let info: any = CacheManager.cultivate.getCultivateInfoByRoleAndType(roleIndex, ECultivateType.ECultivateTypeImmortals);
        flag = info && info.extNum > 0;
        return flag;
    }
    /**判断某个部位是否可以升级 */
    public isPosCanUp(roleIndex: number, pos: number, tarLv: number = -1): boolean {
        let flag: boolean = false;
        //"cultivateType,position,level"
        if (tarLv == -1) {
            tarLv = this.getImmortalLevel(roleIndex, pos) + 1;
        }
        let info: any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeImmortals},${pos},${tarLv}`);
        if (info) {
            let needNum: number = info.itemNum;
            let hasNum: number = CacheManager.pack.propCache.getItemCountByCode2(info.itemCode);
            flag = hasNum >= needNum;
        }
        return flag;
    }

    /**是否有可使用的神兵 */
    public isHasUseImm(roleIndex: number): boolean {
        let flag: boolean = false;
        let info: any = CacheManager.cultivate.getCultivateInfoByRoleAndType(roleIndex, ECultivateType.ECultivateTypeImmortals);
        if (info && info.extStr) {
            let actList: number[] = JSON.parse(info.extStr);
            if (actList && actList.length > 0 && !info.extNum) { //有可使用的神兵
                flag = true;
            }
        }
        return flag;
    }


    /**判断某个角色是否有可解锁的神兵 */
    public isHasUnlock(roleIndex: number): boolean {
        let flag: boolean = false;
        let subTypes: number[] = ConfigManager.cultivate.getSubTypes(ECultivateType.ECultivateTypeImmortals);
        for (let subType of subTypes) {
            flag = this.isHasSubTypeUnlock(roleIndex, subType);
            if (flag) {
                break;
            }
        }
        return flag;
    }

    /***某个神兵是否可解锁 */
    public isHasSubTypeUnlock(roleIndex: number, subType: number): boolean {
        let flag: boolean = false;
        if (!this.isImmortalAct(roleIndex, subType)) {
            flag = this.isImmortalCanAct(roleIndex, subType);
        }
        return flag;
    }

    /**获取某个角色已激活的所有神兵的所有属性 */
    public getActTotalAttrDict(roleIndex: number): any {
        let subTypes: number[] = ConfigManager.cultivate.getSubTypes(ECultivateType.ECultivateTypeImmortals);
        let totalAttr: any = {};

        for (let sub of subTypes) {
            ObjectUtil.mergeObj(totalAttr, this.getSubTypeTotalAttr(roleIndex, sub));
        }
        return totalAttr;
    }
    /**获取某个神兵所有部件的所有属性 */
    public getSubTypeTotalAttr(roleIndex: number, subType: number): any {
        let posInfos: any[] = this.getPosItemInfo(subType);
        let totalAttr: any = {};
        for (let info of posInfos) {
            let pos: number = info.position;
            let lv: number = this.getImmortalLevel(roleIndex, pos);
            if (lv > 0) {
                // "cultivateType,position,level"
                let info: any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeImmortals},${pos},${lv}`);
                ObjectUtil.mergeObj(totalAttr, WeaponUtil.getAttrDict(info.attr));
            }
        }
        return totalAttr;

    }
    /**根据小类获取套装数量 */
    public getSuitNum(subType: number): number {
        if (!this._suitNumDict[subType]) {
            let infos: any[] = this.getPosItemInfo(subType);
            this._suitNumDict[subType] = infos.length;
        }
        return this._suitNumDict[subType];
    }
    /**
     * 获取套装等级
     * @param isReal 是否获取真实等级,false未激活也返回1级 
     */
    public getSuitLevel(roleIndex: number, subType: number, isReal: boolean): number {
        let minLv: number = Number.MAX_VALUE;
        let infos: any[] = this.getPosItemInfo(subType);
        let isNoAct: boolean = false;
        for (let inf of infos) {
            let lv: number = this.getImmortalLevel(roleIndex, inf.position);
            if (lv < minLv) { //根据各个部位的等级
                minLv = lv;
            }
        }
        // 0 1 2 3 4 5 6 7 8 9 10
        let addNum: number = minLv % ForgeImmortalsCache.BREAK_LV == 0 ? 0 : 1;
        minLv = Math.floor(minLv / ForgeImmortalsCache.BREAK_LV) + addNum;
        if (!isReal) { //因为套装配置没有0级 
            minLv = Math.max(minLv, 1);
        }

        return minLv;
    }

    /**
     * 获取达到套装等级条件部件信息 {num:count,total:infos.length}
     * 
     *  */
    public getSuitTargetInfo(roleIndex: number, subType: number, suitLevel: number): any {
        let count: number = 0;
        let infos: any[] = this.getPosItemInfo(subType);
        let isNoAct: boolean = false;
        let posLv: number = this.suitLvToPosLv(suitLevel);
        for (let inf of infos) {
            let lv: number = this.getImmortalLevel(roleIndex, inf.position);
            if (lv >= posLv) {
                count++;
            }
        }
        return { num: count, total: infos.length };
    }
    /**套装等级转换成部件等级 */
    public suitLvToPosLv(suitLv: number): number {
        let posLv: number = (suitLv - 1) * ForgeImmortalsCache.BREAK_LV + 1;
        //posLv = Math.min(posLv,0);
        return posLv;
    }

    /**获取套装信息 */
    public getSuitInfo(roleIndex: number, subType: number, lv: number): any {
        let num: number = CacheManager.forgeImmortals.getSuitNum(subType);
        let suitInfo: any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeImmortals},${subType},${lv},${num}`);
        return suitInfo;
    }
    public attrDictToArr(totalAttr: any): any[] {
        let attr: any[] = [];
        for (let key in totalAttr) {
            attr.push([Number(key), totalAttr[key]]);
        }
        return attr;
    }

    public clear(): void {

    }

}