/**
 * 游戏加载管理器
 * @author Chris
 */
class LoaderManager extends BaseClass
{
    /**最大并行下载数量*/
    private static MAX_LOADIND_THREAD: number = 4;
    /**最大加载失败重新尝试次数*/
    private static MAX_ERROR_RETRY: number = 1;
    /**最大加载超时时间 单位:秒*/
    private static MAX_LOAD_TIMEOUT: number = 10;
    /** 加载失败记录*/
    public static ERR_DIC:any = {};
    /** 加载失败最高次数*/
    public static ERR_MAX_NUM:number = 1;
    /** 日志加载标识*/
    public static LOG:boolean = true;

    /** 加载请求队列*/
    public priorityList:Array<Array<LoaderVo>>;
    /** 加载优先级队列*/
    public epList:Array<ELoaderPriority>;
    /** 加载中字典*/
    private loadingDict: { [url: string]: LoaderVo } = {};
    /** 当前正在加载中的队列，最大长度MAX_LOADIND_THREAD*/
    private curLoadingList:LoaderVo[] = [];
    /** 加载日志字典*/
    private loadLogDict: { [url: string]: LoaderVo };
    /** 通过url加载的资源，保存引用用于快速返回和查询*/
    private urlCompResDict:{[url:string]:any} = {};
    /** 正在加载的线程计数*/
    private loadingCount: number = 0;
    /** 回调字典*/
    private callbackDict: { [url: string]: Array<{name: string, compFunc: Function, thisObj: any, callParams:any[], errorFunc:Function}> } = {};
    /** 地图加载队列*/
    private mapLoadList:Array<any> = [];
    /** 加载组字典-[组名]:resCfg[]*/
    private groupDict:{ [groupName: string]: any[] } = {};
    /** fui包加载组字典*/
    private packageGroupDict:{ [groupName: string]: PackageResVo[] } = {};
    public constructor()
    {
        super();
        RES.setMaxLoadingThread(LoaderManager.MAX_LOADIND_THREAD);
        RES.setMaxRetryTimes(LoaderManager.MAX_ERROR_RETRY);
        this.initPriorityList();
        this.initLoadLog();
        this.initTimer();

        // RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onLoadGroupComp, this);
        // RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onLoadGroupProgress, this);
        // RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onLoadGroupError, this);
        // RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
    }

    private initPriorityList(): void
    {
        this.priorityList = [];
        let plist:Array<ELoaderPriority> = LoaderPriority.NORMAL_PLIST;
        for (let i:number = 0; i < plist.length; i++)
        {
            this.priorityList[plist[i]] = [];
        }
        this.epList = plist;
    }

    /** 获取加载优先级队列*/
    private getPriorityList(priority: ELoaderPriority): Array<LoaderVo> {
        let plist: Array<LoaderVo> = this.priorityList[priority];
        if (plist == null) {
            plist = this.priorityList[ELoaderPriority.DEFAULT];
        }
        return plist
    }

    private initLoadLog():void {
        if (LoaderManager.LOG) {
            this.loadLogDict = {};
        }
    }

    private addLoadLog(vo:LoaderVo):void {
        if (LoaderManager.LOG) {
            this.loadLogDict[vo.name] = vo;
        }
    }

    private initTimer():void {
        App.TimerManager.doTimer(120, 0, this.loadMap, this);
        App.TimerManager.doTimer(1000, 0, this.checkTimeout, this);
    }

    private loadMap():void {//地图加载
        while (this.mapLoadList.length > 0) {
            let loadInfo:any = this.mapLoadList.shift();
            if (loadInfo.valid) {
                this.getResAsync(loadInfo.name, loadInfo.compFunc, loadInfo.thisObj, loadInfo.loaderPriority);
                break;
            }
        }
    }

    private checkTimeout():void {//判断当前正在加载是否超时
        let nowTime:number = egret.getTimer();
        for (let vo of this.curLoadingList) {
            if (nowTime - vo.startLoadTime > LoaderManager.MAX_LOAD_TIMEOUT * 1000) {//超时，这里可以作超时操作，例如中断该加载（引擎没接口，待处理）
                Log.trace(Log.LOAD, "加载超时--->" + vo.name);
                this.loadComp(null, vo.name, false);//超时，从列表删除
            }
        }
    }

