/**
 *  动画播放基类，直接播放指定动画，可以不带标签
 */
class MovieClip extends egret.MovieClip {

	/**资源加载完成 */
	public static RES_READY_COMPLETE:string = "RES_READY_COMPLETE";

	/** 原始帧频 */
	protected static originalRate: any = {};

	/** 动画数据 */
    protected _refMovieClipData: RefMovieClipData;

	/** 播放次数 */
    protected playCount: number;
	/** 播放完的回调函数 */
    protected _compFun: () => void;
	protected _comCaller:any;
    protected time: number;
	/**倍率 ,越大越快*/
	public rate: number = 1;

	public pixelHitTest: boolean = false;

	protected urlPrefix:string;
    /**播放结束重置*/
	protected compReset:boolean;

	public constructor() {
		super();

		// this.$hitTest = function (stageX: number, stageY: number): egret.DisplayObject {
		// 	let values = this.$DisplayObject;
		// 	if (!this.$renderNode || !this.$visible || values[0] == 0 || values[1] == 0) {
		// 		return null;
		// 	}
		// 	let m = this.$getInvertedConcatenatedMatrix();
		// 	if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {//防止父类影响子类
		// 		return null;
		// 	}
		// 	let bounds = this.$getContentBounds();
		// 	let localX = m.a * stageX + m.c * stageY + m.tx;
		// 	let localY = m.b * stageX + m.d * stageY + m.ty;
		// 	if (bounds.contains(localX, localY)) {
		// 		if (!this.$children) {//容器已经检查过scrollRect和mask，避免重复对遮罩进行碰撞。

		// 			let rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
		// 			if (rect && !rect.contains(localX, localY)) {
		// 				return null;
		// 			}
		// 			if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
		// 				return null;
		// 			}
		// 			if (this.pixelHitTest && this instanceof MovieClip && !this.hitTestPoint(stageX, stageY, true)) {
		// 				return null;
		// 			}
		// 		}
		// 		return this;
		// 	}
		// 	return null;
		// };
	}

	/**
	 * @name eg:"resource/assets/rpgGame/player/10100_stand"
	 */
	public playFile(urlPrefix: string,
		playCount: number = 1,
		priority:ELoaderPriority = ELoaderPriority.DEFAULT,
		compFun: () => void = null,
		compReset:boolean = true,comCaller:any=null): void {

		this.time = egret.getTimer();

		this._compFun = compFun;
		this._comCaller = comCaller;
		this.playCount = playCount;
		this.compReset = compReset;

        if (urlPrefix && this._refMovieClipData && this._refMovieClipData.mcName == urlPrefix) {
            this.createBody();
            return;
        }

		this.urlPrefix = urlPrefix;
        let mcData:RefMovieClipData = App.LoaderManager.getModelResByUrl(this.urlPrefix, this.loadComp, this, priority, [urlPrefix]);//CacheManager.res.getModelCache(urlPrefix);
        if (mcData)
        {
            this.setRefMovieClipData(mcData);
            this.createBody();
        }
		// else {
		// 	if(this.refMovieClipData) {
		// 		this.stop();
		// 		this.visible = false;
		// 		this.clearMovieClipData();
		// 		this.movieClipData = null;
		// 	}
		// 	App.LoaderManager.getModelResByUrl(this.urlPrefix, this.loadComp, this, priority, [urlPrefix]);
		// }
	}

	private loadComp(urlPrefix:string):void
    {
    	if (this.urlPrefix == urlPrefix)
    	{
            let refMcData:RefMovieClipData = CacheManager.res.getModelCache(urlPrefix);
            if (refMcData)
            {
                this.setRefMovieClipData(refMcData);
                this.createBody();
            }
		}
    }

	protected setRefMovieClipData(refMovieClipData:RefMovieClipData):void
    {
        this.clearMovieClipData();
        this._refMovieClipData = refMovieClipData;
        this._refMovieClipData.useTime++;
        this.movieClipData = this._refMovieClipData.getMovieClipData();

        if (!(this.urlPrefix in MovieClip.originalRate))
        {
            MovieClip.originalRate[this.urlPrefix] = this.movieClipData.frameRate;
        }
        this.frameRate = (MovieClip.originalRate[this.urlPrefix] * this.rate) >> 0;
    }

	/**
	 * 创建主体动画
	 */
	protected createBody(): void {
        if (!this._refMovieClipData)
            return;
        let nowTime:number = egret.getTimer();
		//从第一帧开始自动播放
		this.gotoAndPlay(1, this.playCount);

		this.visible = true;

        App.TimerManager.remove(this.playComp, this);

		if (this.playCount >= 0) {
			let tempTime = nowTime - this.time;
			let playCount = this.playCount > 0 ? this.playCount : 1;
			tempTime = this.playTime * playCount - tempTime;
			if (tempTime > 0)
				App.TimerManager.doTimer(tempTime, 1, this.playComp, this);
			else
				this.playComp();
		}
        if (App.DebugUtils.isDebug && !ModelResLoader.LOG[this.urlPrefix]) ModelResLoader.LOG[this.urlPrefix] = egret.getTimer() - nowTime;
		// 抛出内容已经改变事件
		// this.dispatchEventWith(egret.Event.CHANGE);
		this.dispatchEventWith(MovieClip.RES_READY_COMPLETE);
	}

	public clearMovieClipData() {
	    if (this._refMovieClipData)
        {
            this._refMovieClipData.useTime--;
            this._refMovieClipData.lastTime = egret.getTimer();
            this._refMovieClipData = null;
        }
	}

	public setScale(scale:number):void {
		this.scaleX = scale;
		this.scaleY = scale;
	}

	/**
	 * 自动播放次数完成处理
	 */
	protected playComp(): void {
		if (this._compFun){
			if(this._comCaller){
				this._compFun.call(this._comCaller);
			}else{
				this._compFun();
			}
		}
			
		if (this.compReset)
			this.reset();
		
	}

	/** 播放总时长(毫秒) */
    public get playTime(): number {
		if (!this._refMovieClipData)
			return 0;
		return 1 / this.frameRate * this.totalFrames * 1000;
	}

	public clearComFun() {
		this._compFun = null;
	}

    /**
	 * 数据源 - 用这份来判断改mc有没有加载完mc data，不用原生的movieClipData判断
     * @returns {boolean}
     */
	public get refMovieClipData():RefMovieClipData
	{
		return this._refMovieClipData;
	}

	//重置 - 调用此方法后可以再播放
	public reset() {
		this.clearMovieClipData();
		this.resetMovieClip();
		this.clearComFun();
		App.TimerManager.removeAll(this);
	}

	//回收 - 调用此方法后只能设null，再使用必须从池中获取
	public destroy() {//Log.trace("RpgDispose=", this.urlPrefix);
		egret.Tween.removeTweens(this);
		this.reset();
		App.DisplayUtils.removeFromParent(this);
		ObjectPool.push(this);
	}

	protected resetMovieClip() {
        this.stop();
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = 0;
        this.visible = false;//重置的时候设为不可见，等新的加载完再显示，底层不支持mc data为null时清掉显示
        this.x = 0;
        this.y = 0;

		// 在用资源管理的情况下置null后会在定时器报错（其实上面已经把定时器stop），白鹭的坑
		// 修改引擎代码增加判断后此问题解决
		this.movieClipData = null;
        this.rate = 1;
		App.LoaderManager.removeCallback(this.urlPrefix, this.loadComp, this);
        this.urlPrefix = null;
        this.compReset = false;
        this.blendMode = egret.BlendMode.NORMAL;
	}

}