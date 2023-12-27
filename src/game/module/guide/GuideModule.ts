/**
 * 指引模块
 */
class GuideModule extends BaseWindow {
    private guideTip: GuideTip;
    // private clickMc: UIMovieClip;
    private clickView: GuideClickView2;
    private forceClickMc: GuideForceClickMc;
    private target: fairygui.GObject;
    private targetPos: egret.Point;
    private targetView: fairygui.GComponent;

    private container: egret.DisplayObjectContainer;
    private skipBtn: fairygui.GButton;

    private guideMask: GuideMask;
    private guideStepInfo: GuideStepInfo;
    private lastGuideStepInfo: GuideStepInfo;
    private targetWidth: number;
    private targetHeight: number;
    private autoGuideExecutor: GuideAutoExecutor;
    private clickMCWidth: number = 256;

    public constructor(moduleId: ModuleEnum) {
        super(PackNameEnum.Guide, "Main", moduleId, LayerManager.UI_Guide);
        this.modal = false;
        this.isPopup = false;
        this.isAnimateShow = false;
        this.isDestroyOnHide = false;
    }

    public initOptUI(): void {
        this.skipBtn = this.getGObject("btn_skip").asButton;
        this.skipBtn.addClickListener(this.skipGuide, this);

        this.container = this.displayObject as egret.DisplayObjectContainer;

        this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
    }

