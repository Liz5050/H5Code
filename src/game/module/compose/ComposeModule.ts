/**
 * 合成模块
 */

class ComposeModule extends BaseModule{
	private controller: fairygui.Controller;
	private composeItemPanel: ComposeItemPanel;
	private composeStonePanel: ComposeStonePanel;
	private composeSuitPanel: ComposeSuitPanel;
	private composeEquipPanel: ComposeEquipPanel;
	private composeEquipBtn: fairygui.GButton;

	public constructor() {
		super(ModuleEnum.Compose, PackNameEnum.Compose);
	}

	public initOptUI(): void{
		this.controller = this.getController("c1");
		this.composeItemPanel = new ComposeItemPanel(this.getGObject("panel_prop").asCom, this.controller, 0);
		this.composeStonePanel = new ComposeStonePanel(this.getGObject("panel_stone").asCom, this.controller, 1);
		this.composeSuitPanel = new ComposeSuitPanel(this.getGObject("panel_suit").asCom, this.controller, 2);
		this.composeEquipPanel = new ComposeEquipPanel(this.getGObject("panel_equip").asCom, this.controller, 3);
		this.composeEquipBtn = this.getGObject("btn_equip").asButton;
	}

	public updateAll(): void{
		this.controller.selectedIndex = 0;
		this.composeItemPanel.updateAll();
        this.composeEquipBtn.visible = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.SmeltEquip, false);
	}

	/**道具合成（用于一键合成） */
	public composeItem(data: any): void{
		let smeltCategory: number = ConfigManager.smeltPlan.getByPk(data.smeltPlanCode).smeltCategory;
		if(data.result){
			//防止提升过快，延迟1秒执行
			App.TimerManager.doTimer(300, 1, ()=>{
				if(ControllerManager.compose.isSmelt){
					switch(smeltCategory){
						case 1:
							this.composeItemPanel.enableSmelt(data.result);
							break;
						case 2:
							this.composeStonePanel.enableSmelt(data.result);
							break;
						case 3:
							this.composeSuitPanel.enableSmelt(data.result);
							break;
					}
				}
			}, this);
		}else{
			switch(smeltCategory){
				case 1:
					this.composeItemPanel.enableSmelt(data.result);
					break;
				case 2:
					this.composeStonePanel.enableSmelt(data.result);
					break;
				case 3:
					this.composeSuitPanel.enableSmelt(data.result);
					break;
			}
		}
	}

	/**更新合成材料 */
	public updateMaterial(): void{
		switch(this.controller.selectedIndex){
			case 0: 
				this.composeItemPanel.updateMaterial();
				break;
			case 1: 
				this.composeStonePanel.updateMaterial();
				break;
			case 2: 
				this.composeSuitPanel.updateMaterial();
				break;
			case 3: 
				this.composeItemPanel.updateMaterial();
				break;
		}
	}

	/**更新用于合成装备（装备合成） */
	public selectedEquip(data: any): void{
		this.composeEquipPanel.updateSelectedEquip(data);
	}

	/**卸下用于合成装备（装备合成） */
	public unDressEquip(data: any): void{
		this.composeEquipPanel.unDressEquip(data);
	}

	/**更新装备合成 */
	public updateEquipCompose(): void{
		this.composeEquipPanel.onEquipChanged();
	}
}