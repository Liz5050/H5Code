/**导航栏，始终在UI_Main层之上，一直显示 */
class Navbar extends BaseModule {
    private c1: fairygui.Controller;
    private expProgessBar: fairygui.GProgressBar;
    private hejiProgessBar: CircleProgressBar;
    private playerBtn: MainIconButton;
    private skillBtn: MainIconButton;
    private strengthenBtn: MainIconButton;
    private packBtn: MainIconButton;
    private returnBtn: fairygui.GButton;
    private expCompoment: ExpCompoment;
    private lifeBall: LifeBall;
    private mcReturn: UIMovieClip;
    private shapeBtn: MainIconButton;
    private guideClickView: GuideClickView2;
    private isGuidingReturn: boolean;

    public constructor() {
        super(ModuleEnum.Navbar, PackNameEnum.Navbar, "Main", LayerManager.UI_Cultivate);
        // EventManager.addListener(NetEventEnum.copyEnter, this.checkTrainShow, this);
        // EventManager.addListener(NetEventEnum.copyLeft, this.checkTrainShow, this);
        // EventManager.addListener(NetEventEnum.copyEnterCheckPoint, this.checkTrainShow, this);
        // EventManager.addListener(NetEventEnum.copyLeftCheckPoint, this.checkTrainShow, this);
        EventManager.addListener(UIEventEnum.PackPlayEffect, this.playPackEffect, this);
        EventManager.addListener(LocalEventEnum.GuideNavbarReturn, this.showReturnGuide, this);
    }

    public initOptUI(): void {
        //移除php页面的div
        Sdk.SdkToShowGame();

        this.c1 = this.getController("c1");
        //合击进度条
        this.hejiProgessBar = <CircleProgressBar>this.getGObject("progressBar_heji");

        //人物
        this.playerBtn = <MainIconButton>this.getGObject("btn_player");

        //技能
        this.skillBtn = <MainIconButton>this.getGObject("btn_skill");

        //炼器/强化
        this.strengthenBtn = <MainIconButton>this.getGObject("btn_refining");

        //外观
        this.shapeBtn = <MainIconButton>this.getGObject("btn_shape");

        //背包
        this.packBtn = <MainIconButton>this.getGObject("btn_backpack");

        //返回
        this.returnBtn = this.getGObject("btn_return").asButton;
        this.returnBtn.addClickListener(this.returnClickHandler, this);


        let expBar = this.getGObject("progressBar_exp") as UIProgressBar;
        let expEffect: UIMovieClip = UIMovieManager.get(PackNameEnum.MCExpAdd2);
        expEffect.setSize(128, 128);
        expEffect.setPivot(0.5, 0.5, true);
        expEffect.y = expBar.y + 8;
        expEffect.addRelation(expBar, fairygui.RelationType.Bottom_Bottom);
        expEffect.playing = false;
        expEffect.visible = false;

        let expBao: UIMovieClip = UIMovieManager.get(PackNameEnum.MCExpBao);
        expBao.setSize(128, 128);
        expBao.setPivot(0.5, 0.5, true);
        expBao.y = expBar.y + 8;
        expBao.addRelation(expBar, fairygui.RelationType.Bottom_Bottom);
        expBao.playing = false;
        expBao.visible = false;

        this.addChild(expEffect);
        this.addChild(expBao);

        this.expCompoment = new ExpCompoment(expBar, null, expEffect, expBao);

        this.lifeBall = <LifeBall>this.getGObject("lifeBall");

        this.playerBtn.addClickListener(this.clickButton, this);
        this.skillBtn.addClickListener(this.clickButton, this);
        this.strengthenBtn.addClickListener(this.clickButton, this);
        this.shapeBtn.addClickListener(this.clickButton, this);
        this.packBtn.addClickListener(this.clickButton, this);

        GuideTargetManager.reg(GuideTargetName.NavbarPlayerBtn, this.playerBtn);
        GuideTargetManager.reg(GuideTargetName.NavbarShapeBtn, this.shapeBtn);
        GuideTargetManager.reg(GuideTargetName.NavbarSkillBtn, this.skillBtn);
        GuideTargetManager.reg(GuideTargetName.NavbarStrengthenBtn, this.strengthenBtn);
        // GuideTargetManager.reg(GuideTargetName.HomeRuneBtn, this.trainBtn);
        // GuideTargetManager.reg(GuideTargetName.HomePackBtn, this.packBtn);
        // GuideTargetManager.reg(GuideTargetName.HomeDailyBtn, this.dailyBtn);
        GuideTargetManager.reg(GuideTargetName.NavbarReturnBtn, this.returnBtn);
        GuideTargetManager.reg(GuideTargetName.NavbarHejiBar, this.hejiProgessBar);
    }

