class ContestConfig {
    private baseData:BaseConfig;

    public constructor(){
        this.baseData = new BaseConfig("t_contest_config", "type,value");
    }

    public getRewards(type:EContestConfigType):any[] {
        let dataDict:any = this.baseData.getDict();
        let rewards:any[] = [];
        let data:any;
        for (let r in dataDict) {
            data = dataDict[r];
            if (data.type == type) rewards.push(data);
        }
        rewards.sort((r1:any, r2:any)=>{
            return (r2.value||0) - (r1.value||0);
        });
        return rewards;
    }

    public getBetMax(round:number):number {
        let data:any = this.baseData.getByPk(EContestConfigType.Gamble+','+round);
        return data ? Number(data.valueStr.split(',')[1]) : 0;
    }

    public getBetCountMax(round:number):number {
        let data:any = this.baseData.getByPk(EContestConfigType.Gamble+','+round);
        return data ? Number(data.valueStr.split(',')[0]) : 0;
    }

}

enum EContestConfigType {
    EliminateReward = 1,
    RankReward,
    MatchFight,
    Gamble
}