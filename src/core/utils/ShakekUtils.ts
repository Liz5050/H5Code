/**
 * 震动
 */
class ShakeUtils extends BaseClass {
    /**
     * 震动id列表
     * @type {any[]}
     */
    private gSceneShakeTimeList:Array<number>=[];
    private gSceneShake:ShakeCtrl;
    private gSceneDirShake:DirShakeCtrl;

    public constructor() {
        super();
    }

    /**
     * 显示对象震动
     */
    public shakeNormal(cusDisplayObject:egret.DisplayObject, shakeType:number, shakeDataIndex:number = 1, shakeData?:any, shakeAngle?:number, shakeUpdateFunc?:Function):IShakeCtrl
    {
        let _quakeData:any = shakeData ? shakeData : ShakeConst["SHAKE_DATA_" + shakeDataIndex];
        let _angle:number = shakeAngle ? shakeAngle : 0;
        let _shakeCtrl:IShakeCtrl = shakeType == ShakeConst.TYPE_SHAKE ? new ShakeCtrl() : new DirShakeCtrl();
        _shakeCtrl.setData(cusDisplayObject, _quakeData, _angle, shakeUpdateFunc);
        _shakeCtrl.startShake();
        return _shakeCtrl;
    }

    /**
     * 场景震动
     */
    public shakeScene(delay:number, shakeType:number, shakeDataIndex:number = 1, shakeData?:any, shakeAngle?:number):void
    {
        if (CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.NoShake]))
            return;
        let _quakeData:any = shakeData ? shakeData : ShakeConst["SHAKE_DATA_" + shakeDataIndex];
        let _angle:number = shakeAngle ? shakeAngle : 0;
        if (delay > 0)
        {
            let _timeoutId:number = egret.setTimeout(this.doShake, this, delay, shakeType, _quakeData, _angle);
            this.gSceneShakeTimeList.push(_timeoutId);
        }
        else
        {
            this.doShake(shakeType, _quakeData, _angle);
        }
    }

    private doShake(cusShakeType:number, cusQuakeData:any, cusQuakeAngle:number):void
    {
        if (this.gSceneShake)
        {
            this.gSceneShake.stopShake()
        }
        if (this.gSceneDirShake)
        {
            this.gSceneDirShake.stopShake();
        }
        if (cusShakeType == ShakeConst.TYPE_SHAKE)
        {
            if (this.gSceneShake == null)
            {
                this.gSceneShake = new ShakeCtrl();
            }
            this.gSceneShake.setData(ControllerManager.rpgGame.view, cusQuakeData/*, redrawScene*/);
            this.gSceneShake.startShake();
        }
        else if (cusShakeType == ShakeConst.TYPE_DIR_SHAKE)
        {
            if (this.gSceneDirShake == null)
            {
                this.gSceneDirShake = new DirShakeCtrl();
            }
            this.gSceneDirShake.setData(ControllerManager.rpgGame.view, cusQuakeData, cusQuakeAngle/*, redrawScene*/);
            this.gSceneDirShake.startShake();
        }
    }

    public cleanShake():void
    {
        if (this.gSceneShake)
        {
            this.gSceneShake.stopShake()
        }
        if (this.gSceneDirShake)
        {
            this.gSceneDirShake.stopShake();
        }
        let _timeId:number;
        while(this.gSceneShakeTimeList.length > 0)
        {
            _timeId = this.gSceneShakeTimeList.pop();
            egret.clearTimeout(_timeId);
        }
    }
}