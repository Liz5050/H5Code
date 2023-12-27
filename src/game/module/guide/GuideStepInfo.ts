/**
 * 一步指引信息
 */
class GuideStepInfo {
    /**唯一标识code_status_step */
    private _key: string;
    /**code_status */
    public taskKey:string;
    public taskCode: number;
    public type: GuideTypeEnum;
    public step: number = 1;
    /**指引目标名称 */
    public target: string;
    /**指引目标所属类名 */
    public targetClassName: string;
    /**指引目标对象名称 */
    public targetObjName: string;
    /**说明 */
    public desc: string;
    /**箭头方向 */
    public direction: GuideArrowDirection;
    /**扩展数据 */
    public extData: any;
    /**持续时间。毫秒 */
    public timeout: number = 0;
    /**是否可以跳过 */
    public isCanSkip: boolean = true;
    /**箭头xy偏移 */
    public arrowOffsetX: number = 0;
    public arrowOffsetY: number = 0;
    /**美女xy偏移 */
    public belleOffsetX: number = 0;
    public belleOffsetY: number = 0;
    /**圆半径 */
    public radius: number;
    /**指引事件key */
    public eventKey: string;
    /**数据，代码指引事件需要的数据 */
    public eventValue: any;
    /**是否强制 */
    private _isForce: boolean = false;
    /**步骤延迟执行 */
    public delay: number = 0;
    /**箭头偏移 */
    private arrowOffset: string;
    /**美女偏移 */
    private belleOffset: string;

    //气泡类型数据
    public isHasMc: boolean;
    public isCircleMc: boolean = false;
    public mcScaleX: number = 1;
    public mcScaleY: number = 1;
    public mcOffsetX: number = 0;
    public mcOffsetY: number = 0;
    private mc: string;
    private mcScale: string;
    private mcOffset: string;

    public constructor(key: string, cfg: any) {
        if (cfg != null) {
            this.type = cfg.guideType;
            this.target = cfg.target;
            if (cfg.isCanSkip != null) {
                this.isCanSkip = cfg.isCanSkip;
            }
            if (GuideUtil.isObjTarget(this.target)) {
                let a: Array<string> = cfg.target.split("#");
                this.targetClassName = a[0];
                this.targetObjName = a[1];
            }
            if (cfg.tip != null) {
                this.desc = cfg.tip;
            }
            if (cfg.direction != null) {
                this.direction = cfg.direction;
            }
            if (cfg.duration != null) {
                this.timeout = cfg.duration;
            }
            
            if (cfg.belleOffset != null) {
                let a: Array<string> = cfg.belleOffset.split(",");
                this.belleOffsetX = Number(a[0]);
                this.belleOffsetY = Number(a[1]);
            }
            if (cfg.radius != null) {
                this.radius = cfg.radius;
            }
            if (cfg.eventKey) {
                this.eventKey = cfg.eventKey;
            }
            if (cfg.eventValue != null) {
                this.eventValue = cfg.eventValue;
            }

            if (cfg.mc != null) {
                this.mc = cfg.mc;
                this.isCircleMc = this.mc == "circle";
            }
            this.isHasMc = cfg.mc != null;
            if (cfg.mcScale != null) {
                this.mcScale = cfg.mcScale;
                let a: Array<string> = cfg.mcScale.split(",");
                this.mcScaleX = Number(a[0]);
                this.mcScaleY = Number(a[1]);
            }
            
            if (cfg.forge != null) {
                this._isForce = cfg.forge;
            }
            if (cfg.step != null) {
                this.step = cfg.step;
            }
            if (cfg.extData != null) {
                this.extData = JSON.parse(cfg.extData);
                if (this.extData.delay != null) {
                    this.delay = this.extData.delay;
                }
                if (this.extData.timeout != null) {
                    this.timeout = this.extData.timeout;
                }
                if (this.extData.arrowOffset != null) {
                    let a: Array<string> = this.extData.arrowOffset.split(",");
                    this.arrowOffsetX = Number(a[0]);
                    this.arrowOffsetY = Number(a[1]);
                }
                if (this.extData.mcOffset != null) {
                    this.mcOffset = this.extData.mcOffset;
                    let a: Array<string> = this.extData.mcOffset.split(",");
                    this.mcOffsetX = Number(a[0]);
                    this.mcOffsetY = Number(a[1]);
                }
            }

            this._key = key + "_" + this.step;

            //设置默认参数
            this.setDefParam();
        }
    }

    public get key(): string {
        return this._key;
    }

    /**
     * 是否为指引释放合击技能
     */
    public get isHejiStep(): boolean {
        return this.type == GuideTypeEnum.HejiClick;
    }

    /**
     * 是否为指引返回
     */
    public get isReturnStep(): boolean {
        return this.target == GuideTargetName.NavbarReturnBtn;
    }

    /**触发类型 */
    public get triggerType(): GuideTriggerType {
        if (this.extData != null && this.extData.trigger != null) {
            return this.extData.trigger;
        }
        return GuideTriggerType.TaskStatus;
    }

    public get isForce(): boolean {
        return this._isForce;
    }

    /**
     * 设置指引步骤默认参数
     */
    private setDefParam(): void {
        if (this.type == GuideTypeEnum.TaskTalk) {
            this.target = GuideTargetName.TaskDialogGetBtn;
            this.targetClassName = GuideTargetName.TaskDialogGetBtn.split("#")[0];
            this.targetObjName = GuideTargetName.TaskDialogGetBtn.split("#")[1];
            this._isForce = true;
            this.direction = GuideArrowDirection.Bottom;
        } else if (this.isHejiStep || this.isReturnStep) {
            this.radius = 51;
        }
        if (this.isHejiStep || this.triggerType == GuideTriggerType.TaskTraceClick) {//默认不能直接指引
            GuideCondition.setCanGuide(this.key, false);
        }
    }
}