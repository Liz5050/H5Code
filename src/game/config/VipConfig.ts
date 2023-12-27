/**Vip商品配置 */
class VipConfig
{
    private vipShopDataDict:any;
    private vipShopMsgConfig: BaseConfig;
    private vipLevelDataList:Array<VipLevelData>;
    private vipLevelConfig: BaseConfig;
    private vipAddConfig: BaseConfig;
    private vipLevelRewardConfig: BaseConfig;


    /**副本增加次数的最小vip等级 */
    private copyAddNumMiniVipLvDict:any;
    /**获取增加副本次数最多次的最小VIP等级 比如：v4 v5 v6 都是增加4次 会得到vip等级4 */
    private copyAddNumMaxVipLvDict:any;

    public constructor()
    {
        this.vipShopMsgConfig = new BaseConfig("t_vip_shop_msg", "id");
        this.vipLevelConfig = new BaseConfig("t_vip_level", "level");
        this.vipAddConfig = new BaseConfig("t_vip_add", "code");
        this.vipLevelRewardConfig = new BaseConfig("t_vip_level_gift_bag", "vipLevel");
        this.copyAddNumMiniVipLvDict = {};
        this.copyAddNumMaxVipLvDict = {};
    }

	/**获取Vip商品信息 */
	public getVipShopItems(isVip:boolean): Array<VipShopItemData>
    {
        if (this.vipShopDataDict == null)
            this.makeShopConfig();
        let vipItem:VipShopItemData;
        let items:Array<VipShopItemData> = [];
		for (let id in this.vipShopDataDict)
        {
            vipItem = this.vipShopDataDict[id];
            if (vipItem.isVipCard == isVip)
                items.push(vipItem);
        }
        return items;
	}

    private makeShopConfig():void
    {
        this.vipShopDataDict = {};
        let dataDict:any = this.vipShopMsgConfig.getDict();
        for (let id in dataDict)
        {
            this.vipShopDataDict[id] = new VipShopItemData(dataDict[id]);
        }
    }

    /**获取Vip等级信息 */
    public getVipLevelList(): Array<VipLevelData>
    {
        if (this.vipLevelDataList == null)
            this.makeLevelConfig();
        return this.vipLevelDataList;
    }

    public getVipAddDict(code: number): any{
        this.vipShopDataDict = {};
        let data:any = this.vipAddConfig.getByPk(code);
        if(data && data.val){
            return WeaponUtil.getAttrDict(data.val);
        }
        return {};
    }
    /**根据VIP副本效果类型获取增加副本次数的最小VIP等级 */
    public getAddCopyNumMiniVipLv(type:EVipAddType):number{
        if(this.copyAddNumMiniVipLvDict[type]==null){
            let info:any = ConfigManager.vip.getVipAddDict(type);
            let min:number = Number.MAX_VALUE;
            for(let key in info){
                if(Number(info[key])>0 && Number(key) < min){
                    min = Number(key);
                }
            }
            this.copyAddNumMiniVipLvDict[type] = min;
        }
        return this.copyAddNumMiniVipLvDict[type];
    }
    /**获取增加副本次数最多次的最小VIP等级 比如：v4 v5 v6 都是增加4次 会得到vip等级4 */
    public getCopyAddNumMaxVipLv(type:EVipAddType):number{
        if(this.copyAddNumMaxVipLvDict[type]==null){
            let info:any = ConfigManager.vip.getVipAddDict(type);
            let maxLv:number = 0;
            let maxNum:number = 0;
            let curLv:number = 0;
            while(info[curLv]!=null){
                let curVal:number = Number(info[curLv]);
                if(maxNum!=curVal){
                    maxLv = curLv;
                    maxNum = curVal;
                }
               curLv++;
            }
            this.copyAddNumMaxVipLvDict[type] = maxLv;
        }
        return this.copyAddNumMaxVipLvDict[type];
    }
   
    /**
     * 获取下一个VIP等级额外增加的材料副本次数信息
     */
    public getCopyNextAddInfo(type:EVipAddType):any{
        let info:any = {nextLv:0,num:0};
        let cfgInfo:any = ConfigManager.vip.getVipAddDict(type);
        let curLv:number = CacheManager.vip.vipLevel;
        let nextLv:number = curLv + 1;
        while(Number(cfgInfo[nextLv])<=Number(cfgInfo[curLv])){
            nextLv++;
        }
        info.nextLv = nextLv; 
        info.addNum = Number(cfgInfo[nextLv]) - Number(cfgInfo[curLv]); 
        return info;
    }

    public getVipLevelInfo(level:number):any{
        return this.vipLevelConfig.getByPk(level);
    }

    private makeLevelConfig()
    {
        this.vipLevelDataList = [];
        let dataDict:any = this.vipLevelConfig.getDict();
        for (let level in dataDict)
        {
            this.vipLevelDataList.push(new VipLevelData(dataDict[level]));
        }
        this.vipLevelDataList.sort(function(v1:VipLevelData, v2:VipLevelData):number
        {
            return v1.level - v2.level;
        });
    }

    public getVipLevelReward(level:number):any
    {
        return this.vipLevelRewardConfig.getByPk(level);
    }
}