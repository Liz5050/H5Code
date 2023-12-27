/**
 * 3V3数据
 * @author Chris
 */
class QualifyingCache implements ICache {
    public static ITEM:number = 20000060;//奖励令牌ID
    public static COLLECT_TIME_COST:number = 10 * 1000;//采集耗时ms

    private _isOpen:boolean = false;
    private openInfo: simple.SQualifyingOpen;
    public info: simple.SQualifyingInfo;
    private _isSingleMatch:boolean;
    public copyInfo: simple.SQualifyingCopyInfo;
    private rankInfo: simple.SQualifyingRanks;
    public myCopyForce: EForce;
    public myCopyRankInfo: simple.ISQualifyingPlayerCopyInfo;
    public myCopyRank: number;
    public copyShowReward: simple.SQualifyingCopyShowReward;

    public constructor(){
    }

    public clear(){
    }

    public setOpen(msg: simple.SQualifyingOpen):void {
        let before:boolean = this.isOpen;
        this.openInfo = msg;
        if (before != this.isOpen) {
            this.openChange();
        }
    }

    public updateInfo(msg: simple.SQualifyingInfo) {
        this.info = msg;
    }

    public updateCopyInfo(msg: simple.SQualifyingCopyInfo) {
        this.copyInfo = msg;
        let ranks:simple.ISQualifyingPlayerCopyInfo[] = msg.ranks.data;
        ranks.sort((r1:any, r2:any)=>{
            return Number(r2.copyScore_I) - Number(r1.copyScore_I);
        });
        msg.ranks.data = ranks;

        let r:simple.ISQualifyingPlayerCopyInfo;
        for (let idx:number=0; idx < ranks.length; idx++) {
            r = ranks[idx];
            if (EntityUtil.isMainPlayer(r.entityId)) {
                this.myCopyForce = r.force_I;
                this.myCopyRankInfo = r;
                this.myCopyRank = idx + 1;
                break;
            }
        }
    }

    public updateRanks(msg: simple.SQualifyingRanks) {
        this.rankInfo = msg;
    }

    public updateCopyShowReward(msg:simple.SQualifyingCopyShowReward):void {
        this.copyShowReward = msg;
    }

    public updateGoalGet(num:number):void {
        if (this.info) {
            this.info.goalGetList.data_I.push(num);
        }
    }

    public exitCopy():void {
        this.copyInfo = null;
        this.myCopyForce = null;
        this.myCopyRankInfo = null;
        this.myCopyRank = 0;
    }

    // public get isOpen(): boolean {
    //     let stime:number = CacheManager.serverTime.getServerTime();
    //     return this.openInfo ?
    //         (this.openInfo.openDt_DT - stime >= 0 && stime - this.openInfo.endDt_DT >= 0) : false;
    // }

    public canJoin(isTips:boolean): boolean {
        let b:boolean = this.info && this.info.leftTimes_I > 0;
        // if (!b) {
        //     isTips && Tip.showTip(LangQualifying.LANG22);
        //     return false;
        // }
        b = this._isOpen;
        // if (!b) {
        //     isTips && Tip.showTip(LangQualifying.LANG23);
        //     return false;
        // }
        return true//b;
    }

    public get isSingleMatch(): boolean {
        return this._isSingleMatch;
    }

    public set isSingleMatch(value: boolean) {
        this._isSingleMatch = value;
    }

    public isMatching():boolean {
        let teamInfo:any = CacheManager.team2.teamInfo;
        return teamInfo && teamInfo.qualifyingMatching_B;
    }

    public get level():number {
        return this.info ? this.info.level_I : 1;
    }

    public get score():number {
        return this.info ? this.info.score_I : 0;
    }

    public set isOpen(value: boolean) {
        if (this._isOpen != value) {
            this._isOpen = value;
            this.openChange();
        }
    }

    public get isOpen():boolean {
        return this._isOpen && !!this.openInfo;
    }

    private openChange():void {
        if (this.isOpen) EventManager.dispatch(LocalEventEnum.AddHomeIcon, IconResId.Qualifying);
        else EventManager.dispatch(LocalEventEnum.RemoveHomeIcon, IconResId.Qualifying);
        EventManager.dispatch(LocalEventEnum.QualifyingTipsChanged);
    }

    public get curStateStr():string {
        let str:string = "";
        if (CacheManager.team2.isQualifyingTeam) {
            let teamInfo:any = CacheManager.team2.teamInfo;
            if (teamInfo.qualifyingMatching_B) str = "匹配中";
            else str = "组队中";
        }
        return str;
    }

    /**
     * 检查开启红点
     * @returns {boolean}
     */
    public checkOpenTips():boolean {
        if (this.isOpen) {
            if (this.info && this.info.leftTimes_I > 0) {
                return true;
            }
            return false;
        }
        return false;
    }

    /**
     * 检查功能红点
     * @returns {boolean}
     */
    public checkFunTips(type:PanelTabType = null):boolean {
        if (this.checkOpenTips()) {
            if (type == PanelTabType.QualifyingStandard) {
                return this.checkStandardTips();
            } else if (type == PanelTabType.QualifyingStage) {
                return this.checkDailyRewardTips();
            }
            return this.checkStandardTips() || this.checkDailyRewardTips();
        }
        return false;
    }

    /**
     * 检查达标红点
     * @returns {boolean}
     */
    private checkStandardTips():boolean {
        if (this.info) {
            let goalList:any[] = ConfigManager.qualifying.getGoalList();
            let goalNum:number = this.info.goalNum_I;
            let canGetNum:number = 0;
            for (let goal of goalList) {
                if (goal.goalNum <= goalNum) canGetNum++;
                else break;
            }
            let gotList:number[] = this.info.goalGetList.data_I;
            return canGetNum > gotList.length;
        }
        return false;
    }

    /**
     * 检查每日奖励红点
     * @returns {boolean}
     */
    private checkDailyRewardTips():boolean {
        if (this.info) {
            if (this.info.dayRewardLevel_I > 0) {
                return !this.info.hadGetDayReward_B;
            }
        }
        return false;
    }

    /////////////////////////////////静态方法////////////////////////////////////

    /**
     * 获取段位描述
     */
    public static getLevelStr(level:number):string {
        return ConfigManager.qualifying.getLevelData(level).name;

        // let big:number = QualifyingCache.getLevelBig(level);
        // let small:number = QualifyingCache.getLevelSmall(level);
        //
        // return LangQualifying['LANG10' + big] + HtmlUtil.colorSubstitude(LangQualifying.LANG110, GameDef.NumberName[small]);
    }

    /**
     * 获取段位描述code
     */
    public static getLevelCode(level:number):string {
        let big:number = QualifyingCache.getLevelBig(level);
        let small:number = QualifyingCache.getLevelSmall(level);

        return String.fromCharCode(96 + big) + small + 'l';
    }

    public static getLevelBig(level:number):number {
        return Math.ceil(level / 3);
    }

    public static getLevelSmall(level:number):number {
        return level % 3 != 0 ? level % 3 : 3;
    }
}