class TeamCache implements ICache {
    public teamInfo: any;
    /**
     * 队伍列表
     * SSeqMiniGroup
     * Group.cdl
     */
    public teamList: any[];

    /**目标点列表 */
    private targetList: any[];
    private targetKey: string[];

    /**当前队伍目标点 */
    private gTeamTarget: any;
    /**无队伍，是否正在匹配中 */
    private gPlayerMatching: boolean = false;
    /**有队伍，是否正在匹配中*/
    private gGroupMatching: boolean = false;
    /**
     * 队伍中自己的地图id（由于地图数据更新比队伍慢，所以这里直接读取队员数据的地图id）
     * 仅用于与其他队员的距离判断
     */
    private gMyMapId: number;

    /**队员是否可邀请 */
    public memberInvite: boolean = true;
    /**是否自动同意申请者入队 */
    public autoEnter: boolean = true;
    /**申请列表 */
    public applyDataList: any[] = [];
    /**附近玩家列表 */
    private gNearbyPlayerList: any[] = [];
    /**邀请我组队的玩家信息 SGroupInvite*/
    public inviteMeTeamList: any[] = [];

    /**是否有新的申请信息 */
    public hasNewApply: boolean = false;
    /**是否有新的邀请信息 */
    public hasNewInvite: boolean = false;
    public static MAX_LEVEL: number;

    public constructor() {
    }

    public updateTeamInfo(teamData: any): void {
        this.teamInfo = teamData;
        if (!teamData) {
            this.gTeamTarget = null;
            this.groupMatching = false;
        }
        else {
            if (teamData.groupId.id_I > 0) {
                this.updateTeamTarget(teamData);
            }
            this.groupMatching = teamData.matching_B;
            this.playerMatching = false;
        }
        EventManager.dispatch(NetEventEnum.TeamInfoUpdate);
        //队伍信息
        //   ["id:20403"] struct SGroup
        //   {
        //      SEntityId groupId;          //队伍ID
        //      SEntityId captainId;        //队长ID
        //      string name;                //队伍名字
        //      string pwd;                 //密码
        //      int allocation;             //分配方案
        //      int64 warfare_L64;                //战斗力
        //      short career;               //职业
        //      bool joinInFighting;        //斗过程中加入
        //      bool fighting;              //是否在战斗中 false--不在战斗中 true--在战斗中
        //      byte playerCount;           //玩家数
        //      byte maxPlayer;             //人数上限
        //      short level;                 //等级
        //      int copyType;               //副本类型
        //      int copyCode;               //副本id
        //      bool memberInvite;          //队员可以邀请
        //      SeqPublicMiniPlayer players;//玩家信息
        //      int isCrossTeam ;           //是否是跨服组队
        //      EGroupTargetType targetType; //队伍目标
        //      int targetValue;            //目标值
        //      short minLevel;             //最低等级
        //      short maxLevel;             //最高等级
        //      bool autoEnter;             //自动接受申请
        //      bool matching;              //是否匹配中
        //      byte copyEnterPlayer;       //进入副本时队伍人数
        //   };
    }

    /**
     * 添加或移除成员
     * @param data SPublicMiniPlayer | SGroupEntityLeft
     * @param reason 为空则为添加成员，不为空则为移除成员
     */
    public updateMemberInfo(data: any, reason: EGroupLeftReason = null): void {
        let _players: any[] = this.teamMembers;
        if (_players) {
            let _updateIndex: number = -1;
            for (let i: number = 0; i < _players.length; i++) {
                if (reason != null) {
                    //移除队员
                    if (_players[i] && EntityUtil.isSame(_players[i].entityId, data.entityId)) {
                        _players.splice(i, 1);
                        break;
                    }
                }
                else {
                    if (_players[i] == null && _updateIndex == -1) {
                        //找到第一个为空的索引
                        _updateIndex = i;
                    }
                    if (_players[i] && EntityUtil.isSame(_players[i].entityId, data.entityId)) {
                        _updateIndex = i;
                        if (EntityUtil.isMainPlayer(data.entityId)) this.gMyMapId = data.mapId_I;
                        break;
                    }
                }
            }

            if (reason == null) {
                if (_updateIndex != -1) _players[_updateIndex] = data;
                else _players.push(data);
            }
            EventManager.dispatch(NetEventEnum.TeamMemberUpdate, reason);
        }
    }

    /**
     * 申请队伍新增申请者
     */
    public addPlayerApplyList(data: any): void {
        for (let i: number = 0; i < this.applyDataList.length; i++) {
            if (EntityUtil.isSame(this.applyDataList[i].player.entityId, data.player.entityId)) {
                this.applyDataList[i] = data;
                return;
            }
        }
        this.applyDataList.push(data);
    }

