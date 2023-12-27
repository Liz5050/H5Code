/**
 * 弹出视图，点击空白地方会自动关闭
 */
class BasePopupView extends BaseUIView {
	private _isShow: boolean;
	protected _view: fairygui.GComponent;
	private _viewName: string;
	private _isInit: boolean = false;
	protected modalLayer: fairygui.GGraph;
	/**是否动画显示/隐藏 */
	protected isAnimateShow: boolean;
	/**遮罩层颜色 */
	protected modalColor: number = 0x000000;
	/**遮罩层透明度 */
	protected modalAlpha: number = 0.7;
	protected parentLayer:fairygui.GComponent;
	/**
	 * @param packageName 包名
	 * @param viewName    视图组件名称
	 */
	public constructor(packageName: string, viewName: string,parent:fairygui.GComponent=LayerManager.UI_Tips) {
		super();
		this.packageName = packageName;
		this._viewName = viewName;
		this.parentLayer = parent;
		this._initUI();

		this.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onHidden, this);
	}

	public initUI(): void {

	}

	public show(x: number = -1, y: number = -1): void {
		this.parentLayer.addChild(this);
		if (x != -1 && y != -1) {
			this.setXY(x, y);
		} else {
			this.center();
		}
		this.onShow();
	}

	public center(): void {
		let centerX: number = (fairygui.GRoot.inst.width - this.width) / 2;
		let centerY: number = (fairygui.GRoot.inst.height - this.height) / 2;
		if (this.isAnimateShow) {
			centerX = fairygui.GRoot.inst.width / 2;
			centerY = fairygui.GRoot.inst.height / 2;
		}
		this.setXY(centerX, centerY);
	}

	public hide(): void {
		if (this.isAnimateShow) {
			egret.Tween.removeTweens(this);
			egret.Tween.get(this).to({ scaleX: 0, scaleY: 0 }, 200).call(() => {
				this.removeFromParent();
			});
		} else {
			this.removeFromParent();
		}
		this._isShow = false;
		EventManager.dispatch(UIEventEnum.ViewClosed, this["__class__"]);
		App.StageUtils.getStage().removeEventListener(egret.Event.RESIZE, this.onStageResize, this);
		this.onHide();
	}

	public get isShow(): boolean {
		return this._isShow;
	}

	public toogle(): void {
		fairygui.GRoot.inst.togglePopup(this);
	}

	public getChild(name: string): fairygui.GObject {
		return this._view.getChild(name);
	}

	/**
     * 根据名称获取子组件
     */
	public getGObject(name: string = null): fairygui.GObject {
		let obj = this._view.getChild(name)
		return obj;
	}

	public removeGObject(name: string): void {
		let obj: fairygui.GObject = this.getGObject(name);
		if (obj != null) {
			obj.removeFromParent();
		}
	}

	public get width(): number {
		return this._view.width;
	}

	public get height(): number {
		return this._view.height;
	}

	public getController(name: string): fairygui.Controller {
		return this._view.getController(name);
	}

	private _initUI(): void {
		if (this._isInit) {
			return;
		}
		if (this.packageName != null) {
			this._view = fairygui.UIPackage.createObject(this.packageName, this._viewName).asCom;
			this.addChild(this._view);
		}
		this.initUI();
		this._isInit = true;
	}

	public set modal(modal: boolean) {
		if (modal) {
			if (this.modalLayer == null) {
				this.modalLayer = new fairygui.GGraph();
				this.modalLayer.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
				this.modalLayer.drawRect(0, 0, 0, this.modalColor, this.modalAlpha);
				this.modalLayer.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
				this.modalLayer.touchable = true;
				this.modalLayer.addClickListener(this.hide, this);
			}
			if (this.modalLayer.parent == null) {
				this.parentLayer.addChild(this.modalLayer);
			}
		} else {
			if (this.modalLayer) {
				this.modalLayer.removeFromParent();
			}
		}
	}

	public onShow(): void {
		super.onShow();
		if (this.isAnimateShow) {
			this.setSize(this._view.width, this._view.height);
			this.addRelation(this._view, fairygui.RelationType.Size);
			this.setPivot(0.5, 0.5, true);
			this.setXY(fairygui.GRoot.inst.width / 2, fairygui.GRoot.inst.height / 2);
			this.setScale(0, 0);
			egret.Tween.removeTweens(this);
			egret.Tween.get(this)
				.to({ scaleX: 1.05, scaleY: 1.05 }, 100).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
					this.setXY(fairygui.GRoot.inst.width / 2, fairygui.GRoot.inst.height / 2);
					this._isShow = true;
					EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
					App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, this.onStageResize, this);
				}, egret.Ease.backInOut);
		} else {
			this.setSize(0, 0);
			this.removeRelation(this._view);
			this.setPivot(0, 0, true);
			this._isShow = true;
			EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
			App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, this.onStageResize, this);
		}
	}

	public onHidden(): void {
		this.modal = false;
	}

	protected onStageResize(): void {
		if (this.isShow) {
			this.center();
			if (this.modal) {
				this.modalLayer.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
				this.modalLayer.clearGraphics();
				this.modalLayer.drawRect(0, 0, 0, this.modalColor, this.modalAlpha);
			}
		}
	}
}