    public getLoadLog(nameFilter:string = null):{log:string, logList:string[]} {
        let logList:string[] = [];
        let log:string = "";
        if (LoaderManager.LOG) {
            let logArr: Array<LoaderVo> = [];
            for (let name in this.loadLogDict) {
                logArr.push(this.loadLogDict[name]);
            }

            logArr.sort(function (v1: LoaderVo, v2: LoaderVo): number {
                return v1.addLoadDate - v2.addLoadDate;
            });
            let logOne:string;
            for (let i = 0; i < logArr.length; i++) {
                if (!nameFilter || logArr[i].name.indexOf(nameFilter) != -1) {
                    logOne = "[" + (i + 1) + "] " + logArr[i].log();
                    logList.push(logOne);
                    log += logOne + "\n";
                }
            }
        }
        return {log:log, logList:logList};
    }

    public printLoadLog(nameFilter:string = null):void {
        Log.trace(Log.LOAD, this.getLoadLog(nameFilter).log);
    }

    public hasRes(key: string): boolean {
        return RES.hasRes(key);
    }

    public getRes(key: string): any {
        return RES.getRes(key);
    }

    public getResAsync(name: string, compFunc: Function = null, thisObj: any = null, loaderPriority: ELoaderPriority = ELoaderPriority.DEFAULT, callParams:any[] = null, errorFunc:Function = null): void {
        this.load(name, ELoaderType.RES, compFunc, thisObj, loaderPriority, callParams);
    }

    public hasUrlRes(key: string): boolean {
        return this.urlCompResDict[key] != undefined;
    }

    /**
     * 加载成功后，通过此接口获取资源
     * @param {string} name
     * @returns {any}
     */
    public getCache(name: string): any {
        return this.urlCompResDict[name] || this.getRes(name);
    }

    public getResByUrl(name: string, compFunc: Function = null, thisObj: any = null, loaderPriority: ELoaderPriority = ELoaderPriority.DEFAULT, callParams:any[] = null, errorFunc:Function = null): any {
        // if (this.hasUrlRes(name)) {
            // compFunc && compFunc.call(thisObj, ...callParams);
            // return this.urlCompResDict[name];
        // }
        this.load(name, ELoaderType.URL, compFunc, thisObj, loaderPriority, callParams);
        return null;
    }

    public loadGroup(name:string, resCfgs:any[], compFunc:Function = null, thisObj: any = null, loaderPriority: ELoaderPriority = ELoaderPriority.DEFAULT, callParams:any[] = null, progressFunc:Function = null, errorFunc:Function = null):void {
        if (name == null || name == "" || resCfgs == null || resCfgs.length <= 0) {
            return;
        }
        let groupName:string = "group_" + name;
        if (!this.groupDict[groupName]) {
            this.groupDict[groupName] = resCfgs;
        }
        if (compFunc || errorFunc) {
            this.addCallback({name:groupName, compFunc, thisObj, callParams, errorFunc});
        }
        let itemsLoaded:number = 0;
        let itemsTotal:number = resCfgs.length;
        for (let resCfg of resCfgs) {
            if (this.hasUrlRes(resCfg.name)) {
                itemsLoaded++;
            } else {
                this.load(resCfg.url, ELoaderType.URL, this.onLoadGroupItemComp, this, loaderPriority, [resCfg.name, groupName, thisObj, progressFunc], this.onLoadGroupItemError, resCfg.name);
            }
        }
        if (itemsLoaded >= itemsTotal) this.compCall(groupName, null);
    }

    private onLoadGroupItemComp(resKey:string, groupName:string, thisObj: any, progressFunc:Function):void {
        let resCfgs:any[] = this.groupDict[groupName];
        let itemsLoaded:number = 0;
        let itemsTotal:number;
        if (resCfgs) {
            itemsTotal = resCfgs.length;
            for (let cfg of resCfgs) {
                if (this.hasUrlRes(cfg.name)) {
                    itemsLoaded++;
                }
            }
            Log.trace(Log.LOAD, `组加载>>>\n|-${groupName}\n|--[normal]${resKey}`);
            if (progressFunc != null) progressFunc.call(thisObj, itemsLoaded, itemsTotal);
            if (itemsLoaded >= itemsTotal) this.compCall(groupName, null);
        }
    }

