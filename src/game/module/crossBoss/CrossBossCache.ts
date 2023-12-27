/**
 * 跨服BOSS数据
 * @author Chris
 */
class CrossBossCache implements ICache {
    public static LOCAL_STATES:number[] = [3, 5, 7];
    public isOpen: boolean;
    public isCrossOpen: boolean;
    // struct SNewCrossBossField
    // {
    //     int type;				//类型 1、单服战场 2、跨服战场
    //     SServerKey serverKey;	//属于哪个服
    //     int bossCode;			//bosscode
    // };
    public bossListAll: any[] = [];
    private bossListLocal: any[] = [];
    private bossListCross: any[] = [];

    private bossResult: any[] = [];

    /**当前选定的神兽入侵boss */
    public curCrossGuildBoss:number = 0;
    public curBossCode: number;

    /**跨服掉落记录 */
    private _crossDropLogDict:any;
    /**更新记录 */
    private _crossDropLogUpdDict:any;

    public constructor(){
        this._crossDropLogDict = {};
        this._crossDropLogUpdDict = {};
    }   

    public clear(){
    }

    public updateBossList(list: any[]) {
        this.bossListAll = list;
        this.bossListLocal.length = 0;
        this.bossListCross.length = 0;

        let bossInf:any;
        for (bossInf of list) {
            if (bossInf.type_I == ECrossBossField.LOCAL) {
                this.bossListLocal.push(bossInf);
            } else {
                this.bossListCross.push(bossInf);
            }
        }

        this.bossListLocal.sort((b1:any, b2:any)=>{
            let bossInf1:any = ConfigManager.mgGameBoss.getByPk(b1.bossCode_I);
            let bossInf2:any = ConfigManager.mgGameBoss.getByPk(b2.bossCode_I);
            return bossInf1.roleState - bossInf2.roleState;
        });

        let crossBossInf:any;
        for (let i=0; i < this.bossListCross.length; i++) {
            bossInf = this.bossListCross[i];
            if (bossInf.type_I == ECrossBossField.CROSS) {
                crossBossInf = bossInf;
                this.bossListCross.splice(i, 1);
                break;
            }
        }
        this.bossListCross.sort((b1:any, b2:any)=>{
            return b1.serverKey.serverId_I - b2.serverKey.serverId_I;
        });
        crossBossInf && this.bossListCross.unshift(crossBossInf);
        if (this.bossListCross.length > CrossBossPanel.POS.length) { //超过界面显示的7个，则裁减为7个
            this.bossListCross = this.bossListCross.splice(0, CrossBossPanel.POS.length);
        }
    }

    public getBossListByType(type:PanelTabType):any[] {
        return type == PanelTabType.CrossBoss ? this.bossListLocal : this.bossListCross;
    }

    public getLocalBossLevel(bossCode:number):number {
        if (this.bossListLocal && this.bossListLocal.length) {
            for (let i=0; i<this.bossListLocal.length;i++) {
                if (bossCode == this.bossListLocal[i].bossCode_I)
                    return i+1;
            }
        }
        return 0;
    }

    public updateResult(msg: any) {
        this.bossResult[msg.type_I] = msg;
    }

    public isHasSelectGuildBoss():boolean{
        return this.curCrossGuildBoss >0; 
    }
    
    public isCurSelectGuildBoss(bossCode:number):boolean{
        return this.curCrossGuildBoss == bossCode; 
    }

    /**判断当前是否可以进入神兽入侵的boss */
    public isCanEnterGuildBoss(bossCode:number):boolean{
        return ( !CacheManager.crossBoss.isHasSelectGuildBoss() && !CacheManager.bossNew.isBossCd(bossCode) ) || 
            ( !CacheManager.bossNew.isBossCd(this.curCrossGuildBoss) && 
            CacheManager.crossBoss.isCurSelectGuildBoss(bossCode) )
    }

    public setDropLogUpdStatus(type:number):void{
        this._crossDropLogUpdDict[type] = true;
    }
    
    public isDropNeedReq(type:number):boolean{
        return this._crossDropLogUpdDict[type]==null || this._crossDropLogUpdDict[type];
    }

