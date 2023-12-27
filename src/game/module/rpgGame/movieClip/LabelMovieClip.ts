/**
 *  帧标签动画类，支持分动作加载，播放有帧标签的动画
 */
class LabelMovieClip extends MovieClip {

	/** 需要播放的标签 */
	private labelName: string;
	/** 此label一共多少帧 */
	private labelFramesNum: number;
    /** 临时传入结束回调 */
    private complateAction: Function;
    /** 临时传入结束回调参数 */
    private complateActionObj: any;

	public constructor() {
		super();
	}

	/**
	 * @name eg:"resource/assets/rpgGame/player/10100_stand"
	 */
	public playLabel(urlPrefix: string, labelName: string,
                     playCount: number = 1,
                     priority:ELoaderPriority = ELoaderPriority.DEFAULT,
                     compFun: () => void = null,
	                 compReset:boolean = true): void {
        this.labelName = labelName;
        super.playFile(urlPrefix, playCount, priority, compFun, compReset);
	}

	/**
	 * 创建主体动画
	 */
    protected createBody(): void {
        if (!this._refMovieClipData)
            return;
        let nowTime:number = egret.getTimer();
		//这里计算此label一共多少帧，
		this.labelFramesNum = 0;
		let currLabel: egret.FrameLabel;
		if (null == this.movieClipData.labels) {
			Alert.info(`资源:` + this.urlPrefix + `有误`);
			return;
		}
		for (var i = 0; i < this.movieClipData.labels.length; i++) {
			if (this.labelName == this.movieClipData.labels[i].name) {
				currLabel = this.movieClipData.labels[i];
			}
		}
		if (!currLabel) {
			return;
		}
        this.labelFramesNum = currLabel.end - currLabel.frame + 1;
		// Log.trace("~~~~time:~~~~:", egret.getTimer());
		// Log.trace("~~~~labelFramesNum~~~~:", this.labelFramesNum);

		//从第一帧开始自动播放
		this.gotoAndPlay(this.labelName, this.playCount);
        // try {
        //     this.gotoAndPlay(this.labelName, this.playCount);
        // } catch (e) {
        //     egret.$warn(1017, this.urlPrefix);
        // }

        this.visible = true;

        App.TimerManager.remove(this.playComp, this);

		if (this.playCount > 0) {
			let tempTime = nowTime - this.time;
			tempTime = this.playTime * this.playCount - tempTime;
			if (tempTime > 0)
				App.TimerManager.doTimer(tempTime, 1, this.playComp, this);
			else
				this.playComp();
		}
		//抛出内容已经改变事件
		// this.dispatchEventWith(egret.Event.CHANGE);
        if (App.DebugUtils.isDebug && !ModelResLoader.LOG[this.urlPrefix]) ModelResLoader.LOG[this.urlPrefix] = egret.getTimer() - nowTime;
		this.dispatchEventWith(MovieClip.RES_READY_COMPLETE);
	}

	/**
	 * 自动播放次数完成处理
	 * @param e
	 */
    protected playComp(): void {
        super.playComp();

        this.complateAction && this.complateAction.apply(this.complateActionObj);
	}

	/** 播放总时长(毫秒) */
    public get playTime(): number {
		if (!this._refMovieClipData || this._refMovieClipData.mcName != this.urlPrefix)
			return 0;
		if (1 > this.labelFramesNum)
			return 0;
		return 1 / this.frameRate * this.labelFramesNum * 1000;
	}

	public clearComFun() {
		super.clearComFun();
	
		this.complateAction = null;
        this.complateActionObj = null;
	}

    public setComplateAction(complateAction: Function, complateActionObj: any): void {
        this.complateAction = complateAction;
        this.complateActionObj = complateActionObj;
    }

    protected resetMovieClip() {
		super.resetMovieClip();
        this.labelFramesNum = 0;
	}
}