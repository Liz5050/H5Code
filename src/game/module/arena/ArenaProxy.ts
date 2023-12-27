class ArenaProxy extends BaseProxy {
	public constructor() {
		super();
	}

	public startMatch():void {
		this.send("ECmdGameKingStifeMatch",{});
	}

	public enterKingBattle():void {
		this.send("ECmdGameEnterKingStifeCopy",{});
	}

	/**
	 * 请求排行榜数据
	 * @param type 0本周排名 1上周排名
	 *  */
	public getKingBattleRank(type:number):void {
		// ECmdGameGetKingStifeRank			= 101632;		//获得王者争霸排行 Message::Public::SInt    [Message/Public/CdlPublic.cdl] valua:0 现在排行， 1：上期排行
		this.send("ECmdGameGetKingStifeRank",{value_I:type});
	}

	public encounterInfo():void {
        this.send("ECmdGameGetEncounterInfo",{});
	}

	public encounterRank():void {
        this.send("ECmdGameGetEncounterRank",{});
	}

	public encounterChallenge(sEntityId:any, index:number):void {
        this.send("ECmdGameEncounterChallenge",{type_BY:sEntityId.type_BY, typeEx2_BY:sEntityId.typeEx2_BY, typeEx_SH:sEntityId.typeEx_SH, id_I:index, roleIndex_BY:sEntityId.roleIndex_BY});
	}

	public encounterClearPk(value:number):void {
        this.send("ECmdGameEncounterClearPk",{value_I:value});
	}

	public reqEnterMiningCopy(copyCode:number, floor:number):void {
		//C2S_SEnterMiningCopy
		this.send("ECmdGameEnterMiningCopy", {copyCode:copyCode, floor:floor});
	}

    public reqEnterMiningChallengeCopy(copyCode:number, sEntityId:any, recordId:number) {
		//C2S_SEnterMiningChallengeCopy
        this.send("ECmdGameEnterMiningChallengeCopy", {copyCode:copyCode
			, entityId:{type_BY:sEntityId.type_BY, typeEx2_BY:sEntityId.typeEx2_BY, typeEx_SH:sEntityId.typeEx_SH, id_I:sEntityId.id_I, roleIndex_BY:sEntityId.roleIndex_BY}
			, recordId:recordId});
    }

    public reqOperateMining(minerId:number, autoBuy:number) {
		//SSeqInt
        this.send("ECmdGameOperateMining", {intSeq:{data_I:[minerId, autoBuy]}});
    }

    public reqUpgradeMining(useItem:number) {
        this.send("ECmdGameOperateUpgradeMining", {value_I:useItem});
    }

    public reqFastMining() {
        this.send("ECmdGameOperateComleteMining", {});
    }

    public reqGetMiningReward(value:number) {
        this.send("ECmdGameOperateGetMiningReward", {value_I:value});
    }

    public reqGetMiningRecord() {
        this.send("ECmdGameOperateGetMiningRecord", {});
    }
}