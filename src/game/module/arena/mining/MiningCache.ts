class MiningCache implements ICache {
    /** 矿洞地图id*/
    public static MINING_MAP_ID:number = 140001;
    public static MINING_MAP_ID2:number = 140003;
    public static ITEM_COST_ID:number = 0;
    /**
     *  Message::Public::SEntityId entityId;	//实体ID
     *  int pos;								//位置
     *  int minerId;							//矿工Id
     *  int miningTimes;						//挖矿次数//都是已使用次数
     *  int robTimes;							//掠夺次数
     *  int robbedTimes;						//被掠夺次数
     *  int status;								//状态：0:正常  1：正在被掠夺
     *  Message::Public::SeqEntityId robEntityIds;//掠夺玩家列表
     */
    public myMiningInfo: any = {floor_I:1, pos_I:0, minerId_I:0, miningEndSec_I:0, miningTimes_I:0, robTimes_I:0, robbedTimes_I:0, status_I:0};//SPlayerMiningInfo
    private sceneMiningInfo: any;//SMiningCopyInfo
    public maxFloor: number = 1;
    private miningRecord: any = {miningRecord:{data:[]}};//SMiningRecord
    public curFloor: number;
    private _myLeftSecs: number;
    private _canGetReward: boolean;
    public myMiningHireInfo: any;
    private _isRobbedRedTips: boolean;
    private _changeMapOpenHire: boolean;
    public needGetReward : boolean = true;
    private _floorList: {floor:number, count:number}[];
    public autoBuy: number = 0;
    //SMinerRefreshInfo

    //SMiningPlayerRecord

    public constructor() {

    }

    public updatePlayerMiningInfo(msg: any) {
        if (EntityUtil.isMainPlayer(msg.player.entityId)) {
            Log.trace(Log.MINING, "更新自己的挖矿信息：", this.myMiningInfo);
            if (this.myMiningInfo && !this.myMiningInfo.minerId_I && msg.minerId_I > 0) {
                EventManager.dispatch(LocalEventEnum.StartMyNewMine);//开始我的挖矿
            }
            this.myMiningInfo = msg;
            //倒计时，自己算结束后派发可以领取标识
            this.countDownMySelf();
            EventManager.dispatch(LocalEventEnum.UpdateMyMiningInfo);
        }
        let playerInfoList:any[] = this.getMiningList();
        if (playerInfoList) {
            for (let i:number = 0;i < playerInfoList.length;i++) {
                if (playerInfoList[i].floor_I == msg.floor_I && playerInfoList[i].pos_I == msg.pos_I) {//同层同矿洞，更新
                    playerInfoList[i] = msg;
                    EventManager.dispatch(LocalEventEnum.UpdatePlayerMiningInfo, msg);
                    return;
                }
            }
            if (msg.floor_I == this.curFloor) {
                playerInfoList.push(msg);
                EventManager.dispatch(LocalEventEnum.UpdatePlayerMiningInfo, msg);
            }
        }
    }

    public updateSceneMiningInfo(msg: any) {
        this.sceneMiningInfo = msg;
        this.curFloor = msg.floor_I;
        this.maxFloor = msg.maxFloor_I;
        EventManager.dispatch(LocalEventEnum.UpdateMiningInfo);
    }

    public getMiningList():any[] {
        return this.sceneMiningInfo
            && this.sceneMiningInfo.playerMiningInfo
            && this.sceneMiningInfo.playerMiningInfo.data;
    }

    public getMiningInfo(minerPos:number):any {
        let list:any[] = this.getMiningList();
        if (list)
            for (let info of list) {
                if (info.pos_I == minerPos) {
                    return info;
                }
            }
        return null;
    }

    public updateMaxFloor(floorDic: any) {
        this._floorList = [];
        let maxFloor:number = 1;
        if (floorDic) {
            let floor:number;
            for (let i:number=0;i < floorDic.key_I.length;i++) {
                floor = floorDic.key_I[i];
                if (floor > maxFloor) maxFloor = floor;
                this._floorList.push({floor:floor, count:floorDic.value_I[i]})
            }
        }
        this._floorList.sort((f1:any, f2:any)=>{
            return f1.floor - f2.floor;
        });
        this.maxFloor = maxFloor;
        this.updatePassPoints();
        EventManager.dispatch(LocalEventEnum.UpdateMiningMaxFloor);
    }

    public updateMiningRecord(msg: any) {
        this.miningRecord = msg;
        this.sortRecords();
        EventManager.dispatch(LocalEventEnum.UpdateMiningRecord);
    }

    public updatePlayerMiningRecord(msg: any) {
        if (this.miningRecord && this.miningRecord.miningRecord) {
            let recordList:any[] = this.miningRecord.miningRecord.data;
            let record:any;
            if (recordList.length) {
                for (let i:number=0;i<recordList.length;i++) {
                    record = recordList[i];
                    if (record.recordId_L64 == msg.recordId_L64) {
                        recordList[i] = msg;
                        break;
                    } else if (i == recordList.length - 1) {//最后一个都找不到，代表新增
                        recordList.push(msg);
                        break;
                    }
                }
            } else {
                recordList.push(msg);
            }
            this.sortRecords();

            if (msg.operType_I == EMiningOperate.EMiningOperateRobbed && msg.valueEx_I == 0) {
                this.isRobbedRedTips = true;
            }
            EventManager.dispatch(LocalEventEnum.UpdatePlayerMiningRecord, msg);
        }
    }

    private sortRecords():void {
        let recordList:any[] = this.miningRecord && this.miningRecord.miningRecord && this.miningRecord.miningRecord.data;
        if (recordList.length)
            recordList.sort((r1:any, r2:any)=>{
                return Number(r2.recordId_L64) - Number(r1.recordId_L64);
            });
    }

    public updateMyMiningHireInfo(msg: any) {
        this.myMiningHireInfo = msg;
        EventManager.dispatch(LocalEventEnum.UpdateMyMiningHireInfo);
    }

    public getMiningLeftSecs(info:any = null) {
        if (!info) info = this.myMiningInfo;
        if (info) {
            return info.miningEndSec_I - CacheManager.serverTime.getServerTime();
        }
        return 0;
    }

    public getMiningHasReward(info:any = null) {
        if (!info) info = this.myMiningInfo;
        if (info) {
            return info.miningEndSec_I > 0;
        }
        return false;
    }

    public getSceneMinerList():any[] {
        return this.sceneMiningInfo && this.sceneMiningInfo.playerMiningInfo.data;
    }

    public getSceneWrokingMinerList():any[] {
        let list:any[] = [];
        let sceneList:any[] = this.sceneMiningInfo && this.sceneMiningInfo.playerMiningInfo.data;
        if (sceneList)
            for (let data of sceneList) {
                if (this.getMiningLeftSecs(data) > 0) list.push(data);
            }
        return list;
    }

    public getMiningRecordList():any[] {
        return this.miningRecord && this.miningRecord.miningRecord && this.miningRecord.miningRecord.data;
    }

    public clear() {
    }

    private countDownMySelf() {
        this._myLeftSecs = this.getMiningLeftSecs();
        if (this._myLeftSecs > 0) {
            this._canGetReward = false;
            EventManager.dispatch(LocalEventEnum.MiningResultClose);
            App.TimerManager.doTimer(1000, 0, this.onCd, this);
        } else {
            if (this.getMiningHasReward()) {
                this._canGetReward = true;
                EventManager.dispatch(LocalEventEnum.MiningResult);
            } else {
                this._canGetReward = false;
                EventManager.dispatch(LocalEventEnum.MiningResultClose);
            }
            App.TimerManager.remove(this.onCd, this);
        }
    }

    private onCd() {
        this._myLeftSecs = this.getMiningLeftSecs();
        if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)) {
            EventManager.dispatch(LocalEventEnum.UpdateMyMiningCountdown);
        }
        if (!(this._myLeftSecs > 0)) {
            if (this.getMiningHasReward()) {
                this._canGetReward = true;
                EventManager.dispatch(LocalEventEnum.MiningResult);
            }
            App.TimerManager.remove(this.onCd, this);
        }
    }

    get canGetReward(): boolean {
        return this._canGetReward;
    }

    get myLeftSecs(): number {
        return this._myLeftSecs;
    }

    /**
     *
     * @param data:SPlayerMiningRecord
     * @returns {string}
     */
    public static makeRecord(data:any):string {
        let me:string;
        let other:string;
        if (data.operType_I == EMiningOperate.EMiningOperateRob) {
            me = LangMining.LANG21;
            other = HtmlUtil.html(data.player.name_S, '#ec422e');
        } else {
            me = HtmlUtil.html(data.player.name_S, '#ec422e');
            other = LangMining.LANG21;
        }
        let minerData:any = ConfigManager.mining.getMinerData(data.operMiner_I);
        let minerName:string = HtmlUtil.html(minerData.name, Color.getRumor((2 + data.operMiner_I) + ""));
        let result:string = data.value_I == 1 ? '' : LangMining.LANG24;
        return App.StringUtils.substitude(LangMining.LANG22, me, other, minerName, result);
    }

    /**
     *
     * @param data:SPlayerMiningInfo
     * @returns {string}
     */
    public static makeRecord2(robbedInfo:any, data:any):string {
        let me:string = robbedInfo.name_S;
        let other:string = LangMining.LANG21;
        let minerData:any = ConfigManager.mining.getMinerData(data.minerId_I);
        let minerName:string = HtmlUtil.html(minerData.name, Color.getRumor((2 + data.minerId_I) + ""));
        let result:string = robbedInfo.success_B ? '' : LangMining.LANG24;
        return App.StringUtils.substitude(LangMining.LANG22, me, other, minerName, result);
    }

    public updatePassPoints() {
        let mapScene:any;
        if (this.sceneMiningInfo && (mapScene = CacheManager.map.getCurMapScene())) {
            let _passPoints:any[] = mapScene.passPoints;
            let _passInfo:any;
            for(let i:number = 0; i < _passPoints.length; i++) {
                _passInfo = _passPoints[i];
                if (_passInfo.process == 1) {//下一层
                    if (this.curFloor > 1) {
                        ControllerManager.rpgGame.view.createSingleEntity(CacheManager.map.addPassPointData(_passInfo));
                    } else {
                        ControllerManager.rpgGame.view.removeEntityById(EntityUtil.getPassPointEntityId(_passInfo));
                    }
                } else {//上一层
                    if (this.curFloor < this.maxFloor) {
                        ControllerManager.rpgGame.view.createSingleEntity(CacheManager.map.addPassPointData(_passInfo));
                    } else {
                        ControllerManager.rpgGame.view.removeEntityById(EntityUtil.getPassPointEntityId(_passInfo));
                    }
                }
            }
        }
    }

    public gotoNextFloor(): void {
        let passInfos:any[] = CacheManager.map.getEntityInfosByObjType(EEntityType.EEntityTypePassPoint);
        if (passInfos && passInfos.length) {
            for (let info of passInfos) {
                if (info.process == 2) {//下一层
                    EventManager.dispatch(LocalEventEnum.AIStart, { "type": AIType.MoveToPassPoint, "data": { passPointId: info.passPointId} });
                    this._changeMapOpenHire = true;
                    break;
                }
            }
        }
    }

    public checkOpenHire():void {
        if (this._changeMapOpenHire) {
            if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining))
                EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.MiningHire);
            this.changeMapOpenHire = false;
        }
    }

    public checkTips():boolean {
        if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Mining],false)) return false;
        if(this.myMiningInfo) {
            if (this.getMiningLeftSecs() > 0) {//正在挖矿中
                return false;
            } else if (this.getMiningHasReward()) {//挖完了奖励未领
                return true;
            } else {
                // let stCfg:any = ConfigManager.mining.getMiningStaticData();
                let miningCount:number = ConfigManager.mining.getMiningStaticMiningCount(CacheManager.welfare2.isPrivilegeCard);
                return this.myMiningInfo.miningTimes_I < miningCount /*|| this.myMiningInfo.robTimes_I < stCfg.robTimes;*/
            }
        }
        return false;
    }

    /**
     * 是否在复仇：场景上没矿工
     * @returns {boolean}
     */
    public isRevengeChallenge():boolean {
        return CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMiningChallenge)
            && CacheManager.map.getEntityInfosByObjType(EEntityType.EEntityTypeBoss, EBossType.EBossTypeMiner).length <= 0;
    }

    /**
     * 是否是自身的矿工
     * @returns {boolean}
     */
    public isMyMining(info:any):boolean {
        if (info) {
            return info.floor_I == this.myMiningInfo.floor_I && info.pos_I == this.myMiningInfo.pos_I;
        }
        return false;
    }

    /**
     * 是否可以掠夺别人的矿工
     * @returns {boolean}
     */
    public canRobOther(info:any):boolean {
        if (info) {
            return info.robbedTimes_I < ConfigManager.mining.getMiningStaticDataKey("robbedTimesOne")
                && CacheManager.mining.myMiningInfo.robTimes_I < ConfigManager.mining.getMiningStaticDataKey("robTimes")
                && EntityUtil.isMainPlayerOther(info.player.entityId) < 0
                && !this.hasRobOtherSucc(info);
        }
        return false;
    }

    /**
     * 是否成功掠夺过别人的矿工
     * @returns {boolean}
     */
    public hasRobOtherSucc(info:any):boolean {
        let robbedList:any[] = info && info.robbedInfo && info.robbedInfo.data;
        if (robbedList) {
            for (let robbedOne of robbedList) {
                if (EntityUtil.isSame(robbedOne.entityId, CacheManager.role.entityInfo.entityId) && robbedOne.success_B)//被自己掠夺成功过1次
                    return true;
            }
        }
        return false;
    }

    public get costItemAmount():number {
        if (!MiningCache.ITEM_COST_ID)
            MiningCache.ITEM_COST_ID = Number(ConfigManager.mining.getMiningStaticDataKey("refreshItem"));
        return CacheManager.pack.propCache.getItemCountByCode(MiningCache.ITEM_COST_ID);
    }

    public get isRobbedRedTips(): boolean {
        return this._isRobbedRedTips;
    }

    public set isRobbedRedTips(value: boolean) {
        if (this._isRobbedRedTips != value) {
            this._isRobbedRedTips = value;
            EventManager.dispatch(LocalEventEnum.UpdateMyRecordTips);
        }
    }

    public get changeMapOpenHire(): boolean {
        return this._changeMapOpenHire;
    }

    public set changeMapOpenHire(value: boolean) {
        this._changeMapOpenHire = value;
    }

    public get floorList(): { floor: number; count: number }[] {
        return this._floorList;
    }

    public getFloorListExceptCur(): { floor: number; count: number }[] {
        if (!this._floorList) return [];
        let cloneList = this._floorList.concat();
        for (let i:number=0;i < cloneList.length; i++) {
            if (cloneList[i].floor == this.curFloor) {
                cloneList.splice(i, 1);
                break;
            }
        }
        return cloneList;
    }

    public set floorList(value: { floor: number; count: number }[]) {
        this._floorList = value;
    }
}

enum EMiningStatus {
    NORMAL = 0, //正常
    ROBBED = 1, //正在被掠夺
}

enum EMiningOperate {
    EMiningOperateRob = 5, //掠夺
    EMiningOperateRobbed = 6, //被掠夺
}