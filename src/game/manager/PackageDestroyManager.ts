/**
 * 资源包销毁管理
 */
class PackageDestroyManager {
	private static _instance: PackageDestroyManager;
	/**是否启用资源包销毁 */
	private _isEnable: boolean;
	/**正在使用的包 */
	private usingPackageDict: { [name: string]: number } = {};
	/**待销毁的视图 */
	private checkViews: { [className: string]: ViewInfo } = {};
	/**待销毁的特效 */
	private checkMCs: { [packageName: string]: MCInfo } = {};
	/**常驻资源包 */
	private residentPackages: string[] = [
		PackNameEnum.Common, PackNameEnum.Num, PackNameEnum.Home, PackNameEnum.HomeIcon, PackNameEnum.Navbar, PackNameEnum.ChatFace, PackNameEnum.Sound,
		PackNameEnum.Copy, PackNameEnum.Copy2, PackNameEnum.Scene, PackNameEnum.Pack, PackNameEnum.Boss];
	/**已销毁图集的视图 */
	private destroyedViews: { [className: string]: any } = {};
	private interval: number = 1000;
	/**存活时间 */
	private ttl: number = 3 * 1000 * 60;

	public constructor() {
		this.isEnable = true;
	}

	public static get instance(): PackageDestroyManager {
		if (PackageDestroyManager._instance == null) {
			PackageDestroyManager._instance = new PackageDestroyManager();
		}
		return PackageDestroyManager._instance;
	}

	public set isEnable(isEnable: boolean) {
		App.TimerManager.remove(this.checkAndDestroy, this);
		this._isEnable = isEnable;
		if (isEnable) {
			App.TimerManager.doTimer(this.interval, 0, this.checkAndDestroy, this);
		}
	}

	public get isEnable(): boolean {
		return this._isEnable;
	}

	/**
	 * 视图图集是否已被销毁
	 */
	public isDestroyed(view: BaseUIView): boolean {
		let className: string = view["__class__"];
		return this.destroyedViews[className] != null;
	}

	public onMCAddOrRemove(mc: UIMovieClip, isAdd: boolean): void {
		if (!this.isEnable) {
			return;
		}
		let add: number = 0;
		if (isAdd) {
			add = 1;
		} else {
			add = -1;
			this.pushToCheckMCs(mc);
		}
		this.updateUsingTimes(mc.pkgName, add);
	}

	/**
	 * 视图显示或关闭触发
	 * @param view 视图。主要包含BaseGUIView和BaseTabView
	 * @param isShow 打开/关闭
	 */
	public onViewShowOrHide(view: BaseUIView, isShow: boolean): void {
		if (!this.isEnable || view == null) {
			return;
		}
		let className: string = view["__class__"];
		let packageName: string = view.packageName;
		let add: number = 0;
		if (isShow) {
			add = 1;
			delete this.destroyedViews[className];
		} else {
			if (this.isCanPushToCheckViews(view)) {
				this.pushToCheckViews(view);
			}
			add = -1;
		}
		this.updateUsingTimes(packageName, add);
		//处理依赖包
		let dependences: Array<string> = ResourceManager.getDependences(packageName);
		if (dependences) {
			for(let name of dependences) {
				this.updateUsingTimes(name, add);
			}
		}
	}

	/**
	 * 加入检测视图列表
	 */
	private pushToCheckViews(view: BaseUIView): void {
		let className: string = view["__class__"];
		if (this.checkViews[className]) {
			this.checkViews[className].lastUseTime = egret.getTimer();
		} else {
			this.checkViews[className] = new ViewInfo(view, egret.getTimer());
		}
	}

	/**
	 * 加入检测特效列表
	 */
	private pushToCheckMCs(mc: UIMovieClip): void {
		let packageName: string = mc.pkgName;
		if (this.checkMCs[packageName]) {
			this.checkMCs[packageName].lastUseTime = egret.getTimer();
		} else {
			this.checkMCs[packageName] = new MCInfo(mc, egret.getTimer());
		}
	}

	/**更新包使用次数 */
	private updateUsingTimes(packageName: string, add: number): void {
		if (this.usingPackageDict[packageName] == null) {
			this.usingPackageDict[packageName] = 0;
		}
		this.usingPackageDict[packageName] += add;
		if (this.usingPackageDict[packageName] < 0) {
			this.usingPackageDict[packageName] = 0;
		}
	}

	/**是否可以加入检测列表 */
	private isCanPushToCheckViews(view: BaseUIView): boolean {
		let packageName: string = view.packageName;
		return this.residentPackages.indexOf(packageName) == -1;// && !ResourceManager.isHasDependence(packageName);//如果有依赖不能销毁的话，像炼器模块多个页签依赖Forge，当Forge被销毁时不能重新渲染所有依赖该包的组件就有问题
	}

	/**
	 * 使用资源包的检测列表的视图是否都可以销毁
	 */
	private isCheckViewCanDestroy(packageName: string): boolean {
		let viewInfo: ViewInfo;
		for (let className in this.checkViews) {
			viewInfo = this.checkViews[className];
			if (viewInfo.view.packageName == packageName && egret.getTimer() - viewInfo.lastUseTime <= this.ttl) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 是否可以销毁
	 * 常驻的、有依赖的、当前正在使用不能销毁
	 */
	private isCanDestroy(view: BaseUIView): boolean {
		let packageName: string = view.packageName;
		return (this.usingPackageDict[packageName] != null && this.usingPackageDict[packageName] == 0) && this.isCheckViewCanDestroy(packageName);
	}

	/**执行销毁视图 */
	private doDestroy(view: BaseUIView): void {
		if (view) {
			let className: string = view["__class__"];
			let packageName: string = view.packageName;
			// let before: number = CacheManager.res.checkBitmapSize().ui;
			console.log("===================销毁" + packageName + "，" + view["__class__"]);
			// console.log("销毁前：" + before);
			// view.dispose();//只销毁图集
			ResourceManager.destroyPackage(packageName);
			this.destroyedViews[className] = 1;
			// let after: number = CacheManager.res.checkBitmapSize().ui;
			// console.log("销毁后：" + after);
			// console.log("减少：" + (after - before));
		}
	}

	/**检测并销毁 */
	private checkAndDestroy(): void {
		let viewInfo: ViewInfo;
		for (let className in this.checkViews) {
			viewInfo = this.checkViews[className];
			if (this.isCanDestroy(viewInfo.view) && (egret.getTimer() - viewInfo.lastUseTime > this.ttl)) {
				this.doDestroy(viewInfo.view);
				delete this.checkViews[className];
			}
		}

		let mcInfo: MCInfo;
		for (let packageName in this.checkMCs) {
			mcInfo = this.checkMCs[packageName];
			if ((this.usingPackageDict[packageName] != null && this.usingPackageDict[packageName] == 0) && (egret.getTimer() - mcInfo.lastUseTime > this.ttl)) {
				ResourceManager.destroyPackage(packageName);
				console.log("===================销毁特效：" + packageName);
				delete this.checkMCs[packageName];
			}
		}
	}
}



/**
 * 视图信息
 */
class ViewInfo {
	public view: BaseUIView;
	public lastUseTime: number;

	public constructor(view: BaseUIView, lastUseTime: number) {
		this.view = view;
		this.lastUseTime = lastUseTime;
	}
}

/**
 * 特效信息
 */
class MCInfo {
	public mc: UIMovieClip;
	public lastUseTime: number;

	public constructor(mc: UIMovieClip, lastUseTime: number) {
		this.mc = mc;
		this.lastUseTime = lastUseTime;
	}
}