    private onLoadGroupItemError(resKey:string, groupName:string, thisObj: any, progressFunc:Function):void {
        Log.trace(Log.LOAD, `组加载失败>>>\n|-${groupName}\n|--[normal]${resKey}`);
        this.errorCall(groupName);
    }

    /************************************Fui包资源加载接口*****************************************/
    public getPackageByGroup(packageName:string, compFunc: Function = null, thisObj: any = null, loaderPriority: ELoaderPriority = ELoaderPriority.UI_PACKAGE, callParams:any[] = null, errorFunc:Function = null):void {
        if (packageName == null || packageName == "") {
            return;
        }
        let groupName:string = "group_" + packageName;
        let packageResList: Array<PackageResVo> = ResourceManager.genResourcesInclueDependence2(packageName, UIManager.getPackNum(packageName));
        if (!this.packageGroupDict[groupName] || this.packageGroupDict[groupName].length != packageResList.length) {
            this.packageGroupDict[groupName] = packageResList;
        }
        if (compFunc || errorFunc) {
            this.addCallback({name:groupName, compFunc, thisObj, callParams, errorFunc});
        }
        if (packageResList.length > 0) {
            for (let pkgVo of packageResList) {
                for (let resCfg of pkgVo.resCfs){
                    this.load(resCfg.url, ELoaderType.URL, this.onLoadPkgGroupItemComp, this, loaderPriority, [resCfg.name, pkgVo.packageName, groupName], this.onLoadPkgGroupItemError, resCfg.name);
                }
            }
        } else {
            this.compCall(groupName, null);
        }
    }

    private onLoadPkgGroupItemComp(url:string, packageName:string, groupName:string):void {
        let packageResList:PackageResVo[] = this.packageGroupDict[groupName];
        let isGroupComp:boolean = true;
        let curPkgVo:PackageResVo;
        if (packageResList) {
            for (let pkgVo of packageResList) {
                if (!pkgVo.isComplete()) {
                    isGroupComp = false;
                }
                if (pkgVo.packageName == packageName) {
                    curPkgVo = pkgVo;
                }
            }
        }
        Log.trace(Log.LOAD, `组加载>>>\n|-${groupName}\n|--[package]${packageName}\n|---${url}`);
        if (curPkgVo && curPkgVo.isComplete()) {
            Log.trace(Log.LOAD, `加载资源包成功：${packageName}`);
            ResourceManager.addPackage(packageName);
        }
        if (isGroupComp) this.compCall(groupName, null);
    }

    private onLoadPkgGroupItemError(url:string, packageName:string, groupName:string):void {
        Log.trace(Log.LOAD, `组加载失败>>>\n|-${groupName}\n|--[package]${packageName}\n|---${url}`);
        this.errorCall(groupName);
    }

    /**
     * 加载总入口
     */
    private load(name: string, loaderType: ELoaderType, compFunc: Function = null, thisObj: any = null, loaderPriority:ELoaderPriority = ELoaderPriority.DEFAULT, callParams:any[] = null, errorFunc:Function = null, loadResKey:string = null): void {
        if (name == null || name == "") {
            return;
        }
        let key:string = loadResKey || name;
        if (LoaderManager.ERR_DIC[key] >= LoaderManager.ERR_MAX_NUM) {
            return;
        }
        if (compFunc || errorFunc) {
            this.addCallback({name:key, compFunc, thisObj, callParams, errorFunc});
        }
        if (this.loadingDict[key]) {//正在加载了或已经存在等待列表当中
            return;
        }
        let cache:any = this.getCache(key);
        if (cache) {//已经加载成功了的
            this.compCall(key, cache);
            return;
        }

        let vo: LoaderVo = new LoaderVo(name, loaderType, loaderPriority, this.getServerTime(), loadResKey);
        let plist: Array<LoaderVo> = this.getPriorityList(loaderPriority);
        plist.unshift(vo);
        this.loadingDict[key] = vo;
        this.addLoadLog(vo);

        this.tryToLoad();
    }

