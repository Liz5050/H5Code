/**Effect配置 */
class EffectListConfig extends BaseConfig {
    private cDataDict:any;
    public constructor() {
        super("t_effect_list", "listId");
    }

    /**获取EffectList配置 */
    public getVo(listId: number, listIndex:number=0): EffectListData {
        if (this.cDataDict == null) 
            this.makeConfig();
        let vo:EffectListData = this.cDataDict[listId];
        if (vo) vo.isDependent = listIndex > 0;
        return vo;
    }

    private makeConfig():void
    {
        this.cDataDict = {};
        let dataDict:any = this.getDict();
        for (let listId in dataDict)
        {
            this.cDataDict[listId] = new EffectListData(dataDict[listId]);
        }
    }
}