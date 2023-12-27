class GamePlayItemView extends ListRenderer {
	private c1:fairygui.Controller;
	private txt_winer:fairygui.GRichTextField;
	private list_reward:List;
    private loaderBg:GLoader;
    private btnDes:fairygui.GButton;
	private btnEnter:fairygui.GButton;
	private txt_timeDes:fairygui.GRichTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.txt_winer = this.getChild("txt_winer").asRichTextField;
		this.list_reward = new List(this.getChild("list_reward").asList,{isShowName:false});
        this.loaderBg = <GLoader>this.getChild("loader_bg");
        this.btnDes = this.getChild("btn_des").asButton;
		this.btnEnter = this.getChild("btn_enter").asButton;
		this.txt_timeDes = this.getChild("txt_timeDes").asRichTextField;

		this.btnDes.addClickListener(this.onOpenDesHandler,this);
		this.btnEnter.addClickListener(this.onEnterHandler,this);
	}

	public setData(data:any):void{		
		this._data = data;
		this.c1.selectedIndex = data.activeType == EActiveType.EActiveTypeQuestion ? 1 : 0;
		if(data.activeType == EActiveType.EActiveTypeQuestion) {
			//科举答题活动
			this.c1.selectedIndex = 1;
			this.txt_winer.text = `上届状元：<font color = ${Color.Color_6}>${CacheManager.exam.lastChampion}</font>`;//上届状元：玩家名字(Color_6)
		}
		else {
			this.c1.selectedIndex = 0;
			this.txt_winer.text = "";
		}

		this.loaderBg.load(URLManager.getModuleImgUrl("gamePlay/itemBg_" + data.activeType + ".jpg",PackNameEnum.Arena));
		this.txt_timeDes.text = data.openDesc;
		
		this.list_reward.data = RewardUtil.getStandeRewards(data.rewards);
		let isOpen:boolean = CacheManager.arena.checkGamePlayIsOpen(data.activeType);
		if(isOpen) {
			this.btnEnter.title = LangArena.L38;
			App.DisplayUtils.grayButton(this.btnEnter, false,false);
		}
		else {
			if(data.activeType == EActiveType.EActiveTypeQuestion && !ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Question,false)){
				this.btnEnter.title = ConfigManager.mgOpen.getOpenCondDesc(MgOpenEnum.Question);
			}else{
				this.btnEnter.title = LangArena.L37;
			}
			App.DisplayUtils.grayButton(this.btnEnter, true,true);
		}
		CommonUtils.setBtnTips(this.btnEnter,CacheManager.arena.checkGamePlayTips(data.activeType));
	}

	private onOpenDesHandler():void {
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:HtmlUtil.br(this._data.desc)});
	}

	private onEnterHandler():void {
		// if(!ConfigManager.mgOpen.isOpenedByKey(this._data.openKey)) {
		// 	return;//策划需求优先判断活动是否开启，再判断该功能是否开启，各自活动独立判断
		// }
		EventManager.dispatch(LocalEventEnum.GamePlayWindowOpen,this._data);
	}
}