    private addCallback(callback:{name: string, compFunc: Function, thisObj: any, callParams:any[], errorFunc:Function}):void{
        if (!this.callbackDict[callback.name])
            this.callbackDict[callback.name] = [];
        let calls:Array<any> = this.callbackDict[callback.name];
        let cb:any;
        for (let i = 0; i < calls.length; i++) {
            cb = calls[i];
            if (cb.name == callback.name && cb.compFunc == callback.compFunc && cb.thisObj == callback.thisObj)
                return;
        }
        calls.push(callback);
    }

    /**
     * 移除回调 - 关闭界面/模型失效时使用
     * @param {string} name
     * @param {Function} compFunc
     */
    public removeCallback(name: string, compFunc: Function,thisObj:any):void{
        let calls:Array<any> = this.callbackDict[name];
        if (calls && calls.length){
            let cb:any;
            for (let i = 0; i < calls.length; i++) {
                cb = calls[i];
                if (cb.name == name && cb.compFunc == compFunc && cb.thisObj == thisObj){
                    calls.splice(i, 1);
                    return;
                }
            }
        }
    }

    private tryToLoad(): void {
        if (this.loadingCount < LoaderManager.MAX_LOADIND_THREAD) {
            let loaderVo: LoaderVo = this.getLoaderVo();
            if (loaderVo != null) {
                loaderVo.startLoadDate = this.getServerTime();
                this.curLoadingList.push(loaderVo);
                switch (loaderVo.loadType) {
                    case ELoaderType.RES:
                        this.loadingCount++;
                        RES.getResAsync(loaderVo.name, this.onGetResAsyncComplete, this);
                        break;
                    case ELoaderType.URL:
                        this.loadingCount++;
                        RES.getResByUrl(loaderVo.name, this.onGetResByUrlComplete, this, null, loaderVo.key);
                        break;
                    case ELoaderType.GROUP:
                        this.loadingCount += RES.getGroupByName(loaderVo.name).length;
                        RES.loadGroup(loaderVo.name);
                        break;
                }
            }
        }
    }

    private onGetResAsyncComplete(data: any, name: string): void {
        if (name == undefined) {//严重错误，配置表里面没有该资源
            let lastVo:LoaderVo = this.getLastLoaderVo(ELoaderType.RES);
            name = lastVo && lastVo.name;//获取最后一个添加的资源名
            name && Log.trace(Log.FATAL, "严重错误，配置表里面!可能!没有该资源:" + name, "请尽快添加!!!");
        }
        this.loadComp(data, name, false);
    }

    private onGetResByUrlComplete(data: any, name: string): void {
        this.loadComp(data, name, true);
    }

    private loadComp(data: any, name: string, isGetUrl:boolean):void {
        this.loadingCount--;
        let loaderVo:LoaderVo = this.loadingDict[name] || this.loadLogDict[name];
        delete this.loadingDict[name];

        let hasKey:boolean = loaderVo.key != null;
        let delLoader:LoaderVo;
        for (let idx:number = 0;idx < this.curLoadingList.length;idx++) {
            delLoader = this.curLoadingList[idx];
            if (delLoader.name == name || (hasKey && delLoader.key == name)) {
                this.curLoadingList.splice(idx, 1);
                break;
            }
        }

        if (data) {
            loaderVo.compLoadDate = this.getServerTime();
            if (isGetUrl) this.urlCompResDict[name] = data;
            this.compCall(name, data);
        } else {
            loaderVo.errorLoadDate = this.getServerTime();
            Log.trace(Log.LOAD_ERR,"url:" + name + " 加载失败，请检查下cdn或网络情况~");
            this.errorCall(name);
        }
        this.tryToLoad();
    }

    /**
     * 加载失败（io/网络波动/丢包等.）
     * @param {RES.ResourceEvent} evt
     */
    private onItemLoadError(evt: RES.ResourceEvent) {
        let resItem:RES.ResourceItem = evt.resItem;
        if (resItem) {
            Log.trace(Log.LOAD_ERR, "url:" + resItem.url + " 加载失败，请检查下cdn或网络情况~");
        }
    }

    public destroyRes(name: string, force?: boolean): boolean {
        delete this.urlCompResDict[name];
        return RES.destroyRes(name, force);
    }

    private getLoaderVo(): LoaderVo {
        let loaderVo: LoaderVo;
        let plist: Array<LoaderVo>;
        for (let i: number = 0; i < this.epList.length; i++) {
            plist = this.priorityList[this.epList[i]];
            if (plist && plist.length > 0) {
                loaderVo = plist.shift();
                break;
            }
        }
        return loaderVo;
    }

