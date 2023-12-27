class MiningConfig {
    private minerConfig: BaseConfig;
    private rewardConfig: BaseConfig;
    private stConfig: BaseConfig;
    private minerDataList:any[];

    public constructor() {
        this.minerConfig = new BaseConfig("t_mg_miner", "id");
        this.rewardConfig = new BaseConfig("t_mg_miner_reward", "id");
        this.stConfig = new BaseConfig("t_mg_mining_static", "id");
    }

    public getMinerData(minerId:number):any {
        return this.minerConfig.getByPk(minerId);
    }

    public getMinerDataList():any[] {
        let dataList:any[] = [];
        let dataDict:any = this.minerConfig.getDict();
        for (let id in dataDict) {
            dataList.push(dataDict[id]);
        }
        return dataList;
    }

    public getMinerDataListLength():number {
        this.minerConfig.getDict();
        return this.minerConfig.configLength;
    }

    public getMinerReward(minerId:number, serOpenDay:number, isRob:boolean = false):ItemData[] {
        let rewardDict:any = this.rewardConfig.getDict();
        let rewardData:any;
        for (let rewardId in rewardDict) {
            rewardData = rewardDict[rewardId];
            if (rewardData.minerId == minerId
                && (serOpenDay >= rewardData.minOpenDay || !rewardData.minOpenDay)
                && (serOpenDay <= rewardData.maxOpenDay || !rewardData.maxOpenDay)) {
                break;
            }
        }
        let list:ItemData[] = RewardUtil.getStandeRewards(rewardData.rewardStr);
        let specialRewardList:ItemData[] = rewardData.specialRewardStr ? RewardUtil.getStandeRewards(rewardData.specialRewardStr) : [];
        if (!isRob) list = list.concat(specialRewardList);//不可掠夺的奖励
        return list;
    }

    public getMinerSpecialReward(minerId:number, serOpenDay:number):ItemData[] {
        let rewardDict:any = this.rewardConfig.getDict();
        let rewardData:any;
        for (let rewardId in rewardDict) {
            rewardData = rewardDict[rewardId];
            if (rewardData.minerId == minerId
                && (serOpenDay >= rewardData.minOpenDay || !rewardData.minOpenDay)
                && (serOpenDay <= rewardData.maxOpenDay || !rewardData.maxOpenDay)) {
                break;
            }
        }
        let specialRewardList:ItemData[] = rewardData.specialRewardStr ? RewardUtil.getStandeRewards(rewardData.specialRewardStr) : [];
        return specialRewardList;
    }

    public getMiningStaticData():any {
        return this.stConfig.getByPk(1);
    }

    public getMiningStaticDataKey(key: string) {
        return this.getMiningStaticData()[key];
    }

    public getMiningStaticMiningTime(isPrivilege:boolean) {
        return isPrivilege ? this.getMiningStaticData()["miningTimePrivilege"] : this.getMiningStaticData()["miningTime"];
    }

    public getMiningStaticMiningCount(isPrivilege:boolean) {
        return isPrivilege ? this.getMiningStaticData()["miningTimesPrivilege"] : this.getMiningStaticData()["miningTimes"];
    }
}