/**
 * 扩展，增加动态加载图片，统一从ObjectPool获取
 */
class GLoader extends fairygui.GLoader {
    /**
     * 优化模式开启标识
     */
    public static OptimizeMode: boolean = true;
    /**
     * 优化模式下忽略列表
	 * 使用最频繁的可加在这里
	 * e.g 具体文件路径/整个文件夹路径
     */
    private static OptimizeFilter:string[] = [
        "resource/assets/module/Common/itemColor/"
	];

	/**
	 * 资源失效时间（毫秒）
	 */
    public static FAILURE_TIME_L1: number = 1 * 60 * 1000;
	/**
	 * 资源失效时间（毫秒）等级2
	 */
    public static FAILURE_TIME_L2: number = 10 * 1000;
	/**
	 * 是否已开启GC检测timer
	 */
	private static gHasStartGCTimer: boolean = false;
	/**
	 * 图片资源使用情况字典
	 */
	private static gImageDic: { [name: string]: ImageVo } = {};
	/**
	 * 资源加载完毕事件
	 */
	public static RES_READY: string = "RES_READY";
	/**
	 * 是否自动GC
	 */
	private gCanGC: boolean = true;
	/**
	 * 是否已显示
	 */
	private gHasAppear: boolean;
    /**
     * 界面关闭前url
     */
    private _closeUrl:string;

	public constructor() {
		super();
		GLoader.startGCTimer();
	}

	public set canGC(value: boolean) {
		this.gCanGC = value;
	}

	public get canGC(): boolean {
		return this.gCanGC;
	}

    /**
	 * 设置图片统一入口
     * @param {string} url
     */
	public load(url: string): void {
		// console.log("load=", url, this.url, this._closeUrl);
		if (this.url && this.url == url) {
			this.dispatchEvent(new egret.Event(GLoader.RES_READY));
			return;
		}
		if (this.url) {
			this.clear();
		} else if (this._closeUrl) {
			this.clearQueue();
		}
		this.url = url;
	}

	/**
	 * 重新加载资源
	 */
	public reload(): void {
		let backupUrl: string = this.url;
		if (this.url) {
			this.clear();
		} else if (this._closeUrl) {
			this.clearQueue();
		}
		this.url = backupUrl;
	}

	protected loadExternal() {
        App.LoaderManager.getResByUrl(this.url, this.onExternalLoadSuccess, this);
	}

	protected onExternalLoadSuccess(): void {
		let _vo: ImageVo = GLoader.gImageDic[this.url];
		if (_vo == null) {
			GLoader.gImageDic[this.url] = _vo = new ImageVo();
		}
        _vo.source = App.LoaderManager.getCache(this.url);
		_vo.useTime++;

		if (!this.gCanGC) {
			_vo.addNoGCMark(this);
		}
        // console.log("onExternalLoadSuccess=", this.url, this._closeUrl);
		super.onExternalLoadSuccess(_vo.source);
		this.dispatchEvent(new egret.Event(GLoader.RES_READY));
        this.onAppear();
	}

    public get closeUrl(): string {
        return this._closeUrl;
    }

    public set closeUrl(value: string) {
        this._closeUrl = value;
    }

    private isOptimizeFilter():boolean {
		let url = this.url;
		if (url && url != "") {
            for (let fUrl of GLoader.OptimizeFilter) {
                if (url.indexOf(fUrl) != -1)
                    return true;
            }
		}
		return false;
	}

	public onAppear():void {
		if (this.gHasAppear) {
			return;
		}
		if (!GLoader.OptimizeMode) {
			return;
		}
		if (this.isOptimizeFilter()) {
			return;
		}
		this.gHasAppear = true;
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAppear, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onDisappear, this);

        // console.log("onAppear:", `${this.url}->${this._closeUrl}`, "Add:" + this.hasEventListener(egret.Event.ADDED_TO_STAGE), "Remove:" + this.hasEventListener(egret.Event.REMOVED_FROM_STAGE))

