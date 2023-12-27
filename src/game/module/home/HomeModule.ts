class HomeModule extends BaseModule {
    private btn_gm:fairygui.GButton;
    private btn_switchUI:fairygui.GButton;
    private c2: fairygui.Controller;
    private topPanel: HomeTopPanel;
    private topIconBar: HomeTopIconBar;
    private leftIconBar: HomeLeftIconBar;
    private left2IconBar: HomeLeft2IconBar;
    private rightIconBar: HomeRightIconBar;
    private bottomIconBar: HomeBottomIconBar;
    private bossComingIcon: BossComingIcon;//boss来袭
    private bossComingContainer:fairygui.GComponent;
    private examIconBar: ExamIconBar;//科举答题图标
    /**开服活动按钮名称 */
    public static ActivityBtn: string = "activityBtn";
    // public battlePanel: BattlePanel;
    public taskTracePanel: TaskTracePanel;

    private vipBubble: VipBubble;
    private fightModePanel: FightModePanel;

    private tpBtn: fairygui.GButton;
    private btn_topSwitch: fairygui.GButton;
    private btn_rightSwitch: fairygui.GButton;
    private roleCache: RoleCache;

    /**队伍 */
    // public teamIconBar: TeamIconBar;
    /**关卡进度 */
    private pointProgressView: CheckPointProgressView;
    private pointExpUpView: CheckPointUpView;//关卡效率
    private txt_checkpoint: fairygui.GTextField;
    private txt_expPerHour: fairygui.GTextField;
    private activePanel: OpenServerActiveListPanel;
    /**功能开启指引界面 */
    private guidePanel: OpenGuidePanel;
    private guide_container: fairygui.GComponent;

    //--------------聊天区域的内容 start
    /**聊天区的容器 */
    private chatCnt: fairygui.GComponent;
    private chatPanel: HomeChatPanel;
    //--------------聊天区域的内容 end
    private mapBtn: HomeMapIcon;
    private shieldBtn: fairygui.GButton;
    private modeBtn: fairygui.GButton;
    /**冲榜排名 */
    private actRankContainer: fairygui.GComponent;
    private actRankIsShow:boolean = true;
    private activityRankIcon: ActivityRankIcon;
    private friendIcon: HomeFriendIcon;
    private isAllIconShow: boolean = true;

    /**体验卡显示 */


    public constructor(moduleId: ModuleEnum) {
        super(moduleId, PackNameEnum.Home, "Main", LayerManager.UI_Home);
        this.roleCache = CacheManager.role;
    }

    public initOptUI(): void {
        if (App.GlobalData.IsDebug) {
            console.log("【加载3，显示主界面】进入场景，不计算地图、动作等，只管显示到显示主界面的耗时：" + (egret.getTimer() - Sdk.testStepTimer) + "ms");
        }
        this.chatCnt = this.getGObject("chat_cnt").asCom;
        this.c2 = this.getController("c2");
        this.c2.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onC2Changed, this)
        this.topPanel = <HomeTopPanel>this.getGObject("topPanel");
        this.topPanel.setCheckPointClickFun(this.onOpenCheckExpRate, this);
        let iconContainer: fairygui.GComponent = this.getGObject("icon_topContainer").asCom;
        this.topIconBar = new HomeTopIconBar();
        iconContainer.addChild(this.topIconBar);
        this.topIconBar.scaleX = this.topIconBar.scaleY = 0.8;

        iconContainer = this.getGObject("icon_leftContainer").asCom;
        this.leftIconBar = new HomeLeftIconBar();
        iconContainer.addChild(this.leftIconBar);
        this.leftIconBar.scaleX = this.leftIconBar.scaleY = 0.9;

        iconContainer = this.getGObject("icon_left2Container").asCom;
        this.left2IconBar = new HomeLeft2IconBar();
        iconContainer.addChild(this.left2IconBar);

        iconContainer = this.getGObject("icon_rightContainer").asCom;
        this.rightIconBar = new HomeRightIconBar();
        iconContainer.addChild(this.rightIconBar);

        this.bottomIconBar = this.getGObject("icon_bottomContainer") as HomeBottomIconBar;

        this.bossComingContainer = this.getGObject("bossComing_icon").asCom;
        this.bossComingIcon = this.bossComingContainer.getChild("bossComing_icon") as BossComingIcon;

        this.guide_container = this.getGObject("guide_container").asCom;
        this.btn_topSwitch = this.getGObject("btn_topSwitch").asButton;
        this.btn_rightSwitch = this.getGObject("btn_rightSwitch").asButton;
        this.btn_topSwitch.addClickListener(this.onSwitchTopIconHandler, this);
        this.btn_rightSwitch.addClickListener(this.onSwitchTopRightIconHandler, this);

        this.actRankContainer = this.getGObject("activityRank_container").asCom;
        //this.monthCardExpCom.visible = false;
        this.updateMonthCardExp();
        //GM
        this.btn_gm = this.getGObject("btn_gm").asButton;
        this.btn_gm.addClickListener(this.gmClickHandler, this);
        this.btn_switchUI = this.getGObject("btn_switchUI").asButton;
        this.btn_switchUI.addClickListener(this.switchClickHandler, this);

        //根据开发调试，屏蔽按钮
        this.btn_gm.visible = App.GlobalData.IsDebug;
        this.btn_switchUI.visible = App.GlobalData.IsDebug;

        this.tpBtn = this.getGObject("btn_tp").asButton;
        this.tpBtn.addClickListener(this.onClickModuleIco, this);

        // this.battlePanel = <BattlePanel>this.getGObject("battlePanel");
        // if (!App.DebugUtils.isDebug) {
        //     this.battlePanel.removeFromParent();
        // }

        //组队
        // this.teamIconBar = this.getGObject("team_iconBar") as TeamIconBar;

        //关卡进度
        this.pointProgressView = new CheckPointProgressView(this.getGObject("btn_checkPoint").asCom);
        this.pointExpUpView = new CheckPointUpView(this.getGObject("checkPoint_rate").asCom);

        //开服活动列表
        this.activePanel = new OpenServerActiveListPanel(this.getGObject("OpenServerActiveList").asCom);

        this.taskTracePanel = <TaskTracePanel>this.getGObject("TaskTracePanel");
        GuideTargetManager.reg(GuideTargetName.TaskTracePanel, this.taskTracePanel);

        this.friendIcon = this.getGObject("friendIcon") as HomeFriendIcon;
        this.taskTracePanel.friendIcon = this.friendIcon;

        this.mapBtn = this.getGObject("btn_map") as HomeMapIcon;
        this.shieldBtn = this.getGObject("btn_shield").asButton;
        this.modeBtn = this.getGObject("btn_mode").asButton;
        this.mapBtn.addClickListener(this.onClickModuleIco, this);
        this.shieldBtn.addClickListener(this.onClickModuleIco, this);
        this.modeBtn.addClickListener(this.onClickModuleIco, this);
    }

    protected addListenerOnShow(): void {
        super.addListenerOnShow();
        this.addListen1(NetEventEnum.BossComingInfoUpdate, this.updateBossComing, this);
        this.addListen1(NetEventEnum.BossInfUpdate, this.updateGameBossInfo, this);
        this.addListen1(UIEventEnum.HomeTopIconShowChange, this.onSwitchTopIconHandler, this);
    }

    public onShow(): void {
        super.onShow();

        //移除php页面的div
        Sdk.SdkToShowGame();
    }

    public updateAll(): void {
        this.topPanel.updateAll();
        this.updateChatVisible(true);
        this.updateChanelList();
        this.updatePointView();
        this.showGuidePanel();
        this.checkBossComing();
        // this.updateLoginRewardIcon();
        this.bossComingIcon.updateAll();
        this.updateExamIconBar();
        this.updateTpButton();
        this.updateFightMode();
        this.updateShieldButton();
        this.updateActRankIcon();
        this.updateFriendIcon();
    }

    public openGM(isOpen: boolean): void {
        this.getGObject("btn_gm").visible = isOpen;
        this.getGObject("btn_switchUI").visible = isOpen;
    }

    public switchUI(index: number): void {
        if(CacheManager.role.getRoleLevel() >= 30) {
            //30级后进关卡boss缩进顶部图标
            let isShow:boolean = index != 2;
            this.topIconBar.goTween(isShow);
            this.leftIconBar.goTween(isShow);
            this.rightIconBar.goTween(isShow);
            this.bossComingIcon.goTween(isShow);
            //充值榜
            this.actRankContainerGoTween(isShow);
            this.btn_topSwitch.selected = this.topIconBar.isShow;
            this.btn_rightSwitch.selected = !this.topIconBar.isShow;
        }
        this.c2.setSelectedIndex(index);
    }

    public addIcon(iconId: number): void {
        let iconBar: BaseIconContainer = this.getIconContainer(iconId);
        if (iconBar) {
            iconBar.addIcon(iconId);
        }
    }

    public removeIcon(iconId: number): void {
        let iconBar: BaseIconContainer = this.getIconContainer(iconId);
        iconBar.removeIcon(iconId);
    }

    public showIconImgTip(iconId: number): void {
        let iconBar: BaseIconContainer = this.getIconContainer(iconId);
        iconBar.showIconImgTip(iconId);
    }

    public hideIconImgTip(iconId: number): void {
        let iconBar: BaseIconContainer = this.getIconContainer(iconId);
        iconBar.hideIconImgTip(iconId);
    }


    public isImgTipShow(iconId: number) : boolean {
		let iconBar: BaseIconContainer = this.getIconContainer(iconId);
		return iconBar.isImgTipShow(iconId);
	}
    
    public checkHasHide(iconId: number) : boolean{
		let iconBar: BaseIconContainer = this.getIconContainer(iconId);
		return iconBar.checkHasHide(iconId);
	}
    

    /**添加底部图标 */
    public addBottomIcon(icon: fairygui.GComponent): void {
        this.bottomIconBar.addIcon(icon);
    }

    /**移除底部图标 */
    public removeBottomIcon(icon: fairygui.GComponent): void {
        this.bottomIconBar.removeIcon(icon);
    }

    /**更新头像 */
    public updateAvatar(avatar: string = ""): void {
        this.topPanel.updateAvatar();
    }

    /**更新头像 */
    public updateAvatarBtnTips(isShow: boolean): void {
        this.topPanel.updateAvatarBtnTips(isShow);
    }

    /**更新等级 */
    public updateLevel(value: number = -1): void {
        this.topPanel.updateLevel();
        this.checkBossComing();
        this.updateTpButton();
    }

    /**更新战力 */
    public updateFight(value: number = -1): void {
        this.topPanel.updateFight();
    }

    /**更新金钱 */
    public updateMoney(): void {
        if (!this.topPanel) {
            return;
        }
        this.topPanel.updateMoney();
    }

    /**更新VIP */
    public updateVip(): void {
        this.topPanel.updateVip();
    }

    /**更新VIP */
    public updateVipGiftTips(): void {
        this.topPanel.updateVipGiftTips();
    }

    /**显示聊天缩略框(只执行一次) */
    public showChatPanel(): void {
        if (!this.chatPanel) {
            this.chatPanel = new HomeChatPanel(this.chatCnt);
        }
        this.chatPanel.show();
    }

    /**
     * 显示主界面模型指引面板
     * @param
     */
    public showGuidePanel(): void {
        if(GuideOpenUtils.isNotShowGuide()){
            this.hideGuidePanel();
            return;
        }
        let data: any = ConfigManager.mgOpen.getCurOpenGuideData();//GuideOpenUtils.getGuideData();
        if (data) {
            if(this.guidePanel && this.guidePanel.isShow){
                if(this.guidePanel.checkCurOk() && this.guidePanel.isCurShowAct()){ //当前已经开启
                    //执行打开激活界面
                    let cfg:any = ConfigManager.mgOpen.getByPk(this.guidePanel.curData.openId);
                    HomeUtil.open(ModuleEnum.Open,false,cfg);
                }
            }
            if (!this.guidePanel) {
                this.guidePanel = new OpenGuidePanel(this.guide_container);
            }
            this.guidePanel.show(data);
        }else{
            this.hideGuidePanel();
        }
    }

    

    /**隐藏引导台 */
    public hideGuidePanel(): void {
        if (this.guidePanel) {
            this.guidePanel.hide();
        }
    }

    /**
     * boss来袭杀怪进度更新
     */
    public updateBossComing(data: any): void {
        if (this.bossComingIcon.visible) {
            this.bossComingIcon.updateBossComing(data);
        }
    }

    private updateGameBossInfo(data: any): void {
        if (this.bossComingIcon.visible) {
            this.bossComingIcon.updateGameBossInfo(data);
        }
    }

    /**更新冲榜排名图标 */
    public updateActRankIcon(): void{
        if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.ActivityOpenServer)){
            let data: ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen);
            if(data && data.leftShowTime > 0){
                if (!this.activityRankIcon) {
                    this.activityRankIcon = new ActivityRankIcon(this.actRankContainer);
                }
                this.activityRankIcon.show(data);
            }else{
                if (this.activityRankIcon) {
                    this.activityRankIcon.hide();
                }
            }
        }
    }

    public updateFriendIcon(): void {
        if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Friend, false) || CacheManager.friend.isShowMail){
            this.friendIcon.visible = true;
            this.friendIcon.updateStatus();
        }else{
            this.friendIcon.visible = false;
        }
    }

    /**
     * 更新登录奖励图标
     */
    // public updateLoginRewardIcon(): void {
    //     this.topIconBar.updateLoginRewardIcon();
    // }

    public updateExamIconBar(): void {
        let isShow: boolean = CacheManager.exam.showIcon;
        if (isShow && ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Question, false)) {
            if (this.examIconBar == null) {
                this.examIconBar = FuiUtil.createComponent(PackNameEnum.Home, "ExamIconBar") as ExamIconBar;
            }
            this.addBottomIcon(this.examIconBar);
            this.examIconBar.updateAll();
        } else if (this.examIconBar && this.examIconBar.parent) {
            this.removeBottomIcon(this.examIconBar);
        }
    }

    /**
     * 更新回城按钮
     */
    public updateTpButton(): void {
        this.tpBtn.getController("c1").selectedIndex = CacheManager.map.isInMainCity ? 1 : 0;
        this.c2.selectedIndex = CacheManager.map.isInMainCity ? 4 : this.c2.selectedIndex;
        if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.MainCity, false)) {
            this.tpBtn.visible = CacheManager.map.isInMainCity || !CacheManager.copy.isInCopy;
        } else {
            this.tpBtn.visible = false;
        }
    }

    /**
     * 更新战斗模式
     */
    public updateFightMode(): void {
        if (this.roleCache.entityInfo && this.roleCache.entityInfo.fightModel_BY == EEntityFightMode.EEntityFightModePeace) {
            this.modeBtn.selected = false;
        } else {
            this.modeBtn.selected = true;
        }
    }

    /**
     * 更新屏蔽
     */
    public updateShieldButton(): void {
        this.shieldBtn.selected = CacheManager.sysSet.getValue(LocalEventEnum.HideOther);
    }

    /**
     * boss来袭功能开启检测
     */
    private checkBossComing(): void {
        let isOpen:boolean = ConfigManager.mgOpen.isOpenedByKey(ModuleEnum[ModuleEnum.BossComing], false);
        if(isOpen) {
            if(!this.bossComingIcon.visible) {
                this.bossComingIcon.visible = true;
                this.bossComingIcon.updateAll();
            }
        }
        else {
            this.bossComingIcon.visible = false;
        }
    }

    private showVipBubble(isShow: boolean, leftTime: number): void {
        if (isShow) {
            if (!this.vipBubble) {
                this.vipBubble = fairygui.UIPackage.createObject(PackNameEnum.Home, "VipBubble") as VipBubble;
                this.vipBubble.y = 155;
            }
            if (this.vipBubble.parent == null)
                this.addChild(this.vipBubble);
            this.vipBubble.update(leftTime);
            App.TimerManager.doTimer(1000, 0, this.countVip, this);
        }
        else {
            this.removeVipBubble();
        }
    }

    private countVip(): void {
        if (this.vipBubble) {
            let leftTime: number = this.vipBubble.countdown();
            if (leftTime < 0)
                this.removeVipBubble();
        }
    }

    private removeVipBubble(): void {
        App.TimerManager.remove(this.countVip, this);
        if (this.vipBubble && this.vipBubble.parent)
            this.vipBubble.parent.removeChild(this.vipBubble);
    }

    public updateStrongerBtn(value: boolean): void {
    }

    public updateChatVisible(visible: boolean): void {
        if (this.chatPanel && this.chatPanel.isShow) {
            this.chatPanel.visible = visible;
        }
    }

    public updateChanelList(): void {
        if (this.chatPanel && this.chatPanel.isShow) {
            this.chatPanel.updateAll();
        }
    }

    /**更新右下角关卡视图 */
    public updatePointView(): void {
        this.pointProgressView.updateAll();
    }

    /**更新关卡效率 */
    public updateCheckPointExpRate(): void {
        this.pointExpUpView.updateRate();
        this.topPanel.updateCheckPointExpRate();
    }

    private onC2Changed(e: fairygui.StateChangeEvent): void {
        EventManager.dispatch(UIEventEnum.HomeBattlePanelShow, this.c2.selectedIndex == 1);
    }

    /**查看关卡效率 */
    private onOpenCheckExpRate(): void {
        this.pointExpUpView.updateRate(true);
    }

    /**更新关卡杀怪数量 */
    public updateCheckPointKills(): void {
        this.pointProgressView.updateProgress();
    }

    public autoCopyStateChange(): void {
        this.pointProgressView.updateAutoCopyState();
    }

    /**更新获得新技能 */
    public updateNewGetSkill(skillData: SkillData): void {
        if (skillData.useType == ESkillUseType.ESkillUseTypeInitiative && !ConfigManager.skill.isFirstCareerSkill(skillData))
            SkillOpenItem.showItem(skillData, this.taskTracePanel.width, this.taskTracePanel.x, this.taskTracePanel.y, this.displayListContainer);
    }

    /**
     * 一个通用的获得某类物品、碎片的动画提示
     */
    public showReceiveIcoEffect(url: string, name: string): void {
        ReceiveIcoEffect.inst.show({
            url: url,
            name: name,
            width: this.taskTracePanel.width,
            x: this.taskTracePanel.x,
            y: this.taskTracePanel.y
        });
    }

    public showRecevieItemTips(item: ItemData): void {
        ReceiveItemTips.inst.show({
            item: item,
            width: this.taskTracePanel.width,
            x: this.taskTracePanel.x,
            y: this.taskTracePanel.y
        })
    }

    public showRecieveNormalItemTips(item: ItemData): void {
        ReceiveNormalItemTips.inst.show({
            item: item,
            width: this.taskTracePanel.width,
            x: this.taskTracePanel.x,
            y: this.taskTracePanel.y
        })
    }

    /**
     * 获取模块按钮
     * @param key ModuleEnum定义的模块 或者 实例名
     */
    public getModuleBtn(key: any, isName: boolean = false): fairygui.GComponent {
        let moduleBtn: fairygui.GComponent;
        if (isName) {
            moduleBtn = this[key];
            return moduleBtn;
        }
        let iconId: number = -1;
        switch (key) {
            case ModuleEnum.CopyHall:
                iconId = IconResId.CopyHall;
                // moduleBtn = this.btn_copy;
                break;
            case ModuleEnum.Achievement:
                iconId = IconResId.Achievement;
                // moduleBtn = this.achievement;
                break;
            case ModuleEnum.Guild:
                break;
            case ModuleEnum.Welfare:
                iconId = IconResId.Welfare;
                // moduleBtn = this.welfareBtn;
                break;
            case ModuleEnum.Boss:
                iconId = IconResId.Boss;
                // moduleBtn = this.btn_boss;
                break;
            case ModuleEnum.CheckPoint:
                if (this.pointProgressView && this.pointProgressView.viewCom) {
                    moduleBtn = this.pointProgressView.viewCom as fairygui.GButton;
                }
                break;
            case ModuleEnum.Arena:
                iconId = IconResId.Arena;
                // moduleBtn = this.btn_arena;
                break;
            case ModuleEnum.Shop:
                iconId = IconResId.Shop;
                break;
            case ModuleEnum.Lottery:
                iconId = IconResId.Lottery;
                break;
            case ModuleEnum.RechargeFirst:
                iconId = IconResId.RechargeFirst;
                break;
            case ModuleEnum.TimeLimitTask:
                iconId = IconResId.TimeLimitTask;
                break;
        }
        if (iconId != -1) {
            moduleBtn = this.getHomeIcon(iconId) as fairygui.GComponent;
        }
        return moduleBtn;
    }


    /**点击头像 */
    private avatarClickHandler(): void {
        EventManager.dispatch(UIEventEnum.SyssetWindowOpen);
    }

    // private clickCoin(): void {
    //     EventManager.dispatch(UIEventEnum.QuickShopBuyOpen, ItemCodeConst.CoinOfShop);
    // }

    // private clickGold(): void {
    //     HomeUtil.openRecharge(ViewIndex.One);
    // }

    private sdkTestPayCB(result: any): void {
        console.log("sdk测试充值:callback:", result);
        let resultStr = "sdk测试充值, code:" + result.code + ", message:" + result.message;
        AlertII.show(resultStr, null, function () {
        }, this, [AlertType.YES]);
    }

    /**点击buff */
    // private buffClickHandler(): void {
    //     let buffs = CacheManager.buff.getShowBuffs();
    //     if (buffs.length > 0) {
    //         if (this.buffPanel == null) {
    //             this.buffPanel = new BuffPanel();
    //         }
    //         this.buffPanel.updateBuff(buffs);
    //         this.buffPanel.toogle();
    //     }
    //     else {
    //         Tip.showTip("您身上没有buff");
    //     }
    // }

    /**点击pk模式 */
    private fightClickHandler(): void {
        if (this.fightModePanel == null) {
            this.fightModePanel = new FightModePanel();
        }
        this.fightModePanel.show();
    }

    /**改变pk模式 */
    public changeFightMode(): void {
        let mode: number = CacheManager.role.player.mode_I;
        // this.fightBtn.fightMode = mode;
        // let tip: string = App.StringUtils.substitude(LangHome.LANG_2, LangHome["LANG_" + (3 + mode)]);
        // Tip.showTip(tip);//屏蔽战斗模式
    }

    /**GM测试 */
    private gmClickHandler(): void {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Test);
    }

    private switchClickHandler(): void {
        EventManager.dispatch(UIEventEnum.SwitchUI);
    }

    /** 主界面还没拆分战斗面板，先这样测试 */
    private onNormalAttack(): void {
        // Log.trace("点击了普攻.......");
        //ControllerManager.rpgGame.mainPlayerAttack(0);
    }

    private loaderMapClick(): void {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.WorldMap);
    }

    /**点击图标模块图标可以在这里处理 */
    private onClickModuleIco(e: TouchEvent): void {
        var btn: any = e.target;
        var roleLv: number = CacheManager.role.role.level_I;
        switch (btn) {
            case this.tpBtn:
                if (CacheManager.map.isInMainCity) {
                    Alert.alert(LangHome.L7, () => {
                        EventManager.dispatch(LocalEventEnum.ConveyToCheckpoint);
                    });
                } else {
                    EventManager.dispatch(LocalEventEnum.ConveyToMainCity);
                }
                break;
            case this.mapBtn:
                EventManager.dispatch(UIEventEnum.WorldMapShowRegionMap, MapUtil.MainCityMapId);
                break;
            case this.shieldBtn:
                let isHideOther: boolean = this.shieldBtn.selected;
                CacheManager.sysSet.setValue(LocalEventEnum.HideOther, isHideOther);
                break;
            case this.modeBtn:
                let mode: EEntityFightMode = EEntityFightMode.EEntityFightModeFight;
                if (this.modeBtn.selected) {
                    mode = EEntityFightMode.EEntityFightModePeace;
                }
                EventManager.dispatch(LocalEventEnum.SetFightMode, mode);
                break;
        }
    }



    /**切换顶部图标显示状态 */
    private onSwitchTopIconHandler(): void {
        this.isAllIconShow = !this.isAllIconShow;
        this.topIconBar.goTween(this.isAllIconShow);
        this.leftIconBar.goTween(this.isAllIconShow);
        this.rightIconBar.goTween(this.isAllIconShow);
        this.bossComingIcon.goTween(this.isAllIconShow);
        if (this.guidePanel) {
            this.guidePanel.goTween(this.isAllIconShow);
        }
        //充值榜
        this.actRankContainerGoTween(this.isAllIconShow);

        this.btn_topSwitch.selected = this.isAllIconShow;
        this.btn_rightSwitch.selected = !this.topIconBar.isShow;
    }

    /**切换右上图标显示 */
    private onSwitchTopRightIconHandler(): void {
        this.topIconBar.goTween(!this.topIconBar.isShow);
        this.btn_rightSwitch.selected = !this.topIconBar.isShow;
    }

    private actRankContainerGoTween(isShow: boolean): void {
        if(this.actRankIsShow == isShow) return;
        this.actRankIsShow = isShow;
		let posX: number;
		if (isShow) {
			posX = fairygui.GRoot.inst.width - 115;
		} 
		else {
			posX = fairygui.GRoot.inst.width + 115;
		}
		egret.Tween.removeTweens(this.actRankContainer);
		egret.Tween.get(this.actRankContainer).to({ x: posX }, 400, egret.Ease.backInOut);
    }

    public getHomeIcon(iconId: number): BaseIcon {
        let iconBar: BaseIconContainer = this.getIconContainer(iconId);
        if (!iconBar) return;
        return iconBar.getHomeIcon(iconId);
    }

    private getIconContainer(iconId: number): BaseIconContainer {
        let iconBar: BaseIconContainer;
        if (HomeUtil.isTopIcon(iconId)) {
            iconBar = this.topIconBar;
        }
        else if (HomeUtil.isLeftIcon(iconId)) {
            iconBar = this.leftIconBar;
        }
        else if (HomeUtil.isLeft2Icon(iconId)) {
            iconBar = this.left2IconBar;
        }
        else if (HomeUtil.isRightIcon(iconId)) {
            iconBar = this.rightIconBar;
        }
        return iconBar;
    }

    public checkPointShow(): void {
        this.topPanel.checkPointShow();
    }

    public guideCheckPoint(guideStepInfo: GuideStepInfo): void {
        this.pointProgressView.showGuide(guideStepInfo);
    }

    public updateName(): void {
        this.topPanel.updateName();
    }

    public showGm(isShow:boolean):void {
        this.btn_gm.visible = isShow && App.GlobalData.IsDebug;
        this.btn_switchUI.visible = isShow && App.GlobalData.IsDebug;
    }

    public clear(): void {
        this.topIconBar.removeAll();
        this.leftIconBar.removeAll();
        this.rightIconBar.removeAll();
    }

    public updateMonthCardExp() {
        this.topPanel.updateMonthCardExp();
    }
}