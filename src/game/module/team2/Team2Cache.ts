/**
 * 组队2数据模型
 * @author Chris
 */
class Team2Cache implements ICache {

    /**邀请cd 2分钟 */
    public static FRIEND_INV_CD:number = 120000;

    public teamList: any[];
    public teamInfo: any;
    public static COUNT_NO_CD:number = -1;
    public static COUNT_NO_LEADER:number = -2;
    public static COUNT_NO_TEAM:number = -3;
    public static COUNT_HAD_INVITE:number = -4; //收到组队邀请
    private enterCopyAutoCount:number = -3;//>=0:有倒计时,-1:队长，没勾选倒计时-2:队员,-3:没有队伍
    public mySelectCopyCode:number = -1;

    /**
     * 当前收到的好友邀请组队信息
     * SCrossTeamFriendInvite */
    public curInviteInfo:any;
    /**屏蔽好友邀请组队字典 */
    public ignoreInviteMap:any;
    /**进入队伍倒计时 */
    private enterLeftSecDict: {[id: string]: number} = {};

    public constructor() {
    }

    public updateTeamInfo(info: any): void {
        this.teamInfo = info;
        if (info) {
            let list:any[] = info.players.data;
            if (list && list.length) {
                let captain:any[];
                for (let i = 0; i < list.length; i++) {
                    if (EntityUtil.isSame(list[i].tinyPlayer.entityId, info.captainId)) {
                        captain = list.splice(i, 1);
                        break;
                    }
                }
                captain && captain.length && list.unshift(captain[0]);
            }
        } else {
            this.setEnterCopyAutoCount(Team2Cache.COUNT_NO_TEAM);
        }
        EventManager.dispatch(LocalEventEnum.TeamCrossInfoUpdate);

        if(this.hasTeam){ //组队自动去除邀请信息
            CacheManager.team2.curInviteInfo = null;
        }
    }

    public isFullMem() {
        return this.teamInfo && this.teamInfo.players.data.length >= this.teamInfo.maxPlayer_BY;
    }

    public updateTeamList(list: any[]) {
        this.teamList = list;
        EventManager.dispatch(LocalEventEnum.TeamMemberListUpdate);
    }

    public get hasTeam():boolean {
        return this.teamInfo != null;
    }

    /**是否是我忽略掉的好友组队邀请信息 */
    public isIgnoreInvite(entityId:any):boolean{
        if(this.ignoreInviteMap && this.ignoreInviteMap[entityId.id_I]){
            let endDt:number = this.ignoreInviteMap[entityId.id_I];
            return egret.getTimer()<endDt;
        }
        return false;
    }
    /**
     * 设置忽略的邀请cd
     */
    public setIgnoreInvite(entityId:any):void{
        if(!this.ignoreInviteMap){
            this.ignoreInviteMap = {};
        }
        this.ignoreInviteMap[entityId.id_I] = egret.getTimer()+Team2Cache.FRIEND_INV_CD;
    }

    public get captainIsMe():boolean {
        return this.teamInfo && EntityUtil.isMainPlayer(this.teamInfo.captainId);
    }

    public get isQualifyingTeam():boolean {
        return this.teamInfo != null && this.teamInfo.copyCode_I == CopyEnum.CopyQualifying;
    }

    public checkTips():boolean {
        if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Team2],false)){
            return false;
        }
        let copy:any = ConfigManager.copy.getByPk(CopyEnum.CopyCrossTeam);
        let pCopy:any = CacheManager.copy.getPlayerCopyInf(CopyEnum.CopyCrossTeam);
        return !pCopy || copy.numByDay > pCopy.todayEnterNum_I;
    }

    public getEnterCopyAutoCount():number {
        return this.enterCopyAutoCount;
    }

    public setEnterCopyAutoCount(count:number):void {
        this.enterCopyAutoCount = count;
        if (count != Team2Cache.COUNT_NO_TEAM) {//要显示图标
            if (count >= 0) {//有倒计时
                App.TimerManager.doTimer(1000, 0, this.onCountAuto, this);
            }
            //显示图标
            EventManager.dispatch(UIEventEnum.Team2IconBar, true);
            EventManager.dispatch(UIEventEnum.Team2IconBarCount);
        } else {//干掉图标
            App.TimerManager.remove(this.onCountAuto, this);
            EventManager.dispatch(UIEventEnum.Team2IconBar, false);
        }
    }

    public cancelEnterCopyAutoCount():void {
        this.enterCopyAutoCount = -3;
        App.TimerManager.remove(this.onCountAuto, this);
    }

    private onCountAuto() {
        if (this.enterCopyAutoCount <= 0) {
            App.TimerManager.remove(this.onCountAuto, this);
            EventManager.dispatch(LocalEventEnum.EnterCopyCross);
            return;
        }
        this.enterCopyAutoCount--;
        EventManager.dispatch(UIEventEnum.Team2IconBarCount);
    }

    public get curTeamCopyCfg():any {
        if(!this.teamInfo) return null;
        let curTeamCopy:any = ConfigManager.copy.getByPk(this.teamInfo.copyCode_I);
        return curTeamCopy;
    }

    public checkHasOtherCrossTeam(copyCode:CopyEnum, exitTeamCallFunc:Function, caller:any = null):boolean {
        if (this.teamInfo && this.teamInfo.copyCode_I != copyCode) {
            let altip:string = this.teamInfo.copyCode_I == CopyEnum.CopyQualifying ? LangQualifying.LANG52 : LangQualifying.LANG53;
            AlertII.show(altip, null, (type:AlertType)=>{
                if (type == AlertType.YES) {//已有其他跨服组队，先退出，再组队
                    EventManager.dispatch(LocalEventEnum.ExitTeamCross);
                    egret.setTimeout(()=>{
                        exitTeamCallFunc.call(caller);
                    }, this, 800);
                }
            });
            return true;
        }
        return false;
    }

    /**被提出队伍 */
    public onKicked(): void {
        let groupId: string = EntityUtil.getEntityId(this.teamInfo.groupId);
        this.enterLeftSecDict[groupId] = 60;
        App.TimerManager.doTimer(1000, 60, () => {
            this.enterLeftSecDict[groupId]--;
        }, this);
    }

    /**加入队伍剩余时间 */
    public getJoinTeamLeftSec(teamId: any): number {
        let groupId: string = EntityUtil.getEntityId(teamId);
        if (this.enterLeftSecDict[groupId] == null) {
            this.enterLeftSecDict[groupId] = 0;
        }
        return this.enterLeftSecDict[groupId];
    }

    public clear(): void {
        this.updateTeamInfo(null);
    }
}

enum ETeam2State {
    Team_NONE = 0,
    Team_Member,
    Team_Leader
}