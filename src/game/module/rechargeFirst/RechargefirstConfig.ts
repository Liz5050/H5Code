/**
 * 模块数据缓存
 * @author zhh
 * @time 2018-07-06 21:02:58
 */
class RechargefirstConfig extends BaseConfig
{   
    private rechargeDailyReward:BaseConfig;//每日累充累计充值天数奖励配置
    private rechargeFirstData:any;

    private typeDict:{[type:number]:any[]};
    /**类型对应最大开服天数配置 */
    private typeMaxDay:{[type:number]:number};

    private dayRecharges:{[openNum:number]:any[]} = {};
    private dayRechargeExs:any[];
    public constructor(){
        super("t_mg_recharge_today","id");
        this.rechargeDailyReward = new BaseConfig("t_mg_recharge_daily_reward","id");
        this.parseTypeDict();
    }

    private parseTypeDict():void {
        this.typeDict = {};
        this.typeMaxDay = {};
        let dict:any = this.getDict();
        for(let id in dict) {
            let type:number = dict[id].type;
            let list:any[] = this.typeDict[type];
            if(!list) {
                list = [];
                this.typeDict[type] = list;
            }
            list.push(dict[id]);
            if(!!dict[id].day) {
                let typeDay:number = this.typeMaxDay[type];
                if(!typeDay) {
                    typeDay = 0;
                }
                if(typeDay < dict[id].day) {
                    this.typeMaxDay[type] = dict[id].day;
                }
            }
        }
    }
    
    public getRechargeFirstData():any{
        if(!this.rechargeFirstData){
            let dict:any = this.getDict();
            for(let key in dict){
                let inf = dict[key];
                if(inf.type==1){
                    this.rechargeFirstData = inf;
                }
            }
        }
        return this.rechargeFirstData;
    }

    /**获取首充奖励的标签类型 */
    public getLabelType(itemCode:number):number{
        let lbl:number = 0;
        let info:any = this.getRechargeFirstData();
        if(info && info.icon){
            let arr:string[] = CommonUtils.configStrToArr(info.icon,false);            
            for(let i:number = 0;i<arr.length;i++){
                let lblInfo:string[] = arr[i].split(",");
                if(itemCode==Number(lblInfo[0])){
                    lbl = Number(lblInfo[1]);
                }
            }
        }
        return lbl;
    }


    /**
     * 通过充值活动类型获取活动配置 
     * @param type  1 首冲 2每日累充
     */
    public getRechargeConfigByType(type:number):any[] {
        let openDay:number = CacheManager.serverTime.serverOpenDay;
        if(!this.dayRecharges[openDay]) {
            let typeList:any[] = this.typeDict[type];
            let roleLv:number = CacheManager.role.getRoleLevel();
            let result:any[] = [];
            for(let i:number = 0; i < typeList.length; i++) {
                if(!!typeList[i].minLevel && roleLv < typeList[i].minLevel) continue;
                if(roleLv > typeList[i].maxLevel) continue;
                if(openDay <= 7) {
                    if(typeList[i].day == openDay) {
                        result.push(typeList[i]);
                    }
                }
                else {
                    //开服7天后，按大于7天的配置循环，如配置了9天 则开服天数大于7就循环读取 8天9天
                    let maxDay:number = this.typeMaxDay[type];
                    let loopDay:number = openDay % 7 % (maxDay - 7);
                    if(loopDay == 0) {
                        if(maxDay == typeList[i].day) {
                            result.push(typeList[i]);
                        }
                    }
                    else {
                        if(loopDay + 7 == typeList[i].day) {
                            result.push(typeList[i]);
                        }
                    }
                }
            }
            this.dayRecharges[openDay] = result;
        }
        return this.dayRecharges[openDay];
    }

    /**
     * 获取有直升丹奖励的每日充值配置
     */
    public getHaveShapeRewardRechargeCfg():any {
        let list:any[] = this.getRechargeConfigByType(2);
		let hadGetList:number[] = CacheManager.recharge.getDayRechargeHadGetList();
        for(let i:number = 0; i < list.length; i++) {
            let rewardStr:string[] = list[i].rewardStr.split("#");
            for(let k:number = 0; k < rewardStr.length; k++) {
                if(rewardStr[k] == "") continue;
                let itemCode:number = Number(rewardStr[k].split(",")[1]);
                if(!ItemsUtil.isShapeUpgradeItem(new ItemData(itemCode))) continue;//非直升丹或进阶丹
                if(hadGetList.indexOf(list[i].index) == -1) {
                    return list[i];
                }
            }
		}
        return null;
    }

    /**获取每日累充累计充值天数奖励配置 */
    public getDayRechargeExRewardCfg():any[] {
        if(!this.dayRechargeExs) {
            this.dayRechargeExs = [];
            let dict:any = this.rechargeDailyReward.getDict();
            for(let id in dict) {
                this.dayRechargeExs.push(dict[id]);
            }
        }
        return this.dayRechargeExs;
    }
}