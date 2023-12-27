/**
 * 3V3代理
 * @author Chris
 */
class QualifyingProxy extends BaseProxy {

    public constructor() {
        super();
    }

    public reqInfo(): void {
        this.send("ECmdPublicQualifyingInfo", {});
    }

    public reqMatch(): void {
        this.send("ECmdPublicQualifyingMatch", {});
    }

    public reqCancelMatch(): void {
        this.send("ECmdPublicQualifyingCancelMatch", {});
    }

    public reqEnterCopy(): void {
        this.send("ECmdPublicQualifyingEnterCopy", {});
    }

    public reqRanks(): void {
        this.send("ECmdPublicQualifyingRanks", {});
    }

    public reqGetDayRewards(): void {
        this.send("ECmdPublicQualifyingGetDayReward", {});
    }

    public reqGetGoalReward(count:number): void {
        this.send("ECmdPublicQualifyingGetGoalReward", {value_I:count});
    }

    public reqFriendList(idSeq:any): void {
        this.send("ECmdPublicQualifyingFriendInfo", {"data": idSeq});
    }
}