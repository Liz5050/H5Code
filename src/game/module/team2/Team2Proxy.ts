class Team2Proxy extends BaseProxy {
    public constructor() {
        super();
    }

    /**
     * 创建队伍
     */
    public createTeam(copyCode:number): void {
        this.send("ECmdPublicCrossTeamCreate", {value_I:copyCode});
    }

    /**
     * 请求队伍列表
     */
    public reqTeamList(copyCode:number): void {
        this.send("ECmdPublicCrossTeamGetList", {value_I:copyCode});
    }

    /**
     * 请求入队
     * SCrossTeamApply
     */
    public applyTeam(copyCode:number, teamId:any): void {
        this.send("ECmdPublicCrossTeamApply", {copyCode_I:copyCode, groupId:teamId});
    }

    /**
     * 快速加入
     */
    public quickJoin(copyCode:number): void {
        this.send("ECmdPublicCrossTeamQuickJoin", {value_I:copyCode});
    }

    /**
     * 踢人
     */
    public kickoutTeamMem(memId:any): void {
        this.send("ECmdPublicCrossTeamKickOut", {type_BY:memId.type_BY
            , typeEx2_BY:memId.typeEx2_BY
            , typeEx_SH:memId.typeEx_SH
            , id_I:memId.id_I
            , roleIndex_BY:memId.roleIndex_BY});
    }

    /**
     * 离队
     */
    public exitTeam(): void {
        this.send("ECmdPublicCrossTeamLeft", {});
    }

    /**
     * 开始副本
     */
    public enterCopy(): void {
        this.send("ECmdPublicCrossTeamEnterCopy", {});
    }

    /**
     * 请求领取仙盟组队排名奖励
     */
    public getGuildTeamRankReward():void {
        this.send("ECmdPublicGuildTeamGetReward",{});
    }

    /**
     * 请求仙盟组队排行榜信息
     */
    public getGuildTeamRankInfo():void {
        this.send("ECmdPublicGuildTeamGetRank",{})
    }

    public reqDropLog(type:number,pageSize:number=100,pageIndex:number=0):void{
		//ECmdGameGetCachedDropLogMsgs
		this.send("ECmdGameGetCachedDropLogMsgs",{type:type,pageSize:pageSize,pageIndex:pageIndex});
	}

    public reqInviteWorld():void {
        this.send("ECmdPublicCrossTeamWorldInvite",{});
    }

    public reqInviteGuild():void {
        this.send("ECmdPublicCrossTeamGuildInvite",{});
    }

    public reqInviteFriend(sEntityId:any):void {
        this.send("ECmdPublicCrossTeamFriendInvite",sEntityId);
    }

}