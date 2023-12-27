class WorldBossPanel extends BossBasePanel {
	
	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void {
		super.initOptUI();
		this.txt_number = this.getGObject("txt_number").asTextField;	
	}

	public updateAll(): void {
		super.updateAll();
		var bossDatas: Array<any>;
		if (!this.list_boss.data) {
			bossDatas = ConfigManager.mgGameBoss.getByCopyCode(CopyEnum.CopyWorldBoss);			
			//this.list_boss.data = bossDatas;
			this.list_boss.setVirtual(bossDatas);
		}else{
			bossDatas = this.list_boss.data;
		}
		this.selectBoss(bossDatas);		
	}
	

}