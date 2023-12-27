/**
 * 福利
 * @author Chris
 */

enum EMonthCard
{
    EMonthCardGold = 1,
    EMonthCardPrivilege = 2,
};
class Welfare2Cache implements ICache {

    public goldCardEndDt: number;
    public privilegeCardEntDt: number;
    private _privilegeRewardFlag: number;
    private tempFlagDict : any;

    private _gotLoginRewardList: number[];
    private _onlineDays: number = 0;
    private configData: any[];

    /**SDailySignRewardInfo */
    public signRewardsInfo: any;

    
    /**
     * 是否已错过领取登录称号
     */
    public isMissLoginTitle: boolean;

    /**在线奖励已领取状态 */
    private onlineRewardState:any;
    /**特权月卡设置信息 */
    private _privilegeSetInfo:{[copyCode:number]:any} = {};
    public constructor() {
        this._gotLoginRewardList = [];
        this.configData = ConfigManager.sevenDays.select({});
        for (var i: number = 0; i < this.configData.length; i++) {
            this._gotLoginRewardList.push(this.configData[i].day); // 默认已领全部的 已经领全部的 服务器不推送的
        }
    }

    public updateCardInfo(msg: any) {
        this.goldCardEndDt = msg.goldCardEndDt_I;
        this.privilegeCardEntDt = msg.privilegeCardEntDt_I;
        this._privilegeRewardFlag = msg.privilegeRewardFlag_I;
        this.tempFlagDict = msg.tempFlagDict;
    }

    /** 是否开通元宝月卡*/
    public get isGoldCard(): boolean {
        let serTime: number = CacheManager.serverTime.getServerTime();
        return this.goldCardEndDt && serTime < this.goldCardEndDt;
    }

    /**是否是使用了元包月卡体验卡 */
    public get isGoldCardExp() : boolean {
        if(!this.tempFlagDict || ! this.tempFlagDict.value_I[EMonthCard.EMonthCardGold]) {
            return false;
        }
        return this.isGoldCard;
    }

    /** 是否开通过元宝月卡*/
    public get hasGoldCard(): boolean {
        return this.goldCardEndDt > 0;
    }
    /** 元宝月卡剩余时间*/
    public get goldCardLeftTime(): number {
        let serTime: number = CacheManager.serverTime.getServerTime();
        return this.goldCardEndDt - serTime;
    }
    /** 是否开通特权月卡*/
    public get isPrivilegeCard(): boolean {
        let serTime: number = CacheManager.serverTime.getServerTime();
        return this.privilegeCardEntDt && serTime < this.privilegeCardEntDt;
    }

    /**是否是使用了特权月卡体验卡 */
    public get isPrivilegeCardExp() : boolean {
        if(!this.tempFlagDict || ! this.tempFlagDict.value_I[1]) {
            return false;
        }
        return this.isPrivilegeCard;
    }

    /**是否是体验卡过期 */
    public get isPrivilegeCardExpEnd() : boolean {
        if(!this.tempFlagDict || ! this.tempFlagDict.value_I[1]) {
            return false;
        }

        return !this.isPrivilegeCard;
    }

    /** 是否开通过特权月卡*/
    public get hasPrivilegeCard(): boolean {
        return this.privilegeCardEntDt > 0;
    }
    /** 特权月卡剩余时间*/
    public get privilegeCardLeftTime(): number {
        let serTime: number = CacheManager.serverTime.getServerTime();
        return this.privilegeCardEntDt - serTime;
    }
    /** 特权月卡是否可领取奖励*/
    public get privilegeRewardFlag(): boolean {
        // let totals: number = CacheManager.serverTime.getTotalDays();
        // return this.isPrivilegeCard && totals != this._privilegeRewardFlag;
        return false;
    }

    /**更新单个设置信息 */
    public updatePrivilegeSetInfo(data:any):void {
        this._privilegeSetInfo[data.copyCode_I] = data.opt_I;
    }

    /**更新特权月卡设置信息列表 */
    public updatePrivilegeSetInfoList(data:any[]):void {
        for(let i:number = 0 ;i < data.length; i++) {
            this.updatePrivilegeSetInfo(data[i]);
        }
    }

    public isPrivilegeDouble(copyCode:number):boolean {
        return !!this._privilegeSetInfo[copyCode];
    }

    public updateLoginReward(list: number[]): void {
        this._gotLoginRewardList = list;
    }

    public isLoginRewardGot(day: number): boolean {
        var flag: boolean = this._gotLoginRewardList.indexOf(day) > -1
        return flag;
    }

