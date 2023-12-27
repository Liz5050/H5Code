class PackUtil {
    public constructor(){
    }

    public static checkOpenSmelt():boolean {
        let limitNumPack: number = ConfigManager.const.getConstValue("PersonalCopyBagFreeCapacity");
        if (!CacheManager.pack.backPackCache.isHasCapacity(limitNumPack)) {
            EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
            return true;
        }
        return false;
    }
}