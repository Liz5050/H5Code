/**
 * 振动控制器
 * @author Chris
 * **/
class ShakeCtrl implements IShakeCtrl
{
    /**
     * 是否当前正在震屏.
     * **/
    private gIsShaking:Boolean = false;

    /**
     * 控制对象.
     * **/
    private gDisplayObject:egret.DisplayObject;

    /**
     * 起始x.
     * **/
    private gOX:number;

    /**
     * 起始y.
     * **/
    private gOY:number;

    /**
     * 振幅
     * **/
    private gIntensity:number;

    /**
     * x振幅
     * **/
    private gIntensity_x:number;

    /**
     * y振幅
     * **/
    private gIntensity_y:number;

    /**
     * 振源
     * **/
    private gIntensityOffset:number;

    /**
     * 震动毫秒
     * **/
    private gShakeTime:number;
    /**
     * 计时秒毫数
     * **/
    private gCountTime: number;
    /**
     * 上一次震动时间
     * **/
    private gLastShakeTime: number;

    /**
     * 震动速度，即帧间隔delay
     * **/
    private gSpeed:number;

    /**
     * 震动间隔
     * **/
    private gRepeatDelay:number;

    /**
     * 是否初始化.
     * **/
    public gIsInit:Boolean = false;
    /**
     *振动时的回调函数
     */
    private gUpdateFunction:Function;
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

    public constructor()
    {
    }

    /**
     * 设定震动参数.
     * cusShakeTime 震动秒数
     * cusRepeat 震动次数，该值大于0时忽略cusShakeTime震动秒数
     * cusRepeatDelay 震动间隔，n帧震动1次
     * **/
    public setData(cusDisplayObject:egret.DisplayObject, cusData:any, cusAngle:number = 0, cusUpdateCallBack:Function = null):void
    {
        this.gIsInit = true;
        this.gDisplayObject = cusDisplayObject;
        this.gOX = this.gDisplayObject.x;
        this.gOY = this.gDisplayObject.y;
        this.gIntensity = cusData.intensity;
        this.gIntensity_x = cusData.tx || 0;
        this.gIntensity_y = cusData.ty || 0;
        this.gIntensityOffset = cusData.intensity / 2;
        this.gShakeTime = cusData.time;
        this.gSpeed = cusData.speed;
        this.gUpdateFunction = cusUpdateCallBack;
        this.gIncreaseData = cusData.increase ? cusData.increase.concat() : null;
    }

    /**
     * 执行震动.
     * **/
    public startShake():void
    {
        if(this.gIsInit == false)
        {
            return;
        }
        if(this.gIsShaking)
        {
            return;
        }
        this.gIsShaking = true;
        this.gCountTime = 0;
        this.gLastShakeTime = 0;
        this.gIncreaseCount = 0;
        this.gIncreaseWorkTime = this.gIncreaseData ? this.gShakeTime * this.gIncreaseData[0] / 100 : 0;
        let _dc:number = this.gSpeed > 0 ? this.gSpeed : 17;
        let _repeat:number = this.gShakeTime > 0 ? this.gShakeTime / this.gSpeed >> 0 : 3;
        App.TimerManager.doTimer(_dc, _repeat, this.quake, this, this.stopShake);//trace("startShake:", _dc, _repeat, getTimer());
    }

    /**
     * 震动中.
     * **/
    private quake():void
    {
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

        if(this.gIntensity != 0)
        {
            this.gDisplayObject.x = this.gOX + Math.random() * this.gIntensity - this.gIntensityOffset;
            this.gDisplayObject.y = this.gOY + Math.random() * this.gIntensity - this.gIntensityOffset;
        }
        else
        {
            this.gDisplayObject.x = this.gOX + Math.random() * this.gIntensity_x - this.gIntensity_x * 0.5;
            this.gDisplayObject.y = this.gOY + Math.random() * this.gIntensity_y - this.gIntensity_y * 0.5;
        }
    //						trace("quake:", gDisplayObject.x, gDisplayObject.y, getTimer());
        if(this.gUpdateFunction != null)
        {
            this.gUpdateFunction();
        }
    }

    /**
     * 停止震动.
     * **/
    public stopShake():void
    {
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
    //						trace("stpoQuake:", gDisplayObject.x, gDisplayObject.y, getTimer());
    }

}