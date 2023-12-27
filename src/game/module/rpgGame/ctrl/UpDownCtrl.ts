/**
 * 上下缓动控制器
 */
class UpDownCtrl {
    private gCtrlTarget: egret.DisplayObjectContainer;

    private gStartY: number;

    private gRange: number;

    private gSpeed: number = 0;

    private gWork: boolean = false;

    private gStep: number;

    private static RANGE: number = 4;

    private static SPEED: number = 0.4;

    public constructor(target: egret.DisplayObjectContainer) {
        this.gCtrlTarget = target;
    }

    public start(startY: number = 0): void {
        if (this.gWork) return;
        this.gStartY = startY;
        this.gRange = UpDownCtrl.RANGE;
        this.gSpeed = UpDownCtrl.SPEED;
        this.gWork = true;
    }

    public update(): void {
        this.gStep++;
        if (this.gWork && this.gStep % 2 == 0) {
            this.gCtrlTarget.y = this.gCtrlTarget.y + this.gSpeed;
            let _targetY: number = this.gRange + this.gStartY;
            if (this.gRange < 0) {
                if (this.gCtrlTarget.y < _targetY) {
                    this.gCtrlTarget.y = _targetY;
                }
            }
            else if (this.gCtrlTarget.y > _targetY) {
                this.gCtrlTarget.y = _targetY;
            }
            if (_targetY == this.gCtrlTarget.y) {
                this.gRange = -this.gRange;
                this.gSpeed = -this.gSpeed;
            }
        }
    }

    public stop(viewY: number = 0): void {
        if (this.gWork == false) return;
        this.gCtrlTarget.y = viewY;
        this.gWork = false;
    }

    public reset(): void {
        this.gStep = 0;
        this.gCtrlTarget.y = 0;
        this.gWork = false;
    }
}