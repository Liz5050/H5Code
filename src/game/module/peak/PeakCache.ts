/**
 * 巅峰竞技数据
 * @author Chris
 */
class PeakCache implements ICache {
    public static ItemPeakCostId: number;

    public hasUpdatedState:boolean;
    private _curState: number;
    public isCrossOpen: boolean;
    public recordState: EPeakArenaState;
    public openDtList: simple.ISMgPeakArenaStateTime[];
    private _info: simple.SMgPeakArenaInfo;
    private _betRecords: simple.ISMgPeakArenaBet[];
    private _totalBet: number;
    private _totalGain: number;
    private _totalBetCount: number;
    private _isSign: boolean;
    private _worshipCount: number;
    private _enterTime: number=0;
    private enterTimeStamp: number=0;
    private _curGroup: EPeakGroup=1;//单服的时候应该发0
    private _leftLikeCount: number;
    private _leftWorshipCount: number;

    public constructor(){
    }

    public clear(){
    }

    /**
     * 可报名，可点赞，可膜拜
     * @returns {boolean}
     */
    public checkTips():boolean {
        return this.hasUpdatedState
            && this._info
            && ((this._curState == EPeakArenaState.EPeakArenaStateSignUp && !this._isSign)
                || this.checkLikeTips()
                || this.checkWorshipTips());
    }

    public checkLikeTips():boolean {
        let hasChamp:boolean = this._info && this._info.champion && this._info.champion.entityId && this._info.champion.entityId.id_I != 0;
        // let crossStateMatch:boolean = this.isCrossOpen && this._curState >= EPeakArenaState.EPeakArenaStateEliminate64Free;
        // let singleStateMatch:boolean = !this.isCrossOpen && this._curState >= EPeakArenaState.EPeakArenaStateEliminate16Free;
        return this._leftLikeCount > 0 /*&& (hasChamp || (crossStateMatch || singleStateMatch))*/;
    }

    public checkWorshipTips():boolean {
        let hasChamp:boolean = this._info && this._info.champion && this._info.champion.entityId && this._info.champion.entityId.id_I != 0;
        return this._leftWorshipCount > 0 && hasChamp && this.isCrossOpen;
    }

    /**
     * 更新状态：curState见定义EPeakArenaState
     * 假如没开过活动，一开始发的就是报名状态
     * 如果带有时间，则活动即将开启
     * @param msg
     */
    public updateState(msg: simple.SMgPeakArenaState) {
        this.curState = msg.state_I;
        this.isCrossOpen = msg.cross_B;
        this.openDtList = msg.openDt.data;
        if (!this.hasUpdatedState) {
            this.hasUpdatedState = true;
            EventManager.dispatch(LocalEventEnum.PeakStateUpdated);
            EventManager.dispatch(LocalEventEnum.PeakGetPeakInfo);//首次更新状态时请求
        }
    }

    public updateInfo(msg: simple.SMgPeakArenaInfo) {
        this._info = msg;
        this.curState = msg.state_I;
        App.TimerManager.doFrame(20, 1, this.dispatchTipsChanged, this);
    }

    private dispatchTipsChanged():void {
        EventManager.dispatch(LocalEventEnum.PeakTipsChanged);
    }

    public updateBetRecords(msg: simple.SMgPeakArenaBetRecords) {
        // if (!this._betRecords) {
        //     this._betRecords = [];
        // } else {
        //     this._betRecords.length = 0;
        // }
        let betRecords = msg.records.data;
        let totalBet:number = 0;
        let totalGain:number = 0;
        for (let rc of betRecords) {
            totalBet += rc.betNum_I;
            totalGain += (rc.result_I > 0 ? rc.betNum_I : 0);
            // if (rc.result_I != 0) this._betRecords.push(rc);
        }
        this._betRecords = betRecords;
        this._totalBetCount = betRecords.length;
        this._totalBet = totalBet;
        this._totalGain = totalGain;
    }

    public updateBetResult(betPairId:number):void {
        if (this._info) {
            this._info.betPairId_I = betPairId;
            // EventManager.dispatch(LocalEventEnum.PeakBetUpdate);
        }
    }

    public updateLikeResult(likeCount:number):void {
        this._leftLikeCount = ConfigManager.peak.getStaticData("maxLikeNum") - likeCount;
        App.TimerManager.doFrame(20, 1, this.dispatchTipsChanged, this);
    }

    public updateRecordState(state: number) {
        this.recordState = state;
    }

    public updateSignInfo(isSign: number) {
        this._isSign = isSign == 1;
        App.TimerManager.doFrame(20, 1, this.dispatchTipsChanged, this);
    }

    public updateWorshipCount(count: number) {
        this._worshipCount = count;
        this._leftWorshipCount = ConfigManager.peak.getStaticData("maxWorshipNum") - count;
        App.TimerManager.doFrame(20, 1, this.dispatchTipsChanged, this);
    }

