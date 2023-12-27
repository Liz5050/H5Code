/**
 * 位图动画 - 所有动画播放基类
 */
class BitmapMovieClip extends egret.Sprite {
    /**
     * BitmapFrame更新时间
     */
    public static BITMAPFRAME_UPDATE_TIME: number = 16000;
    /**
     * 播放帧间隔,帧数.
     * **/
    private _delay: number = 17;

    /**
     * 此bitmapMovieClip的渲染数据源，位图序列.
     * **/
    private _movieClipData: BitmapMovieClipData;
    /**
     * 临时存储的 MovieClipData，因为如果当前处于定帧状态，但又需要设置新的MovieClipData，会导致定帧期间什么都不显示。
     */
    private _tempMovieClipData: BitmapMovieClipData;
    /**
     * bitmapMovieClip的核心位图容器.
     * **/
    private _bitmap: egret.Bitmap;

    /**
     * 当前Frame，当前播放帧编号.
     * **/
    public currentFrame: number;

    /**
     * 当前数据源中的帧总数.
     * **/
    public totalFrames: number;

    /**
     * 播放完成.
     * **/
    public static END: string = "end";

    /**
     * 起始播放帧.
     * **/
    private _startFrame: number;

    /**
     * 结束播放帧.
     * **/
    private _endFrame: number;

    /**
     * 是否循环播放.
     * **/
    private _isLoop: boolean;

    /**
     * 如果循环播放为false,则当从起始帧播放到结束帧的时候，进行调用通知播放完成的方法.
     * **/
    private _endFunction: () => void;

    /**
     * this.
     * **/
    private _thisObj: any;

    /**
     * 上一次帧渲染的时间戳，根据当前时间戳和此值的对比算出是否需要播放下一帧.
     * **/
    private _lastTime: number;

    /**
     * 是否被所动动画.
     * **/
    private lockAble: boolean = false;

    /**
     * 播放过界的时候，是否自动播放最后一帧.
     * **/
    public isAutoPlayEndFrame: Boolean = true;

    /**
     * X缩放系数
     */
    private _scaleX: number = 1;

    /**
     * Y缩放系数
     */
    private _scaleY: number = 1;
    /**
     * 是否正在播放中
     */
    private isPlaying: boolean = false;

    public constructor() {
        super();
        this.touchChildren = false;
        this.touchEnabled = false;
    }

    /**
     * 模仿movieClip,进行优化，当自己被添加到舞台的时候，开始渲染.
     * **/
    private addtoStageHandler(evt: egret.Event): void {
        this.render();
    }

    /**
     * 获取当前帧播放延迟.
     * **/
    public get delay(): number {
        return this._delay;
    }

    /**
     * 设定当前动画播放帧间隔,毫秒单位.
     * **/
    public set delay(cusDelay: number) {
        if (cusDelay == this._delay) {
            return;
        }
        if (cusDelay > 16) {
            this._delay = cusDelay;
        }
        else {
            this._delay = 17;
        }
        if(this.isPlaying)
        {
            App.TimerManager.remove(this.step, this);
            App.TimerManager.doFrame(1, 0, this.step, this);
        }
    }

    /**
     * 停止此movieClip播放.
     * **/
    public stop(): void {
        this.isPlaying = false;
        App.TimerManager.remove(this.step, this);
        App.TimerManager.doTimer(BitmapMovieClip.BITMAPFRAME_UPDATE_TIME, 0, this.updateBitmapFrameTime, this);
    }

    /**
     * 停止并且锁定.
     * **/
    public stopAndLoack(): void {
        this.lockAble = true;
        this.stop();
    }

    /**
     * 播放并且解锁.
     * **/
    public playAndUnlock(): void {
        this.lockAble = false;
        if (this._tempMovieClipData) {
            this.movieClipData = this._tempMovieClipData;
        }
        this.play();
    }

    /**
     * 解锁.
     * **/
    public unlock(): void {
        this.lockAble = false;
        if (this._tempMovieClipData) {
            this.movieClipData = this._tempMovieClipData;
        }
    }

