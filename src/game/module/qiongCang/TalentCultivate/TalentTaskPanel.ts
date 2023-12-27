class TalentTaskPanel extends fairygui.GComponent {
	// private bgLoader: GLoader;
	private nameLoader: GLoader;
	private taskTitleTxt: fairygui.GRichTextField;
	private taskTxt: fairygui.GRichTextField;
	private taskBtn: fairygui.GButton;
	private skillList: List;
	private oneKeyMc:UIMovieClip;

	private career: number;
	private roleIndex: number;
	private task: TaskBase;
	private process: Array<number>;
	private talentCfg: any;

	public constructor() {
		super();
	}


	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		// this.bgLoader = this.getChild("loader_bg") as GLoader;
		this.nameLoader = this.getChild("loader_name") as GLoader;
		this.taskTitleTxt = this.getChild("txt_taskTitle").asRichTextField;
		this.taskTxt = this.getChild("txt_task").asRichTextField;
		this.taskBtn = this.getChild("btn_task").asButton;
		this.skillList = new List(this.getChild("list_skill").asList);
		this.taskBtn.addClickListener(this.clickTaskBtn, this);
	}

	public updateAll(data: any): void {
		this.career = data.career;
		this.talentCfg = ConfigManager.talent.getByPk(this.career);
		this.roleIndex = CacheManager.role.getRoleIndex(this.career);
		this.nameLoader.load(URLManager.getModuleImgUrl("TalentCultivate/name_task_" + this.career + ".png", PackNameEnum.QiongCang));
		this.updateTask();
		this.updateSkill();
	}

	public updateTask(): void {
		this.task = CacheManager.task.getTalentPlayerTask(this.roleIndex);
		if (this.roleIndex != -1) {//已开启角色
			if (CacheManager.talentCultivate.isHasTask(this.roleIndex)) {//当前角色已领取了任务
				if (this.task == null) {//完成任务后立即更新，此时任务还没推送过来
					return;
				}
				let singleTaskProcess: TaskProcess = this.task.getProcess();
				this.process = this.task.extendJson;
				this.taskTitleTxt.text = `${ConfigManager.talent.getTaskDesc(this.career)} ${MoneyUtil.getResourceText(this.process[1],this.process[2],"(",")")}`;
				this.taskTxt.text = `${this.process[1]}、${this.task.traceDesc} ${MoneyUtil.getResourceText(singleTaskProcess.current,singleTaskProcess.total,"(",")")}`;
				if (this.task.isCompleted) {
					this.taskBtn.title = "完成任务";
					this.showBtnMc(true)
				} else {
					this.taskBtn.title = "前往任务";
					this.showBtnMc(false);
				}
			} else {
				this.updateOnNotTask();
			}
		} else {
			this.updateOnNotTask();
		}
	}

	private updateOnNotTask(): void {
		this.taskTitleTxt.text = this.talentCfg.taskDesc;
		this.taskTxt.text = '每次只能领取一个任务';
		this.taskBtn.title = "激活任务";
		if(this.roleIndex != -1 && !CacheManager.talentCultivate.isHasTask(this.roleIndex) && this.task == null){
			this.showBtnMc(true);
		} else {
			this.showBtnMc(false);
		}
	}

	private updateSkill(): void {
		let cfg: any = ConfigManager.talent.getByPk(this.career);
		if (cfg) {
			this.skillList.data = JSON.parse(cfg.unlockShowSkillList);
		}
	}

	private clickTaskBtn(): void {
		if (this.roleIndex == -1) {
			Tip.showTip(`未开启${CareerUtil.getCareerName(this.career)}角色，无法激活任务`);
		} else {
			if (CacheManager.talentCultivate.isHasTask(this.roleIndex)) {//已领取了
				if (this.task.isCompleted) {
					EventManager.dispatch(LocalEventEnum.TaskSubmit, { "npcId": this.task.getNpcId(), "taskCode": this.task.code });
				} else {
					this.task.gotoTask(false);
				}
			} else {
				if (this.task != null) {
					Tip.showTip(`身上已有进行的天赋任务`);
				} else {
					this.task = CacheManager.task.getTalentCanGetTask(this.roleIndex);
					if (this.task.status == ETaskStatus.ETaskStatusCanGet) {
						let tip: string = `领取<font color='${Color.Color_5}'>${this.talentCfg.head}</font>任务后，需要全部任务做完，才能再次领取其他天赋任务，是否确定领取？`;
						Alert.alert(tip, () => {
							EventManager.dispatch(LocalEventEnum.TaskGet, { "npcId": this.task.getNpcId(), "taskCode": this.task.code, "roleIndex": this.roleIndex });
						});
					}
				}
			}
		}
	}

	/**
	 * 显示按钮特效
	 */
	private showBtnMc(isShow: boolean): void {
		if(isShow) {
			App.DisplayUtils.addBtnEffect(this.taskBtn, true);
		} else {
			App.DisplayUtils.addBtnEffect(this.taskBtn, false);
		}
	}
}