/**
 * 模块基类
 */
abstract class BaseModule extends BaseGUIView {
	protected moduleId: ModuleEnum;
	protected closeObj: fairygui.GObject;
	protected moduleTopPanel: ModuleTopPanel;
	protected mainController: fairygui.Controller;
	protected descBtn: fairygui.GObject;

	public constructor(moduleId: ModuleEnum, packageName: string = null, componentName: string = "Main", $parent: fairygui.GComponent = LayerManager.UI_Main) {
		super($parent);
		this.moduleId = moduleId;
		if (packageName == null) {
			packageName = ModuleEnum[moduleId];
		}
		this.packageName = packageName;
		this.viewName = componentName;
		this.isDestroyOnHide = true;
	}

	public show(param: any = null, callBack: CallBack = null): void {
		this.costDict["show"] = Date.now();
		super.show(param, callBack);
	}

	public initUI(): void {
		// this.costDict["init"] = Date.now();
		super.initUI();
		//设置为满屏
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}

		this.closeObj = this.getGObject("btn_close", false);

		this.moduleTopPanel = null;
		if (this.getGObject("ModuleTopPanel", false) != null) {
			this.moduleTopPanel = <ModuleTopPanel>this.getGObject("ModuleTopPanel", false);
			this.closeObj = this.moduleTopPanel.getChild("btn_close");
			this.descBtn = this.moduleTopPanel.getChild("btn_desc");
			if(this.descBtn != null) {
				this.descBtn.addClickListener(this.clickDesc, this);
			}
		}

		if (this.closeObj != null) {
			this.closeObj.addClickListener(() => {
				EventManager.dispatch(UIEventEnum.ModuleClose, this.moduleId);
			}, this);
		}

		// this.mainController = this.getController("c1");
		// if (this.mainController != null) {
		// 	this.title = ModuleEnum[this.moduleId] + "_" + this.mainController.selectedIndex;
		// 	this.mainController.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onMainTabChanged, this);
		// }
		// else {
		// 	this.title = ModuleEnum[this.moduleId];
		// }
		this.changeTitle();
		this.initOptUI();
		// Log.trace(Log.CLEANUP, `${this.packageName},init:${Date.now() - this.costDict["init"]}ms`);
	}

	protected changeTitle():void {
		this.title = ModuleEnum[this.moduleId] + "_0";
	}

	/**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.moneyCoinBindUpdate, this.updateMoney, this);
		this.addListen1(NetEventEnum.moneyGoldUpdate, this.updateMoney, this);
		this.addListen1(NetEventEnum.moneyGoldBindUpdate, this.updateMoney, this);
    }

	/**
	 * 获取当前标签页
	 */
	public getMainTabIndex(name: string = "c1"): number {
		let c: fairygui.Controller;
		if (name != "c1") {
			c = this.getController(name);
		} else {
			c = this.mainController;
		}
		if (c != null) {
			return c.selectedIndex;
		} else {
			return -1;
		}
	}
	/**
	 * 点击元宝 是否可以打开充值界面;请在子类的 initOptUI 方法里设置
	 */
	protected set isOpenRecharge(value:boolean){
        if(this.moduleTopPanel){
			this.moduleTopPanel.isOpenRecharge = value;
		}
    }
	/**
	 * 选中标签页
	 */
	protected selectTab(index: number, c: fairygui.Controller = null): void {
		let optC: fairygui.Controller;
		if (c == null) {
			optC = this.mainController;
		} else {
			optC = c;
		}
		if (optC.selectedIndex == 0 && index == 0) {
			optC.selectedIndex = -1;
			optC.selectedIndex = 0;
		} else {
			optC.selectedIndex = index;
		}
	}

	public onShow(data?: any): void {
		super.onShow(data);
		this.updateAll(data);
		this.updateMoney();
	}

	/**更新金钱 */
	public updateMoney(): void {
		if (this.moduleTopPanel != null) {
			this.moduleTopPanel.updateMoney();
		}
	}

	/**
	 * 设置标题
	 */
	public set title(title: string) {
		if (this.moduleTopPanel != null) {
			//this.moduleTopPanel.icon = `ui://Common/${title}`;
			this.moduleTopPanel.icon = URLManager.getTitleUrl(title);
		}
	}

	/**
	 * 初始化可操作UI组件。与UI编辑器中命名的组件对应。
	 */
	abstract initOptUI(): void;

	/**
	 * 界面打开时自动调用。根据缓存更新所有
	 */
	public updateAll(data: any = null): void {

	}
	
	public hide(param: any = null, callBack: CallBack = null):void {
		super.hide(param,callBack);
		EventManager.dispatch(UIEventEnum.ModuleClose,this.moduleId);
	}

	// protected onMainTabChanged(e: any): void {
	// 	this.title = ModuleEnum[this.moduleId] + "_" + this.mainController.selectedIndex;
	// }

	protected clickDesc(): void {
		
	}

	public onHide(data: any = null): void {
		super.onHide(data);
		// this.destroyView();
	}

}