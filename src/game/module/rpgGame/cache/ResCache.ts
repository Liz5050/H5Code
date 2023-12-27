/**
 * 模型资源缓存管理
 * @author Chris
 */
class ResCache implements ICache
{
    /**
     * 已经缓存的资源
     * **/
    public cacheDic: {[url:string]: {data:any, canGC:boolean}} = {};

    /**
     * 当前已经缓存的资源对象个数.
     * **/
    private cacheNum:number = 0;

    /**
     * 已经缓存的UI界面
     * **/
    public cacheUIDic: {[packageName:string]: {data:BaseGUIView[], canGC:boolean, lastHideTime:number}} = {};

    /**
     * 常驻UI包
     * **/
    private residentUIPackages: string[] = [
            PackNameEnum.Common
            , PackNameEnum.Scene
            , PackNameEnum.Home
            , PackNameEnum.ChatFace
            , PackNameEnum.Num
            , PackNameEnum.Sound
            , PackNameEnum.Guide
            , PackNameEnum.Copy
            , PackNameEnum.Player
            , PackNameEnum.Skill
            , PackNameEnum.Pack
            , PackNameEnum.Chat
        ];

    /**
     * GPU内存阀值
     */
    private static MAX_GPU_MEM:number = 300 * 1024 * 1024;
    /**
     * GPU内存阀值最小值
     */
    private static MIN_GPU_MEM:number = 200 * 1024 * 1024;
    /**
     * 当前销毁等级
     */
    private static RES_GC_LEVEL:number = 1;

    /**
     * MC超过多久要清理，等级1
     */
    private static MC_FAILURE_TIME_L1:number = 60 * 1000;
    /**
     * MC超过多久要清理，等级2
     */
    private static MC_FAILURE_TIME_L2:number = 10 * 1000;

    /**
     * UI超过多久要清理
     */
    private static UI_FAILURE_TIME:number = 5 * 60 * 1000;

    public constructor()
    {
        App.TimerManager.doTimer(5000, 0, this.gcInTime, this);
    }

    public putModelCache(url:string, data:any, canGC:boolean = true):void
    {
        if (this.cacheDic[url] == undefined)
        {
            this.cacheNum++;
            this.cacheDic[url] = {data:data, canGC:canGC};
        }
        else
        {//一般不会有覆盖资源
        }
    }

    public putUICache(packageName:string, view:BaseGUIView, canGC?:boolean):void
    {
        if (this.cacheUIDic[packageName] == undefined)
        {
            if (canGC == undefined)
                canGC = this.residentUIPackages.indexOf(packageName) == -1;
            this.cacheUIDic[packageName] = {data:[view], canGC:canGC, lastHideTime:egret.getTimer()};
        }
        else
        {
            let data:any = this.cacheUIDic[packageName];
            data.lastHideTime = egret.getTimer();
            let views:BaseGUIView[] = data.data;
            if (views.indexOf(view) != -1) views.push(view);
        }
    }

    public getModelCache(url:string):any
    {
        let cache:any = this.cacheDic[url];
        if(cache) return cache.data;
        return null;
    }

    public hasModelCache(url:string):boolean
    {
        return this.cacheDic[url] != undefined;
    }

    private gcInTime():void
    {
        let size:any = this.checkBitmapSize();
        let isForce:boolean = false;
        if (size.total >= ResCache.MAX_GPU_MEM && ResCache.RES_GC_LEVEL == 1) {//超出阀值，把销毁时间降低
            ResCache.RES_GC_LEVEL = 2;
            isForce = true;
        } else if (size.total <= ResCache.MIN_GPU_MEM && ResCache.RES_GC_LEVEL == 2) {
            ResCache.RES_GC_LEVEL = 1;
        }
        let mcFailTime:number =  ResCache["MC_FAILURE_TIME_L" + ResCache.RES_GC_LEVEL];
        let loaderFailTime:number =  GLoader["FAILURE_TIME_L" + ResCache.RES_GC_LEVEL];

        let nowTime:number = egret.getTimer();
        let mcData:RefMovieClipData;
        for (let name in this.cacheDic)
        {
            mcData = this.cacheDic[name].data;
            if (mcData.useTime <= 0
                && (nowTime - mcData.lastTime > mcFailTime || isForce)
                && this.cacheDic[name].canGC)
            {
                // Log.trace(Log.CLEANUP,"模型url：" + name);
                mcData.dispose();
                delete this.cacheDic[name];
                this.cacheNum--;
            }
        }

        GLoader.checkGC(loaderFailTime, isForce);
    }

    public checkBitmapSize() : {total:number, ui:number}
    {
        let alz:any = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
        let fileDic:{[name:string]:egret.Texture} = alz.fileDic;
        let totalMem:number = 0;
        let uiMem:number = 0;
        let texture:egret.Texture;
        for (let name in fileDic) {
            texture = alz.getRes(name);
            if (!texture.bitmapData || !texture.bitmapData.width) continue;
            totalMem += texture.bitmapData.width * texture.bitmapData.height * 4;
            if (name.indexOf('atlas') != -1
                || name.indexOf('assets/avatar') != -1
                || name.indexOf('assets/bg') != -1
                || name.indexOf('assets/icon') != -1
                || name.indexOf('assets/module') != -1
            ) {
                uiMem += texture.bitmapData.width * texture.bitmapData.height * 4;
            }
        }
        return {total:totalMem, ui:uiMem};
    }

    public getResLog(resType:string = RES.ResourceItem.TYPE_IMAGE, isPrint:boolean = false):string[] {
        let log:string[] = [];
        let resTypes:string[];
        if (resType == "all") {
            resTypes = [RES.ResourceItem.TYPE_IMAGE
                , RES.ResourceItem.TYPE_JSON
                , RES.ResourceItem.TYPE_BIN
                , RES.ResourceItem.TYPE_TEXT
                , RES.ResourceItem.TYPE_SHEET
                , RES.ResourceItem.TYPE_SOUND];
        } else {
            resTypes = [resType];
        }
        for (let rT of resTypes) {
            log.push("-------------------" + rT + "-------------------");
            let alz:any = RES.getAnalyzer(rT);
            let fileDic:{[name:string]:egret.Texture} = alz.fileDic;
            let logStr:string = "\n-------------------" + rT + "-------------------\n";
            for (let name in fileDic) {
                logStr += name + "\n";
                log.push(name);
            }
            if (isPrint) Log.trace(Log.CLEANUP, logStr);
        }
        return log;
    }

    public clear(): void
    {

    }
}