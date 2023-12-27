
/**
 * 副本场景内要是显示的所有内容
 */
class BaseCopyPanel extends BaseContentView {
	/**配置信息 */
	protected copyInf: any;
	public controller1: fairygui.Controller;
	/**当前副本左边的伸缩面板;某些副本该属性可能是null */
	//public currentPanel: BaseCopyLeftView;
	public cdView: fairygui.GComponent;
	public txt_time: fairygui.GTextField;
	public btn_exit: fairygui.GButton;
	/**副本开启、副本退出、波数提醒的UI */
	public tipsView: fairygui.GComponent;
	public txt_tips: fairygui.GTextField;
	public loaderDesc:GLoader;

	// --------- 左则panel ---------
	public txt_title: fairygui.GTextField;
	public txt_desc: fairygui.GRichTextField;
	public txt_target: fairygui.GRichTextField;

	protected btn_buff: fairygui.GButton;
	protected btn_useExp: fairygui.GButton; //效率按钮

	protected t_efficiency: fairygui.Transition;
	protected t_buff: fairygui.Transition;
	protected bufTipGroup: fairygui.GGroup;
	protected XPSetBtn:fairygui.GButton;//合击按钮设置

	protected exitTips:string;
	private _isShowBossReward:boolean;

	/**
	 * 副本场景内要是显示的所有内容
	 */
	public constructor(copyInf: any, contentname: string = "",packageName:string = PackNameEnum.Copy) {
		super(packageName, contentname, null, LayerManager.UI_Home); // ModuleEnum.Copy		
		this.copyInf = copyInf;
		this.exitTips = "确定要离开副本吗？";
		this.isDestroyOnHide = true;
	}
	public initUI():void{
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}
	public initOptUI(): void {

		this.controller1 = this.getController("c1");
		var cdObj: fairygui.GObject = this.getGObject("CountDown");
		if (cdObj) {
			this.cdView = cdObj.asCom;
			//let ldr:GLoader = <GLoader>this.cdView.getChild("load_cdBg");
			//ldr.load(URLManager.getModuleImgUrl("countdown_bg.png",PackNameEnum.Copy));
			this.txt_time = this.cdView.getChild('txt_time').asTextField;
		}
		let component:fairygui.GObject = this.getGObject("btn_exit");
		if(component) {
			this.btn_exit = component.asButton;
			this.btn_exit.y = fairygui.GRoot.inst.height - 260;
			this.btn_exit.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Left_Left);
			this.btn_exit.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Bottom_Bottom);
			this.btn_exit.addClickListener(this.exitCopy, this);
		}
		component = this.getGObject("btn_setup");
		if(component) {
			this.XPSetBtn = component.asButton;
			this.XPSetBtn.visible = false;//默认隐藏
			this.XPSetBtn.addClickListener(this.onXpSetChangeHandler,this);
		}
		var tipObj: fairygui.GObject = this.getGObject("Tips");
		if (tipObj) {
			this.tipsView = tipObj.asCom;
			this.tipsView.visible = false;
			this.txt_tips = this.tipsView.getChild("txt_tip").asTextField;
			this.loaderDesc = <GLoader>this.tipsView.getChild("loader_desc");
		}
		//-----------鼓舞和效率 buf操作区域
		var bufObj: fairygui.GObject = this.getGObject("buff");
		if (bufObj) {
			var buff: fairygui.GComponent = bufObj.asCom;
			buff.visible = true;
			this.btn_buff = buff.getChild("btn_buff").asButton;
			this.btn_useExp = buff.getChild("btn_efficiency").asButton;
			this.t_buff = buff.getTransition("t_buff");
			this.t_efficiency = buff.getTransition("t_efficiency");
			this.bufTipGroup = buff.getChild("group_tishi").asGroup;

			this.btn_buff.addClickListener(this.onClickInspire, this);
			this.btn_useExp.addClickListener(this.onClickExp, this);
		}

		// -------------获取左边面板内容-----
		var gobj: fairygui.GObject = this.getGObject("panel");
		if (gobj) {
			var leftPanel: fairygui.GComponent = gobj.asCom;
			var gobj: fairygui.GObject = leftPanel.getChild("txt_title");
			gobj ? this.txt_title = gobj.asTextField : null;

			gobj = leftPanel.getChild("txt_target");
			this.txt_target = gobj ? gobj.asRichTextField : null;

			gobj = leftPanel.getChild("txt_desc");
			this.txt_desc = gobj ? gobj.asRichTextField : null;
		}
	}

	public onTimer(): void {

	}

	public onShow(data?:any): void {
		super.onShow(data);
		this.showBuffTips(true);
	}
	/**
	 * 副本结束 但是还没退出副本场景 需要处理的ui(比如隐藏) 可在这处理;收到副本结算 会执行该函数
	 */
	public setSceneUI():void{
		
	}
	protected onClickInspire(): void {
		//点击鼓舞按钮
		this.t_buff.stop(true);
		this.bufTipGroup.visible = false;
		EventManager.dispatch(UIEventEnum.CopyClickBuff, CopyEnum.BuffInspire);
	}
	protected onClickExp(): void {
		this.t_efficiency.stop(true);
		EventManager.dispatch(UIEventEnum.CopyClickBuff, CopyEnum.BuffExp);
	}

	protected exitCopy(): void {
		let mainPlayer:MainPlayer = CacheManager.king.leaderEntity;
		if(mainPlayer && mainPlayer.currentState == EntityModelStatus.ScaleTween) return;
		if(CopyUtils.isInLeftNoTipCopy()){
			this.dealLeft();
		}else{
			Alert.alert(this.exitTips,this.dealLeft, this);
		}	

	}

    protected dealLeft():void{
		CacheManager.copy.isActiveLeft = true;
		CacheManager.task.gotoTaskFlag = false;
		EventManager.dispatch(LocalEventEnum.CopyReqExit, true);
	}

	protected showBuffTips(isShow: boolean): void {
		if (this.bufTipGroup) {
			this.bufTipGroup.visible = isShow;
		}
	}
	protected get cache(): CopyCache {
		return CacheManager.copy;
	}

	public updateAll(data?: any): void {
		if(data) {
        	this.copyInf = ConfigManager.copy.getByPk(data.copyCode_I);
    	}	
		if(this.isShow){
			this.updateProcess();
			if(this.XPSetBtn) this.XPSetBtn.selected = !CacheManager.sysSet.specialCopyAutoXP;
			this.setExitBtnShow();
		}	
	}
	protected setExitBtnShow():void{
		if(this.copyInf && this.btn_exit){
			let showLeave:number = this.copyInf.showLeave?this.copyInf.showLeave:0;
			this.btn_exit.visible = showLeave==1;
		}
	}
	public extendPanel(flag: boolean): void {
		if (this.controller1) {
			var idx: number = flag ? 1 : 0;
			this.controller1.selectedIndex = idx;
		}
		
	}

	/**自动释放合击设置 */
	protected onXpSetChangeHandler():void {
		CacheManager.sysSet.specialCopyAutoXP = !CacheManager.sysSet.specialCopyAutoXP;
		this.XPSetBtn.selected = !CacheManager.sysSet.specialCopyAutoXP;
	}

	/**
	 * 更新数据（根据配置内容更新）
	 */
	public update(data?: any): void {
		this.copyInf = data;
		if (this.txt_title) {
			this.txt_title.text = data.name ? data.name : "";
		}
		if (this.txt_desc) {
			var ints: string = data.introduction ? data.introduction : "";
			if (ints.length > 0) {
				ints = HtmlUtil.br(ints);
			}
			this.txt_desc.text = HtmlUtil.html("副本描述:", "#FEA700", true) + ints;
		}
		this.updateAll();
	}

	protected updateProcess(): void {
		if (this.copyInf && this.copyInf.bossNumDetail) {
			var bossDrails: Array<any> = (<string>this.copyInf.bossNumDetail).split("#");
			var targetHtml: string = HtmlUtil.html("通关目标：",Color.BASIC_COLOR_8,true);
			for (var i: number = 0; i < bossDrails.length; i++) {
				var copyBossInfs: string[] = (<string>bossDrails[i]).split(",");
				var bossInf: any = ConfigManager.boss.getByPk(Number(copyBossInfs[2]));// 0 是序号 1 一个显示枚举 2 bossId 3 是bossNum
				var killNum:number = CacheManager.copy.getKillBossDetail(Number(copyBossInfs[0]));
				let bossName: string = "怪物";
				if (bossInf != null) {
					bossName = bossInf.name;
					targetHtml+= HtmlUtil.html(`击杀：`,Color.White) + HtmlUtil.html(bossName,Color.Green) + HtmlUtil.html(` ${killNum}/${copyBossInfs[3]}`,Color.White,true);
				}else{
					targetHtml+=HtmlUtil.html(`击杀${bossName}：${killNum}/${copyBossInfs[3]}`,Color.White,true);
				}				
			}
			this.txt_target.text = targetHtml;
		}
	}

	public setCdTime(str: string): void {
		if (this.txt_time) {
			this.txt_time.text = str;
		}
	}

	/**副本结束倒计时 */
	public showCdView(show: boolean): void {
		if (this.cdView) {
			this.cdView.visible = show;
		}
	}
	/**副本开启、副本退出、副本环数倒计时提示 */
	public showTipsView(show: boolean): void {
		if (this.tipsView) {
			this.tipsView.visible = show;
		}
	}

	/**
	 * 设置副本内中下位置的倒计时提示
	 */
	public setTimeTipsText(text: string,type:number): void {
		if (this.txt_tips) {
			this.txt_tips.text = text;
		}
		if(this.loaderDesc){
			this.loaderDesc.load(URLManager.getModuleImgUrl("sec_desc"+type+".png",PackNameEnum.Copy));
		}
	}
	/**停止动画 */
	public stopInspireAni(buffStop: boolean, efficiencyStop: boolean): void {
		if (this.t_buff && buffStop) {
			this.t_buff.stop(true);
		}
		if (this.t_efficiency && efficiencyStop) {
			this.t_efficiency.stop(true);
		}
	}

	public onOpenRewardHandler():void {

	}

    public get isShowBossReward(): boolean {
        return this._isShowBossReward;
    }


    public set isShowBossReward(value: boolean) {
        this._isShowBossReward = value;
    }

	public destroy(): void {
		//this.currentType = -1;
		//this.currentPanel = null;
		this.controller1 = null;
		this.copyInf = null;
	}


}