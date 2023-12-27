/**
 * 标签栏类型
 */
enum TabBgType {
	Default,//默认
	Low,//最低高度
	High,//最大高度
	None//无按钮栏
}


class BaseTabModule extends BaseModule {
	protected _tabBgType: TabBgType;
	protected heightController: fairygui.Controller;
	protected tabParent: fairygui.GComponent;
	protected className: { [tabType: number]: any[] };//[["导出资源名",ts类名,"包名"]]
	protected tabViews: { [type: number]: BaseTabView };
	protected tabBtnList: List;
	protected _tabTypes: PanelTabType[];
	protected curType: PanelTabType = -1;
	protected curIndex: number = -1;

	private leftBtn: fairygui.GObject;
	private rightBtn: fairygui.GObject;

	/**是否根据页签索引设置不同标题 */
	protected indexTitle: boolean = true;
	public constructor(moduleId: ModuleEnum, packageName: string = null, componentName: string = "Main", $parent: fairygui.GComponent = LayerManager.UI_Main) {
		super(moduleId, packageName, componentName, $parent);
	}

	public initOptUI(): void {
		this.initTabInfo();
		this.tabViews = {};
		this._tabTypes = this.getTabTypes();
		let tabModule: fairygui.GObject = this.getGObject("tab_module");
		if (tabModule) {
			let component: fairygui.GComponent = tabModule.asCom;
			this.heightController = component.getController("heightController");
			this.tabParent = component.getChild("tabContainer").asCom;
			this.tabBtnList = new List(component.getChild("list_tabBtn").asList);
			this.leftBtn = component.getChild("btn_left");
			this.rightBtn = component.getChild("btn_right");
		}
		else {
			this.tabParent = this.getGObject("tabContainer").asCom;
			this.tabBtnList = new List(this.getGObject("list_tabBtn").asList);
			this.leftBtn = this.getGObject("btn_left");
			this.rightBtn = this.getGObject("btn_right");
		}
		this.tabBtnList.list.foldInvisibleItems = true;
		this.tabBtnList.list.defaultItem = this.getTabListDefaultItem();

		this.tabBtnList.data = this._tabTypes;
		this.tabBtnList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onSelectBtnChange, this);
		this.tabBtnList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onScroll, this);
		this.tabBtnList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onScrollEnd, this);

		if (this.leftBtn && this.rightBtn) {
			this.leftBtn.addClickListener(this.clickArrowBtn, this);
			this.rightBtn.addClickListener(this.clickArrowBtn, this);
		}
	}

	protected getTabTypes(): number[] {
		return UIManager.ModuleTabTypes[this.moduleId];
	}

	public getTabViews(): { [type: number]: BaseTabView } {
		return this.tabViews;
	}

	protected initTabInfo(): void {
	}

	public onShow(data?: any): void {
		super.onShow(data);
		for (let i: number = 0; i < this._tabTypes.length; i++) {
			this.checkTabVisible(this._tabTypes[i]);
		}
		this.onScroll();
		this.onScrollEnd();
	}

	protected getTabListDefaultItem(): string {
		return URLManager.getPackResUrl(PackNameEnum.Common, "TabButtonItem");
	}

	protected onSelectBtnChange(): void {
		let index: number = this.tabBtnList.selectedIndex;
		let btnItem: ListRenderer = this.tabBtnList.list.getChildAt(index) as ListRenderer;
		let type: PanelTabType = btnItem.getData();
		this.setIndex(type);
	}

	public setIndex(type: PanelTabType, param: any = null): void {
		if (this.curType == type) return;
		let btn: ListRenderer;
		let clickIndex: number = this.tabTypes.indexOf(type);
		if (clickIndex != -1) {
			btn = (this.tabBtnList.list.getChildAt(clickIndex) as ListRenderer);
		}

		let tabIsOpen: boolean = this.isOpen(type, true);
		if (!tabIsOpen) {
			let openCfg: any = ConfigManager.mgOpen.getByOpenKey(PanelTabType[type]);
			let previewLevel:number = openCfg.previewLevel > 0 ? openCfg.previewLevel : 0;
			if (openCfg.showStyleUnopen == UnOpenShowEnum.Show_Tips || openCfg.showStyleUnopen == UnOpenShowEnum.Hide_Entrance || (openCfg.showStyleUnopen == UnOpenShowEnum.Preview && CacheManager.role.getRoleLevel() < previewLevel)) {
				if (btn) btn["btnSelected"] = false;
				return;
			}
		}
		if (this.curType != -1) {
			let preView: BaseTabView = this.tabViews[this.curType];
			if (preView) {
				preView.hide();
			}
			this.curIndex = this.tabTypes.indexOf(this.curType);
			btn = this.tabBtnList.list.getChildAt(this.curIndex) as ListRenderer;
			btn["btnSelected"] = false;
		}
		this.curType = type;
		this.curIndex = this.tabTypes.indexOf(this.curType);
		btn = this.tabBtnList.list.getChildAt(this.curIndex) as ListRenderer;
		btn["btnSelected"] = true;

		let tabPackName: string = this.curTabPackageName;

		let view: BaseTabView = this.tabViews[this.curType];
		if (!view) {
			if (!this.className[this.curType]) {
				return;
			}
			if (!ResourceManager.isPackageLoaded(tabPackName)) {
				ResourceManager.load(tabPackName, UIManager.getPackNum(tabPackName), new CallBack(this.onTabLoadComplete, this, { type: type, isOpen: tabIsOpen, param: param }));
				return;
			}
			let resName: string = this.className[this.curType][0];
			let cls: any = this.className[this.curType][1];
			view = FuiUtil.createObject(tabPackName, resName, cls) as BaseTabView;
			if (!view) {
				console.log("tab error :", tabPackName, resName, cls);
			}
			view.tabIndex = this.curIndex;
			view.tabType = type;
			view.setOpen(tabIsOpen);
			view.packageName = tabPackName;
			this.tabViews[type] = view;
		}
		this.tabParent.addChild(view);
		if (!ResourceManager.isPackageLoaded(tabPackName)) {
			ResourceManager.load(tabPackName, UIManager.getPackNum(tabPackName), new CallBack(() => {
				for (let type in this.tabViews) {//多个tab使用同一个包
					let tabView: BaseTabView = this.tabViews[type];
					if (tabView.packageName == tabPackName) {
						FuiUtil.renderGComponent(tabView, tabPackName);
					}
				}
				view.addListenerOnShow();
				this.changeTitle();
				view.updateAll(param);
				view.setSize(this.tabParent.width, this.tabParent.height);
				view.addRelation(this.tabParent, fairygui.RelationType.Size);
				view.packageName = tabPackName;
				view.onShow();
				this.updateSubView();
				if (!ResourceManager.isPackageLoaded(tabPackName)) {
					ResourceManager.load(tabPackName, UIManager.getPackNum(tabPackName), new CallBack(() => {
						FuiUtil.renderGComponent(view, tabPackName);
					}, this));
				}
				// EventManager.dispatch(UIEventEnum.ViewOpened, view["__class__"]);
				this.dispatchViewOpened(view);
			}, this));
		} else {
			let isDestroyed: boolean = PackageDestroyManager.instance.isDestroyed(view);
			view.addListenerOnShow();
			this.changeTitle();
			view.updateAll(param);
			view.setSize(this.tabParent.width, this.tabParent.height);
			view.addRelation(this.tabParent, fairygui.RelationType.Size);
			view.packageName = tabPackName;
			view.onShow();
			this.updateSubView();
			// EventManager.dispatch(UIEventEnum.ViewOpened, view["__class__"]);
			this.dispatchViewOpened(view);
			if (isDestroyed) {
				FuiUtil.renderGComponent(view, view.packageName);
			}
		}
	}

	protected updateSubView(): void {
	}

	protected changeTitle(): void {
		if (this.curIndex == -1) return;
		if (this.indexTitle) {
			this.title = ModuleEnum[this.moduleId] + "_" + this.curIndex;
		}
		else {
			this.title = ModuleEnum[this.moduleId] + "_0";
		}
	}

	private onTabLoadComplete(data: any): void {
		let type: PanelTabType = data.type;
		if (this.curType != type) return;
		let tabPackName: string = this.curTabPackageName;
		let view: BaseTabView = this.tabViews[this.curType];
		if (!view) {
			let resName: string = this.className[this.curType][0];
			let cls: any = this.className[this.curType][1];
			view = FuiUtil.createObject(tabPackName, resName, cls) as BaseTabView;
			this.tabViews[this.curType] = view;
		}

		view.tabIndex = this.curIndex;
		view.tabType = type;
		view.setOpen(data.isOpen);
		view.packageName = tabPackName;
		this.tabParent.addChild(view);
		view.addListenerOnShow();
		view.updateAll(data.param);
		this.changeTitle();
		view.setSize(this.tabParent.width, this.tabParent.height);
		view.addRelation(this.tabParent, fairygui.RelationType.Size);
		view.onShow();
		this.updateSubView();
		// EventManager.dispatch(UIEventEnum.ViewOpened, view["__class__"]);
		this.dispatchViewOpened(view);
	}

	public setBtnTips(type: PanelTabType, isTips: boolean, posPoint: egret.Point = null, isTopLayer: boolean = false, ): void {
		let index: number = this.tabTypes.indexOf(type);
		if (index == -1) return;
		let btn: fairygui.GButton = this.tabBtnList.list.getChildAt(index) as fairygui.GButton;
		if (btn) {
			if (btn["hasTip"] != undefined) {
				btn["hasTip"] = isTips;
			}
			let px: number = posPoint ? posPoint.x : null;
			let py: number = posPoint ? posPoint.y : null;
			CommonUtils.setBtnTips(btn, this.isOpen(type) && isTips, px, py, isTopLayer);
		}
	}

	/**当前选中的页签是否是指定类型的界面 */
	public isTypePanel(type: PanelTabType): boolean {
		if (!this.curPanel) return false;
		return this.curType == type;
	}

	/**
	 * 检测页签开启状态
	 */
	protected checkTabVisible(type: PanelTabType): void {
		let index: number = this.tabTypes.indexOf(type);
		if (index == -1) return;
		let isOpen: boolean = this.isOpen(type);
		let openCfg: any = ConfigManager.mgOpen.getByOpenKey(PanelTabType[type]);
		let btn: fairygui.GButton = this.tabBtnList.list.getChildAt(index) as fairygui.GButton;
		btn.visible = isOpen || openCfg.showStyleUnopen == UnOpenShowEnum.Preview || openCfg.showStyleUnopen == UnOpenShowEnum.Show_Tips || this.showCondition(type);
		if (this.tabViews[type]) this.tabViews[type].setOpen(isOpen);
	}

	/**
	 * 页签显示扩展条件 
	 */
	protected showCondition(type: PanelTabType): boolean {
		return false;
	}

	protected setBtnVisible(type: PanelTabType, isShow: boolean): void {
		if (!this.tabTypes) return;
		let index: number = this.tabTypes.indexOf(type);
		if (index == -1) return;
		let btn: fairygui.GButton = this.tabBtnList.list.getChildAt(index) as fairygui.GButton;
		if (!btn) return;
		btn.visible = Boolean(isShow);
	}

	/**
	 * 此方法不公开 
	 * 每个页签检测之后，开启信息都会保存到tab类，防止重复检测
	 * 调用curPanel.isOpen()判断页签开启状态
	 */
	private isOpen(type: PanelTabType, showTip: boolean = false): boolean {
		return ConfigManager.mgOpen.isOpenedByKey(PanelTabType[type], showTip);
	}

	protected get curPanel(): any {
		return this.tabViews[this.curType];
	}

	protected get curTabBtn(): any {
		if (this.curIndex == -1 || this.curIndex >= this.tabTypes.length) return null;
		return this.tabBtnList.list.getChildAt(this.curIndex);
	}

	protected get tabTypes(): PanelTabType[] {
		return this._tabTypes;
	}

	protected get curTabPackageName(): string {
		let packageName = this.packageName;
		if (this.className[this.curType].length > 2) {
			packageName = this.className[this.curType][2];
		}
		return packageName;
	}

	protected set bottomArea(value: boolean) {
		if (this.heightController) {
			this.heightController.selectedIndex = value ? 0 : 3;
		}
	}

	protected set tabBgType(tabBgType: TabBgType) {
		if (this.heightController) {
			this.heightController.selectedIndex = tabBgType;
		}
	}

	/**注册需要指引的标签按钮 */
	protected guideRegTab(regRargetName: string, regPanelType: PanelTabType): void {
		let tabButtonItem: TabButtonItem;
		let panelTypeType: PanelTabType;
		let targetName: string = null;
		if (this.tabBtnList) {
			for(let item of this.tabBtnList.list._children) {
				tabButtonItem = item as TabButtonItem;
				panelTypeType = tabButtonItem.getData();
				if (panelTypeType == regPanelType) {
					GuideTargetManager.reg(regRargetName, tabButtonItem);
					break;
				}
			}
		}
	}

	public hide(): void {
		if (this.curType != -1) {
			if (this.tabViews[this.curType]) {
				this.tabViews[this.curType].hide();
			}
			let index: number = this.tabTypes.indexOf(this.curType);
			let btn: ListRenderer = this.tabBtnList.list.getChildAt(index) as ListRenderer;
			btn["btnSelected"] = false;
			this.curType = -1;
		}
		super.hide();
	}

	private onScroll(): void {
		if (!this.leftBtn || !this.rightBtn) {
			return;
		}
		if (this.visibleBtnCount <= 5) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = false;
			return;
		}
		let percX: number = this.tabBtnList.list.scrollPane.percX;
		if (percX == 0) {
			this.leftBtn.visible = false;
			this.rightBtn.visible = true;
		}
		else if (percX == 1) {
			this.leftBtn.visible = true;
			this.rightBtn.visible = false;
		}
		else {
			this.leftBtn.visible = true;
			this.rightBtn.visible = true;
		}
	}

	private clickArrowBtn(e: egret.TouchEvent): void {
		let isLeft: boolean = e.target && e.target.name == "btn_left";
		let idx: number = this.tabBtnList.list.getFirstChildInView();
		if (isLeft) {
			idx -= 5;
			if (idx < 0) {
				idx = 0;
			}
		} else {
			idx += 5;
			if (idx > this._tabTypes.length - 1) {
				idx = this._tabTypes.length - 1;
			}
		}
		this.tabBtnList.scrollToView(idx, true, true);
		App.TimerManager.doDelay(800, this.onScrollEnd, this);
	}

	private onScrollEnd(): void {
		if (!this.leftBtn || !this.rightBtn) {
			return;
		}
		let leftTip: boolean = false;
		let rightTip: boolean = false;
		let firstIdx: number = this.tabBtnList.list.getFirstChildInView();
		let item: TabButtonItem;
		for (let i = 0; i < this.tabBtnList.data.length; i++) {
			if (!this.tabBtnList.isChildInView(i)) {
				item = this.tabBtnList.list.getChildAt(this.tabBtnList.list.itemIndexToChildIndex(i)) as TabButtonItem;
				if (item && item.getChild(CommonUtils.redPointName) != null) {
					if (i <= firstIdx) {
						leftTip = true;
					}
					else {
						rightTip = true;
					}
				}
			}
		}
		CommonUtils.setBtnTips(this.leftBtn.asButton, leftTip);
		CommonUtils.setBtnTips(this.rightBtn.asButton, rightTip);
	}

	/**
	 * 可见按钮数量
	 */
	private get visibleBtnCount(): number {
		let count: number = 0;
		for (let obj of this.tabBtnList.list._children) {
			if (obj.visible) {
				count += 1;
			}
		}
		return count;
	}
}