class TalentCultivateView extends BaseTabView {
	private bgLoader: GLoader;
	private controller: fairygui.Controller;
	private talentTaskPanel: TalentTaskPanel;
	private talentCultivatePanel: TalentCultivatePanel;
	private careerList: List;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.bgLoader = this.getChild("loader_bg") as GLoader;
		this.controller = this.getController("c1");
		this.talentTaskPanel = this.getGObject("TalentTaskPanel") as TalentTaskPanel;
		this.talentCultivatePanel = this.getGObject("TalentCultivatePanel") as TalentCultivatePanel;
		this.careerList = new List(this.getGObject("list_career").asList);
		this.careerList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.updateCareer();
	}

	public updateAll(): void {
		this.careerList.selectedIndex = this.getDefSelectedIndex();
		this.updateSelected();
	}

	public onTaskPlayerTaskUpdated(): void {
	    if(this.controller.selectedIndex == 0) {
		    this.talentTaskPanel.updateTask();
        }
		this.updateCareerTips();
	}

	public onUpdateMoney(): void {
		this.talentCultivatePanel.updateExp();
		this.updateCareerTips();
	}

	public onTalentUpdated(): void {
		this.updateSelected();
	}

	public onPropUpdate(): void {
		this.talentCultivatePanel.updateEquips();
		this.updateCareerTips();
	}

	private onClickItem(): void {
		this.updateSelected();
	}

	private updateCareer(): void {
		this.careerList.data = CareerUtil.CareerAll;
	}

	private updateSelected(): void {
		let careerBtn: TalentCareerBtn = this.careerList.list.getChildAt(this.careerList.selectedIndex) as TalentCareerBtn;
		let career: number = careerBtn.getCareer();
		let roleIndex: number = CacheManager.role.getRoleIndex(career);
		let culInfo: any = CacheManager.talentCultivate.getInfoByIndex(roleIndex);
		if (culInfo != null && !CacheManager.talentCultivate.isHasTask(roleIndex)) {
			this.controller.selectedIndex = 1;
			this.talentCultivatePanel.updateAll({ "career": career });
		} else {
			this.controller.selectedIndex = 0;
			this.talentTaskPanel.updateAll({ "career": career });
		}
		this.bgLoader.load(URLManager.getModuleImgUrl("TalentCultivate/bg" + career + ".jpg", PackNameEnum.QiongCang));
		this.updateCareerTips();
	}

	private updateCareerTips(): void{
		for(let i = 0; i < this.careerList.list.numItems; i++){
			let careerBtn: TalentCareerBtn = this.careerList.list.getChildAt(i) as TalentCareerBtn;
			let career: number = careerBtn.getCareer();
			let roleIndex: number = CacheManager.role.getRoleIndex(career);
			CommonUtils.setBtnTips(careerBtn, CacheManager.talentCultivate.checkTalentTipByIndex(roleIndex));
		}
	}

	private getDefSelectedIndex(): number {
		let task: TaskBase;
		let roleIndex: number;
		let hasTaskIndex: number = -1;
		for (let i = 0; i < CareerUtil.CareerAll.length; i++) {
			roleIndex = CacheManager.role.getRoleIndex(CareerUtil.CareerAll[i]);
			task = CacheManager.task.getTalentPlayerTask(roleIndex);
			if (CacheManager.talentCultivate.getInfoByIndex(roleIndex) != null && !CacheManager.talentCultivate.isHasTask(roleIndex)){
				return i;
			}else if(CacheManager.talentCultivate.isHasTask(roleIndex)){
				if (task && hasTaskIndex == -1) {
					hasTaskIndex = i;
				}
			}
		}
		if(hasTaskIndex != -1){
			return hasTaskIndex;
		}
		return 0;
	}
}