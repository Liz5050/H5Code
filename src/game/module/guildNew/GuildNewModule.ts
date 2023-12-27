/**
 * 新的帮派系统
 * @author zhh
 * @time 2018-07-16 21:51:45
 */
class GuildNewModule extends BaseTabModule {
	//private imgBg:fairygui.GImage;
	//private imgBtnbg:fairygui.GImage;
	private initBgIdx:number;
	private initBtnBgIdx:number;
	private btnDesc:fairygui.GButton;

	public constructor() {
		super(ModuleEnum.GuildNew,PackNameEnum.GuildNew);		
	}
	public initOptUI():void {
		super.initOptUI();
		this.btnDesc = this.getGObject("btn_des").asButton;
		//this.imgBg = this.getGObject("img_bg").asImage;
		//this.imgBtnbg = this.getGObject("img_btnbg").asImage;
		//this.initBgIdx = this.imgBg.parent.getChildIndex(this.imgBg);
		//this.initBtnBgIdx = this.imgBg.parent.getChildIndex(this.imgBtnbg);
		this.indexTitle = false;
		this.btnDesc.addClickListener(this.onShowDesc,this);
	}
	protected initTabInfo():void {
		this.className = {
			[PanelTabType.GuildNewBasics]:["GuildNewBasicsPanel",GuildNewBasicsPanel,PackNameEnum.GuildNewBasics],
			[PanelTabType.GuildNewManager]:["GuildNewManagerPanel",GuildNewManagerPanel,PackNameEnum.GuildNewManager],
			[PanelTabType.GuildNewMember]:["GuildNewMemberPanel",GuildNewMemberPanel,PackNameEnum.GuildNewMember],
			[PanelTabType.GuildNewList]:["GuildNewListPanel",GuildNewListPanel,PackNameEnum.GuildNewMember]
		};
	}

	public updateAll(data?:any):void{
		this.updateTips();
	}

	public updateBasics():void{
		if(this.isTypePanel(PanelTabType.GuildNewBasics)){
			this.curPanel.updateAll();
		}
	}

	public updateManagerPanel():void{
		if(this.isTypePanel(PanelTabType.GuildNewManager)){
			(this.curPanel as GuildNewManagerPanel).updateAll();
		}
	}

	public updateLogs():void{
		if(this.isTypePanel(PanelTabType.GuildNewManager)){
			(this.curPanel as GuildNewManagerPanel).updateLogs();
		}
	}

	public updateBasicsLookupEff(isAdd:boolean):void{
		if(this.isTypePanel(PanelTabType.GuildNewBasics)){
			(this.curPanel as GuildNewBasicsPanel).updateLookEffect(isAdd);
		}
	}

	public updateList(data:any):void{
		if(this.isTypePanel(PanelTabType.GuildNewList)){
			(this.curPanel as GuildNewListPanel).updateAll(data);
		}
	}

	public upateMember(data:any):void{
		if(this.isTypePanel(PanelTabType.GuildNewBasics)){
			(this.curPanel as GuildNewBasicsPanel).updateMember(data);
		}
		if(this.isTypePanel(PanelTabType.GuildNewMember)){
			(this.curPanel as GuildNewMemberPanel).updateMember(data);
		}
	}

	public updateTips():void{
		this.setBtnTips(PanelTabType.GuildNewBasics,CacheManager.guildNew.checkGuildLobbyTip());
		if(this.isTypePanel(PanelTabType.GuildNewBasics)) {
			this.curPanel.checkDonateTip();
		}
	}

	protected updateSubView():void {
		if(this.isTypePanel(PanelTabType.GuildNewList) || this.isTypePanel(PanelTabType.GuildNewManager)){
			this.tabBgType = TabBgType.None;
		}else{
			this.tabBgType = TabBgType.Default;
			//this.imgBg.parent.setChildIndex(this.imgBg,this.initBgIdx);
			//this.imgBtnbg.parent.setChildIndex(this.imgBtnbg,this.initBtnBgIdx);
		}

		if(this.isTypePanel(PanelTabType.GuildNewBasics)){
			EventManager.dispatch(LocalEventEnum.GuildNewReqGuildInfo,{guildId:0});
			EventManager.dispatch(LocalEventEnum.GuildNewReqGuildMember,{guildId:0});
			EventManager.dispatch(LocalEventEnum.GuildNewReqGuildAplyList,{guildId:0});
		}
		if(this.isTypePanel(PanelTabType.GuildNewMember)){
			EventManager.dispatch(LocalEventEnum.GuildNewReqGuildMember,{guildId:0});
			
		}
		if(this.isTypePanel(PanelTabType.GuildNewManager)){
			EventManager.dispatch(LocalEventEnum.GuildNewReqGuildInfo,{guildId:0});
			EventManager.dispatch(LocalEventEnum.GuildNewReqGuildLog,ConfigManager.const.guildLogMaxNum,0);
		}
		if(this.isTypePanel(PanelTabType.GuildNewList)){
			EventManager.dispatch(LocalEventEnum.GuildNewReqSearch,{ "name": "", "includeFull": true });
		}
	}

	private onShowDesc(e:any):void{
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangGuildNew.L26});
	}

}