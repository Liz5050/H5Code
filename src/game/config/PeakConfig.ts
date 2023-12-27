class PeakConfig {
    private rankReward:BaseConfig;
    private staticData: BaseConfig;
    private betData: BaseConfig;

    public constructor(){
        this.rankReward = new BaseConfig("t_mg_peak_arena_rank", "minRank,maxRank");
        this.staticData = new BaseConfig("t_mg_peak_arena_static", "id");
        this.betData = new BaseConfig("t_mg_peak_arena_bet", "state");
    }

    public getRankRewards(isCross:boolean):any[] {
        let list = [];
        let dataDict:any = this.rankReward.getDict();
        let data:any;
        let joinData:any;
        for (let r in dataDict) {
            data = dataDict[r];
            if (data.minRank) {
                if (isCross) data.rewardCross && list.push({minRank:data.minRank, maxRank:data.maxRank, rewards:data.rewardCross});
                else data.reward && list.push({minRank:data.minRank, maxRank:data.maxRank, rewards:data.reward});
            } else {
                joinData = data;
            }
        }
        list.push({minRank:0, maxRank:0, rewards:isCross?joinData.rewardCross:joinData.reward});
        return list;
    }

    public getStaticData(key:string):any {
        return this.staticData.getByPk(1)[key];
    }

    public getBetMaxNum(state:EPeakArenaState):number {
        let betData:any = this.betData.getByPk(state);
        return betData ? betData.maxBetNum : 2000;
    }


}