    public updateAll(data: any = null): void {
        this.guideStepInfo = data;
        this.resetGuide();

        if (this.guideStepInfo) {
            if (this.guideStepInfo.timeout > 0) {//超时时间
                App.TimerManager.doDelay(this.guideStepInfo.timeout, this.durationTimeOut, this);
            }

            this.skipBtn.visible = false;//去掉跳过指引
            // this.skipBtn.visible = this.guideStepInfo.type == GuideTypeEnum.TargetClick;//跳过指引

            if (this.guideStepInfo.target != null && this.guideStepInfo.type != GuideTypeEnum.ViewClose) {
                if (GuideUtil.isObjTarget(this.guideStepInfo.target)) {
                    this.target = GuideTargetManager.getObj(this.guideStepInfo.target);
                    if (GuideTargetManager.getObjView(this.guideStepInfo.target)) {
                        this.targetView = GuideTargetManager.getObjView(this.guideStepInfo.target) as fairygui.GComponent;
                    } else {
                        this.targetView = null;
                    }
                    if (this.guideStepInfo.target == GuideTargetName.NavbarReturnBtn && !this.target.visible && CacheManager.guide.isCannotSkipReturnStep(this.guideStepInfo.taskCode)) {//为了解决返回指引时，而返回按钮不可见导致跳过的问题
                        return;
                    }
                    if (this.target == null || !this.target.onStage || !this.target.visible) {//目标不存在或其他原因导致没显示，直接跳过，避免卡住。
                        this.guideNextStep();
                        return;
                    }
                    if (this.target != null) {
                        if (this.guideStepInfo.isForce) {
                            this.targetPos = this.target.localToGlobal();
                        } else {
                            this.targetPos = new egret.Point(this.target.x, this.target.y);
                            this.target.addClickListener(this.onClickTarget, this);
                        }
                        this.targetWidth = this.target.width * this.target.scaleX;
                        this.targetHeight = this.target.height * this.target.scaleY;
                    }

                } else {
                    let area: Array<number> = GuideUtil.getTargetArea(this.guideStepInfo.target);
                    this.targetPos = new egret.Point(area[0], area[1]);
                    if (area.length == 4) {
                        this.targetWidth = area[2];
                        this.targetHeight = area[3];
                    }
                }
                //微信小游戏并且是iPhoneX系列的处理
                if (App.DeviceUtils.IsWXGame && App.DeviceUtils.IsIPhoneX) {
                    this.targetPos.y -= UIExtensionManager.WXIPhoneXtop;
                }
            }

            switch (this.guideStepInfo.type) {
                case GuideTypeEnum.TaskClick://任务追踪
                    EventManager.dispatch(LocalEventEnum.GuideTaskTrace, this.guideStepInfo);
                    this.hide();
                    break;

                case GuideTypeEnum.HejiClick://指引合击
                    EventManager.dispatch(LocalEventEnum.GuideHeji, this.guideStepInfo);
                    this.hide();
                    break;

                case GuideTypeEnum.CheckPointClick://指引挑战关卡
                    EventManager.dispatch(LocalEventEnum.GuideCheckPoint, this.guideStepInfo);
                    this.hide();
                    break;

                case GuideTypeEnum.TaskTalk://对话指引通过改变默认参数实现
                case GuideTypeEnum.TargetClick://界面目标
                    if (this.guideStepInfo.target == GuideTargetName.NavbarReturnBtn && !this.guideStepInfo.isForce) {
                        //非强制指引的返回，代码处理
                        EventManager.dispatch(LocalEventEnum.GuideNavbarReturn, this.guideStepInfo);
                        return;
                    }
                    if (this.guideStepInfo.desc != null && this.guideStepInfo.desc != "") {
                        this.guideTip = <GuideTip>FuiUtil.createComponent(PackNameEnum.Common, "GuideTip", GuideTip);
                        this.guideTip.targetWidth = this.targetWidth;
                        this.guideTip.targetHeight = this.targetHeight;
                        this.guideTip.visible = false;
                        if (this.guideStepInfo.direction == null) {
                            this.guideStepInfo.direction = GuideArrowDirection.Left;
                        }
                        this.guideTip.direction = this.guideStepInfo.direction;

                        this.guideTip.tip = this.guideStepInfo.desc;
                        if (this.guideStepInfo.isForce) {
                            this.guideTip.x = this.targetPos.x + this.guideTip.offsetX + this.guideStepInfo.arrowOffsetX;
                            this.guideTip.y = this.targetPos.y + this.guideTip.offsetY + this.guideStepInfo.arrowOffsetY;
                            this.addChild(this.guideTip);
                        } else {
                            if (this.targetView) {
                                this.guideTip.x = this.targetPos.x + this.guideTip.offsetX + this.guideStepInfo.arrowOffsetX;
                                this.guideTip.y = this.targetPos.y + this.guideTip.offsetY + this.guideStepInfo.arrowOffsetY;
                                this.targetView.addChild(this.guideTip);
                            } else {
                                this.guideTip.x = this.guideTip.offsetX + this.guideStepInfo.arrowOffsetX;
                                this.guideTip.y = this.guideTip.offsetY + this.guideStepInfo.arrowOffsetY;
                                (this.target as fairygui.GComponent).addChild(this.guideTip);
                            }
                        }
                    }
                    // if (this.clickMc == null) {
                    //     this.clickMc = UIMovieManager.get(PackNameEnum.MCGuideClick);
                    //     this.clickMc.setSize(this.clickMCWidth, this.clickMCWidth);
                    //     this.clickMc.setPivot(0.5, 0.5, true);
                    // }
                    if (!this.clickView) {
                        this.clickView = new GuideClickView2();
                    }

                    if (this.guideStepInfo.target == GuideTargetName.InnerPowerUpgradeBtn && this.guideStepInfo.step > 3) {//升级内功。第一步才放大
                        this.clickView.amplifyTimes = -1;
                    } else {
                        this.clickView.amplifyTimes = 1;
                    }

                    let rotation: number = 0;
                    let scaleX: number = 1;
                    switch(this.guideTip.direction) {
                        case GuideArrowDirection.Top:
                            rotation = -45;
                            break;
                        case GuideArrowDirection.Bottom:
                            rotation = 60;
                            break;
                        case GuideArrowDirection.Left:
                            rotation = 0;
                            scaleX = -1;
                            break;
                        case GuideArrowDirection.Right:
                            rotation = 0;
                            break;
                    }
                    
                    //修正坐标
                    let fixX: number = 0;
                    let fixY: number = 0;
                    if (this.guideStepInfo.target == GuideTargetName.NavbarReturnBtn) {
                        fixX = -3;
                        fixY = -2;
                    }
                    // this.clickMc.setScale(1, 1);
                    // this.clickMc.rotation = rotation;
                    // this.clickMc.scaleX = scaleX;

                    if (this.guideStepInfo.isForce) {
                        // this.clickMc.x = this.targetPos.x + this.targetWidth / 2 + fixX + this.guideStepInfo.mcOffsetX;
                        // this.clickMc.y = this.targetPos.y + this.targetHeight / 2 + fixY + this.guideStepInfo.mcOffsetY;
                        // this.addChild(this.clickMc);
                        this.clickView.addToParent(this, this.guideTip.direction, this.targetPos.x + this.targetWidth / 2 + fixX + this.guideStepInfo.mcOffsetX, this.targetPos.y + this.targetHeight / 2 + fixY + this.guideStepInfo.mcOffsetY, false);
                    } else {
                        if (this.targetView) {
                            // this.clickMc.x = this.targetPos.x + this.targetWidth / 2 + fixX + this.guideStepInfo.mcOffsetX;
                            // this.clickMc.y = this.targetPos.y + this.targetHeight / 2 + fixY + this.guideStepInfo.mcOffsetY;
                            // this.targetView.addChild(this.clickMc);
                            this.clickView.addToParent(this.targetView, this.guideTip.direction, this.targetPos.x + this.targetWidth / 2 + fixX + this.guideStepInfo.mcOffsetX, this.targetPos.y + this.targetHeight / 2 + fixY + this.guideStepInfo.mcOffsetY, false);
                        } else {
                            // this.clickMc.x = this.targetWidth / 2 + fixX + this.guideStepInfo.mcOffsetX;
                            // this.clickMc.y = this.targetHeight / 2 + fixY + this.guideStepInfo.mcOffsetY;
                            // (this.target as fairygui.GComponent).addChild(this.clickMc);

                            this.clickView.addToParent(this.target as fairygui.GComponent, this.guideTip.direction, fixX + this.guideStepInfo.mcOffsetX, fixY + this.guideStepInfo.mcOffsetY);
                        }
                    }
                    break;
                case GuideTypeEnum.ViewClose://界面关闭
                    break;
            }
            this.showMask(this.guideStepInfo.isForce);
            if (this.autoGuideExecutor == null) {
                this.autoGuideExecutor = new GuideAutoExecutor();
            }
            this.autoGuideExecutor.start(this.guideStepInfo);
        }
        this.lastGuideStepInfo = data;
    }