    /**S2C_SGetCachedDropLogMsgs */
    public setCrossDropLog(data:any):void{
        // [SCachedDropLogMsg]
        let msgData:any[] = data.msgs.msgs.data;
        msgData.sort(function (a:any,b:any):number{
            let fA:number = a.notice.flags.data_I[0];
            let fB:number = b.notice.flags.data_I[0];
            if(fA==1 && fB==0){
                return -1;
            }else if(fA==0 && fB==1){
                return 1;
            }else if(fA==fB){ //按时间排
                if(a.timpstamp_I>b.timpstamp_I){
                    return -1;
                }else if(a.timpstamp_I<b.timpstamp_I){
                    return 1;
                }
            }
            return 0;
        });       
        this._crossDropLogDict[data.type] = msgData;
        
    }
    
    public getDropLog(type:number):any[]{
        return this._crossDropLogDict[type];
    }

    public getResult(rewardType:ECrossBossRewardType, isDel:boolean):any {
        let ret:any = this.bossResult[rewardType];
        if (ret && isDel) this.bossResult[rewardType] = null;
        return ret;
    }

    public getLeftResult():any {
        for (let i=0;i < this.bossResult.length;i++) {
            if (this.bossResult[i]) return this.getResult(i, true);
        }
    }

    public clearResult():void {
        this.bossResult = [];
    }

    public isCheckTips():boolean{
        return this.checkTips() || this.isGuildBossTips();
    }

    public checkTips(bossData:any = null, listType:number = -1):boolean {
        let bossLiving:boolean;
        let collectLiving:boolean;

        let serverTime:number = CacheManager.serverTime.getServerTime();
        let bossDt:number;
        let bossCond:boolean;//条件是否符合
        let collectDt:number;
        let bossInf:any;
        if (!bossData) {
            let list;
            if (listType == -1) list = this.bossListAll;
            else list = this.getBossListByType(listType);
            for (let boss of list) {
                bossDt = CacheManager.bossNew.getBossDt(boss.bossCode_I);
                bossInf = ConfigManager.mgGameBoss.getByPk(boss.bossCode_I);
                bossCond = CacheManager.role && bossInf && CacheManager.role.getRoleState() >= (bossInf.roleState || 0);
                collectDt = CacheManager.bossNew.getBossDt(boss.collectCode_I);
                if (/*bossDt > 0 && */bossDt <= serverTime && bossCond)
                    bossLiving = true;
                if (/*collectDt > 0 && */boss.collectCode_I > 0 && collectDt <= serverTime && bossCond)
                    collectLiving = true;
            }
        }
        else {
            bossInf = ConfigManager.mgGameBoss.getByPk(bossData.bossCode_I);
            bossCond = CacheManager.role && bossInf && CacheManager.role.getRoleState() >= (bossInf.roleState || 0);
            bossLiving = bossCond && CacheManager.bossNew.getBossDt(bossData.bossCode_I) <= serverTime;
            collectLiving = bossCond && bossData.collectCode_I > 0 && CacheManager.bossNew.getBossDt(bossData.collectCode_I) <= serverTime;
        }

        return (collectLiving&& CacheManager.role.role.collectTimes_BY > 0) ||
            (bossLiving && CacheManager.role.role.bossTimes_BY > 0);
    }
    /**神兽入侵是否红点 */
    public isGuildBossTips():boolean{
        let flag:boolean = CacheManager.guildNew.isJoinedGuild() && 
            ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.CrossBossGuild],false) && !this.isHasSelectGuildBoss();        
        return flag;

    }

    public canShowCollect():boolean {
        return CacheManager.role.role.collectTimes_BY > 0;
    }

    public getLocalLevel(state:number):number {
        for (let i = 0; i < this.bossListLocal.length; i++) {
            let bossInf:any = ConfigManager.mgGameBoss.getByPk(this.bossListLocal[i].bossCode_I);
            if (bossInf.roleState == state) return i + 1;
        }
        return 1;
    }

}

enum ECrossBossField {
    SINGLE = 1,
    CROSS = 2,
    LOCAL = 3,
    CROSSEx = 4,
}

enum ECrossBossRewardType {
    COLLECT_OWN = 1,//1-神兽精华 2-boss归属
    BOSS_OWN = 2
}