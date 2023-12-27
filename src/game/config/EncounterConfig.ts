class EncounterConfig {
    private rewardCfg:BaseConfig;
    private rewardList:any[];

    public constructor(){
        this.rewardCfg = new BaseConfig("t_encounter_rank_reward", "rankStart");
    }

    public getRewardList():any[] {
        if (!this.rewardList) {
            this.rewardList = [];
            let dict:any = this.rewardCfg.getDict();
            for (let key in dict) {
                this.rewardList.push(dict[key]);
            }
        }
        return this.rewardList;
    }

}