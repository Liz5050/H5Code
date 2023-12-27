/**
 * 1VN数据
 * @author Chris
 */
class ContestCache implements ICache {
    public isOpen: boolean;
    public stateInfo: simple.SContestState;
    private _qualificationInfo: simple.SContestQualificationInfo;
    private _contestInfo: simple.SContestInfo;
    public matchInfo: simple.SContestMatchInfo;
    private enterDt: number;//进入挑战时间戳
    private _lastEnterTime: number;//最后进入挑战的倒计时（单位s）
    public pairInfo: simple.SContestPairInfo;
    public roundInfo: any;
    public betInfo: simple.SContestBetInfo;

    public constructor(){
    }

    public clear(){
    }

    public updateQualificationInfo(msg: simple.SContestQualificationInfo) {
        this._qualificationInfo = msg;
    }

    public updateContestInfo(msg: simple.SContestInfo) {
        this._contestInfo = msg;
    }

    public updateState(msg: simple.SContestState) {
        this.stateInfo = msg;
        this.isOpen = true;
    }

    public updatePairInfo(msg: simple.SContestPairInfo) {
        if (this._contestInfo && this._contestInfo.signUp_B) {//自己报名参加了擂台，把自己的排第一位
            let pairs:any[] = msg.pairs ? msg.pairs.data : [];
            // pairs.sort((p1:any, p2:any)=>{
            //     if (EntityUtil.isMainPlayer(p1.player1.entityId)) return -1;
            //     return 0;
            // });
            let newPairs:any[] = [];//chrome旧版本上面的排序不生效
            let myPair:any;
            for (let p of pairs) {
                if (!EntityUtil.isMainPlayer(p.player1.entityId)) {
                    newPairs.push(p);
                } else {
                    myPair = p;
                }
            }
            if (myPair) newPairs.unshift(myPair);
            if (msg.pairs && msg.pairs.data) msg.pairs.data = newPairs;
        }
        this.pairInfo = msg;
    }

    public updatePairInfoItems(msg: simple.SContestPairInfo) {
        let pairs:any[] = msg.pairs ? msg.pairs.data : [];
        if (!this.pairInfo || !this.pairInfo.pairs || !this.pairInfo.pairs.data || !this.pairInfo.pairs.data.length) {
            this.updatePairInfo(msg);
            return;
        }
        for (let p of pairs) {
            let curPairs:any[] = this.pairInfo.pairs.data;
            for (let i = 0;i < curPairs.length; i++) {
                if (p.pairId_I == curPairs[i].pairId_I) {
                    curPairs[i] = p;
                }
            }
        }
    }

    public updateRoundInfo(msg: any) {
        this.roundInfo = msg;
    }

    public updateMatchInfo(msg: simple.SContestMatchInfo) {
        this.matchInfo = msg;
        this.enterDt = msg.enterDt_I;
        let time:number = msg.enterDt_I - CacheManager.serverTime.getServerTime();
        Log.trace(Log.OVN, `结束时间戳:${msg.enterDt_I},倒计时:${time}S`);
        this._lastEnterTime = time;
        if (time > 0) {
            App.TimerManager.doFrame(3, 0, this.countDownLastEnterTime, this);
            EventManager.dispatch(LocalEventEnum.ContestMatchCountdownUpdate);
        }
    }

    public countDownLastEnterTime():void {
        let time:number = this.enterDt - CacheManager.serverTime.getServerTime();
        if (this._lastEnterTime != time) {//算出当前剩余多少秒
            this._lastEnterTime = time;
            if (this._lastEnterTime < 0)
                App.TimerManager.remove(this.countDownLastEnterTime, this);
            EventManager.dispatch(LocalEventEnum.ContestMatchCountdownUpdate);
        }
    }

    public hasLastEnterTimer():boolean {
        return this._lastEnterTime > 0;
    }

    public getLastEnterTimer():number {
        return this._lastEnterTime;
    }

    public updateBetInfo(msg:simple.SContestBetInfo):void {
        if (msg.betRecords && msg.betRecords.data)
            this.betInfo = msg;
    }

    public canGamble(round:number, betName:string):boolean {
        if (this.betInfo) {
            let maxBetCount:number = ConfigManager.contest.getBetCountMax(round);
            let records:any[] = this.betInfo.betRecords.data;
            let betCount:number = 0;
            for (let rc of records) {//ISContestBetRecord
                if (rc.round_I == round) {
                    betCount++;
                    if (rc.name_S == betName) return false;
                }
            }
            return maxBetCount > betCount;
        }
        return false;
    }

    public get contestInfo(): any {
        return this._contestInfo || {};
    }
    public get qualificationInfo(): any {
        return this._qualificationInfo || {};
    }

    public get state():EContestState {
        return this.stateInfo ? this.stateInfo.state_I : null;
    }

    public get stateRound():number {
        return this.stateInfo ? this.stateInfo.round_I : 0;
    }

    /**剩余时间 */
    public get leftTime():number {
        return this.stateInfo ? this.stateInfo.endSec_I - CacheManager.serverTime.getServerTime() : 0;
    }

    public get curRound():number {
        return this.roundInfo ? this.roundInfo.round_I : 1;
    }

    public get curStateStr():string {
        if (this.stateInfo) {
            switch (this.stateInfo.state_I) {
                case EContestState.EContestStateSignUp:return LangContest.LANG41;
                case EContestState.EContestStateQualification:return LangContest.LANG42;
                case EContestState.EContestStateContest:return LangContest.LANG43;
                default:return "";
            }
        }
        return "";
    }

    /////////////////////////////////静态方法////////////////////////////////////

    /**
     * 获取场次描述
     */
    public static getRoundStr():string {
        let str:string = "";
        return str;
    }

}

enum EContestState {
    EContestStateSignUp		 	= 1,	//报名
    EContestStateQualification  = 2,	//资格赛
    EContestStateContest  		= 3,	//守擂赛
    EContestStateFree		 	= 4, 	//空闲状态
}

enum EContestCountdownType {
    EMatch		 	= 1,	//匹配
    EGamble         = 2,	//下注
    EBattle  		= 3,	//对战
}