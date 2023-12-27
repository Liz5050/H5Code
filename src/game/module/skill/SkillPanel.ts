class SkillPanel extends BaseTabView {
    private skillList: List;
    private upgradeAllBtn: fairygui.GButton;
    private _roleIndex: number;
    private lastClickItem:SkillListItem;

    private enough: boolean;
    private isLevelMatch: boolean;
    private isMaxLevel: boolean;

    public constructor() {
		super();
	}

    protected initOptUI():void {
        this.skillList = new List(this.getChild("list_active").asList);
        this.skillList.list.addEventListener(fairygui.ItemEvent.CLICK, this.clickSkill, this);
        this.upgradeAllBtn = this.getChild("btn_allLevelUp").asButton;
        this.upgradeAllBtn.addClickListener(this.onClick, this);

        GuideTargetManager.reg(GuideTargetName.SkillPanelUpgradeAllBtn, this.upgradeAllBtn);
    }

    public updateAll():void {

    }

    private updateList():void {
        let skillList:any = CacheManager.skill.getActiveSkills(this.roleIndex);
        let dataList:any[] = [];
        for (let skill of skillList) {
            dataList.push({index:this.roleIndex, data:skill});
        }
        this.skillList.data = dataList;
        this.updateListCostAndStatus();
    }

    public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
        if (this.lastClickItem) this.lastClickItem.setSelect(false);
		this.updateList();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

    public updateUpdateSkillOne(skillData: SkillData):void {
        let list:fairygui.GList = this.skillList.list;
        let idx:number = 0;
        let item:SkillListItem;
        let canUp:boolean;
        while (idx < list.numChildren) {
            item = list.getChildAt(idx) as SkillListItem;
            if (item.skillId == skillData.skillId) {
                if (item.skillLevel < skillData.level) {
                    item.upgradeSucc(item.skillLevel, skillData.level);
                }
                item.setData({index:skillData.roleIndex, data:skillData.skill});
                item.updateCostAndStatus(CacheManager.role.getMoney(EPriceUnit.EPriceUnitCoinBind)
                    , CacheManager.role.getRoleLevel()
                    , CacheManager.role.getRoleState()
                );
            }
            if (!canUp) canUp = CacheManager.skill.checkTips(skillData.roleIndex);
            idx++;
        }
        App.DisplayUtils.addBtnEffect(this.upgradeAllBtn, canUp);
    }

    public updateListCostAndStatus():void {
        let list:fairygui.GList = this.skillList.list;
        let idx:number = 0;
        let item:SkillListItem;
        let myCoin:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitCoinBind);
        let myLv:number = CacheManager.role.getRoleLevel();
        let myRoleState:number = CacheManager.role.getRoleState();
        let canUp:boolean;
        while (idx < list.numChildren) {
            item = list.getChildAt(idx) as SkillListItem;
            item.updateCostAndStatus(myCoin, myLv, myRoleState);
            if (!canUp) canUp = CacheManager.skill.checkTips(this.roleIndex);
            idx++;
        }
        App.DisplayUtils.addBtnEffect(this.upgradeAllBtn, canUp);
    }

    private clickSkill(e: fairygui.ItemEvent): void {
        if (this.lastClickItem) this.lastClickItem.setSelect(false);
        let skillListItem: SkillListItem = <SkillListItem>e.itemObject;
        skillListItem.setSelect(true);
        this.lastClickItem = skillListItem;
        // let skillData: SkillData = skillListItem.skillData;
    }

    private onClick(): void {
        this.checkUpgrade();
        if(!this.isMaxLevel){
            if(this.isLevelMatch){
                if(this.enough){
                    App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
                    EventManager.dispatch(LocalEventEnum.SkillUpgradeAll, this.roleIndex);
                }else{
                    Tip.showOptTip("铜钱不足");
                }
            }else{
                Tip.showOptTip("等级不足");
            }
        }else{
            Tip.showOptTip("已满级");
        }
        // if (this.checkUpgrade()) {
        //     App.SoundManager.playEffect(SoundName.Effect_SkillUpgrade);
        //     EventManager.dispatch(LocalEventEnum.SkillUpgradeAll, this.roleIndex);
        // }
    }

    private checkUpgrade() {
        let list:fairygui.GList = this.skillList.list;
        let idx:number = 0;
        let item:SkillListItem;
        this.enough = false;
        this.isLevelMatch = false;
        this.isMaxLevel = true;
        while (idx < list.numChildren) {
            item = list.getChildAt(idx) as SkillListItem;
            if (item.enough) {
                this.enough = true;
            }
            if (item.isLevelMatch) {
                this.isLevelMatch = true;
            }
            if (!item.isMaxLevel) {
                this.isMaxLevel = false;
            }
            // if (item.canUpgrade) {
            //     return true;
            // }
            idx++;
        }
        // return false;
    }

}