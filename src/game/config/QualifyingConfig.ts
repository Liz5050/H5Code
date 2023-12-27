class QualifyingConfig {
    private baseData: BaseConfig;
    private goalData: BaseConfig;
    private goalList: any[];

    public constructor() {
        this.baseData = new BaseConfig("t_qualifying_config", "level");
        this.goalData = new BaseConfig("t_qualifying_goal_config", "goalNum");
    }

    public getNextScore(level:number):number {
        let nextData:any = this.baseData.getByPk(level+1);
        if (nextData) return nextData.minScore;
        let curData:any = this.baseData.getByPk(level);
        return curData ? curData.maxScore : 1;
    }

    public getCurScore(level:number):number {
        let curData:any = this.baseData.getByPk(level);
        return curData ? curData.minScore || 0 : 1;
    }

    public getLevelList():any[] {
        let list:any[] = [];
        let dataDict:any = this.baseData.getDict();
        for (let k in dataDict) {
            list.push(dataDict[k]);
        }
        return list;
    }

    public getGoalList():any[] {
        if (this.goalList) return this.goalList;
        let list:any[] = [];
        let dataDict:any = this.goalData.getDict();
        for (let k in dataDict) {
            list.push(dataDict[k]);
        }
        this.goalList = list;
        return this.goalList;
    }

    public getLevelData(level:number):any {
        return this.baseData.getByPk(level);
    }
}