    /**
     * 核心方法之一，渲染函数.
     * **/
    private render(): void {
        if (this._movieClipData == null || this._movieClipData.length == 0) {
            return;
        }

        let _renderFrame: number = this.currentFrame;
        if (_renderFrame > this._movieClipData.length) {
            if (this.isAutoPlayEndFrame) {
                _renderFrame = this._movieClipData.length;
            }
        }

        this.createBitmap();
        let bitmapFrame: BitmapFrame = this._movieClipData.getFrameData(_renderFrame);
        if (bitmapFrame == null) {
            if (this._bitmap.texture) {
                this._bitmap.texture = null;
            }
            return;
        }
        if (bitmapFrame.isDraw == false) {
            {
                if (bitmapFrame.width == 0 || bitmapFrame.height == 0) {
                    if (this._bitmap.texture) {
                        this._bitmap.texture = null;
                    }
                    return;
                }
                bitmapFrame.create();
            }
        }
        //显示.
        if (this._bitmap.texture != bitmapFrame.texture) {
            this._bitmap.texture = bitmapFrame.texture;
        }
        this._bitmap.scaleX = this._scaleX;
        this._bitmap.scaleY = this._scaleY;
        this._bitmap.x = bitmapFrame.offX * this._scaleX;
        this._bitmap.y = bitmapFrame.offY * this._scaleY;
    }

    /**
     * 播放到第几帧并且停止在此帧.
     * **/
    public gotoAndStop(frameNum: number): void {
        if (this.lockAble) {
            return;
        }
        if (this._movieClipData == null) {
            return;
        }
        this.currentFrame = frameNum;
        this.setCurrentFrame();
        this.stop();
    }

    /**
     * 获取bitmap.
     * **/
    public get bitmap(): egret.Bitmap {
        this.createBitmap();
        return this._bitmap;
    }

    /**
     * 获取图片顶部位置.
     * **/
    public get bitmapY(): number {
        if (this._bitmap) {
            return this._bitmap.y;
        }
        return 0;
    }

    /**
     * 基于时间的一个播放.
     * **/
    public play(): void {
        if (this.lockAble) {
            return;
        }
        if (this._movieClipData == null) {
            return;
        }
        App.TimerManager.remove(this.updateBitmapFrameTime, this);
        App.TimerManager.remove(this.step, this);
        this.isPlaying = true;
        this.curPlayCount = 0;
        App.TimerManager.doFrame(1, 0, this.step, this);
    }

    /**
     * 从第几帧开始播放.
     * @param cusCurrentFrame 立即播放的帧.
     * @param cusIsLoop 是否循环播放.
     * @param cusStartFrame 开始帧.
     * @param cusEndFrame 结束帧.
     * **/
    public gotoAndPlay(cusCurrentFrame: number, cusIsLoop: boolean = true, cusStartFrame: number = 1, cusEndFrame: number = -1, endFun: () => void = null, thisObj:any = null): void {
        if (this.lockAble) {
            return;
        }
        if (this._movieClipData == null) {
            return;
        }
        this._isLoop = cusIsLoop;
        this.currentFrame = cusCurrentFrame;
        this._startFrame = cusStartFrame;
        if (cusEndFrame == -1) {
            this._endFrame = this.totalFrames;
        }
        else {
            this._endFrame = cusEndFrame;
        }
        this._endFunction = endFun;
        this._thisObj = thisObj;
        this.setCurrentFrame();
        this.play();
    }

    public gotoAndPlayLabel(label:string, isLoop:boolean = true, endFun:()=>void = null, thisObj:any = null): void {
        if (this.lockAble || !label || label == "") {
            return;
        }
        if (this._movieClipData == null) {
            return;
        }
        let labelData:any = this._movieClipData.getLabelData(label);
        if (!labelData) {
            Alert.info("模型资源:" + this.fileName + "没有标签<" + label + ">");
            return;
        }
        this._isLoop = isLoop;
        this.currentFrame = labelData.startFrame;
        this._startFrame = labelData.startFrame;
        this._endFrame = labelData.endFrame;
        this.totalFrames = (labelData.endFrame - labelData.startFrame + 1);
        this._endFunction = endFun;
        this._thisObj = thisObj;
        this.setCurrentFrame();
        this.play();
    }

