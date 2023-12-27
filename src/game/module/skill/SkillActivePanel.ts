/**
 * 主动技能
 */
class SkillActivePanel extends BaseTabPanel {
	private skillList: List;
	private skillMenuList: List;
	/**
	 * 是否替换技能
	 */
	private isReplace: boolean = false;

	public initOptUI(): void {
		this.skillList = new List(this.getGObject("list_active").asList);
		this.skillMenuList = new List(this.getGObject("list_skill").asList);
		this.skillList.list.addEventListener(fairygui.ItemEvent.CLICK, this.clickSkill, this);
		this.skillMenuList.list.addEventListener(fairygui.ItemEvent.CLICK, this.clickMemuSkill, this);
		let askBtn:fairygui.GButton = this.getGObject("btn_ask").asButton;
		askBtn.addClickListener(() => {
			ToolTipManager.showInfoTip("选中技能后，选中技能槽任一解锁孔位可替换技能", askBtn)
		}, this);
	}

	public updateAll(): void {
		let skills: Array<any> = CacheManager.skill.getActiveSkills(0);
		let skillDatas: Array<SkillData> = [];
		let menuSkillDatas: Array<SkillData> = [];
		for (let skill of skills) {
			let skillData: SkillData = new SkillData(skill.skillId);
			skillDatas.push(skillData)
			if (!skillData.isNormalSkill()) {
				let sysSetSkillPosType = CacheManager.skill.getMenuSkillPos(skill.skillId);
				if(sysSetSkillPosType != -1){
					skillData.posType = sysSetSkillPosType;
				}
				menuSkillDatas.push(skillData);
			}
		}
		menuSkillDatas.sort((a: any, b: any) => { return a.posType - b.posType });
		this.skillList.data = skillDatas;
		this.skillMenuList.data = menuSkillDatas;
		this.skillList.scrollToView(0);
		this.skillMenuList.scrollToView(0);
	}

	private clickSkill(e: fairygui.ItemEvent): void {
		let skillListItem: SkillListItem = <SkillListItem>e.itemObject;
		let skillData: SkillData = skillListItem.skillData;
		if (skillData.isNormalSkill()) {
			this.lockMenuList(true);
			this.skillMenuList.list.selectedIndex = -1;
			this.isReplace = false;
		} else {
			this.lockMenuList(false);
			if (skillListItem.isOpen) {
				this.selectMenuItem(skillData);
				this.isReplace = true;
			} else {
				this.skillMenuList.list.selectedIndex = -1;
				this.isReplace = false;
			}
		}
	}

	private clickMemuSkill(e: fairygui.ItemEvent): void {
		let clickMenuItem: SkillListMenuItem = <SkillListMenuItem>e.itemObject;
		let clickSkillData: SkillData = clickMenuItem.skillData;

		//处理替换技能
		if (this.isReplace) {
			if (clickMenuItem.isOpen) {
				if (clickSkillData == null) {
					clickMenuItem.setData(this.skillList.selectedData);
				} else {
					//交换2个位置的技能
					let existMenuItem: SkillListMenuItem = this.getMenuItem(this.skillList.selectedData);
					existMenuItem.setData(clickSkillData);
					clickMenuItem.setData(this.skillList.selectedData);
				}
				this.isReplace = false;
				let skillPosDict:any = this.getMenuSkillPosDict();
				CacheManager.sysSet.setValue(SysSetCache.KeyMenuSkillPosDict, skillPosDict);
				EventManager.dispatch(LocalEventEnum.SKillPosUpdated);
			}
		} else {
			if (clickSkillData != null) {
				this.selectListItem(clickMenuItem.skillData);
			}
		}
	}

	/**
	 * 选中菜单技能
	 */
	private selectMenuItem(skillData: SkillData): void {
		for (let i: number = 0; i < this.skillMenuList.list.numChildren; i++) {
			let skillListMenuItem: SkillListMenuItem = <SkillListMenuItem>this.skillMenuList.list.getChildAt(i);
			let menuSkillData: SkillData = skillListMenuItem.skillData;
			if (menuSkillData != null && skillData.skillId == menuSkillData.skillId) {
				skillListMenuItem.selected = true;
			} else {
				skillListMenuItem.selected = false;
			}
		}
	}

	private getMenuItem(skillData: SkillData): SkillListMenuItem {
		for (let i: number = 0; i < this.skillMenuList.list.numChildren; i++) {
			let skillListMenuItem: SkillListMenuItem = <SkillListMenuItem>this.skillMenuList.list.getChildAt(i);
			let menuSkillData: SkillData = skillListMenuItem.skillData;
			if (menuSkillData != null && menuSkillData.skillId == skillData.skillId) {
				return skillListMenuItem;
			}
		}
		return null;
	}

	/**
	 * 选中技能列表项
	 */
	private selectListItem(skillData: SkillData): void {
		for (let i: number = 0; i < this.skillList.list.numChildren; i++) {
			let skillListItem: SkillListItem = <SkillListItem>this.skillList.list.getChildAt(i);
			let listSkillData: SkillData = skillListItem.skillData;
			if (listSkillData != null && skillData.skillId == listSkillData.skillId) {
				skillListItem.selected = true;
			} else {
				skillListItem.selected = false;
			}
		}
	}

	/**
	 * 锁住技能菜单栏
	 */
	private lockMenuList(isLock: boolean): void {
		for (let i: number = 0; i < this.skillMenuList.list.numChildren; i++) {
			let skillListMenuItem: SkillListMenuItem = <SkillListMenuItem>this.skillMenuList.list.getChildAt(i);
			skillListMenuItem.isLock = isLock;
		}
	}

	/**
	 * 获取菜单技能位置
	 */
	private getMenuSkillPosDict(): any {
		let posDict: any = {};
		for (let i: number = 0; i < this.skillMenuList.list.numChildren; i++) {
			let skillListMenuItem: SkillListMenuItem = <SkillListMenuItem>this.skillMenuList.list.getChildAt(i);
			if (skillListMenuItem.isOpen) {
				posDict[skillListMenuItem.skillData.skillId] = i + 2;//主动技能位置从2开始
			}
		}
		return posDict;
	}
}