    /**
     * 邀请列表新增邀请者
     */
    public addCaptainInviteMeList(data: any): void {
        for (let i: number = 0; i < this.inviteMeTeamList.length; i++) {
            if (EntityUtil.isSame(this.inviteMeTeamList[i].player.entityId, data.player.entityId)) {
                this.inviteMeTeamList[i] = data;
                return;
            }
        }
        this.inviteMeTeamList.push(data);
    }

    public updateNearbyPlayer(data: any[]): void {
        this.gNearbyPlayerList = [];
        let _memberIds: string[] = this.teamMembersId;
        for (let i: number = 0; i < data.length; i++) {
            if (_memberIds.indexOf(EntityUtil.getEntityId(data[i].entityId)) == -1) {
                this.gNearbyPlayerList.push(data[i]);
            }
        }
    }

    /**
     * 更新目标点
     * SGroupTarget
     */
    public updateTeamTarget(target: any): void {
        this.gTeamTarget = {
            name: "",
            type: target.targetType,
            targetValue: target.targetValue_I,
            enterMinLevel: target.minLevel_SH,
            enterMaxLevel: target.maxLevel_SH,
        };
        this.gTeamTarget.name = this.getTargetName(this.gTeamTarget);
    }

    /**
     * 更新目标点列表配置（根据主角等级变化）
     */
    public updateTargetConfig(): void {
        this.targetList =
            [
                {
                    name: "无",
                    type: EGroupTargetType.EGroupTargetNull,
                    targetValue: CacheManager.map.mapId,
                    enterMinLevel: 1,
                    enterMaxLevel: this.getMaxLevel(),
                },
                {
                    name: "野外挂机",
                    type: EGroupTargetType.EGroupTargetNormal,
                    targetValue: CacheManager.map.mapId,
                    enterMinLevel: 1,
                    enterMaxLevel: this.getMaxLevel(),
                }
            ];
        this.targetKey = [];
        let _copys: any = ConfigManager.copy.getDict();
        let _level: number = CacheManager.role.getRoleLevel();
        let _copy:any;
        for (let key in _copys) {
            _copy = _copys[key];
            if (!_copy.singleMode) {
                if (_level > _copy.enterMaxLevel || _level < _copy.enterMinLevel) continue;
                let _target: any =
                    {
                        name: _copy.name,
                        type: EGroupTargetType.EGroupTargetCopy,
                        targetValue: _copy.code,
                        enterMinLevel: _copy.enterMinLevel,
                        enterMaxLevel: Math.min(_copy.enterMaxLevel, this.getMaxLevel())
                    };
                this.targetList.push(_target);
                this.targetKey.push(this.getTargetKey(_target));
            }
        }
    }

    /**获取当前组队目标点 */
    public get teamTarget(): any {
        if (!this.gTeamTarget) {
            this.gTeamTarget = {
                name: "野外挂机",
                type: EGroupTargetType.EGroupTargetNormal,
                targetValue: CacheManager.map.mapId,
                enterMinLevel: 1,
                enterMaxLevel: this.getMaxLevel(),
            };
        }
        return this.gTeamTarget;
    }

    public getCopyTarget(copy:any): any {
        return {
            name: copy.name,
            type: EGroupTargetType.EGroupTargetCopy,
            targetValue: copy.code,
            enterMinLevel: copy.enterMinLevel,
            enterMaxLevel: Math.min(copy.enterMaxLevel, this.getMaxLevel())
        };
    }

    /**
     * 获取目标点列表
     */
    public get targets(): any[] {
        if (!this.targetList) {
            this.updateTargetConfig();
        }
        return this.targetList;
    }

    public getTargetKey(target: any): string {
        if (!target) return "";
        return target.type + "_" + target.targetValue;
    }

    /**
     * 获取当前目标所在列表中索引
     */
    public getCurTargetIndex(): number {
        let _key: string = this.getTargetKey(this.teamTarget);
        return this.targetKey.indexOf(_key) + 2;
    }

    public getLevelStr(level: number): string {
        //巅峰基础等级
        let _baseLv: number = ConfigManager.const.getConstValue("DianFengBaseLevel");
        if (level > _baseLv) return "巅峰" + (level - _baseLv);
        return "" + level;
    }

