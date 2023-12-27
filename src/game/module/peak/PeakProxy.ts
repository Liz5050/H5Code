/**
 * 巅峰竞技代理
 * @author Chris
 */
class PeakProxy extends BaseProxy {

    public constructor() {
        super();
    }

    public getPeakInfo(group:EPeakGroup):void {
        this.send("ECmdGameCopyGetPeakArenaInfo", {value_I:group});
    }

    public getPeakRecord(state:EPeakArenaState, groupId:EPeakGroup, pairId:number):void {
        this.send("ECmdGameCopyGetPeakArenaRecord", {state:state, groupId:groupId, pairId:pairId});
    }

    public getPeakBetRecord():void {
        this.send("ECmdGameCopyGetPeakArenaBetRecord", {});
    }

    public getPeakOwnRecord(state:EPeakArenaState):void {
        this.send("ECmdGameCopyGetPeakArenaOwnRecord", {value_I:state});
    }

    public getPeakPopularityRank():void {
        this.send("ECmdGameCopyGetPeakArenaPopularityRank", {});
    }

    public reqSignUp():void {
        this.send("ECmdGameCopyGetPeakArenaSignUp", {});
    }

    public reqWorship(entityId: any):void {
        this.send("ECmdGameCopyGetPeakArenaWorship", {type_BY:entityId.type_BY, typeEx2_BY:entityId.typeEx2_BY, typeEx_SH:entityId.typeEx_SH, id_I:entityId.id_I, roleIndex_BY:entityId.roleIndex_BY});
    }

    public reqLike(entityId: any):void {
        this.send("ECmdGameCopyGetPeakArenaLike", {type_BY:entityId.type_BY, typeEx2_BY:entityId.typeEx2_BY, typeEx_SH:entityId.typeEx_SH, id_I:entityId.id_I, roleIndex_BY:entityId.roleIndex_BY});
    }

    public reqBet(pairId:number, betNO:number, betNum:number):void {
        this.send("ECmdGameCopyGetPeakArenaBet", {pairId:pairId, win:betNO, num:betNum});
    }
}