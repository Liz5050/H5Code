/**
 * 分帧处理
 */
class FrameExecutor {
    private delayFrame:number;
    private functions:Array<Array<any>>;
    private frameDelay:FrameDelay;
    private isRuning:boolean;

    /**
     * 构造函数
     */
    public constructor($delayFrame:number) {
        this.delayFrame = $delayFrame;
        this.frameDelay = new FrameDelay();
        this.functions = new Array();
    }

    /**
     * 注册要分帧处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    public regist($func:Function, $thisObj:any):void {
        this.functions.push([$func, $thisObj]);
    }

    /**
     * 执行
     */
    public execute():void {
        if(!this.isRuning) {
            if(this.functions.length) {
                this.isRuning = true;
                this.deal();
            }
        }
    }

    private deal():void {
        if (this.functions.length) {
            var arr:Array<any> = this.functions.shift();
            arr[0].call(arr[1]);
            this.frameDelay.delayCall(this.delayFrame, this.deal, this);
        }
        else {
            this.isRuning = false;
        }
    }

    /**
     * 直接清理剩余分帧函数
     */
    public clear():void {
        this.functions = [];
        this.frameDelay.clearCall();
        this.isRuning = false;
    }
}
