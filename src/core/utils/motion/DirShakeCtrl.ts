/**
 * 方向振动控制器
 * @author Chris
 * **/
class DirShakeCtrl implements IShakeCtrl {
    /**
     * 控制对象.
     * **/
    private gDisplayObject: egret.DisplayObject;

    /**
     * 起始x.
     * **/
    private gOX: number;

    /**
     * 起始y.
     * **/
    private gOY: number;

    /**
     * 振幅
     * **/
    private gIntensity: number;
    /**
     * 震动速度，即帧间隔delay
     * **/
    private gSpeed: number;
    /**
     * 震动秒毫数
     * **/
    private gShakeTime: number;
    /**
     * 计时秒毫数
     * **/
    private gCountTime: number;
    /**
     * 上一次震动时间
     * **/
    private gLastShakeTime: number;
    /**
     * 震动索引
     * **/
    private gQuakeIndex: number;
    /**
     * 弧度
     */
    private gAngle: number;
    /**
     * 是否当前正在震屏.
     * **/
    private gIsShaking: Boolean = false;
    /**
     *振动时的回调函数
     */
    private gUpdateFunction: Function;
    /**
     * 是否初始化.
     * **/
    public gIsInit: Boolean = false;
    /**
     * 增幅.[频率，增/减幅，作用次数]
     * **/
    private gIncreaseData: any;
    /**
     * 增幅作用次数
     * **/
    private gIncreaseCount: number;
    /**
     * 增幅作用时间
     * **/
    private gIncreaseWorkTime: number;
    /**
     * 角度是否反转
     */
    private isBackward:boolean = true;

    public constructor() {
    }

    /**
     * 设定震动参数
     * @param {egret.DisplayObject} cusDisplayObject
     * @param {number} cusAngle
     * @param {number} cusData
     * @param {Function} cusUpdateCallBack
     */
    public setData(cusDisplayObject: egret.DisplayObject, cusData: any, cusAngle: number = 0, cusUpdateCallBack: Function = null): void {
        this.gDisplayObject = cusDisplayObject;
        this.gAngle = cusData.angle ? MathUtils.getPositiveAngle(cusData.angle * 180 / Math.PI) : cusAngle;
        this.gOX = this.gDisplayObject.x;
        this.gOY = this.gDisplayObject.y;
        this.gIntensity = cusData.intensity;
        this.gShakeTime = cusData.time;
        this.gSpeed = cusData.speed;
        this.gUpdateFunction = cusUpdateCallBack;
        this.gIncreaseData = cusData.increase ? cusData.increase.concat() : null;
        this.isBackward = cusData.isBackward != undefined ? cusData.isBackward : true;
        this.gIsInit = true;
    }

    /**
     * 执行震动.
     * **/
    public startShake(): void {
        this.gQuakeIndex = 0;
        if (this.gIsInit == false) {
            return;
        }
        if (this.gIsShaking) {
            return;
        }
        this.gIsShaking = true;
        this.gCountTime = 0;
        this.gLastShakeTime = 0;
        this.gIncreaseCount = 0;
        this.gIncreaseWorkTime = this.gIncreaseData ? this.gShakeTime * this.gIncreaseData[0] / 100 : 0;
        let _dc: number = this.gSpeed > 0 ? this.gSpeed : 17;
        let _repeat: number = this.gShakeTime > 0 ? this.gShakeTime / this.gSpeed >> 0 : 3;
        App.TimerManager.doTimer(_dc, _repeat, this.quake, this, this.stopShake,this);
    }

    /**
     * 震动中.
     * **/
    private quake(): void {
        let now: number = egret.getTimer();
        if (this.gLastShakeTime > 0) {
            this.gCountTime += (now - this.gLastShakeTime);
        }
        this.gLastShakeTime = now;
        if (this.gIncreaseData) {
            if (this.gCountTime >= this.gIncreaseWorkTime && this.gIncreaseCount < this.gIncreaseData[2]) {
                this.gIntensity += this.gIntensity * this.gIncreaseData[1] / 100;
                this.gIncreaseWorkTime += (this.gShakeTime - this.gIncreaseWorkTime) * this.gIncreaseData[0] / 100;
                this.gIncreaseCount++;
            }
        }

        let _myIntensity: number = this.gIntensity / 2 * 0.8 + (this.gIntensity / 2 * 0.2 * Math.random());
        if (this.gQuakeIndex == 0) {
            this.gDisplayObject.x = this.gOX + _myIntensity * Math.cos(this.gAngle);
            this.gDisplayObject.y = this.gOY + _myIntensity * Math.sin(this.gAngle);
        }
        else {
            //				trace(_myIntensity*Math.cos(gAngle + Math.PI),_myIntensity*Math.sin(gAngle + Math.PI))
            this.gDisplayObject.x = this.gOX + _myIntensity * Math.cos(this.gAngle + Math.PI);
            this.gDisplayObject.y = this.gOY + _myIntensity * Math.sin(this.gAngle + Math.PI);
        }
        if(this.isBackward) this.gQuakeIndex = 1 - this.gQuakeIndex;
        if (this.gUpdateFunction != null) {
            this.gUpdateFunction();
        }
    }

    /**
     * 停止震动.
     * **/
    public stopShake(): void {
        if (!this.gIsShaking) return;
        this.gIsShaking = false;
        this.gDisplayObject.x = this.gOX;
        this.gDisplayObject.y = this.gOY;
        this.gUpdateFunction = null;
        this.gDisplayObject = null;
        this.gIncreaseData = null;
        this.gIncreaseCount = 0;
        this.gIncreaseWorkTime = 0;
        App.TimerManager.remove(this.quake, this);
    }
}