/**
 * 偏移控制器 
 */
class OffsetCtrl {
    /**
     * 控制的显示对象 
     */
    private gView: egret.DisplayObjectContainer;
    /**
     * 偏移数据 
     */
    private gOffsetData: any;
    /**
     * 更新function 
     */
    private gUpdateFun: Function;

    public constructor(cusView: egret.DisplayObjectContainer) {
        this.gView = cusView;
    }

    /**
     * 跳跃 
     * @param cusTime
     * @param cusG
     * @param cusUpdateCallBack
     * @param cusTopCallBack
     * @param cusCompCallBack
     * 
     */
    public Jump(cusTime: number, cusG: number, originY: number, cusMinHeight: number, cusMaxHeight: number, cusUpdateCallBack: Function = null, cusTopCallBack: Function = null, cusCompCallBack: Function = null): void {
        this.gOffsetData = {};
        this.gOffsetData.updateCallBack = cusUpdateCallBack;
        this.gOffsetData.topCallBack = cusTopCallBack;
        this.gOffsetData.compCallBack = cusCompCallBack;
        this.gOffsetData.g = cusG;
        this.gOffsetData.startTime = egret.getTimer();
        this.gOffsetData.lastTime = 0;
        this.gOffsetData.startZ = this.gView.y;
        this.gOffsetData.originZ = originY;
        this.gOffsetData.totalTime = cusTime;
        this.gOffsetData.startSpdZ = -(this.gOffsetData.g * this.gOffsetData.totalTime + (this.gOffsetData.startZ - originY) / this.gOffsetData.totalTime);

        var _time: number = (this.gOffsetData.totalTime >> 1);
        var _maxHeight: number = this.gOffsetData.startZ + (this.gOffsetData.startSpdZ + this.gOffsetData.g * _time) * _time;

        if (_maxHeight < cusMaxHeight) {
            this.gOffsetData.g = -2 * ((cusMaxHeight - this.gOffsetData.startZ) * 2 / this.gOffsetData.totalTime + this.gOffsetData.startZ / this.gOffsetData.totalTime) / this.gOffsetData.totalTime;
            this.gOffsetData.startSpdZ = -(this.gOffsetData.g * this.gOffsetData.totalTime + (this.gOffsetData.startZ - originY) / this.gOffsetData.totalTime);
        }
        else if (_maxHeight > cusMinHeight) {
            this.gOffsetData.g = -2 * ((cusMinHeight - this.gOffsetData.startZ) * 2 / this.gOffsetData.totalTime + this.gOffsetData.startZ / this.gOffsetData.totalTime) / this.gOffsetData.totalTime;
            this.gOffsetData.startSpdZ = -(this.gOffsetData.g * this.gOffsetData.totalTime + (this.gOffsetData.startZ - originY) / this.gOffsetData.totalTime);
        }
        this.gOffsetData = this.JumpUpdate;
    }
    /**
     * 跳跃step 
     * 
     */
    private JumpUpdate(): void {
        var _time: number = (egret.getTimer() - this.gOffsetData.startTime);

        if (_time > this.gOffsetData.totalTime) {
            _time = this.gOffsetData.totalTime;
        }

        var _t2: number;
        var _k: number = 0.3;
        if (_time < (this.gOffsetData.totalTime * _k)) {
            _t2 = (this.gOffsetData.totalTime >> 1) * _time / (this.gOffsetData.totalTime * _k);
        }
        else {
            _t2 = (this.gOffsetData.totalTime >> 1) + (this.gOffsetData.totalTime >> 1) * (_time - (this.gOffsetData.totalTime * _k)) / (this.gOffsetData.totalTime * (1 - _k));
        }

        this.gView.y = (this.gOffsetData.startZ + ((this.gOffsetData.startSpdZ + (this.gOffsetData.g * _t2)) * _t2));//this.gOffsetData.originZ + 

        if (this.gOffsetData.updateCallBack != null) {
            this.gOffsetData.updateCallBack();
        }

        if ((this.gOffsetData.lastTime < (this.gOffsetData.totalTime * _k)) && (_time > (this.gOffsetData.totalTime * _k))) {
            if (this.gOffsetData.topCallBack != null) {
                this.gOffsetData.topCallBack();
            }
        }

        if (this.gOffsetData.lastTime >= this.gOffsetData.totalTime) {
            if (this.gOffsetData.compCallBack != null) {
                this.gOffsetData.compCallBack();
            }
            if (this.gOffsetData == null || this.gOffsetData.lastTime >= this.gOffsetData.totalTime) {
                this.cleanUpdateFun(this.JumpUpdate);
            }
        }
        else {
            this.gOffsetData.lastTime = _time;
        }
    }

    /**
     * 直线缓动
     * @param cusTime 缓动时间
     * @param cusX 缓动到x -1表示不缓动x
     * @param cusY 缓动到y -1表示不缓动y
     */
    public tweenTo(cusTime: number, cusX: number, cusY: number, cusUpdateFunc: Function = null, cusComFunc: Function = null): void {
        this.gOffsetData = new Object();
        this.gOffsetData.updateCallBack = cusUpdateFunc;
        this.gOffsetData.compCallBack = cusComFunc;
        if (cusY != -1) {
            this.gOffsetData.speedY = (cusY - this.gView.y) / cusTime;
        }
        if (cusX != -1) {
            this.gOffsetData.speedX = (cusX - this.gView.x) / cusTime;
        }
        this.gOffsetData.startTime = egret.getTimer();
        this.gOffsetData.lastTime = 0;
        this.gOffsetData.startZ = this.gView.y;
        this.gOffsetData.startX = this.gView.x;
        this.gOffsetData.totalTime = cusTime;
        this.gOffsetData = this.tweenToUpdate;
    }

    private tweenToUpdate(): void {
        var _time: number = (egret.getTimer() - this.gOffsetData.startTime);
        if (_time > this.gOffsetData.totalTime) {
            _time = this.gOffsetData.totalTime;
        }

        if (this.gOffsetData.hasOwnProperty("speedY")) {
            this.gView.y = this.gOffsetData.startZ + this.gOffsetData.speedY * _time;
        }
        if (this.gOffsetData.hasOwnProperty("speedX")) {
            this.gView.x = this.gOffsetData.startX + this.gOffsetData.speedX * _time;
        }
        if (this.gOffsetData.updateCallBack != null) {
            this.gOffsetData.updateCallBack();
        }
        if (this.gOffsetData.lastTime >= this.gOffsetData.totalTime) {
            if (this.gOffsetData.compCallBack != null) {
                this.gOffsetData.compCallBack();
            }
            if (this.gOffsetData == null || this.gOffsetData.lastTime >= this.gOffsetData.totalTime) {
                this.cleanUpdateFun(this.tweenToUpdate);
            }
        }
        else {
            this.gOffsetData.lastTime = _time;
        }
    }

    /**
     * 更新 
     */
    public update(): void {
        if (this.gOffsetData != null) {
            this.gOffsetData();
        }
    }
    /**
     * 清理 
     * @param cusFun
     * 
     */
    private cleanUpdateFun(cusFun: Function): void {
        if (this.gOffsetData == cusFun) {
            this.gOffsetData = null;
            this.gOffsetData = null;
        }
    }
    /**
     * 重置 
     */
    public reset(): void {
        this.gOffsetData = null;
        this.gOffsetData = null;
    }
}