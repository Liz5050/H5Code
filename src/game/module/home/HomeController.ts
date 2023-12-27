class HomeController extends BaseController {
    private static btnGlobalPt: egret.Point = new egret.Point();
    public module: HomeModule;
    public navbar: Navbar;
    private teamIconBar: TeamIconBar;
    private strongerWindow: StrongerWindow;
    private welcomeWindow: WelcomeWindow;
    private battlePanel: BattlePanel;
    /**
     * 如果一登录就在副本 缓存c2控制器的下标
     * 等Home模块show后可以把c2设置为该下标,设完重置 c2IdxCahe=-1 看show函数
     */
    private c2IdxCahe: number = -1;

    //private autoView: AutoFightView;
    private toolTipData: ToolTipData;

    /**动态创建的图标管理 */
    private iconController: HomeIconController;

    /**延时显示增加的战力 */
    private delayAddCombat: number = 0;
    public constructor() {
        super(ModuleEnum.Home);

        this.viewIndex = ViewIndex.Zero;
    }

    public initView(): BaseGUIView {
        this.module = new HomeModule(this.moduleId);
        // this.navbar = new Navbar();
        this.iconController = new HomeIconController(this.module);
        return this.module;
    }

    public hide(): void {
        super.hide();
        if (this.iconController) this.iconController.hide();
    }

    protected afterModuleShow(): void {
        //培养框无controller，直接open
        this.navbar.show();
        //显示聊天缩略图
        this.module.showChatPanel();

        // EventManager.dispatch(UIEventEnum.TaskTraceOpen, true);
        // EventManager.dispatch(LocalEventEnum.PackCheckSpiritExpire);
        // EventManager.dispatch(LocalEventEnum.GetSevenDayMagicWeapon);
        if (this.c2IdxCahe > -1) {
            this.switchUIByCopy(this.c2IdxCahe);
            this.c2IdxCahe = -1;
        }
        this.checkBtnTips();
        ResourceManager.load(PackNameEnum.Sound);
        //2秒后再显示图标
        App.TimerManager.doDelay(2000, this.showHomeIcon, this);
        //Home打开后立即显示广播，因为第一个任务就有广播
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MsgBroadcast);

        // 提醒点击自动闯关
        // if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.StartCheckAutoCheckpoint, false) && !ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.EndCheckAutoCheckpoint, false)) {
        //     //80为自动闯关指引配置id，复用
        //     this.guideCheckPoint(ConfigManager.guide.getGuideStepInfo(80));
        //     // EventManager.dispatch(UIEventEnum.GuideShow, false);
        // }

        EventManager.dispatch(UIEventEnum.TaskTraceOpen, true);
        // EventManager.dispatch(LocalEventEnum.PackCheckSpiritExpire);
        EventManager.dispatch(LocalEventEnum.GetSevenDayMagicWeapon);
        this.monthCardUpdate();
    }

    /**
     * home打开后需要重新检查红点的
     */
    private checkBtnTips(): void {
        this.onCheckPlayerTips(); //人物
        // this.homeSetTrainRedTip(CacheManager.train.checkTips());//设置日常红点
        this.onCheckShapeTips();
        this.onCheckSkillTips();
        this.checkPackTip();
        this.guideSetWin();
    }

    /**
     * 显示主界面图标
     */
    private showHomeIcon(): void {
        ResourceManager.load(PackNameEnum.HomeIcon, -1, new CallBack(() => {
            this.iconController.addListenerOnShow();
        }, this));
    }

    public addListenerOnInit(): void {
        this.addListen0(UIEventEnum.ModuleOpened, this.viewOpenedHandler, this);
        this.addListen0(UIEventEnum.ModuleClosed, this.viewCloseddHandler, this);
        this.addListen0(LocalEventEnum.CopySwitchHomeStatu, this.switchUIByCopy, this);
        this.addListen0(LocalEventEnum.AIAutoPath, this.onAutoPath, this);
        this.addListen0(NetEventEnum.packBackPackItemsChange, this.onPosTypeBagChange, this);
        this.addListen0(NetEventEnum.packPosTypeBagChange, this.onPosTypeBagChange, this);
        this.addListen0(NetEventEnum.packPosTypePropChange, this.onPosTypeBagChange, this);
        this.addListen0(NetEventEnum.packPosTypeRuneChange, this.onPosTypeBagChange, this);
        // this.addListen0(LocalEventEnum.ShapeListUpdate, this.onCheckPlayerTips, this);
        // this.addListen0(LocalEventEnum.ShapeUpdate, this.onCheckPlayerTips, this);
        // this.addListen0(LocalEventEnum.ActivationShow, this.onShowActivation, this);
        // this.addListen0(NetEventEnum.copyEnterCheckPoint, this.onEnterCheckPointCopy, this);
        this.addListen0(NetEventEnum.copyLeftCheckPoint, this.onLeftCheckPointCopy, this);
        this.addListen0(NetEventEnum.copyInfUpdate, this.onCopyInfoUpdate, this);
        this.addListen0(NetEventEnum.copyEnter, this.onEnterCopy, this);
        this.addListen0(NetEventEnum.copyLeft, this.onLeftCopy, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateBuffer], this.updateBuff, this);//主角buff更新
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateWorldLevel], this.onWorldLevel, this);//世界等级
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameClientShowStateInfo], this.updateShowStateInfo,this);//更新显示状态
        this.addListen0(LocalEventEnum.CopyShowExpEffect, this.onShowGetExpEffect, this);
        this.addListen0(UIEventEnum.WelcomeOpen, this.welcomeOpen, this);
        this.addListen0(UIEventEnum.HomeBattlePanelShow, this.showBattlePanel, this);
        this.addListen0(NetEventEnum.roleSkillListUpdated, this.updateBattleSkill, this);
        this.addListen0(UIEventEnum.NavbarOpen, this.navbarOpen, this);
        this.addListen0(UIEventEnum.Team2IconBar, this.onCheckTeamIconBar, this);
        this.addListen0(UIEventEnum.Team2IconBarCount, this.onTeamIconBarCount, this);
        this.addListen0(LocalEventEnum.TeamCrossInfoUpdate, this.onTeamCrossInfoUpdate, this);
        this.addListen0(LocalEventEnum.ReloginCloseGameView, this.onReloginHandler, this);
        this.addListen0(LocalEventEnum.SetFightMode, this.setFightMode, this);
        this.addListen0(LocalEventEnum.CopyTowerDie, this.onPlayerDieInTower,this);
        this.addListen0(UIEventEnum.HomeSwitchMount, this.onMountSwitch, this);
        this.addListen0(UIEventEnum.ShowGM,this.onShowGmBtn,this);
    }

    public addListenerOnShow(): void {
        // this.iconController.addListenerOnShow();
        this.addListen1(LocalEventEnum.GMOpen, this.openGM, this);
        this.addListen1(NetEventEnum.roleLevelUpdate, this.onRoleLevelUpdate, this);
        this.addListen1(LocalEventEnum.TaskRemoved, this.onTaskRemoved, this);
        this.addListen1(LocalEventEnum.PlayerCopyCheckPoint, this.onCheckPointUpdate, this);
        this.addListen1(LocalEventEnum.TrainNewGodWeaponActive, this.onGodWeaponAct, this);
        this.addListen1(NetEventEnum.roleStateChanged, this.onRoleStateUpdate, this);
        this.addListen1(NetEventEnum.roleLifeUpdate, this.onRoleLifeUpdate, this);
        this.addListen1(NetEventEnum.entityInfoMyselfUpdate, this.onRoleLifeUpdate, this);
        this.addListen1(NetEventEnum.roleMaxLifeUpdate, this.onRoleLifeUpdate, this);
        this.addListen1(NetEventEnum.roleExpUpdate, this.roleExpUpdate, this);
        this.addListen1(NetEventEnum.roleCombatCapabilitiesUpdate, this.roleCombatCapabilitiesUpdate, this);
        this.addListen1(NetEventEnum.roleCombatCapabilitiesAdd, this.roleCombatCapabilitiesAdd, this);
        //金钱更新
        this.addListen1(NetEventEnum.moneyCoinBindUpdate, this.moneyUpdate, this);
        this.addListen1(NetEventEnum.moneyGoldUpdate, this.moneyUpdate, this);
        this.addListen1(NetEventEnum.moneyGoldBindUpdate, this.moneyUpdate, this);
        this.addListen1(NetEventEnum.moneyHonourUpdate, this.moneyUpdate, this);
        this.addListen1(NetEventEnum.ChatHomeMsgUpdate, this.onChatUpdate, this);

        this.addListen1(NetEventEnum.PlayerStrengthenExLoginInfo, this.onCheckForgeTips, this);//强化更新
        this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onCheckForgeTips, this);//强化更新

        this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePlayerRuneNew], this.onCheckRuneTips, this);//符文登录推送，镶嵌升级返回
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGamePlayerPopMultiRoles], this.showMultiRoleTips, this );
        this.addListen1(NetEventEnum.packPosTypeRuneChange, this.onCheckRuneTips, this);//符文背包变动过
        this.addListen1(NetEventEnum.moneyRuneCoin, this.onCheckRuneTips, this);//更新符文碎片
        this.addListen1(NetEventEnum.moneyRuneExp, this.onCheckRuneTips, this);//更新符文经验

        this.addListen1(NetEventEnum.SevenDayMagicWeaponUpdate, this.onMagicWeaponUpdate, this);//法宝信息更新
        this.addListen1(NetEventEnum.OnlineDaysUpdate, this.onMagicWeaponUpdate, this);//在线天数更新
        this.addListen1(LocalEventEnum.VipUpdate, this.onMagicWeaponUpdate, this);//vip更新
        this.addListen1(LocalEventEnum.MonthCardInfoUpdate, this.monthCardUpdate, this);

        // this.addMsgListener(EGateCommand[EGateCommand.ECmdGatePlayerLevelWhen3State], this.onCheckSkillTips, this);//完成三转推送

        /**队伍匹配状态改变 */
        this.addListen1(NetEventEnum.TeamMatchChange, this.onTeamMatchChange, this);
        /**队伍队员信息更新 */
        this.addListen1(NetEventEnum.TeamMemberUpdate, this.onTeamMemberUpdate, this);
        /**队伍信息更新 */
        this.addListen1(NetEventEnum.TeamInfoUpdate, this.onTeamInfoUpdate, this);
        /**新增申请者 */
        this.addListen1(LocalEventEnum.TeamTipsIconUpdate, this.onUpdateTeamTipsIcon, this);

        this.addListen1(UIEventEnum.SceneMapUpdated, this.sceneMapUpdated, this);
        // this.addListen1(UIEventEnum.SceneRolePosUpdated, this.sceneRolePosUpdated, this);
        // this.addListen1(LocalEventEnum.AutoFightChange, this.autoFightChange, this);
        this.addListen1(LocalEventEnum.ChatHomePanelVisible, this.onSetChatPanel, this);
        // this.addListen0(LocalEventEnum.SKillPosUpdated, this.updateBattleSkill, this);
        this.addListen1(NetEventEnum.roleFightModel, this.onFightModeChange, this);
        this.addListen1(NetEventEnum.roleCareerChanged, this.onRoleStateLvChange, this);
        this.addListen1(NetEventEnum.CheckPointKillsUpdate, this.onCheckPointKillsUpdate, this);
        this.addListen1(LocalEventEnum.AutoCopyStateChange, this.onAutoCopyStateChange, this);

        this.addListen1(UIEventEnum.HomeStrongerOpen, this.strongerOpen, this);
        this.addListen1(LocalEventEnum.VipUpdate, this.updateVip, this);
        this.addListen1(LocalEventEnum.VipRewardUpdate, this.updateVip, this);
        this.addListen1(LocalEventEnum.VipGiftTips, this.updateVipGiftTips, this);
        this.addListen1(LocalEventEnum.HomeSetBtnTip, this.onSetBtnTip, this);
        this.addListen1(LocalEventEnum.TaskOpenEndUpdated, this.onTaskOpenEndUpdated, this);

        this.addListen1(LocalEventEnum.HomeShowReceiveIcoEff, this.onShowReceiveEff, this);
        this.addListen1(LocalEventEnum.HomeShowReceiveItemTips, this.onShowReceiveItemTips, this);
        this.addListen1(LocalEventEnum.HomeShowReceiveNormalItemTips, this.onShowReceieveNormalItemTips, this);
        this.addListen1(LocalEventEnum.GuidePanelShow, this.onGuidePanelShow, this);
        this.addListen1(LocalEventEnum.GuidePanelHide, this.onGuidePanelHide, this);

        // this.addListen1(UIEventEnum.HomePlayFightAdd, this.showFightAddEffect, this);
        this.addListen1(UIEventEnum.ToolTipShowItem, this.showItemToolTip, this);
        this.addListen1(UIEventEnum.ToolTipShow, this.showToolTip, this);
        this.addListen1(NetEventEnum.roleSkillAdded, this.onAddRoleSkill, this);
        this.addListen1(NetEventEnum.moneyRoleStateExp, this.onRoleStateExpUpdate, this);
        this.addListen1(NetEventEnum.KillDecomposeSuccess, this.onUpdateKill, this);//必杀碎片分解成功
        this.addListen1(NetEventEnum.moneyKillFragmentJunior, this.onUpdateKill, this);//低级必杀精华更新
        this.addListen1(NetEventEnum.moneyKillFragmentSenior, this.onUpdateKill, this);//高级必杀精华更新

        // this.addListen1(NetEventEnum.moneyCoinBindUpdate, this.onCheckCanUp, this);
        this.addListen1(NetEventEnum.roleStateChanged, this.onCheckSkillTips, this);
        this.addListen1(NetEventEnum.roleSkillListUpdated, this.onCheckSkillTips, this);
        this.addListen1(LocalEventEnum.TaskComplete, this.onCheckSkillTips, this);
        this.addListen0(LocalEventEnum.ShapeActivate, this.onCheckSkillTips, this);//外形激活
        this.addListen1(NetEventEnum.SkillXpCooldown, this.onSkillXpCooldown, this);
        this.addListen1(LocalEventEnum.CheckPointInfoShow, this.updateCheckPointIsShow, this);
        this.addListen1(LocalEventEnum.HomeAfterClickReturn, this.homeAfterClickReturn, this);
        this.addListen1(LocalEventEnum.GuideHeji, this.guideHeji, this);
        this.addListen1(LocalEventEnum.GuideHejiHide, this.guideHejiHide, this);
        this.addListen1(LocalEventEnum.GuideCheckPoint, this.guideCheckPoint, this);

        this.addListen1(UIEventEnum.SwitchUI, this.switchUI, this);
        this.addListen1(NetEventEnum.packPosTypeBagCapacityChange, this.checkPackTip, this);//背包容量更新
        this.addListen1(NetEventEnum.roleNameChanged, this.onRoleNameChanged, this);//角色名称更新
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateVIPInfo], this.checkPackTip, this);

        // this.addListen1(LocalEventEnum.HomeSetTrainRedTip, this.homeSetTrainRedTip, this);
        //强化相关
        this.addListen1(NetEventEnum.PlayerStrengthenExLoginInfo, this.onPlayerStrengthenExLoginInfo, this);
        this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenExUpgraded, this);
        this.addListen1(NetEventEnum.PlayerStrengthenExUpdated, this.onPlayerStrengthenExUpdated, this);
        this.addListen1(NetEventEnum.PlayerStrengthenExActived, this.onPlayerStrengthenExActived, this);

        // this.addListen1(LocalEventEnum.HomeLoginRewardUpdate, this.updateLoginRewardIcon, this);
        this.addListen1(UIEventEnum.ExamIconBar, this.onCheckExamIconBar, this);
        this.addListen1(NetEventEnum.FightModeUpdated, this.onFightModeUpdated, this);
        this.addListen1(UIEventEnum.ExamIconBar, this.onCheckExamIconBar, this);
        this.addListen1(UIEventEnum.ExamIconBar, this.onCheckExamIconBar, this);

        //---------冲榜排名图标----------
        this.addListen1(LocalEventEnum.GameCrossDay, this.onUpdateActivityRankIcon, this);//服务器跨天
        this.addListen1(UIEventEnum.HomeActicityRankIcon, this.onUpdateActivityRankIcon, this);

        this.addListen1(UIEventEnum.MailIconUpdate, this.updateFriendIcon, this);
        this.addListen1(LocalEventEnum.HomeFriendIconUpdate, this.updateFriendIcon, this);

        this.addListen1(LocalEventEnum.SysSettingGuide, this.guideSetWin, this);
        this.addListen1(LocalEventEnum.HomeHejiOpenEffect, this.onHeJiOpenEffect, this);
    }

    private onHeJiOpenEffect():void{
        if(this.navbar){
            this.navbar.showHejiOpen();
        }
    }

    private onShowGmBtn(isShow:boolean):void {
        if(this.isShow) {
            this.module.showGm(isShow);
        }
    }

    private viewOpenedHandler(key: number, viewIndex: number): void {
        if (viewIndex == ViewIndex.One && this.isNavbarShow && key != ModuleEnum.TaskDialog && key != ModuleEnum.Chat && key != ModuleEnum.Friend) {
            this.navbar.showReturnBtn(true);
            this.module.visible = false;
        }
        if (this.navbar != null) {
            this.navbar.selectMainIcon(key, true);
        }
        if (key == ModuleEnum.Home) {
            EventManager.dispatch(UIEventEnum.HomeOpened);
        } else if (key == ModuleEnum.Navbar) {

        }
    }


    private onPlayerDieInTower() : void {
		//this.checkMultiRoleTips();
        /*
        if(this.iconController){
            this.iconController.onPlayerDieInTower();
        }
        */
        
	}

    private viewCloseddHandler(key: number, viewIndex: number): void {
        if (viewIndex == ViewIndex.One && this.isNavbarShow) {
            if (!UIManager.isOpenOneIndexView()) {
                this.navbar.showReturnBtn(false);
                this.module.visible = true;
            }
            UIManager.closeAll(ViewIndex.Two, ViewIndex.Two);
        }
        if (this.navbar != null) {
            this.navbar.selectMainIcon(key, false);
        }
        if(key == ModuleEnum.Activity) {
			if(CacheManager.activity.backRankView) {
				HomeUtil.openActivityByType(ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen);
				CacheManager.activity.backRankView = false;
			}
		}
    }

    //进入关卡boss挑战
    // private onEnterCheckPointCopy(): void {
    //     this.switchUIByCopy(2);
    //     this.onGuidePanelHide();
    // }

    //离开关卡boss挑战
    private onLeftCheckPointCopy(): void {
        // this.switchUIByCopy(0);
        // this.onGuidePanelShow();
        if (this.module && this.module.isShow) {
            this.module.updateCheckPointExpRate();
        }
    }

    /**副本信息更新 */
    private onCopyInfoUpdate(): void {
        if (this.module && this.module.isShow) {
            this.module.updatePointView();
            this.iconController.onCopyInfoUpdate();
        }
    }

    private onEnterCopy(): void {
        this.onGuidePanelHide();
    }

    private onLeftCopy(): void {
        this.onGuidePanelShow();
    }

    /**根据是否在副本中切换UI */
    private switchUIByCopy(idx: number): void {
        if (this.isShow) {
            this.module.switchUI(idx);
            //不要在Controller获取视图类的子显示对象，调接口，视图类处理子视图！！！！
            // let controller: fairygui.Controller = this.module.getController('c2');
            // controller.setSelectedIndex(idx);
            this.showBattlePanel(idx == 1);
            this.updateBattleSkill();
        }
        if (!this.isShow) {
            this.c2IdxCahe = idx; //登录就在副本内 但是home还没创建 缓存idx
        }
    }

    private switchUI(): void {
        if (this.isShow) {
            let isShow: boolean = !this.battlePanel || !this.battlePanel.isShow;
            this.module.switchUI(isShow ? 1 : 0);
            this.showBattlePanel(isShow);
        }
    }

    private updateBattleSkill(): void {
        if (this.battlePanel != null && this.battlePanel.isShow) {
            this.battlePanel.updateSkills();
        }
        if (this.isNavbarShow) {
            this.navbar.startHejiTimer();
        }
    }

    /**
     * 显示导航栏
     */
    private navbarOpen(): void {
        if (this.navbar == null) {
            this.navbar = new Navbar();
        }
        this.navbar.show({}, new CallBack(() => {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Home);
        }, this));
    }

    private onCheckTeamIconBar(isShow: boolean): void {
        if (isShow) {
            if (this.teamIconBar == null) {
                this.teamIconBar = FuiUtil.createComponent(PackNameEnum.Home, "TeamIconBar") as TeamIconBar;
                // this.teamIconBar.x = fairygui.GRoot.inst.width - this.teamIconBar.width >> 1;
                // this.teamIconBar.y = 760;
                // this.teamIconBar.addRelation(this.module.view, fairygui.RelationType.Center_Center);
                // this.teamIconBar.addRelation(this.module.view, fairygui.RelationType.Bottom_Bottom);
            }
            this.module.addBottomIcon(this.teamIconBar);
        } else if (this.teamIconBar && this.teamIconBar.parent) {
            this.module.removeBottomIcon(this.teamIconBar);
        }
    }

    private onCheckExamIconBar(): void {
        this.module.updateExamIconBar();
    }

    private onFightModeUpdated(): void {
        this.module.updateFightMode();
    }

    private onUpdateActivityRankIcon(): void {
        this.module.updateActRankIcon();
        this.onCheckShapeTips();
    }

    private updateFriendIcon(): void {
        this.module.updateFriendIcon();
    }

    private onTeamIconBarCount(): void {
        if (this.teamIconBar && this.teamIconBar.parent) {
            this.teamIconBar.updateCount();

            let leftCount: number = CacheManager.team2.getEnterCopyAutoCount();
            if (leftCount == 10 || leftCount == 5) {
                Tip.showTip(App.StringUtils.substitude(LangTeam2.LANG17, leftCount));
            }
        }
    }

    private onTeamCrossInfoUpdate(): void {
        if (CacheManager.team2.hasTeam) {
            if (CacheManager.team2.captainIsMe
                && CacheManager.team2.isFullMem()
                && this.teamIconBar
                && this.teamIconBar.parent) {
                CacheManager.team2.setEnterCopyAutoCount(ConfigManager.team.getFullStartCountTime());
            }
        }
    }

    private onGodWeaponAct():void{
        this.onGuidePanelShow();
        this.iconController.onGodWeaponAct();
    }

    private onCheckPointUpdate():void{
        this.onGuidePanelShow();
    }

    /**
	 * 任务结束
	 */
    private onTaskRemoved(taskCode: number): void {
        this.onGuidePanelShow();
        if (taskCode == ConfigManager.mgOpen.getOpenTask(MgOpenEnum.GuideSelectAutoXp) && !CacheManager.sysSet.isAutoXp) {//指引自动必杀
            EventManager.dispatch(LocalEventEnum.GuideSelectAutoXp);
        }
    }

    private openGM(isOpen: boolean = false): void {
        this.module.openGM(isOpen);
    }

    private onRoleLevelUpdate(data: any): void {
        this.module.updateLevel();
        if (this.isNavbarShow) {
            this.navbar.isLevelUp = data.cur > data.last;
        }
        this.iconController.onRoleLevelUpdate(data);
        // this.updateLoginRewardIcon();//等级改变会开启福利图标

        this.onGuidePanelShow();
        this.onUpdateActivityRankIcon();
        this.updateVipGiftTips();
        this.checkPackTip();
        this.updateFriendIcon();
    }

    private onRoleStateUpdate(): void {
        this.module.updateLevel();
    }

    private onRoleLifeUpdate(): void {
        if (this.isNavbarShow) {
            this.navbar.updateLife();
        }
    }

    private onShowReceiveEff(url: string, name: string): void {
        this.module.showReceiveIcoEffect(url, name);
    }

    private onShowReceiveItemTips(item: ItemData): void {
        if (ReceiveItemTips.inst.isShow) {
            CacheManager.pack.addItemTipsData(item);
        } else {
            this.module.showRecevieItemTips(item);
        }

    }

    private onShowReceieveNormalItemTips(item: ItemData): void {
        if (ReceiveNormalItemTips.inst.isShow) {
            CacheManager.pack.addNormalItemTipsData(item);
        } else {
            this.module.showRecieveNormalItemTips(item);
        }
    }

    /**显示引导台 */
    private onGuidePanelShow(): void {
        if (this.isShow) {
            this.module.showGuidePanel();
        }
    }

    private onGuidePanelHide(): void {
        if (this.isShow) {
            this.module.hideGuidePanel();
        }
    }

    private onCheckPlayerTips(): void {
        this.onSetBtnTip(ModuleEnum.Player, CacheManager.player.checkTips());
        // this.updateStrongerIcon();
    }

    private onCheckForgeTips(): void {
        this.onSetBtnTip(ModuleEnum.Forge, CacheManager.forge.checkTips());
        this.onCheckSkillTips();//内功和经脉更新
    }

    private onCheckSkillTips(): void {
        let flag: boolean = CacheManager.skill.checkAllTips();
        if (flag) this.removeListener(LocalEventEnum.TaskComplete, this.onCheckSkillTips, this);
        this.onSetBtnTip(ModuleEnum.Skill, flag);
    }

    private onCheckRuneTips(): void {
        // this.onSetBtnTip(ModuleEnum.Rune, CacheManager.runeInlay.checkTips());
        this.onCheckPlayerTips();
        // this.updateStrongerIcon();
    }

    private onCheckShapeTips(): void {
        this.onSetBtnTip(ModuleEnum.Shape, CacheManager.shape.checkTips());
    }

    private onMagicWeaponUpdate(): void {
        this.onCheckPlayerTips();
    }

    private onPosTypeBagChange(): void {
        if (this.module && this.module.isShow) {
            this.onCheckPlayerTips();
            this.onSetBtnTip(ModuleEnum.Forge, CacheManager.forge.checkTips());
            this.onSetBtnTip(ModuleEnum.Shape, CacheManager.shape.checkTips());
            this.onCheckSkillTips();
            this.checkPackTip();
            this.iconController.onPosTypeBagChange();
        }

        /**神装合成指引 */
        if(!CacheManager.player.isGuideCompleted(GuideCode.GodEquipCompose) && CacheManager.godEquip.checkGenerateTipByIndex(RoleIndexEnum.Role_index0)){
            if(!ControllerManager.player.isShow && !ControllerManager.godEquip.isShow){
                EventManager.dispatch(LocalEventEnum.GuideByTask, GuideCode.GodEquipCompose, ETaskStatus.ETaskStatusNotCompleted);
                CacheManager.player.updateGuideStatus(GuideCode.GodEquipCompose);
            }
        }
        /**神装分解指引 */
        if(!CacheManager.player.isGuideCompleted(GuideCode.GodEquipDecompose) && CacheManager.godEquip.checkDecompose()){
            if(!ControllerManager.player.isShow && !ControllerManager.godEquip.isShow){
                EventManager.dispatch(LocalEventEnum.GuideByTask, GuideCode.GodEquipDecompose, ETaskStatus.ETaskStatusNotCompleted);
                CacheManager.player.updateGuideStatus(GuideCode.GodEquipDecompose);
            }
        }

        /**神兵激活指引 */
        if(!CacheManager.player.isGuideCompleted(GuideCode.ImmortalsActive) && CacheManager.forgeImmortals.checkRoleTip(RoleIndexEnum.Role_index0, ForgeImmortalsCache.SUB_TYPE_POS_CAN_UP2)){
            if(!ControllerManager.forge.isShow && !ControllerManager.forgeImmortals.isShow){
                EventManager.dispatch(LocalEventEnum.GuideByTask, GuideCode.ImmortalsActive, ETaskStatus.ETaskStatusNotCompleted);
                CacheManager.player.updateGuideStatus(GuideCode.ImmortalsActive);
            }
        }
        /**神兵升级指引 */
        if(!CacheManager.player.isGuideCompleted(GuideCode.ImmortalsUpgrade) && CacheManager.forgeImmortals.checkRoleTip(RoleIndexEnum.Role_index0, ForgeImmortalsCache.SUB_TYPE_POS_CAN_UP1)){
            if(!ControllerManager.forge.isShow && !ControllerManager.forgeImmortals.isShow){
                EventManager.dispatch(LocalEventEnum.GuideByTask, GuideCode.ImmortalsUpgrade, ETaskStatus.ETaskStatusNotCompleted);
                CacheManager.player.updateGuideStatus(GuideCode.ImmortalsUpgrade);
            }
        }
    }

    private roleExpUpdate(exp: number): void {
        if (this.isNavbarShow) {
            this.navbar.updateExp();
        }
    }

    private roleCombatCapabilitiesUpdate(): void {
        this.module.updateFight();
        this.onCheckPlayerTips();
    }

    private onFightModeChange(): void {
        this.module.changeFightMode();
    }

    private strongerOpen(): void {
        if (!this.strongerWindow) {
            this.strongerWindow = new StrongerWindow();
        }
        this.strongerWindow.show();
    }

    /**
     * 战斗力增加，显示特效
     */
    private roleCombatCapabilitiesAdd(value: number, updateCode: number = -1): void {
        if (updateCode == UpdateCodeConfig.EUpdateCodeLevelUp && value <= 100) {//人物升级低于100的不显示
            return;
        }
        if (ConfigManager.updateCode.isDelayCombatCode(updateCode)) {
            this.delayAddCombat = value;
            let delay: number = ConfigManager.updateCode.getDelayCombatMs(updateCode);
            App.TimerManager.doDelay(delay, () => {
                if (this.delayAddCombat > 0) {
                    Tip.showFightAdd(this.delayAddCombat);
                }
                this.delayAddCombat = 0;
            }, this);
        } else {
            Tip.showFightAdd(value);
        }


    }

    private onChatUpdate(): void {
        if (this.module) {
            this.module.updateChanelList();
        }
    }

    private moneyUpdate(): void {
        if (!this.module.isShow) {
            return;
        }
        this.module.updateMoney();
        this.onCheckForgeTips();
    }

    private updateVip(): void {
        this.module.updateVip();
    }

    private updateVipGiftTips(): void {
        this.module.updateVipGiftTips();
    }

    private onTaskOpenEndUpdated(): void {
        this.iconController.onTaskOpenEndUpdated();
    }

    /**
     * 设置模块按钮红点提示
     * @param key ModuleEnum定义的模块 或者 实例名
     */
    private onSetBtnTip(key: any, isTip: boolean, isName: boolean = false, x: number = null, y: number = null): void {
        var btn: fairygui.GComponent;
        if (this.isNavbarShow) {
            btn = this.navbar.getModuleBtn(key, isName);
            CommonUtils.setBtnTips(btn, isTip, x, y);
        }
        if (!btn && this.isShow) {
            this.iconController.onSetBtnTip(key, isTip, isName);
        }
        // if (this.isShow) {
        //     btn = this.module.getModuleBtn(key, isName);
        //     CommonUtils.setBtnTips(btn, isTip);
        // }
    }


    /**
     * 更新buff
     * @param buffMsg - SBufferMsg
     */
    private updateBuff(buffMsg: any): void {
        CacheManager.buff.updateBuff(buffMsg);
    }

    /**
     * 世界等级更新
     * @param data SUpdateMsg
     */
    private onWorldLevel(data: any): void {
        CacheManager.role.worldLevel = data.value_I;
    }

    /**
     * 场景地图更新了
     */
    private sceneMapUpdated(): void {
        this.module.updatePointView();
        this.module.updateTpButton();
        if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
            CacheManager.checkPoint.enterEncounter = false;
        }
        if (CacheManager.map.isInMainCity) {
            this.onGuidePanelHide();
            this.module.updateShieldButton();
            this.module.updateFightMode();
        } else {
            if (!CacheManager.copy.isInCopy) {
                this.onGuidePanelShow();
                this.module.switchUI(0);
            }
        }
    }

    /**自动战斗状态改变，战斗面板按钮状态跟着改变 */

    /*private autoFightChange(): void {
        if (this.module.battlePanel != null) {
            this.module.battlePanel.autoFightSelected(CacheManager.king.isAutoFighting);
        }
        var isAuto: boolean = CacheManager.king.isAutoFighting;
        this.showAutoAni(isAuto, true);
    }*/

    private onAutoPath(isPathEnd: boolean): void {
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
        if (!kingEntity) {
            return;
        }
        /*
        var isAuto: boolean = CacheManager.king.isAutoFighting;
        if (!isAuto) {
            this.showAutoAni(!isPathEnd, false);
        }
        */

    }

    /**显示自动寻路自动战斗是动画 */
    private showAutoAni(isShow: boolean, isFight: boolean): void {
        /*
        if (!this.autoView) {
            this.autoView = new AutoFightView();
            LayerManager.UI_Home.addChild(this.autoView);
        }
        this.autoView.visible = isShow;
        this.autoView.updateStatus(isFight);
        var p: egret.Point
        if (this.module) {
            p = this.module.getTaskTraceGPos();
            this.autoView.y = p.y - this.autoView.height / 2 - 20;
        } else {
            this.autoView.y = 650; //无法根据任务栏来设置Y坐标
        }
        this.autoView.x = Math.round((fairygui.GRoot.inst.width - this.autoView.width) / 2);
        */
    }

    public show(data?: any): void {
        super.show();
    }

    private onSetChatPanel(visible: boolean): void {
        if (this.module) {
            this.module.updateChatVisible(visible);
            this.module.updateChanelList();
        }
    }

    private onMountSwitch(type: MountEnum = MountEnum.AUTO): void {
        let level:number = CacheManager.mount.getLevel(0);
        if(level < 0) {
            //未激活坐骑
            return;
        }
        let cfg:any = ConfigManager.mgShape.getByShapeAndLevel(EShape.EShapeMount, level);
        if(!cfg) return;
        let _mainPlayer: MainPlayer = CacheManager.king.leaderEntity;
        if (!_mainPlayer || !_mainPlayer.canGetOnMount()) return;
        if ((type == MountEnum.UpMount && CacheManager.role.entityInfo.isOnMount) ||
            (type == MountEnum.DownMount && !CacheManager.role.entityInfo.isOnMount)) {
            return;
        }
        let modelId:number = cfg.modelId;
        let url:string = ResourcePathUtils.getRPGGameMount() + modelId + "_move";
        let _getOn: boolean = type == MountEnum.AUTO ? !CacheManager.role.entityInfo.isOnMount : type == MountEnum.UpMount;
        if(_getOn) {
            let mcData:any = App.LoaderManager.getModelResByUrl(url,loadMount,this,ELoaderPriority.KING_MOUNT,[url]);
            if(mcData) {
                loadMount(url);
            }
        }
        else {
            ProxyManager.home.switchMount(_getOn);
        }
        function loadMount(urlPrefix:string){
            if(url == urlPrefix) {
                let _mainPlayer: MainPlayer = CacheManager.king.leaderEntity;
                if (!_mainPlayer || !_mainPlayer.canGetOnMount()) return;
                if (CacheManager.role.entityInfo.isOnMount) {
                    return;
                }
                ProxyManager.home.switchMount(_getOn);
            }
        }
    }

    /**战斗力文字增加特效 */
    // private showFightAddEffect(): void {
    //     this.module.playFightAddEffect();
    // }

    /**
     * 队伍匹配状态发送改变
     */
    private onTeamMatchChange(): void {
        // if (this.module.teamIconBar != null) {
        //     this.module.teamIconBar.updateMatchingState();
        // }
    }

    /**
     * 队伍队员更新
     */
    private onTeamMemberUpdate(): void {
        // if (this.module.teamIconBar != null) {
        //     this.module.teamIconBar.updateTeamMember();
        // }
    }

    /**
     * 队伍信息更新
     */
    private onTeamInfoUpdate(): void {
        // if (this.module.teamIconBar != null) {
        //     this.module.teamIconBar.updateTeam();
        // }
    }

    private onShowGetExpEffect(startPoint: egret.Point, addExp: number = -1): void {
        if (this.isNavbarShow) {
            let endPoint: egret.Point = this.navbar.getBarCenterGPos();
            MoveMotionUtil.startExpEffect(startPoint, endPoint, addExp);
            // CopyUtils.startExpEffect(startPoint, endPoint);
        }

    }

    /**
     * 新增申请者
     */
    private onUpdateTeamTipsIcon(): void {
        // if (this.module.teamIconBar != null) {
        //     this.module.teamIconBar.updateTipsIcon();
        // }
    }

    /**
     * 显示物品ToolTip
     */
    private showItemToolTip(itemData: ItemData): void {
        if (itemData) {
            if (!this.toolTipData) {
                this.toolTipData = new ToolTipData();
            }
            this.toolTipData.isEnableOptList = false;
            this.toolTipData.data = itemData;
            this.toolTipData.type = ItemsUtil.getToolTipType(itemData);
            ToolTipManager.show(this.toolTipData);
        }
    }

    /**
     * 显示ToolTip
     */
    private showToolTip(toolTipData: ToolTipData): void {
        if (toolTipData) {
            ToolTipManager.show(this.toolTipData);
        }
    }

    /**关卡杀怪数量更新 */
    private onCheckPointKillsUpdate(): void {
        if (this.module && this.module.isShow) {
            this.module.updateCheckPointKills();
        }
    }

    private onAutoCopyStateChange(): void {
        if (this.isShow) {
            this.module.autoCopyStateChange();
        }
    }

    /**新增角色技能 */
    private onAddRoleSkill(skillData: SkillData): void {
        if (this.module && this.module.isShow) {
            this.module.updateNewGetSkill(skillData);
        }
    }

    /**修为值改变 */
    private onRoleStateExpUpdate(): void {
        this.onCheckPlayerTips();
    }

    /**转生等级改变 */
    private onRoleStateLvChange(): void {
        this.module.updateAvatar();
        this.onCheckPlayerTips();
        this.checkPackTip();
    }

    /**必杀更新 */
    private onUpdateKill(): void {
        this.onCheckPlayerTips();
    }

    /**获取Home界面按钮全局坐标 */
    public getHomeBtnGlobalPos(key: any, isName: boolean = false, isCultivate: boolean = false,isSearchAll:boolean=false): egret.Point {
        if(!this.navbar || !this.module) return null;
        let btn: fairygui.GComponent;
        
        if(isSearchAll){
            btn = this.navbar.getModuleBtn(key, isName);
            if(!btn){
                btn = this.module.getModuleBtn(key, isName);
            }
            if (!btn) return null;
            return btn.localToGlobal(0, 0, HomeController.btnGlobalPt);
        }

        if (isCultivate) {
            btn = this.navbar.getModuleBtn(key, isName);
        }
        else {
            btn = this.module.getModuleBtn(key, isName);
        }
        if (!btn) return null;
        return btn.localToGlobal(0, 0, HomeController.btnGlobalPt);
    }

    /**
     * 检测背包提示
     */
    private checkPackTip(): void {
        this.onSetBtnTip(ModuleEnum.Pack, CacheManager.pack.isRedTip);
        //检测熔炼
        if (this.isNavbarShow) {
            this.navbar.showSmeltTip(CacheManager.pack.isSmeltRedTip);
        }
    }

    /**xp技能冷却 */
    private onSkillXpCooldown(cd: number): void {
        if (this.isNavbarShow) {
            this.navbar.onHejiCooldown(cd);
        }
    }

    /**关卡效率是否显示更新 */
    private updateCheckPointIsShow(): void {
        this.module.checkPointShow();
    }

    /**
     * 点击了返回按钮
     */
    private homeAfterClickReturn(): void {

    }

    /**
     * 指引合击
     */
    private guideHeji(guideStepInfo: GuideStepInfo): void {
        if (this.isNavbarShow) {
            this.navbar.showHejiGuide(guideStepInfo);
        }
    }

    /**
     * 指引合击隐藏
     */
    private guideHejiHide(): void {
        if (this.isNavbarShow) {
            this.navbar.hideHejiGuide();
        }
    }

    /**
     * 指引挑战关卡
     */
    private guideCheckPoint(guideStepInfo: GuideStepInfo): void {
        if (this.isShow) {
            this.module.guideCheckPoint(guideStepInfo);
        }
    }

    /**
     * 指引设置
     */
    private guideSetWin(): void {
        this.removeListener(LocalEventEnum.SysSettingInit, this.guideSetWin, this);
        this.removeListener(NetEventEnum.roleSkillInfo, this.guideSetWin, this);

        if (!CacheManager.sysSet.data) {
            this.addListen1(LocalEventEnum.SysSettingInit, this.guideSetWin, this);
            return;
        }
        if (!CacheManager.skill.xpSkillData){
            this.addListen1(NetEventEnum.roleSkillInfo, this.guideSetWin, this);
            return;
        }

        let isShow: boolean = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.SysSettingGuide]);
        this.module.updateAvatarBtnTips(isShow);
        if (!isShow) {//只显示一次
            this.removeListener(LocalEventEnum.SysSettingGuide, this.guideSetWin, this);
        }
    }

    /**
     * 显示欢迎页
     */
    private welcomeOpen(): void {
        if (this.welcomeWindow == null) {
            this.welcomeWindow = new WelcomeWindow();
        }
        this.welcomeWindow.show();
    }

    /**
     * 导航栏是否显示了
     */
    private get isNavbarShow(): boolean {
        return this.navbar && this.navbar.isShow;
    }

    private showBattlePanel(isShow: boolean): void {
        if (isShow) {//显示战斗面板
            if (App.DebugUtils.isDebug) {
                if (this.battlePanel == null) {
                    this.battlePanel = new BattlePanel();
                }
                this.battlePanel.show();
            }
        } else {
            if (this.battlePanel != null && this.battlePanel.isShow) {
                this.battlePanel.hide();
            }
        }
    }

    private onReloginHandler(): void {
        if (this.isShow) {
            this.module.clear();
        }
        if (this.iconController) {
            App.TimerManager.remove(this.iconController.addListenerOnShow, this.iconController);
        }
    }

    private setFightMode(mode: EEntityFightMode): void {
        ProxyManager.operation.setMode(mode);
    }

    private onRoleNameChanged(): void {
        this.module.updateName();
    }

    public onUpdateSM(): void {
        this.iconController.updateSMIcon();
    }

    /**
     * 设置日常红点
     */
    // private homeSetTrainRedTip(isRedTip: boolean): void {
    //     if (this.isNavbarShow) {
    //         let trainBtn: fairygui.GComponent = this.navbar.getModuleBtn(ModuleEnum.Train);
    //         let switchBtn: fairygui.GComponent = this.navbar.getModuleBtn("switchBtn", true);
    //         let isSwitchRedTip: boolean = isRedTip && !trainBtn.visible;
    //         CommonUtils.setBtnTips(trainBtn, isRedTip, 80, 0);
    //         CommonUtils.setBtnTips(switchBtn, isSwitchRedTip, 16, -6);
    //     }
    // }

    /**
     * 强化信息推送
     */
    private onPlayerStrengthenExLoginInfo(): void {
        this.onCheckPlayerTips();
        this.onCheckShapeTips();
    }

    /**
	 * 强化成功
	 */
    private onPlayerStrengthenExUpgraded(info: SUpgradeStrengthenEx): void {
        this.onCheckPlayerTips();
        this.onCheckShapeTips();
    }

	/**
	 * 强化更新
	 */
    private onPlayerStrengthenExUpdated(data: any): void {
        this.onCheckPlayerTips();
        this.onCheckShapeTips();
    }

	/**
	 * 激活成功
	 */
    private onPlayerStrengthenExActived(info: SUpgradeStrengthenEx): void {
        this.onCheckPlayerTips();
        this.onCheckShapeTips();
    }

    // private updateLoginRewardIcon(): void {
    //     this.module.updateLoginRewardIcon();
    // }

    public updateShowStateInfo(info : any) : void {
        var data = {};
        if(info.jsonStr&&info.jsonStr!="") {
            data = JSON.parse(info.jsonStr);
        }
        CacheManager.player.stateInfo = data;
    }

    public showMultiRoleTips(data : any) {
        this.module.hideIconImgTip(IconResId.RechargeFirst);
        this.module.showIconImgTip(IconResId.MultiRole);
    }

    public monthCardUpdate() {
        this.module.updateMonthCardExp();
    }
}