    public updateAll(): void {
        this.updateExp();
        this.updateLife();
        // this.checkTrainShow();
    }

    public onShow(data: any = null): void {
        super.onShow(data);
    }

    /**
     * 获取经验条中心的全局坐标
     */
    public getBarCenterGPos(): egret.Point {
        return this.expCompoment.getBarCenterGPos();
    }

    /**更新经验值 */
    private lastExp: number = 0;
    private lastExpMax: number = 0;

    public updateExp(): void {
        let value: number = Number(CacheManager.role.role.experience_L64);
        let max: number = ConfigManager.exp.getMaxExp(CacheManager.role.role.level_I)
        this.expCompoment.update(value, max);
    }

    public set isLevelUp(value: boolean) {
        this.expCompoment.isLevelUp = value;
    }

    public showReturnBtn(isShow: boolean): void {
        if (this.returnBtn != null) {
            this.returnBtn.visible = isShow;
        }
        this.hejiProgessBar.visible = !isShow;
        if (isShow) {
            if (this.mcReturn == null) {
                this.mcReturn = UIMovieManager.get(PackNameEnum.MCReturn);
                this.mcReturn.x = -76;
                this.mcReturn.y = -74;
                this.mcReturn.playing = true;
                this.returnBtn.addChild(this.mcReturn);
            }
        }
        if (!isShow && this.isGuidingReturn) {
            this.hideReturnGuide();
        }
        if (isShow) {
            //在有返回指引时，返回按钮不可见而不能指引，重新发出事件，刷新当前指引
            EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
        }
    }

    /**
     * 选中/取消主功能按钮
     */
    public selectMainIcon(key: number, isSelected: boolean) {
        var moduleBtn: fairygui.GComponent = this.getModuleBtn(key);
        if (moduleBtn instanceof fairygui.GButton) {
            moduleBtn.selected = isSelected;
        }
    }

    /**
     * 获取模块按钮
     * @param key ModuleEnum定义的模块 或者 实例名
     */
    public getModuleBtn(key: any, isName: boolean = false): fairygui.GComponent {
        var moduleBtn: fairygui.GComponent;
        if (isName) {
            moduleBtn = this[key];
            return moduleBtn;
        }
        switch (key) {
            case ModuleEnum.Player:
                moduleBtn = this.playerBtn;
                break;
            case ModuleEnum.Skill:
                moduleBtn = this.skillBtn;
                break;
            case ModuleEnum.Forge:
                moduleBtn = this.strengthenBtn;
                break;
            case ModuleEnum.Pack:
                moduleBtn = this.packBtn;
                break;
            case ModuleEnum.Shape:
                moduleBtn = this.shapeBtn;
                break;
        }
        return moduleBtn;
    }

