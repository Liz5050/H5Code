class HomeBossPanel extends BossBasePanel {
	protected list_floor:List;
	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super(view, controller, index);
	}
	public initOptUI(): void {
		super.initOptUI();
		this.list_floor = new List(this.getGObject("list_floor").asList);
		var data:Array<any> = CopyUtils.getBossHomeFloor();
		this.list_floor.data = data;
		this.list_floor.selectedIndex = -1;
		this.list_floor.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickFloor,this);
	}

	protected onClickFloor(e:fairygui.ItemEvent):void{
		var item:TabButtonTop = <TabButtonTop>e.itemObject;
		this.selectFloor(item);
	}

	protected selectFloor(item:TabButtonTop):void{
		var data:any = item.getData();
		var listPd:Array<any> = ConfigManager.mgGameBoss.getByCopyCode(data.copyCode);
		//this.list_boss.data = listPd;
		this.list_boss.setVirtual(listPd);
		this.list_boss.selectedIndex = 0;
		this.updateReward(this.list_boss.selectedData);
	}
	protected updateReward(data:any):void{
		super.updateReward(data);
		this.btn_solo.text = `V${data.freeVip}前往`;
	}
	public updateAll(): void {
		super.updateAll();
		this.list_floor.selectedIndex = 0;
		this.selectFloor(this.list_floor.selectedItem);
		var bossDatas: Array<any> = this.list_boss.data;		
		this.selectBoss(bossDatas);		
	}
}