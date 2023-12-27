/**诛仙塔 100*/
class TowerCopyPanel extends BaseCopyPanel {
	private listReward:List;
	private baseItem:TowerOpenItem;
	private txt_floor:fairygui.GTextField;
	private runeCom:fairygui.GComponent;
	public constructor(copyInf) {
		super(copyInf,"TowerCopyPanel");
	}
	public initUI():void{
		super.initUI();
		this.listReward = new List(this.getGObject("list_reward").asList);
		let com:fairygui.GComponent = this.getGObject("com_rune").asCom;
		this.runeCom = com; 
		this.baseItem = <TowerOpenItem>com.getChild("baseItem");
		this.txt_floor = com.getChild("txt_floor").asTextField;
	}
	public updateAll(): void {	
		super.updateAll();
		if(this.isShow){
			this.runeCom.visible = true;
			let floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
			let realFloor:number = floor; 
			//floor = Math.max(floor,1);
			let openInf:any =  ConfigManager.mgRuneCopy.getOpenTypeInf(floor+1);			
			if(openInf){
				this.baseItem.visible = true;
				this.txt_floor.visible =  true;
				let openItemData:any;
				if(openInf.openHole){
					openItemData={ type: openInf.openHole };
				}else if(openInf.openTypeCode){
					var openTypeCodes: string[] = (<string>openInf.openTypeCode).split("#");					
					for (var i: number = 0; i < openTypeCodes.length - 1; i++) {
						if(!openTypeCodes[i]){
							continue;
						}
						openItemData = { "item": new ItemData(Number(openTypeCodes[i])) };
						break;
					}
				}				
				if(openItemData){
					this.baseItem.setData(openItemData,0);
				}			
				this.txt_floor.text = App.StringUtils.substitude(LangCopyHall.L30,openInf.floor-realFloor);
			}else{
				this.baseItem.visible = false;
				this.txt_floor.visible =  false;
				this.runeCom.visible = false;
			}
			let rewardFloor:number = realFloor+1;
			rewardFloor = Math.min(rewardFloor,ConfigManager.mgRuneCopy.MAX_FLOOR);
			let towerInf:any = ConfigManager.mgRuneCopy.getByPk(rewardFloor);			
			var itemDatas: ItemData[] = [];
			if(towerInf.rewardShow){
				itemDatas = RewardUtil.getStandeRewards(towerInf.rewardShow);
			}
			
			this.listReward.list.visible = true;
			this.listReward.setVirtual(itemDatas);			
		}	
	}

	public setSceneUI():void{
		this.runeCom.visible = false;
		this.listReward.list.visible = false;
	}

}