/**
 * 装备强化
 * @author shiyong
 */
class RefineModule extends BaseModule {
	protected controller:fairygui.Controller;
	private controllerSelect:number;
	private strengthenPanel:StrengthenPanel;
	private stonePanel: StonePanel;

	private stoneBtn: fairygui.GButton;
	private strengthenBtn: fairygui.GButton;

	public constructor() {
		super(ModuleEnum.Refine);
	}

	/**
	 * 强化一次
	 */
	public strengthenOne():void{
		this.strengthenPanel.clickOne();
	}

	/**
	 * 根据强化结果更新
	 */
	public updateByStrengthenReuslt(data: any): void {
		this.strengthenPanel.updateByStrengthenReuslt(data);
		this.updateBtnTip();
	}

	/**
	 * 启用一键强化
	 */
	public enableOneKey(enable: boolean): void {
		this.strengthenPanel.enableOneKey(enable);
	}

	public initOptUI(): void {
		this.controller = this.getController("c1");
		this.controllerSelect = this.controller.selectedIndex;
		this.controller.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
		this.strengthenPanel = new StrengthenPanel(this.getGObject("panel_strengthen").asCom, this.controller, 0);
		this.stonePanel = new StonePanel(this.getGObject("panel_jewel").asCom, this.controller, 1);
		
		this.stoneBtn = this.getGObject("btn_jewel").asButton;
		this.strengthenBtn = this.getGObject("btn_forging").asButton;
	}

	public updateAll(): void {
		this.controller.selectedIndex = 0;
		this.strengthenPanel.updateAll();
		this.updateBtnTip();
	}

	public updateBtnTip(): void{
		CommonUtils.setBtnTips(this.stoneBtn, CacheManager.refine.checkInlayTip());
		if(CacheManager.refine.isCanRefreshFree() || CacheManager.refine.checkStrengthen()){
			CommonUtils.setBtnTips(this.strengthenBtn, true);
		}else{
			CommonUtils.setBtnTips(this.strengthenBtn, false);
		}
	}

	public updataStonePanel(itemData: ItemData): void{
		this.stonePanel.updateItem(itemData);
	}

	public updataStoneTip(): void{
		this.updateBtnTip();
		if(this.stonePanel){
			this.stonePanel.updateEquipTip();
		}
	}

	/**
     * tab标签改变
     */
	protected onTabChanged(e: any): void {
		let isOpen: boolean = true;
		switch(this.controller.selectedIndex){
			case 1:
				isOpen = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.JewelEmbel);
				break;
			case 2:
				isOpen = false;
				Tip.showTip("系统尚未开放");
				break;
		}
		if(isOpen){
			this.controllerSelect = this.controller.selectedIndex;
        }
        else{
			this.controller.selectedIndex = this.controllerSelect;
        }
	}

	/**更新洗炼 */
	public updateRefresh(itemData: ItemData): void{
		this.strengthenPanel.updateRefreshItem(itemData);
	}

	/**更新洗炼页签红点推送 */
	public updateRefreshBtnTip(): void{
		this.updateBtnTip();
		if(this.strengthenPanel){
			this.strengthenPanel.updateRefreshBtnTip();
		}
	}

	/**更新洗炼石 */
	public updateRefreshStone(): void{
		if(this.strengthenPanel){
			this.strengthenPanel.updateRefreshStone();
		}
	}
}