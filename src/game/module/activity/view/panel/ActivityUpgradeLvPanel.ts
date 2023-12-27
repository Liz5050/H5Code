/**
 * 冲级豪礼
 */
class ActivityUpgradeLvPanel extends ActivityBaseTabPanel {
	private list_item:List;
	private txt_myValue:fairygui.GRichTextField;
	private rewardCfgs:any[];
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditionTypeLevelReward;
	}

	public initOptUI():void {
		super.initOptUI();
		this.list_item = new List(this.getGObject("list_item").asList);
		this.txt_myValue = this.getGObject("txt_myValue").asRichTextField;
	}

	public updateAll():void {
		super.updateAll();
		if(!this.rewardCfgs) {
			let dict: any = ConfigManager.levelReward.getDict();
			this.rewardCfgs = [];
			for(let key in dict){
				let data: any = dict[key];
				this.rewardCfgs.push(data);
			}
		}
		this.list_item.setVirtual(this.rewardCfgs);
		this.updateUpgradeLv(true);
	}

	public updateUpgradeLv(isUdateAll:boolean = false):void {
		let roleState:number = CacheManager.role.getRoleState();
		let level:number = CacheManager.role.getRoleLevel();
		let myValueStr:string;
		if(roleState > 0) {
			myValueStr = roleState + "转" + level + "级";
		}
		else {
			myValueStr = level + "级";
		}
		this.txt_myValue.text = "我的等级：" + "<font color=\"#fea700\">" + myValueStr + "</color>";

		this.rewardCfgs.sort(this.sortReward);
		if(!isUdateAll) this.list_item.list.refreshVirtualList();
		this.list_item.scrollToView(0);
	}

	private sortReward(value1:any,value2:any):number {
		let roleState:number = CacheManager.role.getRoleState();
		let level:number = CacheManager.role.getRoleLevel();
		let myValue:number = roleState * 10000 + level;
		let hadGetList:number[] = CacheManager.welfare.levelReward;
		if(!hadGetList[value1.level] && hadGetList[value2.level]) return -1;
		if(hadGetList[value1.level] && !hadGetList[value2.level]) return 1;
		let leftCount1:number = CacheManager.welfare.getRemainNum(value1);
		let leftCount2:number = CacheManager.welfare.getRemainNum(value2);
		let canGet1:boolean = myValue >= value1.level && leftCount1 != 0;
		let canGet2:boolean = myValue >= value2.level && leftCount2 != 0;
		if(canGet1 && !canGet2) return -1;
		if(!canGet1 && canGet2) return 1;
		return value1.level - value2.level;
	}
}