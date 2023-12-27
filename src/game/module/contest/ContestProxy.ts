/**
 * 1VN代理
 * @author Chris
 */
class ContestProxy extends BaseProxy {

    public constructor() {
        super();
    }

    public reqSign(): void {
        this.send("ECmdPublicContestSign", {});
    }

    public reqQualificationInfo(): void {
        this.send("ECmdPublicContestQualificationInfo", {});
    }

    public reqContestInfo(): void {
        this.send("ECmdPublicContestInfo", {});
    }

    public reqContestBet(pairId:number, contestKeeperBetWin:boolean, betNum:number): void {
        this.send("ECmdPublicContestBet", {pairId_I:pairId, betWin_B:contestKeeperBetWin, betNum_I:betNum});
    }

    public reqContestBetInfo(): void {
        this.send("ECmdPublicContestBetInfo", {});
    }

    public reqContestRoundInfo(): void {
        this.send("ECmdPublicContestRoundInfo", {});
    }

    public reqContestPairInfo(): void {
        this.send("ECmdPublicContestPairInfo", {});
    }
}