    public checkLoginRewardTips(): boolean {
        for (var i: number = 0; i < this.configData.length; i++) {
            var day: number = this.configData[i].day;
            if (!this.isLoginRewardGot(day) && this.checkOnline(day)) {
                return true;
            }
        }
        return false;
    }

    public checkOnline(day: number): boolean {
        return this.onlineDays >= day;
    }

    public set onlineDays(value: number) {
        this._onlineDays = value;
    }

    public get onlineDays(): number {
        return this._onlineDays;
    }

    //===================== 签到 ==============

    public get date(): Date{
        return new Date(this.signRewardsInfo.severDt_DT*1000);
    }

    public get signDays(): number{
        if(this.signRewardsInfo){
            return this.signRewardsInfo.signCount_I;
        }
        return 0;
    }

    public get isSignToday(): boolean{
        if(this.signRewardsInfo){
            return this.signRewardsInfo.todaySignFlag_I == 1;
        }
        return false;
    }

    public get hadGetAccDay(): number{
        if(this.signRewardsInfo){
            return this.signRewardsInfo.hadGetAccDay_I;
        }
        return 0;
    }

    // public get hadGetAccDay(): number{

    // }

    /**相对每日签到配表的当前签到天数，非真实签到天数 */
    public get currentSignDay(): number {
        let signDays: number = this.signDays;
        let maxLength: number = ConfigManager.mgSignDay.configLength;
        if (this.signDays >= maxLength) {
            signDays = this.signDays % maxLength;//大于配表长度的，奖励循环
        }
        return signDays;
    }

    /**当前可领取累计签到奖励的天数 */
    public get getSignRewardDay(): number{
        let rewardData: any = ConfigManager.mgSignMonth.getRewardData(this.hadGetAccDay, false);
        if(rewardData.accDay <= this.signDays){
            return rewardData.accDay;
        }
        return -1;
    }

    /**是否已签到 */
    public isSign(day: number): boolean {
        if (day <= this.currentSignDay) {
            return true;
        }else if(this.currentSignDay == 0 && this.isSignToday){//全部奖励签到领取之后，界面不跳转下一个签到循环,可领取刷新再跳转
            return true;
        }
        return false;
    }

    /**是否可签到 */
    public isCanSign(day: number): boolean {
        if (!this.isSignToday) {
            if (day == this.currentSignDay + 1) {
                return true;
            }
        }
        return false;
    }

    /**签到红点 */
    public checkSignTips(): boolean {
        if (!this.isSignToday || this.getSignRewardDay != -1) {
            return true;
        }
        return false;
    }

    /**福利红点 */
    public checkTips(): boolean {
        let flag: boolean = this.checkSignTips();
        if (!flag) {
            flag = this.checkLoginRewardTips();
        }
        if (!flag) {
            flag = CacheManager.welfare2.privilegeRewardFlag;
        }
        return flag || this.checkOnlineRewardTips();
    }

    public isLoginRewardPanelShow(): boolean{
        if(!this.checkLoginRewardTips() && this.checkOnline(this.configData.length)){
            return false;
        }
        return true;
    }

    /**
     * 每日在线奖励红点
     */
    public checkOnlineRewardTips():boolean {
        // let onlineCfgs:any[] = ConfigManager.online.getDayOnlineRewardCfgs();
        // let onlineTime:number = CacheManager.serverTime.onlineTime;
        // for(let i:number = 0; i < onlineCfgs.length; i++) {
        //     if(this.onlineRewardHadGet(onlineCfgs[i].type,onlineCfgs[i].onlineMinute)) continue;
        //     if(onlineTime >= onlineCfgs[i].onlineMinute * 60) {
        //         return true;
        //     }
        // }
        return false;
    }

    public checkOnlineOnceRewardTips():boolean {
        let onceCfg:any = ConfigManager.online.getOnceOnlineRewardCfg();
        let totalOnlineTime:number = CacheManager.serverTime.totalOnlineTime;
        return !this.onlineRewardHadGet(onceCfg.type,onceCfg.onlineMinute) && totalOnlineTime >= onceCfg.onlineMinute*60;
    }

    /**
     * 在线奖励状态更新
     */
    public updateOnlineRewardState(data:any):void {
        this.onlineRewardState = data;
        EventManager.dispatch(LocalEventEnum.OnlineRewardStateUpdate);
    }

    /**是否已领取在线奖励 */
    public onlineRewardHadGet(type:number,time:number):boolean {
        if(!this.onlineRewardState) return false;
        let getList:any;
        if(type == 1) {
            getList = this.onlineRewardState.getList1;
        }
        else {
            getList = this.onlineRewardState.getList2;
        }
        return getList != null && getList.data_I.indexOf(time) != -1;
    }

    public clear(): void {

    }
}