    public updateLife() {
        let value: number = 0;
        let max: number = 0;
        if (CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining)) {
            let mainInfo: EntityInfo = CacheManager.role.entityInfo;
            max = Number(mainInfo.maxLife_L64);
            value = Number(mainInfo.life_L64);
        }
        else {
            max = CacheManager.role.getMaxLife();
            value = CacheManager.role.getLife();
        }
        this.lifeBall.max = max;
        this.lifeBall.value = value;
    }

    public startHejiTimer(): void {
        this.hejiProgessBar.startTimer();
    }

    public onHejiCooldown(cd: number) {
        this.hejiProgessBar.onHejiCooldown(cd);
    }

    /**
     * 显示熔炼提示
     */
    public showSmeltTip(isTip: boolean): void {
        this.c1.selectedIndex = isTip ? 1 : 0;
    }

    public showHejiGuide(guideStepInfo: GuideStepInfo): void {
        this.hejiProgessBar.showGuide(guideStepInfo);
    }

    public hideHejiGuide(): void {
        this.hejiProgessBar.hideGuide();
    }

    public showHejiOpen():void{
        this.hejiProgessBar.showOpenEffect();
    }

    /**
     * 播放背包按钮特效
     */
    private isPlayingPackEffect: boolean;
    public playPackEffect(duration: number = 250): void {
        if (this.isPlayingPackEffect) {
            return;
        }
        this.isPlayingPackEffect = true;
        let oy: number = this.shapeBtn.y;
        egret.Tween.removeTweens(this.packBtn);
        egret.Tween.get(this.packBtn).to({ y: oy - 10 }, duration).to({ y: oy }, duration).call(() => {
            this.isPlayingPackEffect = false;
        }, this);
    }

    protected onStageResize(): void {
        super.onStageResize();
        this.packBtn.y = this.shapeBtn.y;
    }

    /**
     * 点击按钮
     */
    private clickButton(e: egret.TouchEvent): void {
        let tabType: PanelTabType;
        switch (e.target) {
            case this.playerBtn:
                EventManager.dispatch(UIEventEnum.ModuleToggle, ModuleEnum.Player);
                break;
            case this.skillBtn:
                tabType = PanelTabType.Skill;
                if (CacheManager.guide.isNextGuideTarget(GuideTargetName.InnerPowerUpgradeBtn)) {
                    tabType = PanelTabType.InnerPower;
                }
                EventManager.dispatch(UIEventEnum.ModuleToggle, ModuleEnum.Skill, {"tabType": tabType});
                break;
            case this.strengthenBtn:
                tabType = PanelTabType.Strengthen;
                if (CacheManager.guide.isNextGuideTarget(GuideTargetName.ForgeRefinePanelRefineBtn) 
                    || CacheManager.guide.isNextGuideTarget(GuideTargetName.ForgeRefinePanelOneKeyRefineBtn))
                {
                    tabType = PanelTabType.Refine;
                }
                EventManager.dispatch(UIEventEnum.ModuleToggle, ModuleEnum.Forge, {"tabType": tabType});
                break;
            case this.shapeBtn:
                if (ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Pet, false)) {
                    let tabType: PanelTabType = PanelTabType.Pet;
                    if (CacheManager.guide.isNextGuideTarget(GuideTargetName.WingOneKeyBtn)) {
                        tabType = PanelTabType.Wing;
                    } else if (CacheManager.guide.isNextGuideTarget(GuideTargetName.MountPanelOnekeyBtn)) {
                        tabType = PanelTabType.Mount;
                    } else if (CacheManager.guide.isNextGuideTarget(GuideTargetName.SwordPoolPanelActiveBtn) || CacheManager.guide.isNextGuideTarget(GuideTargetName.SwordPoolPanelOnekeyBtn)) {
                        tabType = PanelTabType.ShapeSwordPool;
                    } else if (CacheManager.guide.isNextGuideTarget(GuideTargetName.BattleArrayPanelActiveBtn) || CacheManager.guide.isNextGuideTarget(GuideTargetName.BattleArrayPanelOnekeyBtn)) {
                        tabType = PanelTabType.ShapeBattle;
                    }
                    EventManager.dispatch(UIEventEnum.ModuleToggle, ModuleEnum.Shape, {"tabType": tabType});
                } else {
                    Tip.showTip(ConfigManager.mgOpen.getOpenCondDesc(MgOpenEnum.Pet));
                }
                break;
            case this.packBtn:
                EventManager.dispatch(UIEventEnum.ModuleToggle, ModuleEnum.Pack);
                break;
        }
    }

    /**点击返回 */
    private returnClickHandler(): void {
        let lastKey: ModuleEnum = UIManager.getLastKey();
        if (HomeReturnInterceptor.intercept(lastKey)) {
            return;
        }
        let preKey: number = UIManager.showPreView();
        if (preKey == -1) {
            this.returnBtn.visible = false;
        }
        EventManager.dispatch(LocalEventEnum.HomeAfterClickReturn);
    }

    private notOpenTip(): void {
        EventManager.dispatch(LocalEventEnum.ShowRollTip, "功能未开放");
    }

    private checkTrainShow(): void {
        // if (CacheManager.copy.isInCopy) {
        //     this.trainBtn.visible = false;
        // } else {
        //     this.trainBtn.visible = true;
        // }
        // this.lifeBall.visible = !this.trainBtn.visible;
        // EventManager.dispatch(LocalEventEnum.HomeSetTrainRedTip, CacheManager.train.checkTips());
    }

    /**
     * 显示返回指引
     */
    private showReturnGuide(guideStepInfo: GuideStepInfo): void {
        if (this.guideClickView == null) {
            this.guideClickView = new GuideClickView2();
            // this.guideClickView.setMcXY(-133, 53);
            // this.guideClickView.clickMc.rotation = -45;
            // this.guideClickView.setTipXY(-4, 50);
        }
        // this.guideClickView.guideKey = guideStepInfo.key;
        // this.guideClickView.updateTip(guideStepInfo.desc);
        // this.returnBtn.addChild(this.guideClickView);
        this.guideClickView.addToParent(this.returnBtn);
        this.isGuidingReturn = true;
    }

    private hideReturnGuide(): void {
        if (this.guideClickView != null) {
            this.guideClickView.removeFromParent();
        }
        this.isGuidingReturn = false;
        EventManager.dispatch(UIEventEnum.GuideNextStep);
    }
}