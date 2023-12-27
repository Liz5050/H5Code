class PackCache implements ICache {

    public quickUseEquipQueue: ItemData[] = [];
    /**要飘提示的红装队列 */
    private itemTipsQueue: ItemData[] = [];
    private normalitemTipsQueue : ItemData[] = [];

    /**基本背包, 其他的背包仓库可继承Cache.PackBaseCache */
    public backPackCache: PackBackCache;
    /**人物背包 */
    public rolePackCache: PackRoleCache;
    /**仓库背包 */
    public warePackCache: PackBaseCache;
    /**符文背包 */
    public runePackCache: PackRuneCache;
    /**道具背包 */
    public propCache: PackPropCache;
    /**装备寻宝仓库 */
    public lotteryEquipPack: PackBaseCache;
    /**符文寻宝仓库 */
    public lotteryRunePack: PackBaseCache;
    /**混元寻宝仓库 */
    public lotteryAncientPack: PackBaseCache;

    /**物品使用次数（隔天服务端主动清空） */
    private usedCount: { [code: number]: number } = {};

    /**是否点击打开过VIP特惠礼包 */
    public isVipLimitedGiftBagClick:boolean;
    /**是否点击打开过超值大礼包 */
    public isRechargeGiftBag:boolean;

    public constructor() {
        this.backPackCache = new PackBackCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeBag});
        this.rolePackCache = new PackRoleCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeRole});
        this.warePackCache = new PackBaseCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeWarehouse});
        this.runePackCache = new PackRuneCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeRune});
        this.propCache = new PackPropCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeProp});
        this.lotteryEquipPack = new PackBaseCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeLottery});
        this.lotteryRunePack = new PackBaseCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeLotteryRune});
        this.lotteryAncientPack = new PackBaseCache({"posType": EPlayerItemPosType.EPlayerItemPosTypeLotteryAncient});
    }

    /**根据类型获取背包缓存 */
    public getPackCacheByPosType(posType: number): PackBaseCache {
        if (posType == EPlayerItemPosType.EPlayerItemPosTypeBag) {
            return this.backPackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeRole) {
            return this.rolePackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeWarehouse) {
            return this.warePackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeDelegate) {
            // return this.delegatePackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeRune) {
            return this.runePackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeSoul) {
            // return this.soulPackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeBeast) {
            // return this.beastPackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeShapeEquip) {
            // return this.shapeEquipPackCache;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeProp) {
            return this.propCache;
        }
        else if (posType == EPlayerItemPosType.EPlayerItemPosTypeLottery) {
            return this.lotteryEquipPack;
        }
        else if (posType == EPlayerItemPosType.EPlayerItemPosTypeLotteryRune) {
            return this.lotteryRunePack;
        } else if (posType == EPlayerItemPosType.EPlayerItemPosTypeLotteryAncient) {
            return this.lotteryAncientPack;
        } else {
            return null;
        }
    }

    
    /**
     * 获取道具或者符文的数量
     * @param code
     * @param isRunType 符文的时候用到 默认是false,当为true的时候 会获取该类符文不同等级的总数量(已升级的符文code不一样而且不能堆叠)
     */
    public getItemCount(code:number,isRunType:boolean=false):number{
        let c:number = 0;
        let info:any = ConfigManager.item.getByPk(code);
        switch(info.category){
            case ECategory.ECategoryEquip:
                c = this.backPackCache.getItemCountByCode2(code); 
                break;
            case ECategory.ECategoryRune:
                c = this.runePackCache.getItemCountByCode2(code);
                if(isRunType){
                    if(code==info.effect){
                        //计算出升级后的符文code
                        let cs:string = code.toString();
                        let a:string[] = cs.split('');
                        a[1] = '1';
                        let lvCode:number = Number(a.join(''));
                        c+=this.runePackCache.getItemCountByCode2(lvCode);
                    }else{ //配了升级后的code
                        c+=this.runePackCache.getItemCountByCode2(info.effect);
                    }
                }
                break;
            case ECategory.ECategoryBeastEquip:
                c = this.propCache.getItemCountByCode2(code);
                if(isRunType){
                    if(code==info.effect){
                        //计算出强化后的装备code
                        let strCode: number = code + 10000;
                        c+=this.propCache.getItemCountByCode2(strCode);
                    }else{ //配了升级后的code
                        c+=this.propCache.getItemCountByCode2(info.effect);
                    }
                }
                break;
            default:
                c = this.propCache.getItemCountByCode2(code);
                break;
        }        
        return c;
    }
    
    public getByUid(uid:string,posType:number):ItemData{
        let cache:PackBaseCache = this.getPackCacheByPosType(posType);
        if(cache){
            return cache.getItemByUid(uid);
        }
        return null;
    }

    /**物品使用次数更新 */
    public updateItemUsedCount(dataDict: any): void {
        let codes: number[] = dataDict.key_I;
        if (codes && codes.length > 0) {
            for (let i: number = 0; i < codes.length; i++) {
                this.usedCount[codes[i]] = dataDict.value_I[i];
            }
        }
        else {
            //清空
            this.usedCount = {};
        }
        EventManager.dispatch(NetEventEnum.ItemUsedCountUpdate);
    }

    /**获取物品今日已使用次数 */
    public getItemUsedCountToday(code: number): number {
        if (!this.usedCount[code]) return 0;
        return this.usedCount[code];
    }

    /**
     * 获取物品今日剩余使用次数
     **/
    public getItemLeftUseCount(code: number): number {
        let itemCfg: any = ConfigManager.item.getByPk(code);
        if (!itemCfg.dayUseNum) return -1;//-1 不限使用次数
        if (itemCfg.level && CacheManager.role.getRoleLevel() < itemCfg.level) return 0; //未达到使用等级，剩余次数返回0
        let leftCount: number = itemCfg.dayUseNum - this.getItemUsedCountToday(code);
        return leftCount;
    }

    public getNextQuickUseEquip(): ItemData {
        let item: ItemData;
        if (this.quickUseEquipQueue.length > 0) {
            item = this.quickUseEquipQueue.pop();
        }
        return item;
    }

    public getNextItemTipData(): ItemData {
        let item: ItemData;
        if (this.itemTipsQueue.length > 0) {
            item = this.itemTipsQueue.pop();
        }
        return item;
    }

    public addItemTipsData(item: ItemData): void {
        this.itemTipsQueue.push(item);
    }

    public getNextNormalItemTipData(): ItemData {
        let item: ItemData;
        if (this.normalitemTipsQueue.length > 0) {
            item = this.normalitemTipsQueue.pop();
        }
        return item;
    }

    public addNormalItemTipsData(item: ItemData): void {
        this.normalitemTipsQueue.push(item);
    }


    /**
     * 背包按钮是否红点提示
     */
    public get isRedTip(): boolean {
        return this.propCache.isHadCanUseItem || 
        this.runePackCache.isHadCanUseItem || this.isSmeltRedTip || this.isCanSmelt() || CacheManager.cultivate.checkIllustrateTips(false); 
    }

    /**
     * 容量超过80%或者关卡50关内，装备数量大于50
     * @returns {boolean}
     */
    public get isSmeltRedTip(): boolean {
        let flag: boolean = false;
        let limitNum: number = Math.floor(CacheManager.pack.backPackCache.capacity * 0.8);
        flag = CacheManager.pack.backPackCache.usedCapacity >= limitNum;
        if (!flag) {
            if ((CacheManager.copy.getCopyProcess(CopyEnum.CopyCheckPoint) + 1) <= 50 && CacheManager.pack.backPackCache.usedCapacity >= 50) {
                flag = true;
            }
        }
        return flag;
    }

    /**合成背包是否有可合成 */
    public isCanSmelt():boolean{
        let flag:boolean = false;        
        if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.PackSmelt],false)){
            return false;
        }
        let dict:any = ConfigManager.smeltPlan.getPackSmeltDict();
        for(let k in dict){
            flag = this.isCateSmelt(Number(k));
            if(flag){
                break;
            }
        }
        return flag;
    }
    /**某大类是否有可合成 */
    public isCateSmelt(cate:number):boolean{
        let flag:boolean = false;
        if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.PackSmelt],false)){
            return false;
        }
        let cateTypes:any[] =  ConfigManager.smeltPlan.getPackSmeltTypes(cate);
        for(let v of cateTypes){
            flag = this.isCateTypeSmlet(v.smeltCategory,v.smeltType);
            if(flag){
                break;
            }
        }
        return flag;
    }
    
    /**
     * 某小类下是否可合成
     */
    public isCateTypeSmlet(cate:number,type:number):boolean{
        let flag:boolean = false;
        let datas:any[] = ConfigManager.smeltPlan.getSmelts(cate,type);
        for(let d of datas){
            if(this.isSmeltMaterOk(d)){
                flag = true;
                break;
            }
        }
        return flag;
    }

    /**合成材料是否足够 */
    public isSmeltMaterOk(smeltCfg:any):boolean{
        let flag:boolean = true;
        let materItems:ItemData[] = RewardUtil.getRewards(smeltCfg.smeltMaterialList);
        for(let item of materItems){
            let code:number = item.getCode(); 
            let info:any = ConfigManager.smeltPlan.getSmeltCateInfo(smeltCfg.smeltCategory,smeltCfg.smeltType);
            let c:number = this.getItemCount(code,true);
            if(info.smeltClass==ESmeltClassType.ESmeltClassTypePetEquip && CacheManager.pet.isEquip(code)){
                c++;
            }
            if(c<item.getItemAmount()){
                flag = false;
                break;
            }
        }
        return flag;
    }

    public clear(): void {

    }
}