    /**
     * 向后播放一帧.
     * **/
    public nextFrame(): void {
        this.gotoAndStop(Math.min((this.currentFrame + 1), this._movieClipData.length));
    }

    /**
     * 初始化位图对象作为child.
     * **/
    private createBitmap(): void {
        if (this._bitmap == null) {
            this._bitmap = new egret.Bitmap();
            this.addChild(this._bitmap);
        }
    }
    /**
     * 渲染循环逻辑.
     * **/
    private step(): void {
        if (this.currentFrame >= this._endFrame) {
            if (this._isLoop == false && this.playCount > 0 && this.curPlayCount >= this.playCount) {
                this.playComp();
                return;
            }
            this.currentFrame = this._startFrame;
            this.curPlayCount++;
        }
        else {
            let _rate = 1;//this.gRateManager != null?this.gRateManager.getRate():1;
            let passFrame: number = ((egret.getTimer() - this._lastTime)*_rate / this._delay) + 0.5 >> 0;//基于时间的渲染方式.
            if (passFrame == 0) {
                return;
            }
            this.currentFrame = this.currentFrame + passFrame;
            if (this.currentFrame >= this._endFrame) {
                this.currentFrame = this._endFrame;
            }
        }

        this.setCurrentFrame();
    }

    /**
     * 作为movieClip播放时候，基本都使用此方法，从资源缓存位置取出
     * 位图资源，设定给此对象，此对象存储后开始渲染,在场景物件中，经常
     * 是先创建此显示对象，然后动态从资源缓存中取出图形数据来设定给此
     * 显示对象，此显示对象提供渲染控制接口，比如gotoAndPlay...
     * **/
    public set movieClipData(cusMovieClipData: BitmapMovieClipData) {
        if (cusMovieClipData == this._movieClipData) {
            return
        }
        if (cusMovieClipData == null) {
            return;
        }
        this.createBitmap();
        if (this._movieClipData != null) {
            this._movieClipData.useTime--;
            this._movieClipData = null;
        }
        if (this.lockAble == true) {
            this._tempMovieClipData = cusMovieClipData;
            this._tempMovieClipData.useTime++;
        }
        else {
            this._bitmap.texture = null;
            this._movieClipData = cusMovieClipData;
            this.totalFrames = this._movieClipData.length;
            this.delay = 1000/cusMovieClipData.getFrameRate();

            if (this.isPlaying) {
                this.render();
            }
            else {
                this._startFrame = 1;
                this._endFrame = this.totalFrames;
                this.gotoAndStop(1);
            }
            if (this._tempMovieClipData == null) {
                this._movieClipData.useTime++;
            }
            else {
                this._tempMovieClipData = null;
            }
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addtoStageHandler, this);
        }
    }

    /**
     * 获取movieClipData数据源,此方法一般在资源加载管理器中使用.
     * **/
    public get movieClipData(): BitmapMovieClipData {
        return this._movieClipData;
    }

    /**
     * 获取当前位图的Texture.
     * **/
    public get texture(): egret.Texture {
        this.createBitmap();
        return this._bitmap.texture;
    }

    /**
     * 后退播放一帧.
     * **/
    public prevFrame(): void {
        this.gotoAndStop(Math.max((this.currentFrame - 1), 1));
    }

    /**
     * 设定当前播放帧,如果此显示对象在舞台上，则直接渲染，否则不渲染，但是帧变量更新.
     * **/
    private setCurrentFrame(): void {
        this._lastTime = egret.getTimer();
        if (this.stage == null) {
            this.createBitmap();
            this._bitmap.texture = null;
            return;
        }
        this.render();
    }
    /**
     *  BitmapFrame使用时间更新
     *
     */
    private updateBitmapFrameTime(): void {
        if (this._movieClipData) {
            let bitmapFrame: BitmapFrame = this._movieClipData.getFrameData(this.currentFrame);
            if (bitmapFrame) {
                bitmapFrame.lastUseTime = egret.getTimer();
            }
        }
        else {
            App.TimerManager.remove(this.updateBitmapFrameTime, this);
        }
    }
    /**
     * 设置x缩放系数
     * @param cusScale
     *
     */
    public setScaleX(cusScale: number): void {
        this._scaleX = cusScale;
    }
    /**
     * 设置y缩放系数
     * @param cusScale
     *
     */
    public setScaleY(cusScale: number): void {
        this._scaleY = cusScale;
    }

    /**
     * 设置x,y缩放系数
     * @param cusScale
     *
     */
    public setScale(cusScale: number): void {
        this._scaleX = cusScale;
        this._scaleY = cusScale;
    }
    // /**
    //  * 检查矩形碰撞
    //  * @return
    //  *
    //  */
    // public isHit():Boolean
    // {
    // 	let mx:Number = this.bitmap.mouseX * this._scaleX;
    // 	let my:Number = this.bitmap.mouseY * this._scaleY;
    // 	return mx > 0 && mx < this._bitmap.width &&  my > 0 && my < this._bitmap.height
    // }
    /**
     * 获取开始帧
     * @return
     *
     */
    public get startFrame(): number {
        return this._startFrame;
    }
    /**
     * 获取结束帧
     * @return
     *
     */
    public get endFrame(): number {
        return this._endFrame;
    }

    /**
     * 释放此movieClip，此方法并未彻底释放位图资源，
     * 只是删除资源引用，然后停止渲染计时器.
     * **/
    public dispose(): void {
        App.TimerManager.removeAll(this);
        this.isPlaying = false;
        App.LoaderManager.removeCallback(this.fileName, this.loadComp, this);
        if (this._movieClipData != null) {
            this._movieClipData.useTime--;
            this._movieClipData = null;
        }
        if (this._tempMovieClipData != null) {
            this._tempMovieClipData.useTime--;
            this._tempMovieClipData = null;
        }
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addtoStageHandler, this);
        this.isAutoPlayEndFrame = true;
        this._endFunction = null;
        this.unlock();
        if (this._bitmap) {
            this._bitmap.texture = null;
            this._bitmap.scaleX = 1;
            this._bitmap.scaleY = 1;
        }
        this._scaleX = 1;
        this._scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = 0;
        this.visible = true;
        this.x = 0;
        this.y = 0;
    }

    public destroy(): void {
        this.dispose();
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }

    public playComp(): void {
        this.stop();
        if (this._endFunction != null) {
            this._endFunction.call(this._thisObj);
        }
        this.dispatchEvent(new egret.Event(BitmapMovieClip.END));
    }

    protected playCount:number = 0;
    private curPlayCount:number = 0;
    private fileName:string;
    protected playFileTime:number;
    /**
     * @name eg:"resource/assets/rpgGame/player/10100_stand"
     */
    public playFile(fileName: string,
                    playCount: number = 1,
                    compFun: () => void = null,
                    thisObj:any = null,
                    priority:ELoaderPriority): void {

        this._endFunction = compFun;
        this._thisObj = thisObj;
        this.playCount = playCount;
        this.playFileTime = egret.getTimer();

        if (!fileName || fileName == "" || this.fileName == fileName) {
            return;
        }

        App.TimerManager.remove(this.playComp, this);

        this.fileName = fileName;
        let mcData:BitmapMovieClipData = App.LoaderManager.getModelResByUrl2(this.fileName, this.loadComp, this, priority, [fileName]);
        if (mcData) {
            this.movieClipData = mcData;
            this.setPlay();
            this.dispatchEventWith(MovieClip.RES_READY_COMPLETE);
        }
    }

    private loadComp(fileName:string):void {
        if (this.fileName != fileName)
            return;
        let mcData:BitmapMovieClipData = CacheManager.res.getModelCache(this.fileName);
        if (mcData) {
            this.movieClipData = mcData;
            this.setPlay();
            this.dispatchEventWith(MovieClip.RES_READY_COMPLETE);
        }
    }

    /**
     * 设置播放
     */
    protected setPlay():void {
        if (!this._movieClipData)
            return;

        this.gotoAndPlay(1, this.playCount<0);

        if (this.playCount >= 0) {
            let tempTime = egret.getTimer() - this.playFileTime;
            let playCount = this.playCount > 0 ? this.playCount : 1;
            tempTime = this.delay * this.totalFrames * playCount - tempTime;
            if (tempTime > 0)
                App.TimerManager.doTimer(tempTime, 1, this.playComp, this);
            else
                this.playComp();
        }
    }
}