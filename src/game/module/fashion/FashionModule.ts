class FashionModule extends BaseWindow {
	public clothesFashionPanel: ClothesFashionPanel;
	public weaponFashionPanel: WeaponFashionPanel;
	private modelContainer: fairygui.GComponent;
	private playerModel: PlayerModel;
	private btn_cloth:fairygui.GButton;
	private btn_weapon:fairygui.GButton;
	public controller: fairygui.Controller;
	public constructor(moduleId: ModuleEnum) {
		super(PackNameEnum.Fashion, "Main", moduleId);
	}

	public initOptUI(): void {
		this.btn_cloth = this.getGObject("btn_cloth").asButton;
		this.btn_weapon = this.getGObject("btn_weapon").asButton;
		this.controller = this.getController("c1");
		this.controller.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
		this.clothesFashionPanel = new ClothesFashionPanel(this.getGObject("panel_cloth").asCom, this.controller, 0);
		this.weaponFashionPanel = new WeaponFashionPanel(this.getGObject("panel_weapon").asCom, this.controller, 1);
		this.playerModel = new PlayerModel();
		this.playerModel.x = 310;
		this.playerModel.y = 365;
		this.clothesFashionPanel.addModel(this.playerModel);
	}

	public updateAll(): void {
		this.controller.selectedIndex = 0;
		this.clothesFashionPanel.updateAll();
		this.updateBtnTips();
	}

	public updateBtnTips():void{
		CommonUtils.setBtnTips(this.btn_cloth,CacheManager.clothesFashion.checkTips());
		CommonUtils.setBtnTips(this.btn_weapon,CacheManager.weaponFashion.checkTips());
	}

	private onTabChanged(e: any): void {
		if (this.controller.selectedIndex == 0) {
			this.clothesFashionPanel.addModel(this.playerModel);
		} else if (this.controller.selectedIndex == 1) {
			this.weaponFashionPanel.addModel(this.playerModel);
		}
	}
}