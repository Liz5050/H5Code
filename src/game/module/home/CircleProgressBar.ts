/**
 * 合击环形进度条
 */
class CircleProgressBar extends fairygui.GComponent {
    private c1: fairygui.Controller;
    private container: fairygui.GComponent;
    // private mcProgress: fairygui.GMovieClip;
    private mcOk: fairygui.GMovieClip;
    private mcPoint: fairygui.GMovieClip;
    private lockImg: fairygui.GImage;
    private guideClickView: GuideClickView2;
    private shape: egret.Shape;
    private startAngle: number = -90;//起始角度，单位度。
    private skillData: SkillData;
    private colldown: number = 0;//冷却时间
    private leftTime: number = 0;//剩余时间
    private value: number = 0;//当前值
    private maxValue: number = 100;//最大值
    private _isOk: boolean;
    private stopFlag: boolean;
    private _progressValue: number;
    private hasLoadMcHeji: boolean;
    private hasLoadMcHejiPoint: boolean;
    private hasLoadMcHejiOk: boolean;
    private lastDirection: GuideArrowDirection;
    private _angle: number;
    private _mcAngle: number;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.container = this.getChild("container").asCom;
        this.container.touchable = false;
        this.lockImg = this.getChild("img_lock").asImage;
        this.shape = new egret.Shape();
        (this.displayObject as egret.DisplayObjectContainer).addChild(this.shape);
        this.addClickListener(this.fireHejiSkill, this);
        this.container.mask = this.shape;
        this.startCoolDown();

