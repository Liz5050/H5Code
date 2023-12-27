class PetSuitDetailView extends BaseWindow {
	private suitList: List;
	private tipCom: fairygui.GComponent;

	private petType: Array<number>;
	// private imgIndex: number;
	// private skillId: number = 140001;
	// private skillCfg: any;
	// private skillNextCfg: any;
	// /**是否为天赋技能 */
	// private isTalent: boolean = true;
	// private isOpen: boolean;
	// private tipY: number;

	public constructor() {
		super(PackNameEnum.Pet, "PetSuitDetailView");
	}

	public initOptUI(): void {
		this.suitList = new List(this.getGObject("list_suitDetail").asList);
		this.tipCom = this.getGObject("com_tip").asCom;
		this.petType = CacheManager.pet.petEquipType;
	}

	public updateAll() {
		let equipInfo: any = CacheManager.pet.getEquips();
		let levels: Array<number> = [];
		let equipMinLevel: number = -1;
		let activedMinNum: number = 0;
		let suitCfg: any;
		let suitNextCfg: any;
		let suitData: Array<any> = [];
		for(let type of this.petType){
			let equipLevel: number = 0;
			if(equipInfo[type]){
				let equipData: ItemData = new ItemData(equipInfo[type]);
				equipLevel = equipData.getItemLevel();
			}
			if(equipMinLevel > equipLevel || equipMinLevel == -1){
				equipMinLevel = equipLevel;
			}
			levels.push(equipLevel);
		}
		if(equipMinLevel > 0){
			suitCfg = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeShapeEquip},${EShape.EShapePet},${equipMinLevel},4`);
			suitNextCfg = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeShapeEquip},${EShape.EShapePet},${equipMinLevel+1},4`);
			suitData.push({"isActived": true, "cfg": suitCfg});
			if(suitNextCfg){
				activedMinNum = 0;
				for(let level of levels){
					if(level >= equipMinLevel+1){
						activedMinNum++;
					}
				}
				suitData.push({"isActived": false, "cfg": suitNextCfg, "activeNum": activedMinNum});
			}
		}else{
			suitCfg = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeShapeEquip},${EShape.EShapePet},1,4`);
			activedMinNum = 0;
			for(let level of levels){
				if(level >= 1){
					activedMinNum++;
				}
			}
			suitData.push({"isActived": false, "cfg": suitCfg, "activeNum": activedMinNum});
		}
		this.suitList.data = suitData;
		App.TimerManager.doDelay(10, ()=>{
			this.suitList.list.resizeToFit();
			this.tipCom.y = this.suitList.list.height;
		}, this);
	}
}