        if (this._closeUrl && this._closeUrl != "") {
            GLoader.removeFromDisappearQueue(this);
            GLoader.removeFromAppearQueue(this);
            if (!this.texture) {
                GLoader.addToAppearQueue(this);
                // Log.trace(Log.CLEANUP, "GLoader addToAppearQueue:", this._closeUrl, egret.getTimer());
                // this.load(this.closeUrl);
                // this.closeUrl = null;
            } else {
                this.closeUrl = null;
			}
        }
	}

	public onDisappear():void {
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onDisappear, this);
        this.gHasAppear = false;

        if (this.url && this.url != "" && this.hasParent()) {
			this.closeUrl = this.url;
			//this.clear(false);
			GLoader.removeFromAppearQueue(this);
            GLoader.addToDisappearQueue(this);
            // Log.trace(Log.CLEANUP, "GLoader addToDisappearQueue:", this._closeUrl, egret.getTimer());
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAppear, this);
		}
        // console.log("onDisappear:", this.url, "Add:" + this.hasEventListener(egret.Event.ADDED_TO_STAGE), "Remove:" + this.hasEventListener(egret.Event.REMOVED_FROM_STAGE))
    }

    private hasParent():boolean {
		let has:boolean = false;
		let parent = this.parent;
		while (parent != null) {
			if (parent instanceof BaseGUIView) {
				has = true;
                break;
            }
			parent = parent.parent;
		}
        return has;
	}

    private static dpQueue:GLoader[] = [];
    private static addToDisappearQueue(loader:GLoader):void {
		if (GLoader.dpQueue.indexOf(loader) == -1) {
			GLoader.dpQueue.push(loader);
		}
	}

	private static removeFromDisappearQueue(loader:GLoader):boolean {
    	let delIdx:number = GLoader.dpQueue.indexOf(loader);
        if (delIdx != -1) {
            GLoader.dpQueue.splice(delIdx, 1);
            return true;
        } else {
            return false;
		}
	}

    private static apQueue:GLoader[] = [];
    private static addToAppearQueue(loader:GLoader):void {
        if (GLoader.apQueue.indexOf(loader) == -1) {
            GLoader.apQueue.push(loader);
        }
    }

    private static removeFromAppearQueue(loader:GLoader):boolean {
        let delIdx:number = GLoader.apQueue.indexOf(loader);
        if (delIdx != -1) {
            GLoader.apQueue.splice(delIdx, 1);
            return true;
        } else {
            return false;
        }
    }

	private static checkQueueDisappear():void {
    	if (GLoader.dpQueue.length) {
    		let loader = GLoader.dpQueue.shift();
            loader.clear(false);
            let useTime:number;
            let imgVo:ImageVo = GLoader.gImageDic[loader._closeUrl];
            if(imgVo) {
                useTime = imgVo.useTime;
            }
            // Log.trace(Log.CLEANUP, "GLoader Disappear Clear:", loader._closeUrl, egret.getTimer(), `useTime=${useTime}`);
		}
		if (GLoader.apQueue.length) {
            let loader = GLoader.apQueue.shift();
            // if (loader.closeUrl && loader.closeUrl != "") {
            // Log.trace(Log.CLEANUP, "GLoader Appear Load:", loader.texture != null, loader._closeUrl, egret.getTimer());
            loader.load(loader._closeUrl);
            loader.closeUrl = null;
			// }
		}
	}

	private clearQueue():void {
        GLoader.removeFromAppearQueue(this);
        GLoader.removeFromDisappearQueue(this);
        this.closeUrl = null;
	}

	public clear(clearEvt:boolean = true) {
		if (clearEvt) {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onDisappear, this);
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAppear, this);
            this.clearQueue();
		}
		if (this.url && this.url != "") {
			App.LoaderManager.removeCallback(this.url, this.onExternalLoadSuccess, this);
		}
		// if(!this.texture) return;
		if (this.texture) {
			if (this.url && this.url != "") {
				let imgVo:ImageVo = GLoader.gImageDic[this.url];
				if (imgVo) {
                    imgVo.useTime--;
                    imgVo.removeNoGCMark(this);
				}
			}
		}
		this.texture = null;
		this.url = null;
	}

	public dispose():void {
        this.clear();
		super.dispose();
	}

	public destroy():void {
		// super.dispose();//这里不调用父类dispose，因为要做回池
		egret.Tween.removeTweens(this);
		egret.Tween.removeTweens(this.displayObject);
		this.clear();
		this.removeFromParent();
		App.DisplayUtils.removeFromParent(this.displayObject);
		AnchorUtil.setAnchor(this.displayObject, 0);
		this.scaleX = this.scaleY = 1;
		this.alpha = 1;
		this.visible = true;
		this.rotation = 0;
		// this.pivotX = this.pivotY = 0
		this.setPivot(0,0,true);
		this.touchable = true;
		this.fill = fairygui.LoaderFillType.None;
		this.align = fairygui.AlignType.Left;
		this.verticalAlign = fairygui.VertAlignType.Top;
		this.width = 0;
		this.height = 0;
		this.autoSize = undefined;
		this.x = this.y = 0;
		ObjectPool.push(this);
	}

	/**
	 * 开启GC检测timer
	 */
	private static startGCTimer() {
		if (GLoader.gHasStartGCTimer == false) {
			GLoader.gHasStartGCTimer = true;
			// App.TimerManager.doTimer(5000, 0, GLoader.checkGC, GLoader);
			App.TimerManager.doTimer(50, 0, GLoader.checkQueueDisappear, GLoader);
		}
	}

	/**
	 * 检测GC
	 */
	public static checkGC(failTime:number, isForce:boolean) {
		let _now: number = egret.getTimer();
		for (let name in GLoader.gImageDic) {
			let _imageVo: ImageVo = GLoader.gImageDic[name];
			if (_imageVo.useTime == 0 && _imageVo.canGC) {
				if ((_now - _imageVo.lastUseTime >= failTime) || isForce) {
					_imageVo.dispose();
					delete GLoader.gImageDic[name];
					let _re = App.LoaderManager.destroyRes(name);
					// Log.trace(Log.CLEANUP, ">>>GLoaderDispose:" + name, "ret:" + _re);
				}
			}
		}
	}

	/**
	 * 防止bitmap使用到的资源被GLoader清理掉
	 */
	public static addUseTime(url:string):void {
		let _vo: ImageVo = GLoader.gImageDic[url];
		if (_vo == null) {
			GLoader.gImageDic[url] = _vo = new ImageVo();
		}
        _vo.source = App.LoaderManager.getCache(url);
		_vo.useTime++;
	}

	public static clearByUrl(url:string):void {
		let imgVo:ImageVo = GLoader.gImageDic[url];
		if (imgVo) {
			imgVo.useTime--;
		}
	}
}

