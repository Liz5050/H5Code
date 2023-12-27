/**
 * 震动接口
 */
interface IShakeCtrl
{
    setData(cusDisplayObject:egret.DisplayObject, cusData:any, cusAngle:number, cusUpdateCallBack:Function):void;
    startShake():void;
    stopShake():void;
}