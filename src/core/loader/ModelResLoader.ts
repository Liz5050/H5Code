/**
 * 模型资源加载器
 * @author Chris
 */
class ModelResLoader
{
    private static NO_GC_URLs:string[] = [
        "resource/assets/rpgGame/skill/9999"
        , "resource/assets/rpgGame/skill/99999"
    ];
    //不回收标识：默认回收，true代表不回收
    public static RES_NO_GC_FLAG:boolean;

    public static LOG:any[] = [];
    private name:string;

    private callParams:any[];

    private compFunc:Function;

    private errorFunc:Function;

    private thisObj:any;

    private jsonData:any;

    private pngData:egret.Texture;

    private loadedCount:number = 0;

    public constructor()
    {
    }

    /**
     * 加载模型
     */
    public getResByUrl(name:string, compFunc: Function, thisObject: any, loaderPriority:ELoaderPriority = ELoaderPriority.DEFAULT, callParams:any[] = null, errorFunc:Function = null):any
    {
        this.name = name;
        this.compFunc = compFunc;
        this.thisObj = thisObject;
        this.callParams = callParams;
        this.errorFunc = errorFunc;
        let jsonUrl:string = name + ".json";
        App.LoaderManager.getResByUrl(jsonUrl, this.loadJsonReturn, this, loaderPriority, [jsonUrl]);
        let pngUrl:string = name + ".png";
        App.LoaderManager.getResByUrl(pngUrl, this.loadPngReturn, this, loaderPriority, [pngUrl]);
    }

    /**
     * 加载json返回
     */
    private loadJsonReturn(jsonName:string):void
    {
        this.jsonData = App.LoaderManager.getCache(jsonName);
        this.loadedCount++;
        this.handleData();
    }

    /**
     * 加载png返回
     */
    private loadPngReturn(pngName:string):void
    {
        this.pngData = App.LoaderManager.getCache(pngName);
        this.loadedCount++;
        this.handleData();
    }

    private handleData():void
    {
        // if (data == null)
        // {//加载失败
        //     Log.trace(Log.LOAD, "资源" + this.name + "." + extName + "不存在");
        // }
        if (this.makeMovieClipData())
        {
            if (this.compFunc)
            {
                this.compFunc.apply(this.thisObj, this.callParams);
            }
        }
        else if (this.loadedCount >= 2)
        {
            if (this.errorFunc)
            {
                this.errorFunc.apply(this.thisObj, this.callParams);
            }
        }
        if (this.loadedCount >= 2)
        {
            this.reset();
        }
    }

    /**
     * 制作动画内容
     * @returns {boolean}
     */
    private makeMovieClipData():boolean
    {
        if (this.jsonData && this.pngData)
        {
            let factory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(this.jsonData, this.pngData);//ObjectPool.pop("egret.MovieClipDataFactory");
            let temp = this.name.split("/");
            let tempName = temp.pop();
            let newMcClipData:egret.MovieClipData = factory.generateMovieClipData(tempName);
            let refMovieClipData:RefMovieClipData = ObjectPool.pop("RefMovieClipData");
            refMovieClipData.setMovieClipData(newMcClipData, this.name);
            refMovieClipData.lastTime = egret.getTimer();//防止一加载成功就被清理掉
            //refMovieClipData.setMovieClipDataSource(this.jsonData, this.pngData, tempName);
            //缓存refMovieClipData
            let canGC:boolean = ModelResLoader.NO_GC_URLs.indexOf(this.name) == -1;
            if (DEBUG) {
                if (ModelResLoader.RES_NO_GC_FLAG) {
                    canGC = false;
                }
            }
            CacheManager.res.putModelCache(this.name, refMovieClipData, canGC);

            // if (!ModelResLoader.BMC) {
            //     let data:BitmapMovieClipData = ObjectPool.pop("BitmapMovieClipData");
            //     data.setSource(this.name, this.jsonData, this.pngData);
            //     ModelResLoader.BMC = data;
            // }

            if (this.pngData.textureWidth > 2048)
                Log.trace(Log.MODEL, `警告!!!资源尺寸超过2048--->${this.name}, 请策划确认是否有必要!`);
            return true;
        }
        return false;
    }

    public static printLog():void
    {
        let logStr:string = "";
        let url:string;
        for (url in ModelResLoader.LOG)
        {
            logStr += "url:" + url + ">>>decodeCost:" + ModelResLoader.LOG[url] + "\n";
        }
        Log.trace(Log.MODEL, logStr);
    }

    private reset():void
    {
        this.loadedCount = 0;
        this.jsonData = null;
        this.pngData = null;
        this.name = null;
        this.callParams = null;
        this.compFunc = null;
        this.errorFunc = null;
        this.thisObj = null;
        ObjectPool.push(this);
    }

}