class BitmapMovieClipData {
    private static TOTAL_COUNT:number = 0;
    private gName:string;
    private gUseTime: number;
    private gLastUseTime: number = 0;
    private gHasInit: boolean = false;

    private gConfig: any;
    private gSource: egret.SpriteSheet;
    private gFrameList: BitmapFrame[];
    private gLabelDict: {[lable:string] : {startFrame, endFrame}};
    private gFrameRate: number = 0;

    public constructor() {
        BitmapMovieClipData.TOTAL_COUNT++;
    }

    /**
     * 设置配置，纹理
     * @param  {string} cusName
     * @param  {string} cusJson
     * @param  {egret.Texture} cusTexture
     * @returns boolean
     */
    public setSource(cusName:string, cusJson: string, cusTexture: egret.Texture): boolean {
        if (this.gHasInit) {
            return true;
        }
        if (!cusJson || !cusTexture) {
            return false;
        }
        this.gName = cusName;
        this.gConfig = cusJson;
        this.gSource = new egret.SpriteSheet(cusTexture);
        return this.initSourceData();
    }

    /**
     * 初始化资源
     * @returns boolean
     */
    private initSourceData(): boolean {
        if (this.gSource && this.gConfig) {
            this.gFrameList = [];
            this.gLabelDict = {};
            let mcs:any = this.gConfig.mc;
            let res:any = this.gConfig.res;
            let mc:any;
            for (let name in mcs) {
                mc = mcs[name];
                this.gFrameRate = mc.frameRate;
                for (let obj of mc.frames) {
                    let _resObj: any = res[obj.res];
                    this.gSource.createTexture(obj.res, _resObj.x, _resObj.y, _resObj.w, _resObj.h);
                    let _frameData: BitmapFrame = new BitmapFrame(this.gSource, obj.res, _resObj.x, _resObj.y, _resObj.w, _resObj.h, obj.x, obj.y);
                    this.gFrameList.push(_frameData);
                }
                for (let obj of mc.labels) {
                    this.gLabelDict[obj.name] = {startFrame:obj.frame, endFrame:obj.end};
                }
                break;
            }

            this.gHasInit = true;
        }
        return this.gHasInit;
    }

    public get hasInit(): boolean {
        return this.gHasInit;
    }


    /**
     * 获取当前数据中帧数.
     */
    public get length(): number {
        if (this.gFrameList == null) {
            return 0;
        }
        return this.gFrameList.length;
    }

    public getFrameData(cusFrame: number): BitmapFrame {
        return this.gFrameList[cusFrame - 1];
    }

    public getLabelData(cusLabel: string): any {
        return this.gLabelDict[cusLabel];
    }

    public getFrameRate(): number {
        return this.gFrameRate;
    }

    public get useTime(): number {
        return this.gUseTime;
    }

    public set useTime(cusValue: number) {
        if (this.gUseTime != cusValue) {
            this.gUseTime = cusValue;
            this.gLastUseTime = egret.getTimer();
        }
    }

    public get lastUseTime(): number {
        return this.gLastUseTime;
    }

    public dispose(): void {
        if (this.gSource) {
            this.gSource.dispose();
            this.gSource = null;
        }
        this.gConfig = null;
        this.gFrameRate = 0;
        this.gHasInit = false;

        App.LoaderManager.destroyRes(this.gName + ".json");
        let ret:boolean = App.LoaderManager.destroyRes(this.gName + ".png");
        Log.trace(Log.CLEANUP, ">>>ModelDispose:" + this.gName, "ret->" + ret);
        for (let _frameData of this.gFrameList) {
            _frameData.dispose();
        }
    }
}