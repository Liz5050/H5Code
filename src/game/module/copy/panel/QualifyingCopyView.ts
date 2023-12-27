class QualifyingCopyView extends BaseCopyPanel {
    private ourScoreTxt: fairygui.GTextField;
    private theirScoreTxt: fairygui.GTextField;
    private timeTxt: fairygui.GTextField;
    private qaBtn: fairygui.GButton;

    private c1: fairygui.Controller;//0无1开始2结束
    private c2: fairygui.Controller;//0无1我方2敌方
    private c3: fairygui.Controller;//0不可采集1可采集
    private resultBtn: fairygui.GButton;
    private myRankTxt: fairygui.GRichTextField;
    private myGoalTxt: fairygui.GRichTextField;
    private countTxt: fairygui.GTextField;
    private headList: List;
    private playerRanks: simple.ISQualifyingPlayerCopyInfo[];
    private timeObj: {startSec_I:number, endSec_I:number} = {startSec_I:0, endSec_I:0};
    private timeIdx: number;
    private countTxt1: fairygui.GTextField;
    private _data: simple.SQualifyingCopyInfo;
    private c2BeginShowTime: number;
    private myForce: EForce;
    private kingRank: simple.ISQualifyingPlayerCopyInfo;
    private gCollect: fairygui.GGraph;
    private collectCdTxt: fairygui.GTextField;
    private mcClick: UIMovieClip;
    private collectImg: fairygui.GImage;
    private collectEndDt: number = 0;
    private isRunning: boolean;
    private collectView: HomeCollectBarView;
    private c4: fairygui.Controller;
    private c5: fairygui.Controller;//0不显示采集气泡1显示
    private occupyCollectPlayerId: simple.ISEntityId;

    public constructor(copyInfo:any) {
        super(copyInfo,"QualifyingCopyView",PackNameEnum.CopyQualifying);
        this.isCenter = true;
    }

    public initOptUI():void {
        super.initOptUI();
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.c3 = this.getController('c3');
        this.c4 = this.getController('c4');
        this.c5 = this.getController('c5');
        this.ourScoreTxt = this.getGObject("txt_our_score").asTextField;
        this.theirScoreTxt = this.getGObject("txt_their_score").asTextField;
        this.timeTxt = this.getGObject("txt_time").asTextField;
        this.myRankTxt = this.getGObject("txt_my_rank").asRichTextField;
        this.myGoalTxt = this.getGObject("txt_my_goal").asRichTextField;
        this.countTxt = this.getGObject("txt_count").asTextField;
        this.countTxt1 = this.getGObject("txt_count1").asTextField;

        this.qaBtn = this.getGObject("btn_qa").asButton;
        this.qaBtn.addClickListener(this.onClick, this);
        this.resultBtn = this.getGObject("btn_result").asButton;
        this.resultBtn.addClickListener(this.onClick, this);
        this.headList = new List(this.getGObject('list_head').asList);
        this.headList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onAttackItemClick,this);
        this.XPSetBtn.visible = true;

        this.gCollect = this.getGObject('block_collect').asGraph;
        this.gCollect.addClickListener(this.onClick, this);
        this.collectImg = this.getGObject('img_collect').asImage;
        this.collectCdTxt = this.getGObject('txt_collect_cd').asTextField;
        this.collectView = this.getGObject('collect_view') as HomeCollectBarView;
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.QualifyingCopyInfo, this.onCopyInfo, this);
        this.addListen1(LocalEventEnum.QualifyingCopyInfoUpdate, this.onCopyInfoUpdate, this);
        // this.addListen1(NetEventEnum.EntityLifeUpdate, this.updateOnePlayerLife, this);
    }

    public onShow(): void {
        super.onShow();
        this.timeIdx = egret.setInterval(this.step, this, 500);
    }

    public onHide():void {
        this.timeObj.startSec_I = this.timeObj.endSec_I = 0;
        if (this.timeIdx > 0) {
            egret.clearInterval(this.timeIdx);
            this.timeIdx = 0;
        }
        this.c1.selectedIndex = 0;
        this.c2.selectedIndex = 0;
        this.c2BeginShowTime = 0;
        this._data = null;
        this.myForce = null;
        this.kingRank = null;
        // CacheManager.qualifying.exitCopy();
        this.collectEndDt = 0;
        this.isRunning = false;
        this.headList.data = [];
        this.occupyCollectPlayerId = null;
        this.playerRanks = null;
        super.onHide();
    }

    public updateAll(): void {
        if (this.isShow) {
            this.XPSetBtn.selected = !CacheManager.sysSet.specialCopyAutoXP;
        }
        let copyInfo:any = CacheManager.qualifying.copyInfo;
        if (copyInfo) this.onCopyInfo(copyInfo);
        //采集状态，1采/倒计时
    }

    private step(): void {
        if (this._data) {
            this.updateTime(this.timeObj);
            this.updatePlayersLife();//先试下定时更新
            if (this.c2BeginShowTime > 0 && egret.getTimer() - this.c2BeginShowTime > 3000) {//胜利在望停留2s
                this.c2.selectedIndex = 0;
            }
            if (this.collectEndDt > 0) {
                let leftCd:number = ((this.collectEndDt - CacheManager.serverTime.getServerMTime()) / 1000) >> 0;
                if (leftCd >= 0) {
                    this.collectCdTxt.text = leftCd + 'S';
                } else {
                    this.collectCdTxt.text = '';
                    this.collectEndDt = 0;
                }
            } else {
                this.collectCdTxt.text = this._data.firstCollect_B ? LangQualifying.LANG55 : "";
            }
            this.checkCollectFlag();
        }
    }

    private onCopyInfo(data:simple.SQualifyingCopyInfo):void {
        this._data = data;
        this.updatePlayerRanks(data);
        this.updateTime(data);
        Log.trace(Log.TVT, "onCopyInfo:", data);
    }

    private onCopyInfoUpdate(data:simple.SQualifyingCopyUpdate):void {
        this.updateTime(data);
        this.broadcast(data);
        this.updateCd(data);
        Log.trace(Log.TVT, "onCopyInfoUpdate:", data);
    }

    private onClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        switch (btn) {
            case this.qaBtn:
                EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:HtmlUtil.colorSubstitude(LangQualifying.LANG33)});
                break;
            case this.resultBtn:
                EventManager.dispatch(UIEventEnum.QualifyingWin, EQualifyingWinType.Result, this._data);
                break;
            case this.gCollect:
                if (!this.isRunning) {
                    Tip.showTip(LangQualifying.LANG50);
                    break;
                }
                if (this.c3.selectedIndex==1) {//可采集
                    if(!this.mcClick) {
                        this.mcClick = UIMovieManager.get(PackNameEnum.MCClick);
                        this.mcClick.x = this.collectImg.x - 208;
                        this.mcClick.y = this.collectImg.y - 211;
                        this.addChild(this.mcClick);
                    }
                    this.mcClick.setPlaySettings(0,-1,1,-1,function(){
                        this.mcClick.destroy();
                        this.mcClick = null;
                    },this);
                }
                this.gotoCollect();
                break;
        }
    }

    private gotoCollect():void {
        EventManager.dispatch(LocalEventEnum.AIStart, { "type": AIType.Route
            , "data": { "mapId": 0, "x": 30, "y": 42, "distance": 0
                , "callBack": new CallBack(()=>{
                    let checkCollect:RpgMonster = CacheManager.map.getNearestCollect();
                    if (checkCollect) {
                        if (!this.occupyCollectPlayerId) this.onAttackItemClick(checkCollect);
                        else this.onAttackItemClick(this.occupyCollectPlayerId);
                    } else {
                        Tip.showTip(LangQualifying.LANG49);
                    }
                }, this) } });
    }

    private onAttackItemClick(target:any = null):void {
        if (!this.isRunning) {
            Tip.showTip(LangQualifying.LANG50);
            return;
        }
        let entity:RpgGameObject = target;
        let item:QualifyingHeadItem;
        if (entity instanceof fairygui.ItemEvent) {
            let index:number = this.headList.list.itemIndexToChildIndex(this.headList.selectedIndex);
            item = this.headList.list.getChildAt(index) as QualifyingHeadItem;
            entity = item.getTarget();
        } else if (entity instanceof simple.SEntityId) {
            let itemIdx:number = 0;
            while (itemIdx < this.headList.list.numChildren) {
                item = this.headList.list.getChildAt(itemIdx) as QualifyingHeadItem;
                if (EntityUtil.isSame(item.entityId, entity, true)) {
                    if (item.force == this.myForce) {//队友，直接返回
                        Tip.showTip(LangQualifying.LANG54);
                        return;
                    }
                    entity = item.getTarget();
                    break;
                }
                itemIdx++;
            }
        }

        if (item && item.force == this.myForce) {
            Tip.showTip(LangFight.LANG8);
            return;
        }
        if(!entity) {
            CacheManager.bossNew.battleObj = null;
            Tip.showTip(LangFight.LANG9);
            return;
        } else if (entity.isDead()) {
            CacheManager.bossNew.battleObj = null;
            Tip.showTip(LangFight.LANG7);
            return;
        } else if (CacheManager.map.isMapPointType(entity.gridPoint, EMapPointType.EMapPointTypeFunc1)
            || CacheManager.map.isMapPointType(entity.gridPoint, EMapPointType.EMapPointTypeFunc2)) {//敌人在安全区，提示返回
            CacheManager.bossNew.battleObj = null;
            Tip.showTip(LangFight.LANG10);
            return;
        }
        if(entity != CacheManager.bossNew.battleObj) {
            CacheManager.king.stopKingEntity(true);
        }
        CacheManager.bossNew.battleObj = entity;
    }

    protected exitCopy(): void {
        super.exitCopy();
    }

    private updateTime(data: any) {
        let time = this.timeObj;
        if (data instanceof simple.SQualifyingCopyInfo || data.startSec_I > 0 || data.endSec_I > 0) {
            time.startSec_I = data.startSec_I;
            time.endSec_I = data.endSec_I;
        } else {//simple.SQualifyingCopyUpdate
            if (data.updateType == EQualifyingUpdate.EUpdateTypeStart) {
                time.startSec_I = data.value;
            } else if (data.updateType == EQualifyingUpdate.EUpdateTypeEnd) {
                time.endSec_I = data.value;
            }
        }
        let curTime:number = CacheManager.serverTime.getServerTime();
        let countdown:number = 0;
        if (time.startSec_I > curTime) {//尚未开启
            this.isRunning = false;
            this.timeTxt.text = '00:00';
            countdown = time.startSec_I - curTime;
            if (countdown <= 30) {
                this.c1.selectedIndex = 1;
                this.countTxt.text = countdown + '';//App.DateUtils.getTimeStrBySeconds(countdown, DateUtils.FORMAT_6);
            }
        } else if (time.endSec_I > curTime) {//活动中
            this.isRunning = true;
            countdown = time.endSec_I - curTime;
            this.timeTxt.text = App.DateUtils.getTimeStrBySeconds(countdown, DateUtils.FORMAT_6, false);
            if (countdown <= 10) {
                this.c1.selectedIndex = 2;
                this.countTxt.text = countdown + '';
            } else {
                this.c1.selectedIndex = 0;
            }
        } else {//活动结束
            this.isRunning = false;
            this.timeTxt.text = '00:00';
            this.c1.selectedIndex = 0;
        }
    }

    private broadcast(data:simple.SQualifyingCopyUpdate):void {
        if (data.updateType == EQualifyingUpdate.EUpdateTypeWillWin) {
            this.c2BeginShowTime = egret.getTimer();
            this.c2.selectedIndex = data.valueEx_I == EForce.EForceOne ? 1 : 2;
            this.countTxt1.text = data.value_I + '';
        } else if (data.updateType == EQualifyingUpdate.EUpdateTypeKill) {//飘字
            let name1:string = data.name1_S;
            let name2:string = data.name2_S;
            let tip:string = this.myForce == data.valueEx_I ? LangQualifying.LANG41 : LangQualifying.LANG42;
            Tip.showRollTip(HtmlUtil.colorSubstitude(tip, name1, name2, data.value_I));
            if (EntityUtil.isSame(data.entityId1, CacheManager.role.entityInfo.entityId, true)) {
                CacheManager.copy.combo ++;
            }
        } else if (data.updateType == EQualifyingUpdate.EUpdateTypeCollect) {//飘字
            let name1:string = data.name1_S;
            let name2:string = data.name2_S;
            let tip:string = this.myForce == data.valueEx_I ? LangQualifying.LANG43 : LangQualifying.LANG44;
            Tip.showRollTip(HtmlUtil.colorSubstitude(tip, name1, name2, data.value_I));
        }
    }

    private updateCd(data:any):void {
        if (data.updateType == EQualifyingUpdate.EUpdateTypeCollectCoolDown) {
            this.collectEndDt = Number(data.valueEx2_L64);
        } else if (data.updateType == EQualifyingUpdate.EUpdateTypeCollectStart && !EntityUtil.isSame(data.entityId1, CacheManager.role.entityInfo.entityId, true)) {
            let endDt:number = Number(data.valueEx2_L64);
            let curDt:number = CacheManager.serverTime.getServerMTime();
            let leftTime:number = endDt - curDt;
            if (leftTime > QualifyingCache.COLLECT_TIME_COST)
                leftTime = QualifyingCache.COLLECT_TIME_COST;
            if (leftTime > 0) {
                this.c4.selectedIndex = 0;//屏蔽他人采集
                // this.collectView.startCollect({past:QualifyingCache.COLLECT_TIME_COST - leftTime
                //     , total:QualifyingCache.COLLECT_TIME_COST
                //     , content:HtmlUtil.colorSubstitude(LangQualifying.LANG51, data.name1_S)});
                this.occupyCollectPlayerId = data.entityId1;
                Log.trace(Log.TVT, `当前被其他玩家采集中:curDt=${curDt}
                ,endDt=${endDt}
                ,leftTime=${leftTime}
                ,past=${QualifyingCache.COLLECT_TIME_COST - leftTime}`);
            } else {
                this.c4.selectedIndex = 0;
                this.occupyCollectPlayerId = null;
                Log.trace(Log.TVT, "其他玩家采集中断/结束-1");
            }
        } else if (data.updateType == EQualifyingUpdate.EUpdateTypeCollectEnd) {
            // this.collectView.stopCollect();
            this.c4.selectedIndex = 0;
            this.occupyCollectPlayerId = null;
            Log.trace(Log.TVT, "其他玩家采集中断/结束1");
        } else if (data.updateType == EQualifyingUpdate.EUpdateTypeRevial) {
            let reliveDt:number = Number(data.valueEx2_L64);
            let reliveId:any = data.entityId1;
            let itemIdx:number = 0;
            let item:QualifyingHeadItem;
            while (itemIdx < this.headList.list.numChildren) {
                item = this.headList.list.getChildAt(itemIdx) as QualifyingHeadItem;
                if (EntityUtil.isSame(item.entityId, reliveId, true)) {
                    break;
                }
                itemIdx++;
            }
            item && item.updateReliveCd(reliveDt);
        }
    }

    private updatePlayerRanks(data: simple.SQualifyingCopyInfo) {
        let playerNumUpdate:boolean = false;
        let ranks = data.ranks.data;
        if (!this.playerRanks || this.playerRanks.length != ranks.length-1) playerNumUpdate = true;
        this.playerRanks = [];
        this.myForce = CacheManager.qualifying.myCopyForce;
        for (let r of ranks) {
            if (!EntityUtil.isMainPlayer(r.entityId)) {
                if (r.force_I == this.myForce)
                    this.playerRanks.unshift(r);
                else
                    this.playerRanks.push(r);
            }
        }

        let myRank:number = CacheManager.qualifying.myCopyRank;
        this.kingRank = CacheManager.qualifying.myCopyRankInfo;

        this.myRankTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG26, myRank);
        if (this.kingRank)
            this.myGoalTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG27, this.kingRank.copyScore_I);
        this.ourScoreTxt.text = this.myForce == EForce.EForceOne ? data.score1_I + '' : data.score2_I + '';
        this.theirScoreTxt.text = this.myForce == EForce.EForceOne ? data.score2_I + '' : data.score1_I + '';

        if (playerNumUpdate) {
            this.headList.data = this.playerRanks;
            // this.updatePlayersLife();
        }
    }

    private updatePlayersLife() {
        if (this.playerRanks) {
            // for (let r of this.playerRanks) {
            //     if (!EntityUtil.isMainPlayer(r.entityId)) {//更新其他人的血量
            //         this.updateOnePlayerLife(CacheManager.map.getEntity(r.entityId));
            //     }
            // }
            this.headList.callItemsFunc("updateLife");
        }
    }

    private updateOnePlayerLife(entity:RpgGameObject) {
        let idx:number = 0;
        let item:QualifyingHeadItem;
        let updateEntityId:any = entity && entity.entityInfo ? entity.entityInfo.entityId : null;
        while (idx < this.headList.list.numChildren) {
            item = this.headList.list.getChildAt(idx) as QualifyingHeadItem;
            if (EntityUtil.isSame(item.entityId, updateEntityId)) {
                item.updateLife();
                break;
            }
        }
    }

    private checkCollectFlag() {
        let collect:RpgMonster = CacheManager.map.getNearestCollect();
        this.c3.selectedIndex = this.isRunning && collect ? 1 : 0;
        let mpt:EMapPointType = CacheManager.map.getCurMapPointType();
        this.c5.selectedIndex = this.c3.selectedIndex == 1
        && (mpt == EMapPointType.EMapPointTypeFunc1
            || mpt == EMapPointType.EMapPointTypeFunc2
            || mpt == EMapPointType.EMapPointTypeFunc3) ? 1 : 0;
    }
}