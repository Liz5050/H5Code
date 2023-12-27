class TeamConfig {

    private starConfig:BaseConfig;
    private guildTeamRankReward:BaseConfig;

    private rankRewards:any[];
    public constructor(){
        this.starConfig = new BaseConfig("t_cross_team_config","copyCode");
        this.guildTeamRankReward = new BaseConfig("t_guild_team_rank_reward","rankStart,rankEnd");
    }

    public getCopyStarInf(code:number):any{
        return this.starConfig.getByPk(code);
    }

    public getCopyFirstStar3Rewards(code:number):ItemData[] {
        return RewardUtil.getStandeRewards(this.starConfig.getByPk(code).firstStar3Reward);
    }

    public getCopyFirstRewards(code:number):ItemData[] {
        return RewardUtil.getStandeRewards(this.starConfig.getByPk(code).star3Reward);
    }

    public getTeamInfo(copyCode:number):any{
        return this.starConfig.getByPk(copyCode);
    }

    public getFastJoinCountTime():number {
        return 10;
    }

    public getAutoStartCountTime():number {
        return 60;
    }

    public getFullStartCountTime():number {
        return 5;
    }

    /**
     * 仙盟组队副本排名奖励
     */
    public getGuildRankRewards():any[] {
        if(!this.rankRewards) {
            this.rankRewards = [];
            let dict:any = this.guildTeamRankReward.getDict();
            for(let key in dict) {
                this.rankRewards.push(dict[key]);
            }
        }
        return this.rankRewards;
    }

}