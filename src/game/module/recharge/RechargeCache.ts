/**
 * 模块数据缓存
 * @author zhh
 * @time 2018-07-05 15:14:09
 */
class RechargeCache implements ICache
{
    private _rechargeActInfo:any;

    /**团购充值信息 SRechargeGroupInfo */
    private _groupBuyInf:any;

    private _rechargeRewardInfo:any;
    /**全服充值人数 */
    private _serveRechargeCount:number = 0;
    public constructor(){
    
    }

    public set serveRechargeCount(value:number){
        this._serveRechargeCount = value;
    }
    /**全服充值人数 */
    public get serveRechargeCount():number{
        return this._serveRechargeCount;
    }
    /**团购充值信息 */
    public setGroupBuyInf(data:any):void{
        this._groupBuyInf = data;
    }

    /**判断某个团购奖励是否已领取 */
    public isGroupBuyGet(id:number):boolean{
        return  this._groupBuyInf && this._groupBuyInf.rechargeGroupHadGet && this._groupBuyInf.rechargeGroupHadGet.data_I.indexOf(id)>-1;
    }
    /**团购活动期间，我的充值金额是否足够 */
    public isGroupRechargeOk(needMoney:number):boolean{
        let myRcgNum:number = this._groupBuyInf && this._groupBuyInf.rechargeGroupNum_I?this._groupBuyInf.rechargeGroupNum_I:0;
        return myRcgNum>=needMoney;
    }

    /**是否可领取某个团购奖励 */
    public isGroupBuyCan(idOrInfo:any):boolean{
        let cfgInfo:any;
        if(typeof(idOrInfo)=='number'){
            cfgInfo = ConfigManager.mgRecharge.getGroupBuyByPk(idOrInfo);
        }else{
            cfgInfo = idOrInfo;
        }
        let rechargeNum:number = cfgInfo.rechargeNum?cfgInfo.rechargeNum:0;
        let groupNum:number = cfgInfo.groupNum?cfgInfo.groupNum:0;
        return cfgInfo && this.isGroupRechargeOk(rechargeNum) && this._serveRechargeCount>=groupNum;
    }

    /**团购期间我的充值金额(实际的RMB数) */
    public get rechargeGroupNum():number{
        let n:number = 0;
        if(this._groupBuyInf){
            n = this._groupBuyInf.rechargeGroupNum_I;
        }
        return n;
    }

    /*检测团购红点 */
    public checkGroupBuyTips():boolean{
        let flag:boolean = false;
        let index:number = CacheManager.activity.getGroupBuyIndex();
        if(index>0){
            let infos:any[] = ConfigManager.mgRecharge.getIndexInfos(index);
            flag = this.isGroupBuyHasGet(infos); 
        }              
        return flag;
    } 
    /**判断一个团购列表中是否有可领取的项 */
    public isGroupBuyHasGet(infos:any[]):boolean{
        let flag:boolean = false;
        if(infos){
            for(let info of infos){
                flag = this.isGroupBuyCan(info) && !this.isGroupBuyGet(info.id);
                if(flag){
                    break;
                }
            }
        }
        
        return flag;
    }

    /**
     * 充值获得信息
     * SRechargeActiveInfo
     */
    public setRechargeActInfo(data:any){
        this._rechargeActInfo = data;
    }
    /**
     * 充值奖励信息
     */
    public setRechargeRewardInfo(data:any):void{
        this._rechargeRewardInfo = data;
    }

    /**判断某个档次是否充值了 */
    public isRecharged(id:number):boolean{
        let flag:boolean = false;
        if(this._rechargeRewardInfo && this._rechargeRewardInfo.hadRecharge){
            let ids:number[] = this._rechargeRewardInfo.hadRecharge.data_I;
            flag = ids.indexOf(id) > -1;
        }
        return flag;
    }   
    /**
     * 是否首充过并且领取了首充奖励 (充值 但是没领取奖励的 也是返回false)
     */
    public isFirstRecharge():boolean{
        let flag:boolean = false;
        if(this._rechargeActInfo){
            let rechargeFirstState_I:number = this._rechargeActInfo.rechargeFirstState_I; //0 不可领取 1 可领取 2已领取 3已结束
            flag = rechargeFirstState_I>1;
        }
        return flag;
    }

    /**
     * 是否充值过任意金额
     */
    public get isRechargedAny(): boolean {
        if(this._rechargeActInfo){
            let rechargeFirstState_I:number = this._rechargeActInfo.rechargeFirstState_I; //0 不可领取 1 可领取 2已领取 3已结束
            return rechargeFirstState_I > 0;
        }
        return false;
    }

    public isCanFirstRchGetReward():boolean{
        let flag:boolean = false;
        if(this._rechargeActInfo){
            let rechargeFirstState_I:number = this._rechargeActInfo.rechargeFirstState_I; //0 不可领取 1 可领取 2已领取 3已结束
            flag = rechargeFirstState_I==1;
        }
        return flag;
    }

    /**今日已充值额度（元宝） */
    public getRechargeNumToDay():number {
        if(!this._rechargeActInfo) return 0;
        return this._rechargeActInfo.rechargeNumToday_I;
    }

    /**是否领取了每日充值的所有奖励 */
    public isDayRechargeGetReward():boolean{
        let hadGets:number[] = this.getDayRechargeHadGetList();
        let cfgs:any[] = ConfigManager.rechargeFirst.getRechargeConfigByType(2);
        return hadGets.length==cfgs.length;
    }

    /**
     * 每日累充已领取列表
     */
    public getDayRechargeHadGetList():number[] {
        if(!this._rechargeActInfo) return [];
        return this._rechargeActInfo.dayTotalHadGet.data_I;
    }

    /**每日累充累计充值天数奖励已领取列表 */
    public getDayRechargeHadGetListEx():number[] {
        if(!this._rechargeActInfo) return [];
        return this._rechargeActInfo.threeDayHadGet.data_I;
    }

    /**获取每日充值累计充值天数 */
    public get rechargeDay():number {
        if(!this._rechargeActInfo) return 0;
        return this._rechargeActInfo.rechargeDaily_I;
    }

    /**
     * 检测是否可以充值
     */
    public checkCanRecharge(isTip:boolean=true):boolean{
        if(isTip && Sdk.platform_config_data.is_close_recharge == 1){
            Tip.showTip("系统繁忙，请稍后再试");
        }
        return Sdk.platform_config_data.is_close_recharge == 1 ? false : true;
    }

    public clear(): void{    

    }
}