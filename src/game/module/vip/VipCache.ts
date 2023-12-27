/**
 * vip
 * @author Chris
 */
class VipCache implements ICache
{   
    /**VIP最大等级 */
    public static Max_lv:number = 9;
    
    public vipType: EVIPType;
    public vipLevel: number = 0;
    public endDate: number = 0;
    public growth: number = 0;
    public isTaste: boolean;
    public tasteLeftTime: number = 0;
    private vipLevelRewards: Array<any>;//SVIPGiftBagInfo

    public constructor()
    {
    }

    public updateVip(data:any):void
    {
        this.vipType = data.VIPType;
        this.endDate = data.endDt_DT;
        this.vipLevel = data.level_I;
        this.growth = data.growth_I;
        this.isTaste = data.isTaste_B;
    }

    public updateTasteVip(data:any):void
    {
        this.tasteLeftTime = data.leftTime_I;
    }

    public updateVipType(data:any):void
    {
        this.vipType = data.VIPTypeNew;
    }

    /**
     * 判断VIP是否足够某个等级
     */
    public checkVipLevel(viplevel:number):boolean{
        return this.vipLevel >= viplevel;
    }

    public get isOverdue():boolean
    {
        return this.growth > 0 && this.leftTime <= 0;
    }

    public get isTasteOverdue():boolean
    {
        return this.growth <= 0 && this.leftTime < 0;
    }

    public get leftTime():number
    {
        return this.endDate > 0 ? this.endDate - CacheManager.serverTime.getServerTime() : 0;
    }

    public updateVipLevelReward(vipLevelRewards: Array<any>) {
        this.vipLevelRewards = vipLevelRewards;
        EventManager.dispatch(LocalEventEnum.VipRewardUpdate);
    }

    public getFirstVipLevelReward():number {
        if (this.vipLevel > 0) {
            let rewardMsg:any;
            for (let lv:number = 1;lv <= this.vipLevel; lv++) {
                if (this.vipLevelRewards && (rewardMsg = this.vipLevelRewards[lv-1])) {
                    if (!rewardMsg.flags_B) return lv;
                } else {
                    return lv;
                }
            }
        }
        return 0;
    }

    public getVipLevelReward(level:number):any {
        return this.vipLevelRewards && this.vipLevelRewards[level - 1];
    }

    public isVip3AndHasReward():boolean {
        return this.vipLevel >= 3 && (!this.getVipLevelReward(3) || !this.getVipLevelReward(3).flags_B);
    }

    public clear(): void
    {

    }

}