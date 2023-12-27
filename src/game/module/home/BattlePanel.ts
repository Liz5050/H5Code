/**
 * 战斗操作面板
 */
class BattlePanel extends BaseContentView {
    private skillItems: any;//键为技能位置
    private normalSkill: SkillData;
    private autoFightBtn: fairygui.GButton;
    private testCdBtn: fairygui.GButton;
    private testGcBtn: fairygui.GButton;

    public constructor() {
        super(PackNameEnum.BattlePanel, "Main");
        this.isCenter = false;
        this.skillItems = {};
    }

    public initOptUI(): void {
        this.getGObject("btn_attack").addClickListener(this.onNormalAttack, this);

        for (let i = 2; i <= 7; i++) {//第一个主动技能位置从2开始，1为普攻
            let skillItem: MainSkillItem = <MainSkillItem>this.getGObject(`skillItem_${i - 1}`);
            this.skillItems[i] = skillItem;
            skillItem.addClickListener(this.fireSkill, this);
        }
        this.autoFightBtn = this.getGObject("btn_autoFight").asButton;
        this.autoFightBtn.addClickListener(this.clickAutoFight, this);
        this.testCdBtn = this.getGObject("btn_cd").asButton;
        this.testGcBtn = this.getGObject("btn_gc").asButton;
        this.testGcBtn.addClickListener(this.onTestGc, this);

        this.x = (fairygui.GRoot.inst.width - this.width) / 2;
        this.y = fairygui.GRoot.inst.height - this.height - 135;
        this.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Bottom_Bottom);
        this.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Center_Center);

        this.updateSkills();
    }

    public updateAll(): void {

    }

    protected addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.CoolSkill, this.onCoolSkill, this);
        this.addListen1(LocalEventEnum.LeaderRoleChange, this.updateSkills, this);
        this.addListen1(LocalEventEnum.TestUseSkill, this.fireSkill, this);
    }

    public updateSkills(): void {
        let skills: Array<SkillData> = CacheManager.skill.getBattleSkills(CacheManager.king.leaderIndex);
        if (!skills) return;
        for (let skillData of skills) {
            let skillItem: MainSkillItem = this.skillItems[skillData.posType];
            if (skillItem) {
                skillItem.skillData = skillData;
            } else if (skillData.skillId != SkillCache.SKILLID_XP) {
                this.normalSkill = skillData;
            }
        }
    }

    public autoFightSelected(selected: boolean) {
        this.autoFightBtn.selected = selected;
    }

    /** 点击普攻 */
    private onNormalAttack(): void {
        this.normalSkill && EventManager.dispatch(UIEventEnum.ClickMainSkillItem, this.normalSkill.skillId);
    }

    private fireSkill(e: any): void {
        let skillItem: MainSkillItem = e.target;
        let skillData: SkillData = skillItem ? skillItem.skillData : CacheManager.skill.getSkill(e);
        let skillId: number = skillData.skillId;
        if (this.testCdBtn.selected) {//无CD表现
            let king:MainPlayer = CacheManager.king.leaderEntity;
            if (king) {
                king.stopMove();
                king.playAttack(skillId, king.battleObj);
                let tP = RpgGameUtils.getAttackTargetPoint(king);
                SkillUtil.playSkill(skillId, king, king.battleObj, null, tP.x_SH, tP.y_SH);
            }
        } else if (skillData != null && !skillItem.isCooldown) {
            Tip.showTip("释放了" + skillData.skill.skillName + ",ID:" + skillId);
            //ControllerManager.rpgGame.mainPlayerAttack(skillData.skill.skillId);
            EventManager.dispatch(UIEventEnum.ClickMainSkillItem, skillId);
        }
    }

    private clickAutoFight(): void {
        if (this.autoFightBtn.selected) {
            EventManager.dispatch(LocalEventEnum.AutoStartFight);
        } else {
            EventManager.dispatch(LocalEventEnum.AutoStopFight);
        }
    }

    private onMountHandler(): void {
        // EventManager.dispatch(UIEventEnum.HomeSwitchMount);
    }

    private onTestGc(): void {
        ModelResLoader.RES_NO_GC_FLAG = this.testGcBtn.selected;
    }

    private onCoolSkill(skillId: number, cd: number): void {
        let skillItem: MainSkillItem;
        let skillData: SkillData;
        for (let i = 2; i <= 5; i++) {
            skillItem = this.skillItems[i];
            skillData = skillItem.skillData;
            if (skillData) {
                if (skillData.skillId == skillId)//cd
                    skillItem.beginCD(0, cd);
                else if (skillItem.cdGroup == skillItem.cdGroup && skillItem.isCooldown == false)//组cd
                    skillItem.beginCD(1);
            }
        }
    }
}