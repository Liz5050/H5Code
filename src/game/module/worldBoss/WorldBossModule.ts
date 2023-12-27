class WorldBossModule extends BaseModule {
	private _c1:fairygui.Controller;
	private panelCtrl:TabPanelCtrl;
	public constructor() {
		super(ModuleEnum.WorldBoss,PackNameEnum.WorldBoss);
	}

	public initOptUI():void{
		this._c1 = this.getController("c1");
		this._c1.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
		this.panelCtrl = new TabPanelCtrl(this._c1,[WorldBossPanel,HomeBossPanel],[
			this.getGObject("panel_world").asCom,
			this.getGObject("panel_home").asCom
		]);

	}
	public updateAll():void{
		this._c1.selectedIndex = 0;
		this.panelCtrl.curPanel.updateAll();
	}
	public get curPanel():BossBasePanel{
		return <BossBasePanel>this.panelCtrl.curPanel;
	}

	private onTabChanged(e:any):void{
		if(this._c1.selectedIndex>1){
			Tip.showTip("功能未开放");
			this._c1.selectedIndex = 0;
		}		
	}

	public hide(param: any = null, callBack: CallBack = null):void{
		super.hide(param,callBack);
		this.curPanel.destroy();
	}

}