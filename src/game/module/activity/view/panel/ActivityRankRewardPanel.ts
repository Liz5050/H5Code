/**
 * 冲榜排名
 */
class ActivityRankRewardPanel extends ActivityBaseTabPanel {
	private c1:fairygui.Controller;
	private bgLoader:GLoader;
	private firstView:ActivityRankFirstView;
	private txt_myRankValue:fairygui.GRichTextField;
	private txt_myRank:fairygui.GRichTextField;
	private txt_rankCondition:fairygui.GRichTextField;
	private btn_rank:fairygui.GButton;

	private rankItems:ActivityRankRewardItem[];
	private btn_goto:fairygui.GButton;
	private list_getWay:List;

	private curRankCfg:any;
	private rankDetailCfgs:any[];
	public constructor() {
		super();
		this.activityType = ESpecialConditonType.ESpecialConditonTypeToplistActiveOpen;
		this.desTitleStr = "";
		// this.isDestroyOnHide = false;
	}

	public initOptUI():void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.bgLoader = this.getGObject("bgLoader") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("activity_bg_4.jpg",PackNameEnum.Activity));
		this.firstView = this.getGObject("first_view") as ActivityRankFirstView;
		this.txt_myRankValue = this.getGObject("txt_myRankValue").asRichTextField;
		this.txt_myRank = this.getGObject("txt_myRank").asRichTextField;
		this.txt_rankCondition = this.getGObject("txt_rankCondition").asRichTextField;
		this.btn_rank = this.getGObject("btn_rank").asButton;
		this.btn_rank.addClickListener(this.onCheckRankHandler,this);
		this.rankItems = [];
		for(let i:number = 0; i < 3; i++) {
			let item:ActivityRankRewardItem = this.getGObject("rank_item" + i) as ActivityRankRewardItem;
			this.rankItems.push(item);
		}

		this.btn_goto = this.getGObject("btn_goto").asButton;
		this.btn_goto.addClickListener(this.gotoUpgradeHandler,this);

		this.list_getWay = new List(this.getGObject("list_getWay").asList);
		this.list_getWay.list.scrollItemToViewOnClick = false;
	}

	public updateAll():void {
		super.updateAll();
		this.curRankCfg = ConfigManager.toplistActive.getCurRankCfg();
		if(!this.curRankCfg) return;
		if(this.curRankCfg.getWay) {
			this.list_getWay.data = this.curRankCfg.getWay.split("#");
		}
		else {
			this.list_getWay.data = null;
		}
		this.rankDetailCfgs = ConfigManager.toplistActiveDatail.getTopListDetailCfgByType(this.curRankCfg.toplist);
		for(let i:number = 0; i < this.rankDetailCfgs.length; i++) {
			let cfg:any = this.rankDetailCfgs[i];
			if(cfg.idx == 1) {
				this.firstView.setData(cfg);
			}
			else if(cfg.idx <= 4) {
				this.rankItems[cfg.idx - 2].setData(cfg);
			}
		}

		this.txt_myRank.text = "我的排名：";
		let rankStr:string[] = CacheManager.activity.getActivityRankStr(this.curRankCfg.toplist);
		this.txt_myRankValue.text = rankStr[0];
		if(!this.curRankCfg.minCond) {
			this.txt_rankCondition.text = "";
			this.txt_myRank.verticalAlign = fairygui.VertAlignType.Middle;
			this.txt_myRankValue.verticalAlign = fairygui.VertAlignType.Middle;
		}
		else {
			this.txt_rankCondition.text = "最低上榜条件：" + HtmlUtil.html(this.curRankCfg.minCond + rankStr[1],Color.Color_2);
			this.txt_myRank.verticalAlign = fairygui.VertAlignType.Top;
			this.txt_myRankValue.verticalAlign = fairygui.VertAlignType.Top;
		}
		EventManager.dispatch(LocalEventEnum.GetRankList,this.curRankCfg.toplist);
		this.c1.selectedIndex = this.curRankCfg.toplist == EToplistType.EToplistTypePlayerRechargeOpen ? 1 : 0;
	}

	public updateActicityInfo(info:ActivityInfo):void {
		super.updateActicityInfo(info);
	}

	/**
	 * 冲榜排名更新
	 */
	public updateActivityRank(data:any[]):void {
		let myRank:number = -1;
		if(!data || data.length == 0) {
			this.firstView.updateRankInfo(null);
		}
		else {
			this.firstView.updateRankInfo(data[0]);
			for(let i:number = 0; i < data.length; i++){
				if(data[i].entityId_I == CacheManager.role.entityInfo.entityId.id_I && 
					data[i].entityName_S == CacheManager.role.entityInfo.name_S){
					myRank = data[i].rank_I;
					// rankData = data[i];
					break;
				}
			}
		}

		// for(let i:number = 0; i < this.rankItems.length; i++) {
		// 	if(data && i + 1 < data.length) {
		// 		this.rankItems[i].updateRankInfo(data[i + 1]);
		// 	}
		// 	else {
		// 		this.rankItems[i].updateRankInfo(null);
		// 	}
		// }
		
		if(myRank == -1) {
			this.txt_myRank.text = "我的排名：" + HtmlUtil.html("暂未上榜",Color.Color_2);
		}
		else {
			this.txt_myRank.text = "我的排名：" + HtmlUtil.html(myRank + "",Color.Color_2);
		}
	}

	/**
	 * 查看排行榜
	 */
	private onCheckRankHandler():void {
		if(!this.curRankCfg) return;
		EventManager.dispatch(LocalEventEnum.CheckActivityRank,this.curRankCfg.toplist);
	}

	/**前往升级 */
	private gotoUpgradeHandler():void {
		if(!this.curRankCfg || !this.curRankCfg.gotoUpgrade) {
			return;
		}
		let linkStr:string[] = this.curRankCfg.gotoUpgrade.split(",");
		let moduleId:ModuleEnum = ModuleEnum[linkStr[0]];
		if(moduleId == ModuleEnum.Recharge) {
			HomeUtil.openRecharge();
		}
		else {
			let tabType:string = "";
			if(linkStr.length > 0) {
				tabType = linkStr[1];
			}
			EventManager.dispatch(UIEventEnum.ModuleOpen,moduleId,{tabType:PanelTabType[tabType]},ViewIndex.Two);
		}
	}

	public hide():void {
		super.hide();
		this.firstView.hide();
	}
}