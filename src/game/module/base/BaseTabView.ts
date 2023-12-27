abstract class BaseTabView extends BaseUIView {
	protected _tabIndex:number = -1;
	protected _tabType:number = -1;
	protected _isOpen:boolean = false;//页签是否开启
	protected openCfg:any;//功能开启配置
	/**是否关闭时销毁界面资源 */
    protected isDestroyOnHide: boolean = true;
    private _listen: BaseListen;

	public constructor() {
		super();
        this._listen = new BaseListen();
	}

	public set tabType(type:number) {
		if(this._tabType == type) return;
		this._tabType = type;
		this.openCfg = ConfigManager.mgOpen.getByOpenKey(PanelTabType[type]);
	}
	
	public get tabType():number {
		return this._tabType;
	}

	public setOpen(value:boolean) {
		if(this._isOpen == value) return;
		this._isOpen = value;
	}

	public isOpen(showTips:boolean = false):boolean {
		if(!this._isOpen && showTips) {
			Tip.showTip(this.openCfg.openCondDesc);
		}
		return this._isOpen;
		// return ConfigManager.mgOpen.isOpenedByKey(PanelTabType[this.tabType],showTips);
	}

	public set tabIndex(index:number) {
		if(this._tabIndex == -1) {
			this._tabIndex = index;
		}
	}

	public get tabIndex():number {
		return this.tabIndex;
	}

    public addListenerOnShow(): void {

    }

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.initOptUI();
	}

	/**
     * 根据名称获取子组件
     */
	protected getGObject(name: string): fairygui.GObject {
		let obj = this.getChild(name);
		return obj;
	}

    /**
     * 增加监听，界面关闭时会移除监听
     */
    protected addListen1(name: any, listener: Function, caller: any): void {
        this._listen.add(name, 1, listener, caller);
    }

	/**
	 * 初始化可操作UI组件。与UI编辑器中命名的组件对应。
	 */
	protected abstract initOptUI(): void;

	public updateAll(param:any = null):void {
		
	}

	public hide():void {
		this.removeFromParent();
        this._listen.hide();
		this.onHide();
	}

	/**销毁界面 */
	public destroy():void {
		this.hide();
		this.removeChildren();
		this._tabType = -1;
		this._tabIndex = -1;
		this._isOpen = false;
		this.openCfg = null;
	}

	public onShow(): void {
		if (this.isDestroyOnHide) {
            PackageDestroyManager.instance.onViewShowOrHide(this, true);
        }
	}

	public onHide(): void {
		if (this.isDestroyOnHide) {
            PackageDestroyManager.instance.onViewShowOrHide(this, false);
        }
	}
}