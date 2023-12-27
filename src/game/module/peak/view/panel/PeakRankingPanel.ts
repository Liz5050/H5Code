class PeakRankingPanel extends BaseView {
    private static LIGHT_NUM: number[] = [8, 4, 2, 1];

    private stateCtl: fairygui.Controller;
    private serverCtl: fairygui.Controller;
    private myScoreBtn: fairygui.GButton;
    private myGambleBtn: fairygui.GButton;
    private rankBtn: fairygui.GButton;

    private lightCtls: fairygui.Controller[][];
    private lightBtns: fairygui.GButton[][];
    private playerNames: fairygui.GTextField[];
    private nameBgLoaders: GLoader[];
    private champScoreBtn: fairygui.GButton;
    private champGambleBtn: fairygui.GButton;
    private champHeadLoader: GLoader;
    private champNameTxt: fairygui.GTextField;

    private roundList: List;
    private gameTimeTxt: fairygui.GTextField;
    private info: simple.SMgPeakArenaInfo;
    private isCross: boolean;
    private curState: EPeakArenaState;
    private lastTeamBtn: fairygui.GButton;
    private team1Btn: fairygui.GButton;
    private team2Btn: fairygui.GButton;
    private team3Btn: fairygui.GButton;
    private team4Btn: fairygui.GButton;
    private testStateTxt: fairygui.GTextField;

    public constructor(component: fairygui.GComponent) {
        super(component);
    }

    public initOptUI(): void {
        this.stateCtl = this.getController('ctl');
        this.serverCtl = this.getController('ctl1');
        //上方按钮区域
        this.myScoreBtn = this.getGObject('btn_myScore').asButton;
        this.myScoreBtn.addClickListener(this.onClick, this);
        this.myGambleBtn = this.getGObject('btn_myGamble').asButton;
        this.myGambleBtn.addClickListener(this.onClick, this);
        this.rankBtn = this.getGObject('btn_rank').asButton;
        this.rankBtn.addClickListener(this.onClick, this);

        //中心排位区域
        //c0_0-c0_7,c1_0-c1_3,c2_0-c2_1,c3_0
        this.lightCtls = [];
        this.lightBtns = [];
        let lightNum:number;
        let lightBtn:any;
        for (let i = 0; i < PeakRankingPanel.LIGHT_NUM.length; i++) {
            lightNum = PeakRankingPanel.LIGHT_NUM[i];
            this.lightCtls[i] = [];
            this.lightBtns[i] = [];
            for (let j = 0; j < lightNum; j++) {
                this.lightCtls[i][j] = this.getController('c' + i + '_' + j);
                lightBtn = this.getGObject('btn_' + i + '_' + j);
                if (lightBtn) {
                    lightBtn = lightBtn.asButton;
                    lightBtn.name = "btn_" + i + '_' + j;
                    lightBtn.addClickListener(this.onClick, this);
                    this.lightBtns[i][j] = lightBtn;
                }
            }
        }

        this.playerNames = [];
        this.nameBgLoaders = [];
        let nameBgLoader:GLoader;
        for (let i = 0; i < 16; i++) {
            this.playerNames[i] = this.getGObject('txt_name' + i).asTextField;
            nameBgLoader = this.getGObject('item_bg_' + i) as GLoader;
            nameBgLoader.addClickListener(this.onClick, this);
            this.nameBgLoaders[i] = nameBgLoader;
        }

        this.champScoreBtn = this.getGObject('btn_chap_score').asButton;
        this.champScoreBtn.addClickListener(this.onClick, this);
        this.champGambleBtn = this.getGObject('btn_chap_gamble').asButton;
        this.champGambleBtn.addClickListener(this.onClick, this);
        this.champHeadLoader = this.getGObject('icon_head') as GLoader;
        this.champNameTxt = this.getGObject('txt_chap_name').asTextField;

        //中下方时间区域
        this.roundList = new List(this.getGObject('list_round').asList);
        this.gameTimeTxt = this.getGObject('txt_game_time').asTextField;
        this.testStateTxt = this.getGObject('txt_test_state').asTextField;

        //下方按钮区域
        this.team1Btn = this.getGObject('btn_team0').asButton;
        this.team1Btn.name = "team_1";
        this.team1Btn.addClickListener(this.onClick, this);
        this.team2Btn = this.getGObject('btn_team1').asButton;
        this.team2Btn.name = "team_2";
        this.team2Btn.addClickListener(this.onClick, this);
        this.team3Btn = this.getGObject('btn_team2').asButton;
        this.team3Btn.name = "team_3";
        this.team3Btn.addClickListener(this.onClick, this);
        this.team4Btn = this.getGObject('btn_team3').asButton;
        this.team4Btn.name = "team_4";
        this.team4Btn.addClickListener(this.onClick, this);
    }

    public updateAll(data?: any): void {
        if (data) {
            this.info = data;
            this.isCross = CacheManager.peak.isCrossOpen;
            this.updateState(data.state_I, true);
            this.setLookTimer(true);
            this.setTips();
            if (App.DebugUtils.isDebug) {
                this.testStateTxt.text = App.StringUtils.substitude(LangPeak.MAIN13, data.state_I, EPeakArenaState[data.state_I]);
            }
        }
    }

    public hide():void {
        this.setLookTimer(false);
    }

    private updateState(state: EPeakArenaState, bUpdata:boolean, bForce:boolean = false): void {
        let stateChange:boolean = this.curState != state;
        if (stateChange || bUpdata || bForce) {
            this.curState = state;

            let stateIdx:number = 0;
            let btnGroup:number;
            let btnState:EPeakBtnState = null;
            let gamblePairId:number = 0;
            let pairInter:number = -1;
            let hasRankingInfo:boolean = this.info.pair8.data.length > 0;
            if (this.isCross) {
                switch (state) {
                    case EPeakArenaState.EPeakArenaStateSignUp:break;
                    case EPeakArenaState.EPeakArenaStateEliminate64:
                        stateIdx = EPeakPanelState.StateAudition;
                        btnGroup = -1;
                        btnState = null;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate64Free:
                        stateIdx = EPeakPanelState.State16;
                        //64强下注=单服的16强
                        btnGroup = 0;
                        btnState = EPeakBtnState.StateGamble;
                        pairInter = 8;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate32:
                        stateIdx = EPeakPanelState.State16;
                        //64强比赛日志=单服的16强
                        btnGroup = 0;
                        // btnState = EPeakBtnState.StateLookup;
                        pairInter = 8;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate32Free:
                        stateIdx = EPeakPanelState.State16;
                        //32强下注=单服的8强
                        btnGroup = 1;
                        btnState = EPeakBtnState.StateGamble;
                        pairInter = 4;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate16:
                        stateIdx = EPeakPanelState.State16;
                        //32强比赛日志=单服的8强
                        btnGroup = 1;
                        // btnState = EPeakBtnState.StateLookup;
                        pairInter = 4;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate16Free:
                        stateIdx = EPeakPanelState.State16To2;
                        //16强下注=单服的4强---->合并到一个页面
                        btnGroup = 0;
                        btnState = EPeakBtnState.StateGamble;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate8:
                        stateIdx = EPeakPanelState.State16To2;
                        //16强比赛日志
                        btnGroup = 0;
                        // btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate8Free:
                        stateIdx = EPeakPanelState.State16To2;
                        //8强下注
                        btnGroup = 1;
                        btnState = EPeakBtnState.StateGamble;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate4:
                        stateIdx = EPeakPanelState.State16To2;
                        //8强比赛日志
                        btnGroup = 1;
                        // btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate4Free:
                        stateIdx = EPeakPanelState.State16To2;
                        //4强下注
                        btnGroup = 2;
                        btnState = EPeakBtnState.StateGamble;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate2:
                        stateIdx = EPeakPanelState.State16To2;
                        //4强比赛日志
                        btnGroup = 2;
                        // btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate2Free:
                        stateIdx = EPeakPanelState.State2Free;
                        //2强下注-直接链接下注
                        btnGroup = 2;
                        btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateFinal:
                        //冠军出炉
                        stateIdx = EPeakPanelState.StateFinal;
                        //2强比赛日志
                        btnGroup = 3;
                        btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateFree:
                        stateIdx = hasRankingInfo ? EPeakPanelState.StateFinalFree : EPeakPanelState.StateFree;
                        //2强比赛日志//是否有数据
                        btnGroup = this.info.pair8.data.length ? 3 : -1;
                        btnState = EPeakBtnState.StateLookup;
                        break;
                }
            } else {
                switch (state) {
                    case EPeakArenaState.EPeakArenaStateSignUp:break;
                    case EPeakArenaState.EPeakArenaStateEliminate64:
                    case EPeakArenaState.EPeakArenaStateEliminate64Free:
                    case EPeakArenaState.EPeakArenaStateEliminate32:
                    case EPeakArenaState.EPeakArenaStateEliminate32Free:
                        //单服直接跳过上述;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate16:
                        stateIdx = EPeakPanelState.StateAudition;
                        //16强
                        btnGroup = -1;
                        btnState = null;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate16Free://接下来跟跨服一样，看要不要合并
                        stateIdx = EPeakPanelState.State16;
                        //16强下注
                        btnGroup = 0;
                        btnState = EPeakBtnState.StateGamble;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate8:
                        stateIdx = EPeakPanelState.State16;
                        //16强比赛日志
                        btnGroup = 0;
                        // btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate8Free:
                        stateIdx = EPeakPanelState.State16;
                        //8强下注
                        btnGroup = 1;
                        btnState = EPeakBtnState.StateGamble;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate4:
                        stateIdx = EPeakPanelState.State16;
                        //8强比赛日志
                        btnGroup = 1;
                        // btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate4Free:
                        stateIdx = EPeakPanelState.State16;
                        //4强下注
                        btnGroup = 2;
                        btnState = EPeakBtnState.StateGamble;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate2:
                        stateIdx = EPeakPanelState.State16;
                        //4强比赛日志
                        btnGroup = 2;
                        // btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateEliminate2Free:
                        stateIdx = EPeakPanelState.State2Free;
                        //2强下注-直接链接下注
                        btnGroup = 2;
                        btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateFinal:
                        //冠军出炉
                        stateIdx = EPeakPanelState.StateFinal;
                        //2强比赛日志
                        btnGroup = 3;
                        btnState = EPeakBtnState.StateLookup;
                        break;
                    case EPeakArenaState.EPeakArenaStateFree:
                        stateIdx = hasRankingInfo ? EPeakPanelState.StateFinalFree : EPeakPanelState.StateFree;
                        //2强比赛日志//是否有数据
                        btnGroup = this.info.pair8.data.length ? 3 : -1;
                        btnState = EPeakBtnState.StateLookup;
                        break;
                }
            }

            if (stateChange) {
                this.stateCtl.selectedIndex = stateIdx;
                if (stateIdx >= 1) {//64->16/16->8..->1
                    this.updateGameTime(state, this.isCross);
                }
            }
            if (btnState == EPeakBtnState.StateGamble) {//下注按钮更新
                gamblePairId = this.info.betPairId_I;//根据state然后算出1.2.3...(每个state对应1-n的pairId)
                if (gamblePairId != 0 && pairInter != -1) gamblePairId -= (this.info.groupId_I - 1) * pairInter;
            }
            this.updateLightBtns(btnGroup, btnState, gamblePairId);
            if (bUpdata) {
                this.updateRanking();
            }

            this.serverCtl.selectedIndex = this.isCross ? 1 : 0;
            if (this.isCross && this.stateCtl.selectedIndex == 1) {
                this.lastTeamBtn && (this.lastTeamBtn.selected = false);
                this.lastTeamBtn = this["team"+this.info.groupId_I+"Btn"];
                if(this.lastTeamBtn) {
                    this.lastTeamBtn.selected = true;
                }
            }

        }

    }

    public updateBetResult():void {
        this.updateState(this.info.state_I, false, true);
    }

    public updateLikeResult():void {
        this.setTips();
    }

    private updateGameTime(state: EPeakArenaState, isCross:boolean) {
        if (state == EPeakArenaState.EPeakArenaStateFree) return;
        let stateData:any = PeakCache.getStateStr(state, isCross);
        let stateStr:string = PeakCache.getGameTimeStateStr(stateData.pre, stateData.next);
        let stateTime:simple.ISMgPeakArenaStateTime = CacheManager.peak.getStateTime(CacheManager.peak.getNextState(state), false);
        if (!stateTime) {
            Log.trace(Log.PEAK, `找不到state为${stateData.next}的活动时间`);
            return;
        }
        let stateTimeStr:string = App.DateUtils.formatDate(stateTime.startDt_DT, DateUtils.FORMAT_CN_M_D_WEEKX_HH_MM);
        this.gameTimeTxt.text = stateTimeStr + '  ' + stateStr;
        let roundTimeList:number[] = PeakCache.getRoundTimeList(stateTime);
        this.roundList.data = roundTimeList;
    }

    private updateLightBtns(btnGroup:number, btnState:EPeakBtnState, gamblePairId:number):void {
        let btns:fairygui.GButton[];
        let btn:fairygui.GButton;
        let urlName:string;
        let curShowLookBtn:boolean = CacheManager.peak.showCurStateLookBtn();
        for (let i = 0; i < PeakRankingPanel.LIGHT_NUM.length; i++) {
            btns = this.lightBtns[i];
            if (i < btnGroup) {
                urlName = "btn_look";
            } else if (i == btnGroup && (btnState != null || curShowLookBtn)) {
                urlName = btnState == EPeakBtnState.StateGamble ? "btn_gamble": "btn_look";
            } else {
                urlName = null;
            }
            for (let j = 0; j < btns.length; j++) {
                btn = btns[j];
                btn.visible = urlName != null;
                if (i == btnGroup && gamblePairId != 0) {//只显示当前下注的按钮，其他隐藏
                    if (gamblePairId == j+1) btn.enabled = false;
                    else {
                        btn.visible = false;
                        continue;
                    }
                } else {
                    btn.enabled = true;
                }

                urlName && (btn.icon = URLManager.getPackResUrl(PackNameEnum.Peak, urlName));
                if (btn.enabled) {
                    btn.text = urlName == "btn_gamble" ? LangPeak.MAIN11 : "";
                } else {
                    btn.text = LangPeak.MAIN12;
                }
            }
        }
        if (this.stateCtl.selectedIndex == EPeakPanelState.State2Free) {
            this.champGambleBtn.text = gamblePairId != 0 ? LangPeak.GAMBLE21 : LangPeak.GAMBLE20;
        }
        this.champScoreBtn.visible = btnGroup == 3 && (curShowLookBtn || (this.info.champion && this.info.champion.entityId && this.info.champion.entityId.id_I != 0));
    }

    private updateRanking():void {
        let pair8:simple.ISMgPeakArenaPair[] = this.info.pair8.data;
        let pair4:simple.ISMgPeakArenaPair[] = this.info.pair4.data;
        let pair2:simple.ISMgPeakArenaPair[] = this.info.pair2.data;
        let pair1:simple.ISMgPeakArenaPair = this.getPair(3, 0);
        let pair0:simple.ISPublicMiniPlayer = this.info.champion;

        if (this.updatePair(pair8, 0)) {
            if (this.updatePair(pair4, 1)) {
                if (this.updatePair(pair2, 2)) {
                    if (this.updateChampPair(pair1, pair0, 3)) {
                    }
                }
            }
        }

    }

    private updatePair(pairs:simple.ISMgPeakArenaPair[], lightIdx:number):boolean {
        if (pairs && pairs.length) {
            if (lightIdx == 0) {
                let name:fairygui.GTextField;
                for (let i:number=0;i< this.playerNames.length;i++) {
                    name = this.playerNames[i];
                    name.text = LangPeak.MAIN1;
                    this.nameBgLoaders[i].grayed = false;
                }
            }

            let pairInfo:simple.ISMgPeakArenaPair;
            for (let i = 0; i < pairs.length; i++) {//默认按顺序排序?
                pairInfo = pairs[i];
                if (lightIdx == 0) {
                    this.playerNames[i*2].text = pairInfo.player1.name_S;
                    this.playerNames[i*2+1].text = pairInfo.player2.name_S;
                }
                if (EntityUtil.isSame(pairInfo.successEntityId, pairInfo.player1.entityId)) {//4种状态
                    this.lightCtls[lightIdx][i].selectedIndex = 2;
                    this.grayPlayerName(pairInfo.player2);
                } else if (EntityUtil.isSame(pairInfo.successEntityId, pairInfo.player2.entityId)) {
                    this.lightCtls[lightIdx][i].selectedIndex = 3;
                    this.grayPlayerName(pairInfo.player1);
                } else {
                    this.lightCtls[lightIdx][i].selectedIndex = 0;
                }
            }
            return true;
        } else {//重置后面的状态
            let lightArr;
            while (lightIdx < PeakRankingPanel.LIGHT_NUM.length) {
                lightArr = this.lightCtls[lightIdx];
                for (let cLight of lightArr) {
                    cLight.selectedIndex = 0;
                }
                lightIdx++;
            }
        }
        return false;
    }

    private updateChampPair(pair1:simple.ISMgPeakArenaPair, champ:simple.ISPublicMiniPlayer, lightIdx:number):void {
        let champId:any = champ && champ.entityId && champ.entityId.id_I != 0 ? champ.entityId : null;
        if (champId && pair1) {
            this.champHeadLoader.load(URLManager.getPlayerHead(champ.career_SH));
            this.champNameTxt.text = champ.name_S;
            if (EntityUtil.isSame(champId, pair1.player1.entityId)) {//4种状态
                this.lightCtls[lightIdx][0].selectedIndex = 2;
                this.grayPlayerName(pair1.player2);
            } else {
                this.lightCtls[lightIdx][0].selectedIndex = 3;
                this.grayPlayerName(pair1.player1);
            }
        } else {
            this.champNameTxt.text = "";
        }
    }

    private grayPlayerName(grayPlayer:any):void {
        let pair8:simple.ISMgPeakArenaPair[] = this.info.pair8.data;
        if (pair8 && pair8.length) {
            for (let i:number=0;i< pair8.length;i++) {
                if (EntityUtil.isSame(grayPlayer.entityId, pair8[i].player1.entityId)) {
                    // name.color = Color.toNum(Color.Color_9);
                    this.nameBgLoaders[i*2].grayed = true;
                } else if (EntityUtil.isSame(grayPlayer.entityId, pair8[i].player2.entityId)) {
                    this.nameBgLoaders[i*2+1].grayed = true;
                }
            }
        }

    }

    private setLookTimer(b:boolean):void {
        if (b) {
            let leftTimeSec:number = CacheManager.peak.getCurStateTimePassLeft();
            if (leftTimeSec > 0) {
                App.TimerManager.doTimer(leftTimeSec * 1000, 1, this.onLookTimer, this);
            }
        } else {
            App.TimerManager.remove(this.onLookTimer, this);
        }
    }

    private onLookTimer():void {
        EventManager.dispatch(LocalEventEnum.PeakGetPeakInfo);
    }

    private setTips():void {
        CommonUtils.setBtnTips(this.rankBtn, CacheManager.peak.checkLikeTips());
    }

    private onClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        let btnName: string = btn.name;
        switch (btn) {
            case this.myScoreBtn:
                EventManager.dispatch(LocalEventEnum.PeakGetPeakRecord, EPeakWinType.typeReport1, PeakCache.getCurRecordState());
                break;
            case this.myGambleBtn:
                EventManager.dispatch(UIEventEnum.PeakGambleInfoOpen);
                break;
            case this.rankBtn:
                EventManager.dispatch(UIEventEnum.PeakPopRankOpen);
                break;
            case this.champScoreBtn:
                EventManager.dispatch(LocalEventEnum.PeakGetPeakRecord, EPeakWinType.typeReport2, this.getRecordState(3, this.isCross), EPeakGroup["GROUP" + this.info.groupId_I], 1);
                break;
            case this.champGambleBtn:
                if (this.info.betPairId_I > 0) {
                    Tip.showTip(LangPeak.GAMBLE14);
                    return;
                }
                EventManager.dispatch(UIEventEnum.PeakGambleOpen, this.getPair(3, 0));
                break;
            default:
                if (btnName.indexOf('team') != -1) {
                    let arr:string[] = btnName.split('_');
                    let teamIdx:number = Number(arr[1]);
                    EventManager.dispatch(LocalEventEnum.PeakGetPeakInfo, EPeakGroup["GROUP" + teamIdx]);
                    if (this.lastTeamBtn) this.lastTeamBtn.selected = false;
                    this.lastTeamBtn = e.target;
                } else if (btnName.indexOf('item_bg') != -1) {
                    let arr:string[] = btnName.split('_');
                    let playerIdx:number = Number(arr[2]);
                    let player:any = CacheManager.peak.getPlayerInfo(playerIdx);
                    player && EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:player.entityId}, true, true, false);
                } else {
                    let arr:string[] = btnName.split('_');
                    let bi:number = Number(arr[1]);
                    let bj:number = Number(arr[2]);
                    if (btn.icon == URLManager.getPackResUrl(PackNameEnum.Peak, "btn_look")) {//查看某一场报告
                        EventManager.dispatch(LocalEventEnum.PeakGetPeakRecord, EPeakWinType.typeReport2, this.getRecordState(bi, this.isCross), EPeakGroup["GROUP" + this.info.groupId_I], bj + 1);
                    } else { //下注
                        if (this.info.betPairId_I > 0) {
                            Tip.showTip(LangPeak.GAMBLE14);
                            return;
                        }
                        EventManager.dispatch(UIEventEnum.PeakGambleOpen, this.getPair(bi, bj));
                    }
                }
                break;
        }

    }

    private getRecordState(bi: number, isCross:boolean):EPeakArenaState {
        if (isCross && this.curState <= EPeakArenaState.EPeakArenaStateEliminate32Free && !CacheManager.peak.hasChamp) {
            switch (bi) {
                case 0:return EPeakArenaState.EPeakArenaStateEliminate32;
                case 1:return EPeakArenaState.EPeakArenaStateEliminate16;
                case 2:break;//2轮之后就合并到一个页面了
            }
        } else {
            switch (bi) {
                case 0:return EPeakArenaState.EPeakArenaStateEliminate8;
                case 1:return EPeakArenaState.EPeakArenaStateEliminate4;
                case 2:return EPeakArenaState.EPeakArenaStateEliminate2;
                default:return EPeakArenaState.EPeakArenaStateFinal;
            }
        }
    }

    private getPair(bi: number, bj: number):any {
        switch (bi) {
            case 0:return this.info.pair8.data[bj];
            case 1:return this.info.pair4.data[bj];
            case 2:return this.info.pair2.data[bj];
            default:return {pairId_I:1, player1:this.getSuccPlayer(this.info.pair2.data[0]), player2:this.getSuccPlayer(this.info.pair2.data[1])};
        }
    }

    private getSuccPlayer(pair: simple.ISMgPeakArenaPair) {
        if (pair && pair.pairId_I) {
            return EntityUtil.isSame(pair.successEntityId, pair.player1.entityId) ?
                pair.player1 : pair.player2;
        }
        return null;
    }
}