    public updateEnterTimer(timeStamp: number) {
        this.enterTimeStamp = timeStamp;
        let time:number = timeStamp - CacheManager.serverTime.getServerTime();
        Log.trace(Log.PEAK, `2_结束时间戳:${timeStamp},倒计时:${time}S`);
        this._enterTime = time;
        if (time > 0) {
            App.TimerManager.doFrame(3, 0, this.countDownEnterTime, this);
            EventManager.dispatch(LocalEventEnum.PeakCountdownUpdated);
        }
    }

    public countDownEnterTime():void {
        let time:number = this.enterTimeStamp - CacheManager.serverTime.getServerTime();
        if (this._enterTime != time) {//算出当前剩余多少秒
            this._enterTime = time;
            if (this._enterTime < 0)
                App.TimerManager.remove(this.countDownEnterTime, this);
            EventManager.dispatch(LocalEventEnum.PeakCountdownUpdated);
        }
    }

    public hasEnterTimer():boolean {
        return this._enterTime > 0;
    }

    public getEnterTimer():number {
        return this._enterTime;
    }

    public getStateTime(state:EPeakArenaState, bBoth:boolean = true):simple.ISMgPeakArenaStateTime {
        for (let dt of this.openDtList) {
            if (dt.state_I == state || (bBoth && dt.state_I + 1 == state)) {
                return dt;
            }
        }
        return null;
    }

    public getNextState(state:EPeakArenaState):EPeakArenaState {
        switch (state) {
            case EPeakArenaState.EPeakArenaStateEliminate64:
                return EPeakArenaState.EPeakArenaStateEliminate64;
            case EPeakArenaState.EPeakArenaStateEliminate64Free:
            case EPeakArenaState.EPeakArenaStateEliminate32:
                return EPeakArenaState.EPeakArenaStateEliminate32;
            case EPeakArenaState.EPeakArenaStateEliminate32Free:
            case EPeakArenaState.EPeakArenaStateEliminate16:
                return EPeakArenaState.EPeakArenaStateEliminate16;
            case EPeakArenaState.EPeakArenaStateEliminate16Free:
            case EPeakArenaState.EPeakArenaStateEliminate8:
                return EPeakArenaState.EPeakArenaStateEliminate8;
            case EPeakArenaState.EPeakArenaStateEliminate8Free:
            case EPeakArenaState.EPeakArenaStateEliminate4:
                return EPeakArenaState.EPeakArenaStateEliminate4;
            case EPeakArenaState.EPeakArenaStateEliminate4Free:
            case EPeakArenaState.EPeakArenaStateEliminate2:
                return EPeakArenaState.EPeakArenaStateEliminate2;
            case EPeakArenaState.EPeakArenaStateEliminate2Free:
            case EPeakArenaState.EPeakArenaStateFinal:
                return EPeakArenaState.EPeakArenaStateFinal;
            default:
                return null;
        }
    }

    public getPlayerInfo(playerIdx:number):any {
        return this._info
            && this._info.pair8.data[playerIdx>>1]
            && this._info.pair8.data[playerIdx>>1]['player'+(playerIdx%2==0?1:2)];
    }

    public showCurStateLookBtn():boolean {
        let timePass:number = this.getCurStateTimePass();
        if (timePass != -1) {
            return App.DebugUtils.isDebug ? timePass >= 30 : timePass >= 50;
        }
        return false;
    }

    public getCurStateTimePass():number {
        let time:any = this.getStateTime(this.curState, false);
        if (time) {
            let timePass:number = CacheManager.serverTime.getServerTime() - time.startDt_DT;
            return timePass;
        }
        return -1;
    }

    public getCurStateTimePassLeft():number {
        let timePass:number = this.getCurStateTimePass();
        if (timePass != -1) {
            return App.DebugUtils.isDebug ? 30 - timePass: 50 - timePass;
        }
        return -1;
    }

    get info(): simple.SMgPeakArenaInfo {
        return this._info;
    }

    get betRecords(): simple.ISMgPeakArenaBet[] {
        return this._betRecords;
    }

    get totalGain(): number {
        return this._totalGain;
    }

    get totalBet(): number {
        return this._totalBet;
    }

    get totalBetCount(): number {
        return this._totalBetCount;
    }

    get isSign(): boolean {
        return this._isSign;
    }

    get worshipCount(): number {
        return this._worshipCount;
    }

    set curGroup(value:number) {
        this._curGroup = value;
    }

    get curGroup(): number {
        if (this.isCrossOpen) {
            if (this._curState <= EPeakArenaState.EPeakArenaStateEliminate16 && !this.hasChamp)
                return this._curGroup;
            return 0;
        }
        return 0;
    }