        //技能信息推送后需要再检测一次。处理在技能信息前就检测了导致合击不显示的问题
        EventManager.addListener(NetEventEnum.roleSkillListUpdated, this.onSkillUPdate, this);
    }

    public startTimer(): void {
        App.TimerManager.remove(this.doProgress, this);
        this.skillData = CacheManager.skill.xpSkillData;
        if (this.skillData != null) {
            this.colldown = this.skillData.colldown;
            this.maxValue = this.colldown;
        }
        this.checkLock();
    }

    private lastValue: number = -1;
    private updateValue(newValue: number): void {
        if (this.value == newValue) return;
        this.value = newValue;
        let newAngle = this.startAngle + ((newValue / this.maxValue) * 360) % 360;
        if (newValue >= this.maxValue) {
            newAngle = this.startAngle + 360;
        }
        this.changeGraphics(newAngle);
        this.lastValue = newValue;
    }

    public set progressValue(progressValue: number) {
        this._progressValue = progressValue;
        this.updateValue(progressValue);
    }

    public get progressValue(): number {
        return this._progressValue;
    }

    public set isOk(isOk: boolean) {
        CacheManager.guide.isHejiOk = isOk;
        if (this._isOk == isOk) return;
        // if (this.mcProgress != null) {
        //     this.mcProgress.visible = !isOk;
        // }
        if (this.mcPoint != null) {
            this.mcPoint.visible = !isOk;
        }
        if (this.mcOk != null) {
            this.mcOk.visible = isOk;
            this.mcOk.playing = isOk;
        }
        this._isOk = isOk;
        if (isOk) {
            this.loadMcHejiOk();
            CacheManager.guide.onHejiOk(false);
        } else {
            this.loadMcHeji();
            this.loadMcHejiPoint();
            if (this.guideClickView != null && this.guideClickView.isShow) {
                this.guideClickView.removeFromParent();
            }
        }
    }

    public showOpenEffect():void{
        let mc:UIMovieClip = UIMovieManager.get(PackNameEnum.MCHJOpen,-80,-80);
        mc.playing=true;
        this.addChild(mc);

        mc.addFrameScript(8,()=>{
            CacheManager.skill.isXpSkillOpened = true;
            this.checkLock();
        },this);
        mc.setPlaySettings(0,-1,1,-1,()=>{
            mc.playing=false;
            mc.destroy();
            mc = null;   
        },this);    

    }

    private loadMcHeji(): void {
        // if (!this.hasLoadMcHeji) {
        //     this.hasLoadMcHeji = true;
        //     ResourceManager.load(PackNameEnum.MCHeji, -1, new CallBack(this.mcLoaded, this, PackNameEnum.MCHeji));
        // }
    }

    private loadMcHejiPoint(): void {
        if (!this.hasLoadMcHejiPoint) {
            this.hasLoadMcHejiPoint = true;
            ResourceManager.load(PackNameEnum.MCHejiPoint, -1, new CallBack(this.mcLoaded, this, PackNameEnum.MCHejiPoint));
        }
    }

    private loadMcHejiOk(): void {
        if (!this.hasLoadMcHejiOk) {
            this.hasLoadMcHejiOk = true;
            ResourceManager.load(PackNameEnum.MCHejiOk, -1, new CallBack(this.mcLoaded, this, PackNameEnum.MCHejiOk));
        }
    }

    public get isOk(): boolean {
        return this._isOk;
    }

    /**合击技能冷却 */
    public onHejiCooldown(cd: number) {
        this.startCoolDown(cd);
        this.checkLock();
    }

    /**
     * 显示指引
     */
    public showGuide(guideStepInfo: GuideStepInfo): void {
        // let direction: GuideArrowDirection = GuideArrowDirection.Left;
        // if (this.guideClickView == null || direction != this.lastDirection) {
        //     this.guideClickView = new GuideClickView(0);
        //     this.guideClickView.clickMc.setSize(256, 256);
        //     this.guideClickView.clickMc.setPivot(0.5, 0.5, true);
        //     this.guideClickView.clickMc.rotation = -45;
        //     this.guideClickView.setMcXY(48, 48); 
        //     this.guideClickView.setTipXY(0, 50);
        // }

        // if (guideStepInfo.direction != null) {
        //     direction = guideStepInfo.direction;
        //     this.guideClickView.setTipXY(45, 0);
        // } else {
        //     this.guideClickView.setTipXY(0, 50);
        // }
        // this.guideClickView.guideKey = guideStepInfo.key;
        // this.guideClickView.updateTip(guideStepInfo.desc, direction);
        // this.addChild(this.guideClickView);
        // this.lastDirection = direction;
        if (this.guideClickView == null) {
            this.guideClickView = new GuideClickView2(0);
        }
        this.guideClickView.guideKey = guideStepInfo.key;
        this.guideClickView.addToParent(this);
    }

    /**
     * 隐藏指引
     */
    public hideGuide(): void {
        if (this.guideClickView != null && this.guideClickView.isShow) {
            this.guideClickView.removeFromParent();
        }
    }

    private mcLoaded(name: PackNameEnum): void {
        if (name == PackNameEnum.MCHejiPoint) {
            this.mcPoint = FuiUtil.createMc(PackNameEnum.MCHejiPoint, PackNameEnum.MCHejiPoint);
            this.mcPoint.setPivot(0.5, 0.5, true);
            this.mcPoint.x = 0;
            this.mcPoint.y = 0;
            this.mcPoint.visible = !this.isOk;
            this.addChild(this.mcPoint);
            this.updateMCPointPos(this.mcAngle);
        } else if (name == PackNameEnum.MCHeji) {
            // this.mcProgress = FuiUtil.createMc("MCHeji", PackNameEnum.MCHeji);
            // this.mcProgress.x = 0;
            // this.mcProgress.y = -7;
            // this.mcProgress.visible = !this.isOk;
            // this.container.addChild(this.mcProgress);
            this.updateValue(this.value);
            this.loadMcHejiOk();
        } else if (name == PackNameEnum.MCHejiOk) {
            this.mcOk = FuiUtil.createMc("MCHejiOk", PackNameEnum.MCHejiOk);
            this.mcOk.setScale(1.1, 1.1);
            this.mcOk.x = -89;
            this.mcOk.y = -96;
            this.mcOk.visible = this.isOk;
            this.addChildAt(this.mcOk, 1);
            this.loadMcHeji();
        }
    }

    private changeGraphics(angle: number) {
        let r: number = 60;
        this.shape.graphics.clear();
        this.shape.graphics.moveTo(50, 50);
        this.shape.graphics.beginFill(0x00ffff, 1);
        this.shape.graphics.lineTo(r, 0);
        this.shape.graphics.drawArc(50, 50, r, this.startAngle * Math.PI / 180, angle * Math.PI / 180, false);
        this.shape.graphics.lineTo(50, 50);
        this.shape.graphics.endFill();
    }

    public set angle(angle: number) {
        this._angle = angle;
        this.changeGraphics(this._angle);
    }

    public get angle(): number {
        return this._angle;
    }

    public set mcAngle(mcAngle: number) {
        this._mcAngle = mcAngle;
        this.updateMCPointPos(mcAngle);
    }

    public get mcAngle(): number {
        return this._mcAngle;
    }

    private startCoolDown(cd: number = null): void {
        this.isOk = false;
        if (cd == null) {
            cd = CacheManager.skill.getCd(SkillCache.SKILLID_XP)
        }
        if (cd > 0) {
            this.angle = this.startAngle;
            this.mcAngle = -180;
            let leftTime: number = cd - egret.getTimer();
            let time1: number = 0;
            let angle1: number = this.angle;
            let angle2: number = this.mcAngle;
            egret.Tween.removeTweens(this);
            if (leftTime < 10000) {//切图，1快速到240。30度慢速
                time1 = 1000;
                angle1 = 240;
                angle2 = -510;
            }
            egret.Tween.get(this).to({ "angle": angle1, "mcAngle": angle2}, time1).to({ "angle": 270, "mcAngle": -540 }, leftTime - time1).call(() => {
                if (!this.isOk) {//合击从未满到满
                    this.isOk = true;
                    CacheManager.guide.onHejiOk(true);
                    EventManager.dispatch(LocalEventEnum.HomeHejiOk);
                }
            }, this);
        } else {
            if (cd != -1) {
                this.isOk = true;
            }
        }
    }

    private fireHejiSkill(): void {
        if (this.isOk) {
            EventManager.dispatch(UIEventEnum.ClickMainSkillItem, SkillCache.SKILLID_XP);
            if (this.guideClickView != null && this.guideClickView.isShow) {
                this.guideClickView.onClick();
            }
        } else if (CacheManager.skill.isLearnedSkill(SkillCache.SKILLID_XP)) {
            Tip.addTip(LangFight.LANG5, TipType.LeftBottomText);
        }
        EventManager.dispatch(LocalEventEnum.TestUseSkill, SkillCache.SKILLID_XP);//技能测试，BattlePanel用到
    }

    private doProgress(): void {
        if (this.stopFlag) {
            return;
        }
        let cd: number = CacheManager.skill.getCd(SkillCache.SKILLID_XP);
        if (cd != -1) {
            let value: number = this.getValueByCd(cd);
            this.updateValue(value);
        }
    }

    /**
     * 根据cd获取进度值
     */
    private getValueByCd(cd: number): number {
        let value: number = 0;
        if (cd != -1) {
            this.leftTime = cd - egret.getTimer();
            if (!this.isOk && this.leftTime <= 0) {//由false变true才触发
                this.isOk = true;
                CacheManager.guide.onHejiOk(true);
                EventManager.dispatch(LocalEventEnum.HomeHejiOk);
            }
            this.isOk = this.leftTime <= 0;
            if (this.isOk) {
                value = this.colldown;
            } else {
                value = this.colldown - this.leftTime;
                if (value < 0) {
                    value = 0;
                }
            }
        }
        return value;
    }

    private checkLock(): void {
        let isNotCd:boolean = CacheManager.skill.getCd(SkillCache.SKILLID_XP) <= 0; //是否有冷却时间
        let b:boolean = CacheManager.skill.isXpSkillOpened?isNotCd:true;
        this.lockImg.visible = b;
    }

    private onSkillUPdate(): void {
        this.checkLock();
        this.startCoolDown();
    }

    private test(): void {
        var angle: number = -90;
        egret.startTick((timeStamp: number): boolean => {
            angle += 1;
            this.changeGraphics(angle);
            angle = angle % 360;
            return true;
        }, this);
    }

    /**
     * 更新特效点左边
     * @param angle角度
     */
    private updateMCPointPos(angle: number): void {
        let r: number = 49;//光效的圆要小些
        let rx: number = 51;
        let ry: number = 51;
        let pointX: number = r * Math.sin(angle * Math.PI / 180) + rx;
        let pointY: number = r * Math.cos(angle * Math.PI / 180) + ry;
        if (this.mcPoint) {
            this.mcPoint.x = pointX;
            this.mcPoint.y = pointY;
        }
    }
}