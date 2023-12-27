class TimeLimitTaskItem extends ListRenderer {
	
	private _item:BaseItem;

	private _txtDesc:fairygui.GTextField;
	private _txtNum:fairygui.GRichTextField;
	private _txtDone:fairygui.GTextField;

	private _optBtn:fairygui.GButton;

	private _config:any;
	private _taskConfig:any;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);

		this._item = <BaseItem>this.getChild("loader_item");
		this._item.enableToolTip = true;
		this._item.enableToolTipOpt = false;
		this._item.isShowName = false;
		this._item.isShowRedEff = true;

		this._txtDesc = this.getChild("txt_desc").asTextField;
		this._txtNum = this.getChild("txt_num").asRichTextField;
		this._txtDone = this.getChild("txt_done").asTextField;

		this._optBtn = this.getChild("btn_opt").asButton;
		this._optBtn.addClickListener(this.onOptBtnClickHandler, this);
	}

	public setData(data:any):void {
		this._data = data;

		this._config = ConfigManager.timeLimitTask.getTaskDetails(data.code_I, data.index_I);
		var secConfig = undefined;
		let arr = (this._config.taskList as string).split("#");
		this._taskConfig = ConfigManager.task.getByPk(arr[0]);
		if(arr.length >= 2) {
			secConfig = ConfigManager.task.getByPk(arr[1]);
		}


		this._txtDesc.text = this._config.title;

		if(data.process_I >= data.target_I) {
			this._txtNum.text = App.StringUtils.substitude("<font color='#0DF14B'>({0}/{1})</font>", data.process_I, data.target_I);
		}
		else {
			this._txtNum.text = App.StringUtils.substitude("({0}/{1})", data.process_I, data.target_I);
		}

		if(secConfig) {
			let obj:any = JSON.parse(secConfig.processJsStr);
			let processType:number = obj[0].contents[0];
			let processNum : number = obj[0].contents[2];
			if(processType == ETaskCountType.ETaskCountTypeOnlineDays) {
				if(data.process_I >= data.target_I) {
					this._txtNum.text = App.StringUtils.substitude("<font color='#0DF14B'>({0}/{1})</font>", processNum, processNum);
				}
				else {
					this._txtNum.text = App.StringUtils.substitude("({0}/{1})", CacheManager.welfare2.onlineDays, processNum);
				}
			}
		}



		let list:ItemData[] = RewardUtil.getStandeRewards(this._config.rewards);
		this._item.setData(list[0]);


		if(data.status_I == ETaskStatus.ETaskStatusHadCompleted) {
			this._optBtn.visible = true;
			this._txtDone.visible = false;
			this._optBtn.text = "领取";
			CommonUtils.setBtnTips(this._optBtn, true);
		}
		else if(data.status_I == ETaskStatus.ETaskStatusNotCompleted) {
			this._optBtn.visible = true;
			this._txtDone.visible = false;
			this._optBtn.text = "前往";
			CommonUtils.setBtnTips(this._optBtn, false);
		}
		else {
			this._optBtn.visible = false;
			this._txtDone.visible = true;
		}
	}

	private hideModule():void {
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.TimeLimitTask);
	}

	private onOptBtnClickHandler():void {
		
		if(this._data.status_I == ETaskStatus.ETaskStatusHadCompleted) {
			let limitNumPack: number = 1;
			if (!CacheManager.pack.backPackCache.isHasCapacity(limitNumPack)) {
				EventManager.dispatch(LocalEventEnum.ShowSmeltTipsWin, limitNumPack);
				return;
			}
			ProxyManager.timeLimitTask.getTimpLimitedTaskReward(this._data.code_I, this._data.index_I);
		}
		else if(this._data.status_I == ETaskStatus.ETaskStatusNotCompleted) {

			let taskType:number = this._taskConfig.type;
			let obj:any = JSON.parse(this._taskConfig.processJsStr);
			let processType:number = obj[0].contents[0];

			Log.trace(Log.GAME, "taskName taskType processType", this._taskConfig.name, taskType, processType);

			switch (taskType) {
				case ETaskType.ETaskTypeTalk:
					// playerTask = new TaskTalk(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillBoss:
					// playerTask = new TaskKillBoss(sPlayerTask);
					break;
				case ETaskType.ETaskTypeCollect:
					// playerTask = new TaskCollect(sPlayerTask);
					break;
				case ETaskType.ETaskTypeEscort:
					let npcId: number = this._taskConfig.getNpc;
					EventManager.dispatch(LocalEventEnum.SceneRouteToNpc, { "npcId": npcId });
					this.hideModule();
					break;
				case ETaskType.ETaskTypeTaskCount:
					switch (processType) {
						// case ETaskCountType.ETaskCountTypeFriend:
						// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Mail, null, ViewIndex.Two);
						// 	break;
						case ETaskCountType.ETaskCountTypeTransport:
							EventManager.dispatch(LocalEventEnum.TaskGotoEscort);
							break;
						// case ETaskCountType.ETaskCountTypePetSwallow:
						// 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PetMount, null, ViewIndex.Two);
						// 	break;
						case ETaskCountType.ETaskCountTypeSwordPool:
						case ETaskCountType.ETaskCountTypeSwordPoolActivity:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Daily, null, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeWorldBoss:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.WorldBoss, null, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeStrengthen:
						case ETaskCountType.ETaskCountTypeStarBest:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine, null, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeRuneCopyFloor:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallTower });
							break;
						case ETaskCountType.ETaskCountTypeCopyCheckPointOne:
							if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter) && CacheManager.checkPoint.canChallenge && CacheManager.checkPoint.curCopy) {
								this.hideModule();
							}
							EventManager.dispatch(LocalEventEnum.EnterPointChallenge);
							break;
						case ETaskCountType.ETaskCountTypeSkillUpgrade:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.Skill }, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeMeltEquip:
							EventManager.dispatch(UIEventEnum.PackSmeltOpen);
							break;
						case ETaskCountType.ETaskCountTypeDressEquipCount://装备
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, { "tabType": PanelTabType.Player }, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypePlayerLevel://玩家等级
							EventManager.dispatch(UIEventEnum.UpgradeGuideOpen);
							break;
						case ETaskCountType.ETaskCountTypeEquipLottery:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Lottery, { "tabType": PanelTabType.LotteryEquip }, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeRuneLottery:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Lottery, { "tabType": PanelTabType.LotteryRune }, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeOnlineDays:

							break;
						case ETaskCountType.ETaskCountTypeVipLevel:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.VIP, { "tabType": PanelTabType.VipActive }, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeFirstRecharge:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.RechargeFirst, null, ViewIndex.Two);
							break;
						case ETaskCountType.ETaskCountTypeMaterialCopy:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.CopyHall, { "tabType": PanelTabType.CopyHallMaterial }, ViewIndex.Two);
							break;
					}
					break;
				case ETaskType.ETaskTypeKillBossFirstDrop:
					// playerTask = new TaskKillBossFirstDrop(sPlayerTask);
					break;
				case ETaskType.ETaskTypeKillBossDropEx:
					// playerTask = new TaskKillBossDropEx(sPlayerTask);
					break;
				case ETaskType.ETaskTypeHandEquip:
					// playerTask = new TaskHandEquip(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStrengthenLevel:
					// playerTask = new TaskStrengthen(sPlayerTask);
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Refine, null, ViewIndex.Two);
					break;
				case ETaskType.ETaskTypePassNewPlayerCopy:
					// playerTask = new TaskPassNewPlayerCopy(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStarPassCopy:
					// playerTask = new TaskStarPassCopy(sPlayerTask);
					break;
				case ETaskType.ETaskTypeCopyExpTarget:
					// playerTask = new TaskCopyExpTarget(sPlayerTask);
					break;
				case ETaskType.ETaskTypeGuide:
					// playerTask = new TaskGuide(sPlayerTask);
					break;
				case ETaskType.ETaskTypeItemSmelt:
					// playerTask = new TaskSmelt(sPlayerTask);
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Compose, null, ViewIndex.Two);
					break;
				case ETaskType.ETaskTypeDressEquip:
					// playerTask = new TaskDressEquip(sPlayerTask);
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Player, null, ViewIndex.Two);
					break;
				case ETaskType.ETaskTypeReachMap:
					// playerTask = new TaskReachMap(sPlayerTask);
					break;
				case ETaskType.ETaskTypeStrengthenExActivate:
					// playerTask = new TaskStrengthenExActivate(sPlayerTask);
					switch (processType) {
						case EStrengthenExType.EStrengthenExTypeDragonSoul:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWare, { "tabType": PanelTabType.DragonSoul }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeWing:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Wing }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeInternalForce:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.InnerPower }, ViewIndex.Two);
							break;
					}
					break;
				case ETaskType.ETaskTypeStrengthenExState:
				case ETaskType.ETaskTypeStrengthenExCount:
				case ETaskType.ETaskTypeStrengthenExLevel:
					switch (processType) {
						case EStrengthenExType.EStrengthenExTypeUpgrade:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.Strengthen }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeCast:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.Casting }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeNerve:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.Nerve }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeInternalForce:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.InnerPower }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeDragonSoul:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWare, { "tabType": PanelTabType.DragonSoul }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeWing:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Wing }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeLord:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Train, { "tabType": PanelTabType.TrainNobility }, ViewIndex.Two);
							break;
						case EStrengthenExType.EStrengthenExTypeMedal:
							EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Train, { "tabType": PanelTabType.TrainMedal }, ViewIndex.Two);
							break;
					}
					break;
				case ETaskType.ETaskTypeGodWeaponActivate:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Skill, { "tabType": PanelTabType.TrainGodWeapon }, ViewIndex.Two);
					break;
				case ETaskType.ETaskTypeEnterCopyCount:
				case ETaskType.ETaskTypeHistoryEnterCopyCount:
				case ETaskType.ETaskTypeHistoryFinishCopyCount:
				case ETaskType.ETaskTypePassCopyCount:
					TaskCopyUtil.execute(processType, this._taskConfig.copyCode, ViewIndex.Two);
					break;
				case ETaskType.ETaskTypeHireMining:
					EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Arena, {"tabType": PanelTabType.Mining}, ViewIndex.Two);
					break;
			}
		}
		else {
			
		}

	}
}