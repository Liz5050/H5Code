class ResurgenceCache implements ICache {
    private static NORMAL_CD:number = 10;

    private static CD:{[copyType:number]:number} = {
        [ECopyType.ECopyNewCrossBoss]: 20,
        [ECopyType.ECopyLegend]: 15,
        [ECopyType.ECopyCrossTeam]: 10
    };
    public constructor(){
    }

    public get reliveCd():number {
        let copyInf:any = ConfigManager.copy.getByPk(CacheManager.copy.curCopyCode);
        return copyInf && ResurgenceCache.CD[copyInf.copyType] || ResurgenceCache.NORMAL_CD;
    }

    public clear(){
    }
}