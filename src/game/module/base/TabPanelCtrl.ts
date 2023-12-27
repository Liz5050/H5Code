class TabPanelCtrl {
	private _curPanel:BaseTabPanel;
	private _ctrl:fairygui.Controller;
	private _panelCls:any[];
	private _viewComs:fairygui.GComponent[];
	private _panelDict:any;

	/**
	 * 管理tabPanel
	 * @param ctrl
	 * @param panelCls 继承BaseTabPanel的类数组,子类执行 super 的时候最好把BaseTabPanel的isAutoListener参数设置为false
	 * @param viewComs 对应的fairygui组件数组
	 */
	public constructor(ctrl:fairygui.Controller,panelCls:any[],viewComs:fairygui.GComponent[]) {
		this._ctrl = ctrl;		
		this._panelCls = panelCls;
		this._viewComs = viewComs;
		this._panelDict = {};
		this.init();
	}

	private init():void{	
		this._curPanel = this.getPanelByIndex(this._ctrl.selectedIndex);
		this._ctrl.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged,this);		
	}

	private onTabChanged(e:fairygui.StateChangeEvent=null):void{
		let panel:BaseTabPanel = this.getPanelByIndex(this._ctrl.selectedIndex);
		if(panel){ //防止未注册的报错
			if(this._curPanel){
				this._curPanel.destroy();
			}
			this._curPanel = panel;
			if(this._curPanel){
				this._curPanel.updateAll();
			}
		}
				
	}

	/**
	 * 获取当前的panel
	 */
	public get curPanel():BaseTabPanel{
		return this._curPanel;
	}
	/**根据下标获取实例;没有会自动创建 */
	public getPanelByIndex(index:number):BaseTabPanel{
		let panel:any = this._panelDict[index];
		if(index>-1 && !panel && index<this._panelCls.length){
			var cls:any = this._panelCls[index];
			if(cls){
				panel = new cls(this._viewComs[index],this._ctrl,index,false);
			}
			this._panelDict[index] = panel;
		}
		return panel;
	}
	/**
	 * 根据类获取panel实例
	 */
	public getPanelByCls(cls:any):BaseTabPanel{
		var idx:number = this._panelCls.indexOf(cls);
		return this.getPanelByIndex(idx);
	}
	/**
	 * 根据类判断当前是否是某个类实例
	 * @param cls
	 */
	public isCurPanel(cls:any):boolean{
		return this.curPanel instanceof cls; 
	}

	/**
	 * 销毁函数
	 */
	public destroy():void{
		this._ctrl.removeEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
		this._ctrl = null;
		App.ArrayUtils.emptyArr(this._panelCls);
		this._panelCls = null;
		App.ArrayUtils.emptyArr(this._viewComs);
		this._viewComs = null;
		this._panelDict = null;
		if(this._curPanel){
			this._curPanel.destroy();
			this._curPanel = null;
		}		
	}

	

}