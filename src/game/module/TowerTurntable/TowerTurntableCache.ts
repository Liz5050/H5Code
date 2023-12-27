/**
 * 模块数据缓存
 * @author zhh
 * @time 2018-09-11 10:53:12
 */
class TowerTurntableCache implements ICache
{   
    public static OPEN_FLOOR:number = 10;
    /**抽奖信息 */
    private _info:any;    
    public constructor(){
    
    }
    public isOpen():boolean{
        var floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
        return floor>=TowerTurntableCache.OPEN_FLOOR;
    }
    /**
     * 设置抽奖信息
     * S2C_SRuneCopyLotteryInfo
     */
    public setTurntableInfo(value:any):void{
        this._info = value;
    }
    public get isLastLottery():boolean{
        let flag:boolean = this._info && this._info.hadGetList && this._info.hadGetList.data_I.length==9;
        return flag;
    }
    /**获取抽奖类型 */
    public get lotteryType():number{
        let start:number = LotteryCategoryEnum.LotteryTower*100;        
        let t:number = 0;
        if(this._info){
            t = Math.floor(this._info.lotteryTimes/10); //已抽奖次数
        }       
        return start + t;
    }
    /**获取剩余次数 */
    public get lotteryTime():number{
        let t:number = 0;
        var floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
        //floor = floor - TowerTurntableCache.OPEN_FLOOR+1;
        let hasTime:number = Math.floor(floor/10);
        if(this._info){
            t = hasTime - this._info.lotteryTimes; //已抽奖次数
        }
        t = Math.max(t,0);
        return t;
    }
    /**是否可抽奖 */
    public isCanLottry():boolean{
        return this.isOpen() && this.isHasLotteryTimes();
    }

    public isHasLotteryTimes():boolean{
        return this.lotteryTime>0;
    }

    public isGetReward(rewardIndex:number):boolean{
        return this._info && this._info.hadGetList && this._info.hadGetList.data_I.indexOf(rewardIndex)>-1; //已获得物品索引
    }

    public clear(): void{    

    }
}