/**
 * 数据源vo
 */
class ImageVo {
	/**
	 * 数据源（SpriteSheet或者texture）
	 */
	public source: any;
	/**
	 * 子图片集合（用于数据源是SpriteSheet）
	 */
	public subImage: { [name: string]: ImageVo } = {};
	/**
	 * 使用次数
	 */
	private gUseTime: number = 0;
	/**
	 * 最后使用时间戳（毫秒）
	 */
	private gLastUseTime: number = 0;
	/**
	 * 本vo释放时是否需要释放数据源
	 */
	private gNeedDisposeSource: boolean;
	/**
	 * 防止自动回收的引用标记
	 */
	private gNoGCMark: any[] = [];
	public constructor(cusNeedDisposeSource: boolean = false) {
		this.gNeedDisposeSource = cusNeedDisposeSource;
	}
	/**
	 * 添加防GC标记引用
	 * @param  {GLoader} cusObj
	 */
	public addNoGCMark(cusObj: GLoader) {
		if (this.gNoGCMark.indexOf(cusObj) == -1) {
			this.gNoGCMark.push(cusObj);
		}
	}
	/**
	 * 移除防GC标记引用
	 * @param  {GLoader} cusObj
	 */
	public removeNoGCMark(cusObj: GLoader) {
		let _index: number = this.gNoGCMark.indexOf(cusObj)
		if (_index != -1) {
			this.gNoGCMark.splice(_index, 1);
		}
	}

	/**
	 * 是否自动回收
	 * @returns boolean
	 */
	public get canGC(): boolean {
		return this.gNoGCMark.length == 0;
	}

	/**
	 * 获取引用次数
	 * @returns number
	 */
	public get useTime(): number {
		return this.gUseTime;
	}
	/**
	 * 设置引用次数
	 * @param  {number} cusValue
	 */
	public set useTime(cusValue: number) {
		if (this.gUseTime != cusValue) {
			this.gUseTime = cusValue;
			this.gLastUseTime = egret.getTimer();
		}
	}
	/**
	 * 最后使用时间戳（毫秒）
	 * @returns number
	 */
	public get lastUseTime(): number {
		return this.gLastUseTime;
	}
	/**
	 * 释放
	 */
	public dispose() {
		if (this.gNeedDisposeSource && (typeof this.source).toString() == "egret.Texture") {
			this.source.dispose();
		}
		this.source = null;
		this.subImage = null;
		this.gUseTime = 0;
		this.gLastUseTime = 0;
	}

	public $hitTest(stageX: number, stageY: number): egret.DisplayObject {
		return null;
	}
}