    private getTargetName(target: any): string {
        if (target.type == EGroupTargetType.EGroupTargetNull) {
            return "无";
        }
        else if (target.type == EGroupTargetType.EGroupTargetNormal) {
            return "野外挂机";
        }
        let _copy: any = ConfigManager.copy.getByPk(target.targetValue);
        if (!_copy) return "";
        return _copy.name;
    }

    /**当前队伍队员列表 */
    public get teamMembers(): any[] {
        if (!this.hasTeam) return null;
        let _list: any[] = this.teamInfo.players.data;
        let _captain: any;
        for (let i: number = 0; i < _list.length; i++) {
            if (_list[i] && this.getEntityIsCaptain(_list[i].entityId)) {
                if (i != 0) {
                    //改变队长索引，始终在第一位
                    _captain = _list[i];
                    _list[i] = _list[0];
                    _list[0] = _captain;
                }
                break;
            }
        }
        return this.teamInfo.players.data;
    }

    public get teamMembersId(): string[] {
        let _ids: string[] = [];
        let _members: any[] = this.teamMembers;
        if (_members) {
            for (let i: number = 0; i < _members.length; i++) {
                if (!_members[i]) continue;
                _ids.push(EntityUtil.getEntityId(_members[i].entityId));
            }
        }
        return _ids;
    }

    /**
     * 根据entityId获取一个队员信息
     */
    public getTeamMember(entityId: any): any {
        let _members: any[] = this.teamMembers;
        if (_members) {
            for (let i: number = 0; i < _members.length; i++) {
                if (_members[i] && EntityUtil.isSame(_members[i].entityId, entityId)) {
                    return _members[i];
                }
            }
        }
        return null;
    }

    /**
     * 获取队员状态
     */
    public getMemberState(member: any): number {
        if (EntityUtil.isMainPlayer(member.entityId)) return ETeamMemberState.Nearby;
        if (member.online_BY == 1) {
            if (member.mapId_I == this.myMapId) {
                //附近
                return ETeamMemberState.Nearby;
            }
            //远离
            return ETeamMemberState.Faraway;
        }
        //离线
        return ETeamMemberState.OffLine;
    }

    /**匹配中列表数据 */
    public get teamMatchs(): any[] {
        let _list: any[] = this.teamMembers;
        if (!_list || _list.length == 0 || _list[0] == null) return [CacheManager.role.entityInfo, null, null];
        let _length: number = _list.length;
        if (_length < 3) {
            for (let i: number = 0; i < 3 - _length; i++) {
                _list.push(null);
            }
        }
        return _list;
    }

    /**是否已有队伍 */
    public get hasTeam(): boolean {
        return this.teamInfo != null && this.teamInfo.groupId.id_I > 0;
    }

    /**
     * 当前队伍是否已满员
     * （前提条件是有队伍才用该值，无队伍用该属性不准确） */
    public get teamIsFull(): boolean {
        return this.teamMembersId.length == this.teamInfo.maxPlayer_BY;
    }

    /**
     * 自己是否是队长
     */
    public get captainIsMe(): boolean {
        if (!this.hasTeam) return false;
        return EntityUtil.isMainPlayer(this.teamInfo.captainId);
    }

    /**
     * 判断一个玩家是不是当前队伍队长
     */
    public getEntityIsCaptain(entityId: any): boolean {
        if (!entityId) return false;
        if (!this.teamInfo || this.teamInfo.groupId.id_I <= 0) return false;
        return EntityUtil.isSame(entityId, this.teamInfo.captainId);
    }

    public get isMatching(): boolean {
        return this.playerMatching || this.groupMatching;
    }

    public set playerMatching(value: boolean) {
        if (this.gPlayerMatching == value) return;
        this.gPlayerMatching = value;
        EventManager.dispatch(NetEventEnum.TeamMatchChange);
    }

    public get playerMatching(): boolean {
        return this.gPlayerMatching;
    }

    public set groupMatching(value: boolean) {
        if (this.gGroupMatching == value) return;
        this.gGroupMatching = value;
        EventManager.dispatch(NetEventEnum.TeamMatchChange);
    }

    public get groupMatching(): boolean {
        return this.gGroupMatching;
    }

    public get myMapId(): number {
        if (!this.gMyMapId) return CacheManager.map.mapId;
        return this.gMyMapId;
    }

    /**附近玩家列表 */
    public get nearbyPlayerList(): any[] {
        return this.gNearbyPlayerList;
    }

    public getMaxLevel(): number {
        if (!TeamCache.MAX_LEVEL) {
            TeamCache.MAX_LEVEL = ConfigManager.exp.configLength;
        }
        return TeamCache.MAX_LEVEL;
    }

    public clear(): void {
    }
}