    public get hasChamp():boolean {
        return this._info && this._info.champion && this._info.champion.entityId && this._info.champion.entityId.id_I != 0;
    }

    get curState(): number {
        return this._curState;
    }

    set curState(value: number) {
        if (this._curState != value) {
            this._curState = value;

            EventManager.dispatch(LocalEventEnum.PeakStateChanged);
        }
    }

    get leftLikeCount(): number {
        return this._leftLikeCount;
    }

    /////////////////////////////////静态方法////////////////////////////////////

    /**
     * 获取场次描述
     */
    public static getRoundStr(state: EPeakArenaState, isCross:boolean, round:number):string {
        let stateStr:any = PeakCache.getStateStr(state, isCross);
        let pre:number = stateStr.pre;
        let next:number = stateStr.next;

        let roundStr:string = GameDef.NumberName[round];
        let rs:string = "";
        let crossStr:string = isCross ? LangPeak.GAMBLE5 : LangPeak.GAMBLE6;
        if (pre == -1) {
            rs = App.StringUtils.substitude(LangPeak.GAMBLE7, roundStr)
        } else if (next == 2) {
            rs = App.StringUtils.substitude(LangPeak.RECORD4
                , crossStr, roundStr);
        } else if (next == 1) {
            rs = App.StringUtils.substitude(LangPeak.RECORD5
                , crossStr, roundStr);
        } else {
            rs = App.StringUtils.substitude(LangPeak.GAMBLE4
                , crossStr, pre, next, roundStr);
        }
        return rs;
    }

    public static getStateStr(state:EPeakArenaState, isCross:boolean):{pre:number, next:number} {
        let pre:number;
        let next:number;
        if (isCross) {
            switch (state) {
                case EPeakArenaState.EPeakArenaStateEliminate64:
                    pre = -1;next = 64;break;
                case EPeakArenaState.EPeakArenaStateEliminate64Free:
                case EPeakArenaState.EPeakArenaStateEliminate32:
                    pre = 64;next = 32;break;
                case EPeakArenaState.EPeakArenaStateEliminate32Free:
                case EPeakArenaState.EPeakArenaStateEliminate16:
                    pre = 32;next = 16;break;
                case EPeakArenaState.EPeakArenaStateEliminate16Free:
                case EPeakArenaState.EPeakArenaStateEliminate8:
                    pre = 16;next = 8;break;
                case EPeakArenaState.EPeakArenaStateEliminate8Free:
                case EPeakArenaState.EPeakArenaStateEliminate4:
                    pre = 8;next = 4;break;
                case EPeakArenaState.EPeakArenaStateEliminate4Free:
                case EPeakArenaState.EPeakArenaStateEliminate2:
                    pre = 4;next = 2;break;
                case EPeakArenaState.EPeakArenaStateEliminate2Free:
                case EPeakArenaState.EPeakArenaStateFinal:
                    pre = 2;next = 1;break;
            }
        } else {
            switch (state) {
                case EPeakArenaState.EPeakArenaStateEliminate16:
                    pre = -1;next = 16;break;
                case EPeakArenaState.EPeakArenaStateEliminate16Free:
                case EPeakArenaState.EPeakArenaStateEliminate8:
                    pre = 16;next = 8;break;
                case EPeakArenaState.EPeakArenaStateEliminate8Free:
                case EPeakArenaState.EPeakArenaStateEliminate4:
                    pre = 8;next = 4;break;
                case EPeakArenaState.EPeakArenaStateEliminate4Free:
                case EPeakArenaState.EPeakArenaStateEliminate2:
                    pre = 4;next = 2;break;
                case EPeakArenaState.EPeakArenaStateEliminate2Free:
                case EPeakArenaState.EPeakArenaStateFinal:
                    pre = 2;next = 1;break;
            }
        }
        return {pre:pre, next:next};
    }

