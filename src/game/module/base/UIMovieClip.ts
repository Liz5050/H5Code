/**
 * 动态创建的UI特效
 * 大特效单独打包
 */
class UIMovieClip extends fairygui.GComponent {
	public static Ready: string = "UIMovieClip_Ready";

	private static loadingPkgDict: any = {};

	public mc: fairygui.GMovieClip;
	private mc2: fairygui.GMovieClip;
	protected resName: string;
	private _pkgName: string;
	private _autoRemove: boolean;
	private _playing: boolean = true;
	private _frame: number = 0;
	private _grayedStatus: boolean = false;
	private _settings: any[];
	private _isLoaded: boolean = false;
	private _dfWidth:number = 0;
	private _dfHeight:number = 0;
	private _double: boolean = false;
	private offsetX: number = 0;
	private offsetY: number = 0;
	
	private _scriptFrame:number = -1;
	private _frameCallBack:Function;
	private _frameCaller:any;
	private _scriptTimeId:number = 0;

	public constructor(pkgName: string, resName: string) {
		super();
		this.touchable = false;
		this.setRes(pkgName, resName);
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddHandler, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveHandler, this);
	}

	public get height(): number {
		if (this.mc) {
			return this.mc.height;
		}
		return this._dfHeight;
	}
	public get width(): number {
		if (this.mc) {
			return this.mc.width;
		}
		return this._dfWidth;
	}

	public setDfWH(width:number,height:number):void{
		this._dfWidth = width;
		this._dfHeight = height;
	}

	public set playing(playing: boolean) {
		this._playing = playing;
		if (this.mc) {
			this.mc.playing = this._playing;
		}
		if (this.mc2) {
			this.mc2.playing = this._playing;
		}
	}

	public set grayed(value: boolean) {
		this._grayedStatus = value;
		if (this.mc) {
			this.mc.grayed = this._grayedStatus;
		}
	}
	public get grayed(): boolean {
		return this._grayedStatus;
	}
	public get playing(): boolean {
		return this._playing;
	}

	public setDouble(value: boolean = true, offsetX: number = 0, offsetY: number = 0) {
		this._double = value;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		if (this._isLoaded) {
			this.processDouble();
		}
	}

	public get double(): boolean {
		return this._double;
	}

	public setDoubleOffSet(): void {

	}

	public set frame(frame: number) {
		this._frame = frame;
		if (this.mc) {
			this.mc.frame = frame;
		}
		if (this.mc2) {
			this.mc2.frame = frame;
		}
	}
	public get frame(): number {
		if (this.mc) {
			return this.mc.frame
		}
		return this._frame;
	}
	/**
	 * 是否播放完一次就自动删除
	 */
	public set autoRemove(value: boolean) {
		this._autoRemove = value;
		if (this._autoRemove) {
			this.setPlaySettings(0, -1, 1, -1, () => {
				this.removeFromParent();
			}, this);
		} else {
			this.setPlaySettings(0, -1, 0, -1);
		}
	}
	/**
	 * 从start帧开始，播放到end帧（-1表示结尾），重复times次（0表示无限循环），循环结束后，停止在endAt帧（-1表示参数end）
	 */
	public setPlaySettings(start?: number, end?: number, times?: number, endAt?: number, endCallback?: Function, callbackObj?: any): void {
		if (this.mc) {
			this.mc.setPlaySettings(start, end, times, endAt, endCallback, callbackObj);
			if (this.mc2) {
				this.mc2.setPlaySettings(start, end, times, endAt);
			}
		} else {
			this._settings = [start, end, times, endAt, endCallback, callbackObj];
		}
	}

	/**播放到第几帧回调 */
	public addFrameScript(frame:number,callFn:Function,caller:any):void{
		this._scriptFrame = frame;
		this._frameCallBack = callFn;
		this._frameCaller = caller;
		if(this._frameCallBack && this._frameCaller){
			this._scriptTimeId = egret.setInterval(()=>{
				if(this._frameCallBack && this._frameCaller && this.mc && this.mc.frame>=this._scriptFrame){
					this._frameCallBack.call(this._frameCaller);
					this.stopFrameTimeOut();
				}
			},this,20); //20毫秒执行一次,准确度可能会有一帧的差别
		}
	}

	public setRes(pkgName: string, resName: string): void {
		if (this._pkgName != pkgName || this.resName != resName) {
			this.resName = resName;
			this._pkgName = pkgName;
			let data: any = { pkgName: pkgName, resName: resName };
			if (ResourceManager.isPackageLoaded(pkgName)) {
				this.onLoaded(data);
			} else if (UIMovieClip.loadingPkgDict[pkgName]) {
				EventManager.addListener(UIEventEnum.PackageLoaded, this.onPkgLoaded, this);
			} else {
				ResourceManager.load(pkgName, -1, new CallBack(this.onLoaded, this, data));
				UIMovieClip.loadingPkgDict[pkgName] = true;
			}
		}
	}

	public get pkgName(): string {
		return this._pkgName;
	}

	private stopFrameTimeOut():void{
		if(this._scriptTimeId>0){
			egret.clearInterval(this._scriptTimeId);
		}
	}

	private onPkgLoaded(pkgName: string): void {
		if (this._pkgName == pkgName) {
			let data: any = { pkgName: this._pkgName, resName: this.resName };
			this.onLoaded(data);
			EventManager.removeListener(UIEventEnum.PackageLoaded, this.onPkgLoaded, this);
		}
	}

	private onLoaded(data: any): void {
		this._isLoaded = true;
		let resName: string = data.resName;
		let pkgName: string = data.pkgName;
		this.clearMc();
		ResourceManager.addPackage(pkgName);
		this.mc = fairygui.UIPackage.createObject(pkgName, resName).asMovieClip;
		this.addChild(this.mc);
		this.processDouble();
		if (this._settings) {
			this.setPlaySettings.apply(this, this._settings);
		}
		this.frame = this._frame;
		this.playing = this._playing;
		this.mc.touchable = false;
		this.mc.grayed = this._grayedStatus;
		this.dispatchEvent(new egret.Event(UIMovieClip.Ready));
		delete UIMovieClip.loadingPkgDict[pkgName];
	}

	private processDouble(): void {
		if (this.double) {
			if (!this.mc2) {
				this.mc2 = fairygui.UIPackage.createObject(this.pkgName, this.resName).asMovieClip;
				this.mc2.scaleX = -1;
				this.mc2.x = this.width + this.offsetX;
				this.mc2.y = this.offsetY;
				this.addChild(this.mc2);
				this.mc2.touchable = false;
			}
		} else {
			if (this.mc2) {
				this.mc2.removeFromParent();
			}
		}
	}

	protected clearMc(): void {
		if (this.mc) {
			this.mc.dispose();
			this.mc = null;
		}
		if (this.mc2) {
			this.mc2.dispose();
			this.mc2 = null;
		}
	}
	public clearVars():void{
		this._scriptFrame = -1;
		this._frameCallBack = null;
		this._frameCaller = null;
	}
	public destroy(): void {
		this.dispose();
		this.clearMc();
		this.clearVars();
		this._grayedStatus = false;
		this.resName = "";
		this._pkgName = "";
		this._settings = null;		
		this.stopFrameTimeOut();
	}

	private onAddHandler(): void {
		PackageDestroyManager.instance.onMCAddOrRemove(this, true);
		let packageName: string = this.pkgName;
		if (this.mc) {
			if (FuiUtil.isGMovieClipDispose(this.mc)) {
				ResourceManager.load(packageName, -1, new CallBack(() => {
					if (this.mc) {
						FuiUtil.renderGMovieClip(this.mc);
					}
					if (this.mc2) {
						FuiUtil.renderGMovieClip(this.mc2);
					}
				}, this));
			}
		}
	}

	private onRemoveHandler(): void {
		PackageDestroyManager.instance.onMCAddOrRemove(this, false);
	}
}