    public onShow(data: any = null): void {
        super.onShow(data);
    }

    public onHide(data: any = null): void {
        super.onHide(data);
    }

    /**
     * 重置
     */
    public resetGuide(): void {
        if (this.guideTip != null) {
            this.guideTip.removeFromParent();
        }

        // if (this.clickMc != null) {
        //     this.clickMc.removeFromParent();
        // }
        if (this.clickView != null) {
            this.clickView.removeFromParent();
        }
        if (this.forceClickMc != null) {
            this.forceClickMc.removeFromParent();
            this.forceClickMc.stop();
        }
        this.showMask(false);
    }

    /**
     * 显示/隐藏遮罩
     */
    private showMask(isShow: boolean): void {
        if (isShow) {
            if (this.guideMask == null) {
                this.guideMask = new GuideMask();
                this.guideMask.setClickCallBack(this.onClickMask, this);
            }
            this.container.addChildAt(this.guideMask, 0);
            if (this.targetPos) {
                if (this.guideStepInfo.radius != null) {
                    this.guideMask.drawCircle(this.targetPos.x + this.targetWidth / 2, this.targetPos.y + this.targetHeight / 2, this.guideStepInfo.radius);
                } else {
                    this.guideMask.drawRect(this.targetPos.x, this.targetPos.y, this.targetWidth, this.targetHeight);
                }
            }
            this.guideMask.onShowMask(true);
        } else {
            if (this.guideMask != null) {
                this.guideMask.onShowMask(false);
            }
            App.DisplayUtils.removeFromParent(this.guideMask);
        }
    }

    /**
     * 点击遮罩回调
     */
    private onClickMask(): void {
        if (this.forceClickMc != null && this.forceClickMc.isPlaying) {
            return;
        }
        if (this.guideStepInfo.isForce) {//强制指引，放大效果
            if (this.forceClickMc == null) {
                this.forceClickMc = new GuideForceClickMc();
            }
            this.forceClickMc.x = this.targetPos.x + this.targetWidth / 2 - this.forceClickMc.offset;
            this.forceClickMc.y = this.targetPos.y + this.targetHeight / 2 - this.forceClickMc.offset;
            this.addChild(this.forceClickMc);
            this.forceClickMc.play(1);
        }
    }

    /**
     * 点击非强制指引目标
     */
    private onClickTarget(): void {
        if (this.guideTip) {
            this.guideTip.removeFromParent();
        }
        // if (this.clickMc) {
        //     this.clickMc.removeFromParent();
        // }
        if (this.clickView) {
            this.clickView.removeFromParent();
        }
        this.guideNextStep();
    }

    /**
     * 时间到，跳过指引
     */
    private durationTimeOut(): void {
        if (this.lastGuideStepInfo == this.guideStepInfo) {
            this.skipGuide();
        }
    }

    /**
     * 指引下一步
     */
    private guideNextStep(): void {
        EventManager.dispatch(UIEventEnum.GuideNextStep);
    }

    /**跳过指引 */
    private skipGuide(): void {
        EventManager.dispatch(UIEventEnum.GuideSkip);
    }
}