    public static getIconStateStr(state:EPeakArenaState, isCross:boolean):string {
        let pre:number;
        let next:number;
        if (isCross) {
            switch (state) {
                case EPeakArenaState.EPeakArenaStateFree:
                    pre = -3;next = -2;break;
                case EPeakArenaState.EPeakArenaStateSignUp:
                    pre = -2;next = -1;break;
                case EPeakArenaState.EPeakArenaStateEliminate64:
                case EPeakArenaState.EPeakArenaStateEliminate64Free:
                    pre = -1;next = 64;break;
                case EPeakArenaState.EPeakArenaStateEliminate32:
                case EPeakArenaState.EPeakArenaStateEliminate32Free:
                    pre = 64;next = 32;break;
                case EPeakArenaState.EPeakArenaStateEliminate16:
                case EPeakArenaState.EPeakArenaStateEliminate16Free:
                    pre = 32;next = 16;break;
                case EPeakArenaState.EPeakArenaStateEliminate8:
                case EPeakArenaState.EPeakArenaStateEliminate8Free:
                    pre = 16;next = 8;break;
                case EPeakArenaState.EPeakArenaStateEliminate4:
                case EPeakArenaState.EPeakArenaStateEliminate4Free:
                    pre = 8;next = 4;break;
                case EPeakArenaState.EPeakArenaStateEliminate2:
                case EPeakArenaState.EPeakArenaStateEliminate2Free:
                    pre = 4;next = 2;break;
                case EPeakArenaState.EPeakArenaStateFinal:
                    pre = 2;next = 1;break;
            }
        } else {
            switch (state) {
                case EPeakArenaState.EPeakArenaStateFree:
                    pre = -3;next = -2;break;
                case EPeakArenaState.EPeakArenaStateSignUp:
                    pre = -2;next = -1;break;
                case EPeakArenaState.EPeakArenaStateEliminate16:
                case EPeakArenaState.EPeakArenaStateEliminate16Free:
                    pre = -1;next = 16;break;
                case EPeakArenaState.EPeakArenaStateEliminate8:
                case EPeakArenaState.EPeakArenaStateEliminate8Free:
                    pre = 16;next = 8;break;
                case EPeakArenaState.EPeakArenaStateEliminate4:
                case EPeakArenaState.EPeakArenaStateEliminate4Free:
                    pre = 8;next = 4;break;
                case EPeakArenaState.EPeakArenaStateEliminate2:
                case EPeakArenaState.EPeakArenaStateEliminate2Free:
                    pre = 4;next = 2;break;
                case EPeakArenaState.EPeakArenaStateFinal:
                    pre = 2;next = 1;break;
            }
        }

        let stateStr:string;
        if (pre == -3) {
            stateStr = "";
        } else if (pre == -2) {
            stateStr = LangPeak.GAMBLE10;
        } else if (pre == -1) {
            stateStr = LangPeak.GAMBLE8;
        } else {
            if (next == 2) {
                stateStr = LangPeak.GAMBLE11;
            } else if (next == 1) {
                stateStr = LangPeak.GAMBLE12;
            } else {
                stateStr = App.StringUtils.substitude(LangPeak.GAMBLE9, next);
            }
        }
        return stateStr;
    }

    public static getGameTimeStateStr(pre:number, next:number):string {
        let str:string;
        if (next > 2) {
            str = App.StringUtils.substitude(LangPeak.MAIN4, pre, next);
        } else if (next == 2) {
            str = LangPeak.GAMBLE11;
        } else {
            str = LangPeak.GAMBLE12;
        }
        return str;
    }

    public static getRoundTimeList(time:simple.ISMgPeakArenaStateTime, round:number = 5, inter:number = 5):number[] {
        let ts:number[] = [];
        let startDt:number = time.startDt_DT;
        for (let i = 0; i < round; i++) {
            ts.push(startDt + i * inter * 60);
        }
        return ts;
    }

    /**
     * 获得当前战绩状态
     */
    public static getCurRecordState():EPeakArenaState {
        switch (CacheManager.peak._curState) {
            case EPeakArenaState.EPeakArenaStateEliminate64:
            case EPeakArenaState.EPeakArenaStateEliminate64Free:
                return EPeakArenaState.EPeakArenaStateEliminate64;
            case EPeakArenaState.EPeakArenaStateEliminate32:
            case EPeakArenaState.EPeakArenaStateEliminate32Free:
                return EPeakArenaState.EPeakArenaStateEliminate32;
            case EPeakArenaState.EPeakArenaStateEliminate16:
            case EPeakArenaState.EPeakArenaStateEliminate16Free:
                return EPeakArenaState.EPeakArenaStateEliminate16;
            case EPeakArenaState.EPeakArenaStateEliminate8:
            case EPeakArenaState.EPeakArenaStateEliminate8Free:
                return EPeakArenaState.EPeakArenaStateEliminate8;
            case EPeakArenaState.EPeakArenaStateEliminate4:
            case EPeakArenaState.EPeakArenaStateEliminate4Free:
                return EPeakArenaState.EPeakArenaStateEliminate4;
            case EPeakArenaState.EPeakArenaStateEliminate2:
            case EPeakArenaState.EPeakArenaStateEliminate2Free:
                return EPeakArenaState.EPeakArenaStateEliminate2;
            default:
                return EPeakArenaState.EPeakArenaStateFinal;
        }
    }

}

enum EPeakBtnState {
    StateGamble,
    StateLookup,
}

enum EPeakPanelState {
    StateAudition = 0,//海选
    State16,//16
    StateFinal,//2->1
    StateFree,//无数据时空闲
    State2Free,//2->1空闲
    StateFinalFree,//决赛之后空闲
    State16To2,//16->2
}