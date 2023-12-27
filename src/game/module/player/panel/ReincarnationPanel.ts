class ReincarnationPanel extends BaseTabView {
	private c1: fairygui.Controller;
	private bgLoader:GLoader;
	private loader_img:GLoader;
	private txt_roleState: fairygui.GTextField;
	private fightTxt: fairygui.GTextField;
	private progressBar:UIProgressBar;
	// private costTxt: fairygui.GTextField;
	// private haveTxt: fairygui.GRichTextField;

	private list_curAttr: List;
	private list_nowAttr: List;
	private list_nextAttr: List;
	private mcContainer:fairygui.GComponent;

	private txt_open:fairygui.GTextField;
	private list_item:List;

	private reincarnationBtn: fairygui.GButton;
	private linkBtn: fairygui.GButton;

	private mc_onkey:UIMovieClip;
	private mc_reinSuccess: UIMovieClip;
	private touch_area: fairygui.GGraph;

	// private mcCircle:UIMovieClip;

	private curCfg: any;
	private nextCfg: any;
	private needCost:number = 0;
	private myValue:number = 0;
	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.bgLoader = this.getGObject("img_reinBg") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("roleStateBg.jpg",PackNameEnum.Reincarnation));
		this.loader_img = this.getGObject("loader_img") as GLoader;

		this.txt_roleState = this.getGObject("txt_roleState").asTextField;
		// this.costTxt = this.getGObject("txt_consume").asTextField;
		// this.haveTxt = this.getGObject("txt_have").asRichTextField;
		this.progressBar = this.getGObject("progressBar") as UIProgressBar;
		this.progressBar.setStyle(URLManager.getCommonIcon("progressBar_7"),URLManager.getCommonIcon("bg_9"),0,0,19,6,UIProgressBarType.Mask);
		this.progressBar.labelType = BarLabelType.Current_Over_Total;
		this.progressBar.formatValue = true;
		this.progressBar.labelSize = 20;

		this.list_curAttr = new List(this.getGObject("list_curAttr").asList);
		this.list_nowAttr = new List(this.getGObject("list_nowAttr").asList);
		this.list_nextAttr = new List(this.getGObject("list_nextAttr").asList);

		this.txt_open = this.getGObject("txt_open").asTextField;
		this.list_item = new List(this.getGObject("list_item").asList);

		this.reincarnationBtn = this.getGObject("btn_rein").asButton;
		this.reincarnationBtn.addClickListener(this.onClickHandler, this);

		let fightPanel: fairygui.GComponent = this.getGObject("panel_fight").asCom;
		this.fightTxt = fightPanel.getChild("txt_fight").asTextField;

		this.mcContainer = this.getGObject("mc_container").asCom;

		this.linkBtn = this.getGObject("btn_decompose").asButton;
		this.linkBtn.addClickListener(this.onTextLinkHandler, this);

		this.mc_onkey = UIMovieManager.get(PackNameEnum.MCOneKey);
		this.addChild(this.mc_onkey);
		this.mc_onkey.scaleX = this.mc_onkey.scaleY = 0.55;
		this.mc_onkey.x = this.linkBtn.x - 90;
		this.mc_onkey.y = this.linkBtn.y - 124;
		this.mc_onkey.setPlaySettings(0, -1, -1, -1);
		this.mc_onkey.visible = false;
		this.mc_onkey.addRelation(this.linkBtn,fairygui.RelationType.Center_Center);
		this.mc_onkey.addRelation(this.linkBtn,fairygui.RelationType.Middle_Middle);

		// this.mcCircle = UIMovieManager.get(PackNameEnum.MCReincarnation);
		// this.mcCircle.x = 105;
		// this.mcCircle.y = 171;
		// this.mcCircle.scaleX = this.mcCircle.scaleY = 1.8;
		// this.mcContainer.addChild(this.mcCircle);
		// this.mcCircle.playing = true;

		this.mc_reinSuccess = UIMovieManager.get(PackNameEnum.MCReinSuccess);
		this.mc_reinSuccess.x = -1;
		this.mc_reinSuccess.y = -30;
		this.mcContainer.addChild(this.mc_reinSuccess);
		this.effectComplete();

		GuideTargetManager.reg(GuideTargetName.ReincarnationPanelLinkBtn, this.linkBtn, true);
	}

	public updateAll(): void {
		this.updateRoleStateLevel(false);
		this.checkTips();
		// App.DisplayUtils.grayButton(this.reincarnationBtn,!this.isOpen())
		// this.reincarnationBtn.enabled = this.isOpen();
	}

	public updateRoleStateLevel(playEffect: boolean = true): void {
		let stateLv: number = CacheManager.role.getRoleState();
		this.txt_roleState.text = FuiUtil.getStageStr(stateLv) + "转";
		this.loader_img.load(URLManager.getModuleImgUrl(Math.max(1,stateLv) + ".png",PackNameEnum.Reincarnation));
		this.curCfg = ConfigManager.roleStateNew.getByPk(stateLv);
		if (this.curCfg) {
			this.fightTxt.text = (WeaponUtil.getCombat(WeaponUtil.getAttrDict(this.curCfg.attr)) * CacheManager.role.roles.length) + "";
			this.list_nowAttr.data = this.curCfg.attr.split("#");
			this.list_curAttr.data = this.curCfg.attr.split("#");
		}
		else {
			this.fightTxt.text = "0";
		}

		this.nextCfg = ConfigManager.roleStateNew.getByPk(stateLv + 1);
		let openStr:string[] = [];
		let openList:any[] = [];
		let career:number;
		if (!this.nextCfg) {
			// this.costTxt.text = "0";
			this.c1.setSelectedIndex(2);
			this.txt_open.text = stateLv + "";
			this.needCost = 0;
			if(this.curCfg.curOpen) openStr = this.curCfg.curOpen.split("#");
			career = this.curCfg.roleState;
			this.progressBar.labelType = BarLabelType.Only_Current_Over;
		}
		else {
			this.txt_open.text = this.nextCfg.roleState + "";
			if(this.nextCfg.curOpen) openStr = this.nextCfg.curOpen.split("#");
			career = this.nextCfg.roleState;
			if (stateLv == 0) {
				this.c1.setSelectedIndex(0);
			}
			else {
				this.c1.setSelectedIndex(1);
			}
			this.list_nextAttr.data = this.nextCfg.attr.split("#");
			this.list_curAttr.data = this.nextCfg.attr.split("#");
			this.needCost = this.nextCfg.roleExp;
			// this.costTxt.text = App.MathUtils.formatNum2(this.nextCfg.roleExp);
		}
		for(let i:number = 0 ; i < openStr.length; i++) {
			if(openStr[i] == "") continue;
			openList.push({open:openStr[i],career:career});
		}
		this.list_item.data = openList;
		if (playEffect) {
			this.playEffect();
		}
		this.updateStateValue();
	}

	public updateStateValue(): void {
		// this.haveTxt.text = App.MathUtils.formatNum2(CacheManager.role.money.roleExp_I);
		this.progressBar.setValue(CacheManager.role.money.roleExp_I,this.needCost);
		CommonUtils.setBtnTips(this.reincarnationBtn, this.isOpen() && CacheManager.player.checkCanReincarnation());
		// if (!this.nextCfg) {
		// 	this.haveTxt.text = "0";//HtmlUtil.html(, Color.Green2);
		// }
		// else {
		// 	// let color: any;
		// 	// if (CacheManager.role.money.roleExp_I < this.nextCfg.roleExp) {
		// 	// 	color = Color.BASIC_COLOR_9;
		// 	// }
		// 	// else {
		// 	// 	color = Color.Green2;
		// 	// }
		// 	// this.haveTxt.text = "" + HtmlUtil.html(CacheManager.role.money.roleExp_I + "", Color.BASIC_COLOR_9);
		// 	// CommonUtils.setBtnTips(this.reincarnationBtn, CacheManager.player.checkCanReincarnation());
		// }
	}

	public checkTips(): void {
		let flag: boolean = this.isOpen() && (CacheManager.player.isCurCheckPointGetXW() || CacheManager.copy.checkExpCopyTips() || CacheManager.player.checkExchangeRoleStateExp());
		this.mc_onkey.visible = flag;
		this.mc_onkey.playing = flag;
	}

	/**获取修为 */
	private onTextLinkHandler(): void {
		if(this.isOpen(true)) {
			// if (!this.nextCfg) {
			// 	Tip.showTip("已满级");
			// 	return;
			// }
			EventManager.dispatch(UIEventEnum.OpenRoleStateExpExchange);
		}
	}

	private onClickHandler(): void {
		if(!this.isOpen(true)) return;
		if (!this.nextCfg) {
			Tip.showOptTip("已满级");
			return;
		}
		if (CacheManager.role.money.roleExp_I < this.nextCfg.roleExp) {
			Tip.showOptTip("修为不足");
			return;
		}
		EventManager.dispatch(LocalEventEnum.Reincarnation);
	}

	private playEffect(): void {
		this.mc_reinSuccess.visible = true;
		this.mc_reinSuccess.setPlaySettings(0, -1, 1, -1, this.effectComplete, this);
		this.mc_reinSuccess.playing = true;
	}

	private effectComplete(): void {
		this.mc_reinSuccess.visible = false;
		this.mc_reinSuccess.playing = false;
	}
}