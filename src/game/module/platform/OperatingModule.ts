class OperatingModule extends BaseTabModule  {

	private _selectType:number = -1;

	public constructor() {
		super(ModuleEnum.Operating,PackNameEnum.Operating);
		this.indexTitle = false;
	}
	public initOptUI():void{
		super.initOptUI();

	}

	protected initTabInfo(): void {
		this.className = {
			[PanelTabType.Share]:['OperatingBgPanel',OperatingSharePanel],
			[PanelTabType.MiniClient]:['OperatingBgPanel',OperatingMiniClientPanel],
			[PanelTabType.Focus]:['OperatingBgPanel',OperatingFocusPanel],
			[PanelTabType.SaveDesktop]:['OperatingBgPanel',OperatingMiniClientPanel],
			//[PanelTabType.Certification]:['OperatingSMPanel',OperatingSMPanel],
		};
	}
	public updateAll(data?:any):void{		
		super.updateAll(data);
		//this.setBtnTips(PanelTabType.Certification,CacheManager.certification.checkShowSMIcon());		
		this.tabBtnList.data = this._tabTypes;
	}

	public updateShare():void{
		if(this.isTypePanel(PanelTabType.Share)){
			this.curPanel.updateAll();
		}
	}
	
	/**
	 * 检测页签开启状态
	 */
	
	protected checkTabVisible(type: PanelTabType): void {		
		let index: number = this.tabTypes.indexOf(type);
		if (index==-1) return;
		let isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[type], false);		
		let openCfg: any = ConfigManager.mgOpen.getByOpenKey(PanelTabType[type]);
		let btn: fairygui.GButton = this.tabBtnList.list.getChildAt(index) as fairygui.GButton;
		let isNeed:boolean = CacheManager.platform.isNeedIco(type);
		btn.visible = isNeed && ( isOpen || openCfg.showStyleUnopen == UnOpenShowEnum.Preview || openCfg.showStyleUnopen == UnOpenShowEnum.Show_Tips || this.showCondition(type) );
		if(btn.visible && this._selectType==-1){
			this._selectType = type;			
		}
		if (this.tabViews[type]) this.tabViews[type].setOpen(isOpen);

	}
	public hide():void
	{
		super.hide();
		this._selectType = -1;	
	}

	public onShow(data):void{
		super.onShow(data);
		this.setIndex(this._selectType);
	}

	protected getTabListDefaultItem(): string {
		return URLManager.getPackResUrl(PackNameEnum.Operating, "OperatingBtnItem");
	}

}