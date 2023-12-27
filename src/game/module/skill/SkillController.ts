/**
 * 技能控制器
 */
class SkillController extends BaseController {
	private module: SkillModule2;
	private skillNewGetWindow: SkillNewGetWindow;

	private cheatsPreview: SkillCheatsPreviewWin;
	private cheatsExchange: SkillCheatsExchangeWin;
	private cheatsSelectWin: SkillCheatsEmbedSelectWin;
	private cheatsTip: CheatItemTip;

	public constructor() {
		super(ModuleEnum.Skill);
	}

	public initView(): BaseModule {
		this.module = new SkillModule2();
		return this.module;
	}

	protected addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSkill], this.onSSkillMsg, this);//技能列表更新
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameCheatsInfo], this.onCheatsInfo, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameMosaicCheatsRet], this.onMosaicCheatsRet, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameExchangeCheatsRet], this.onEchangeCheatsRet, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGodWeaponInfo],this.onGodWaeponInf,this);

		this.addListen0(LocalEventEnum.SkillUpgradeOneKey, this.onUpgradeOneKey, this);
		this.addListen0(LocalEventEnum.SkillUpgradeAll, this.onUpgradeAll, this);
		this.addListen0(NetEventEnum.roleSkillUpdated, this.onUpdateOne, this);
		this.addListen0(NetEventEnum.moneyCoinBindUpdate, this.onCheckCanUp, this);
		this.addListen0(NetEventEnum.roleStateChanged, this.onCheckCanUp, this);

		this.addListen0(LocalEventEnum.CheatsReqEmbed, this.onReqEmbed, this);
		this.addListen0(LocalEventEnum.CheatsReqExchange, this.onReqExchange, this);

		this.addListen0(LocalEventEnum.CheatsReqEmbed, this.onReqEmbed, this);
		this.addListen0(LocalEventEnum.CheatsReqExchange, this.onReqExchange, this);
		this.addListen0(LocalEventEnum.CheatsReqEmbed, this.onReqEmbed, this);
		this.addListen0(LocalEventEnum.CheatsReqExchange, this.onReqExchange, this);		
		
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExUpgraded, this.onPlayerStrengthenExUpdated, this);
		this.addListen1(NetEventEnum.PlayerStrengthenExActived, this.onPlayerStrengthenExActived, this);

		this.addListen1(LocalEventEnum.CheatsShowPreviewWin, this.onShowCheatPreview, this);
		this.addListen1(LocalEventEnum.CheatsShowExchangewWin, this.onShowCheatExchange, this);
		this.addListen1(LocalEventEnum.CheatsShowSelectwWin, this.onShowCheatSelect, this);
		this.addListen1(LocalEventEnum.CheatsAddToEmned, this.onAddEmbed, this);
		this.addListen1(LocalEventEnum.CheatsItemTips, this.onCheatItemTips, this);
		this.addListen1(LocalEventEnum.CheatsHidePreviewWin, this.onHidePreviewWin, this);
		this.addListen1(LocalEventEnum.CheckPointUpdate,this.onCheckPointUpdate,this);
	}

	/**
	 * 神器信息
	 *@param S2C_SGodWeaponInfo
	 */
	private onGodWaeponInf(data:any):void{
		CacheManager.godWeapon.setGodWPInfos(data);
		if(this.isShow){
			this.module.updateGodWeapon();
		}
		this.showGuide();		
		let flag:boolean = CacheManager.skill.checkAllTips();
		EventManager.dispatch(LocalEventEnum.HomeSetBtnTip,ModuleEnum.Skill, flag)
	}

	private showGuide():void{
		EventManager.dispatch(LocalEventEnum.GuidePanelShow);
	}

	/**
	 * 收到技能列表，结构为：SSkillMsg，updateType为ESkillOp，进游戏初始化updateType为0
	 * @param data SSkillMsg
	 */
	private onSSkillMsg(data: any): void {
		CacheManager.skill.skillMsg = data;
		this.onCheckCanUp();
		EventManager.dispatch(NetEventEnum.roleSkillListUpdated);
	}

	private onUpgradeAll(roleIndex: number): void {
		let msg: any = {};
		msg.cmd = ECmdGame[ECmdGame.ECmdGameSkillUpgradeAll];
		msg.body = {
			"index": roleIndex
		};
		App.Socket.send(msg);
	}

	private onUpgradeOneKey(skillId: number, roleIndex: number): void {
		let msg: any = {};
		msg.cmd = ECmdGame[ECmdGame.ECmdGameSkillUpgradeOneKey];
		msg.body = {
			"skillId": skillId,
			"index": roleIndex
		};
		App.Socket.send(msg);
	}

	/**
	 * 学习技能 - 暂时无用
	 */
	private learnSkill(data: any): void {
		// if (data) {
		// 	let skillId: number = data.skillId;
		// 	if (!CacheManager.skill.isLearnedSkill(skillId)) {
		// 		ProxyManager.player.learnSkill(data.skillId, data.posType, data.planType);
		// 	}
		// }
	}

	/**
	 * 获得了新技能 - 暂时无用
	 */
	private newGetSkill(skill: any): void {
		if (skill == null) {
			return;
		}
		EventManager.dispatch(LocalEventEnum.TaskStop);
		if (this.skillNewGetWindow == null) {
			this.skillNewGetWindow = new SkillNewGetWindow();
		}
		this.skillNewGetWindow.updateSkill(skill);
		this.skillNewGetWindow.show();
	}

	private onUpdateOne(skillData: SkillData): void {
		this.module && this.module.isShow && this.module.updateSkillOne(skillData);
	}

	private onCheckCanUp(): void {
		// ControllerManager.player.updatePlayerPanelBtnTips();
		this.module && this.module.isShow && this.module.updateSkillBtnTips();
	}

	private onPlayerStrengthenExUpdated(info: SUpgradeStrengthenEx): void {
		this.module.onStrengthenExUpdated(info);
	}

	private onPlayerStrengthenExActived(info: SUpgradeStrengthenEx): void {
		this.module.onnStrengthenExActived(info);
		if (info != null) {
			if (info.type == EStrengthenExType.EStrengthenExTypeInternalForce) {
				EventManager.dispatch(LocalEventEnum.ActivationShow, { "name": "内功", "model": 1, "modelType": EShape.EInnerPower });
			}
		}
	}

	private onCheckPointUpdate():void{
		this.module.onCheckPointUpdate();
	}

	/**
	 * 道具背包更新
	 */
	private packPosTypePropChange(): void {
		this.module.onPropUpdate();
		if (this.cheatsExchange && this.cheatsExchange.isShow) {
			this.cheatsExchange.updateAll();
		}

	}

	///////==============秘籍功能===============

	/**
	 * 秘籍信息更新
	 * S2C_SCheatsInfo
	 */
	private onCheatsInfo(data: any): void {
		CacheManager.cheats.setCheatsInfo(data);
		if (this.isShow) {
			this.module.updateCheats();
		}
	}
	/**
	 * 置换返回
	 * S2C_SExchangeCheatsRet
	 */
	private onEchangeCheatsRet(data: any): void {
		//S2C_SExchangeCheatsRet		
		if (this.cheatsExchange && this.cheatsExchange.isShow) {
			this.cheatsExchange.updateByEchange(data.genItemcode);
		}
	}
	/**
	 * 镶嵌返回
	 * S2C_SMosaicCheatsRet */
	private onMosaicCheatsRet(data: any): void {
		// data.retCode  0成功 -1失败		
		if (this.isShow) {
			this.module.updateByEmbed(data);
		}
	}

	private onShowCheatPreview(data: any): void {
		if (!this.cheatsPreview) {
			this.cheatsPreview = new SkillCheatsPreviewWin();
		}
		this.cheatsPreview.show(data);
	}

	private onShowCheatExchange(): void {
		if (!this.cheatsExchange) {
			this.cheatsExchange = new SkillCheatsExchangeWin();
		}
		this.cheatsExchange.show();
	}

	private onCheatItemTips(data: ItemData): void {
		if (!this.cheatsTip) {
			this.cheatsTip = new CheatItemTip();
		}
		this.cheatsTip.show(data);
	}
	private onHidePreviewWin(): void {
		if (this.cheatsPreview && this.cheatsPreview.isShow) {
			this.cheatsPreview.hide();
		}
	}
	
	private onAddEmbed(item: ItemData): void {
		this.module.addCheatEmbedItem(item);
	}

	private onShowCheatSelect(data: any): void {
		if (!this.cheatsSelectWin) {
			this.cheatsSelectWin = new SkillCheatsEmbedSelectWin();
		}
		this.cheatsSelectWin.show(data);
	}
	/**镶嵌 */
	private onReqEmbed(roleIndex: number, costItemcode: number): void {
		ProxyManager.cheats.embeld(roleIndex, costItemcode);
	}
	/**置换 */
	private onReqExchange(data: ItemData[]): void {
		if (data.length == 3) {
			let mapCost: any = { key_I: [], value_I: [] };
			for (let i: number = 0; i < data.length; i++) {
				if (data[i]) {
					mapCost.key_I.push(data[i].getCode());
					mapCost.value_I.push(1);
				} else {
					return;
				}
			}
			ProxyManager.cheats.exchange(mapCost);
		}

	}

}