    private getLastLoaderVo(loaderType:ELoaderType):LoaderVo {
        let loaderVo: LoaderVo;
        let v:LoaderVo;
        for (let name in this.loadingDict) {
            v = this.loadingDict[name];
            if ((!loaderVo || loaderVo.addLoadTime > v.addLoadTime) && v.loadType == loaderType)
                loaderVo = v;
        }
        return loaderVo;
    }

    public getModelResByUrl(name:string, compFunc?: Function, thisObject?: any, loaderPriority:ELoaderPriority = ELoaderPriority.DEFAULT, callParams:any[] = null, errorFunc:Function = null):any {
        if (CacheManager.res.hasModelCache(name)) {//读取缓存
            return CacheManager.res.getModelCache(name);
        }
        else if (LoaderManager.ERR_DIC[name+'.png'] >= LoaderManager.ERR_MAX_NUM || LoaderManager.ERR_DIC[name+'.json'] >= LoaderManager.ERR_MAX_NUM) {//资源失败次数过多不作加载
            return null;
        } else {//RES.setMaxLoadingThread，因此这里没做loader限制
            let loader:ModelResLoader = ObjectPool.pop("ModelResLoader");
            loader.getResByUrl(name, compFunc, thisObject, loaderPriority, callParams, errorFunc);
        }
        return null;
    }

    public getModelResByUrl2(name:string, compFunc?: Function, thisObject?: any, loaderPriority:ELoaderPriority = ELoaderPriority.DEFAULT, callParams:any[] = null, errorFunc:Function = null):BitmapMovieClipData {
        if (CacheManager.res.hasModelCache(name)) {//读取缓存
            return CacheManager.res.getModelCache(name);
        }
        else if (LoaderManager.ERR_DIC[name] >= LoaderManager.ERR_MAX_NUM) {//资源失败次数过多不作加载
            return null;
        } else {//RES.setMaxLoadingThread，因此这里没做loader限制
            let loader:ModelResLoader = ObjectPool.pop("ModelResLoader");
            loader.getResByUrl(name, compFunc, thisObject, loaderPriority, callParams, errorFunc);
        }
        return null;
    }

    public getMapResAsync(name:string, compFunc: Function = null, thisObj: any = null, loaderPriority: ELoaderPriority = ELoaderPriority.DEFAULT):void {
        this.mapLoadList.push({name:name, compFunc:compFunc, thisObj:thisObj, loaderPriority:loaderPriority, valid:true});
    }

    public removeMapResLoad(name: string, compFunc: Function, thisObj:any):void {
        this.removeCallback(name, compFunc, thisObj);
        let mapLoadInfo:any;
        for (mapLoadInfo of this.mapLoadList) {
            if (mapLoadInfo.name == name) {
                mapLoadInfo.valid = false;
                break;
            }
        }
    }

    private compCall(name: string, data:any):void{
        let calls:Array<any> = this.callbackDict[name];
        let cb:any;
        while (calls && calls.length){
            cb = calls.shift();//确保回调顺序
            // cb.callParams || (cb.callParams = []);
            // cb.callParams.unshift(data);//回调的第一个为加载成功的资源
            cb.compFunc && cb.compFunc.call(cb.thisObj, ...cb.callParams);
        }
    }

    private errorCall(name: string):void {
        LoaderManager.ERR_DIC[name] || (LoaderManager.ERR_DIC[name] = 1);
        LoaderManager.ERR_DIC[name] = LoaderManager.ERR_DIC[name] + 1;
        let calls:Array<any> = this.callbackDict[name];
        let cb:any;
        while (calls && calls.length){
            cb = calls.shift();//确保回调顺序
            cb.errorFunc && cb.errorFunc.call(cb.thisObj, ...cb.callParams);
        }
    }

    private getServerTime():number{
        return CacheManager.serverTime ? CacheManager.serverTime.getServerTime() : 0;
    }

    public clear():void {//过场景清理掉加载队列:只清地图，不清普通队列
        // this.initPriorityList();
        // this.loadingDict = {};
        this.mapLoadList.length = 0;
    }

}