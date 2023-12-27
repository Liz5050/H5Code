/**
 * 诛仙塔副本
 * @author zhh
 * @time 2018-06-05 17:28:35
 */
class CopyHallRuneTowerPanel extends BaseTabView{
    private loadBg:GLoader;
    private loaderRankBg:GLoader;
    private txtDayGet:fairygui.GTextField;
    //private txtFloorreward:fairygui.GTextField;
    private txtRankcheck:fairygui.GRichTextField;
    private txtTime:fairygui.GRichTextField;
    private txtLimit:fairygui.GTextField;
    //private txtFlloor:fairygui.GRichTextField;
    private txtTurntable:fairygui.GRichTextField;
    private btnChallenge:fairygui.GButton;
    private btnTurntable:fairygui.GButton;
    private btnDailyreward:fairygui.GButton;
    private listReward:List;
    private listNewreward:List;
    private listRank:List;
	//private c1:fairygui.Controller;
    private _isCurPassFloor:boolean = false;
    private curPassFloor:number = 0;
    private curSelectFloor:number = 0;	
	//private imgLeft:fairygui.GImage;
    //private imgRight:fairygui.GImage;
    private txtTarget:fairygui.GTextField;
	private towerFloors:TowerFloorInfo[];

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super();
	}

	public initOptUI():void{
        //---- script make start ----
		//this.c1 = this.getController("c1");
        this.loadBg = <GLoader>this.getGObject("bg_tower");
        this.loaderRankBg = <GLoader>this.getGObject("loader_rankbg");
		//let towerInfo:fairygui.GComponent = this.getGObject("towerInfo").asCom;
        //this.imgLeft = towerInfo.getChild("img_left").asImage;
        //this.imgRight = towerInfo.getChild("img_right").asImage;
		//this.txtFlloor = towerInfo.getChild("txt_flloor").asRichTextField;        
        //this.txtFloorreward = this.getGObject("txt_floorReward").asTextField;
        this.txtRankcheck = this.getGObject("txt_rankCheck").asRichTextField;
        this.txtTime = this.getGObject("txt_time").asRichTextField;
        this.txtLimit = this.getGObject("txt_limit").asTextField;
        this.txtTarget = this.getGObject("txt_target").asTextField;
        this.txtDayGet = this.getChild("txt_dayget").asRichTextField;
        this.txtTurntable = this.getGObject("txt_turntable").asRichTextField;
        this.btnChallenge = this.getGObject("btn_challenge").asButton;
        this.btnTurntable = this.getGObject("btn_turntable").asButton;
        this.btnDailyreward = this.getGObject("btn_dailyReward").asButton;
        this.listReward = new List(this.getGObject("list_reward").asList,{isShowName:true});
        this.listNewreward = new List(this.getGObject("list_newReward").asList);
        this.listRank = new List(this.getGObject("list_rank").asList);
		this.txtTarget.text = "";
        this.btnChallenge.addClickListener(this.onGUIBtnClick, this);
        this.btnTurntable.addClickListener(this.onGUIBtnClick, this);
        this.btnDailyreward.addClickListener(this.onGUIBtnClick, this);
        this.txtRankcheck.addEventListener(egret.TextEvent.LINK,this.onClickRankTxt,this);
        //---- script make end ----
		this.loadBg.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.CopyTower));
		this.loaderRankBg.load(URLManager.getModuleImgUrl("rankBg.png",PackNameEnum.CopyTower));
		this.txtRankcheck.text = HtmlUtil.html("查看排行",Color.Green,false,0,"rank",true);
		this.listNewreward.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickRuneItem,this);

		this.towerFloors = [];
		for(let i:number = 0;i<5;i++){
			let info:TowerFloorInfo = new TowerFloorInfo(this.getGObject("tower_info"+i).asCom);
			this.towerFloors.push(info);
		}

		GuideTargetManager.reg(GuideTargetName.CopyHallRuneTowerPanelChallengeBtn, this.btnChallenge);

	}

	public updateAll(data?:any):void{
        var floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
		let topFloor:number = ConfigManager.mgRuneCopy.MAX_FLOOR;
        this.curPassFloor = floor;
		let isTop:boolean = floor>=topFloor;
		this.btnChallenge.enabled = !isTop; 
        floor+=1;
        floor = Math.min(floor,topFloor);
		//this.txtFlloor.text = "第"+floor+"层"; 
        let curFloorInf:any = ConfigManager.mgRuneCopy.getByPk(floor);       
        this.selectFloorHandler(curFloorInf);
		this.updateDayReward();
		this.updateFloors();
		this.updateTurnableTip();
		EventManager.dispatch(LocalEventEnum.GetRankList,EToplistType.EToplistTypeCopyMgRune);
		this.txtTurntable.visible = this.btnTurntable.visible = CacheManager.towerTurnable.isOpen();
	}
	public updateRank(data:any[]):void{
		data = data.slice(0,3);
		this.listRank.setVirtual(data);
	}
	public updateTurnableTip():void{
		CommonUtils.setBtnTips(this.btnTurntable,CacheManager.towerTurnable.isCanLottry());
	}
	public updateDayReward():void{
		let isTip:boolean = CacheManager.copy.isRunTowerReward;
		CommonUtils.setBtnTips(this.btnDailyreward,isTip);
		if(isTip){
			this.txtDayGet.text =LangCopyHall.L13;
		}else{
			this.txtDayGet.text =LangCopyHall.L14;
		}
		
	}

	/**选中某层后的处理函数 */
	public selectFloorHandler(floorInf: any): void {
		var floor: number = 0;
		var towerInf: any;
		if (typeof floorInf == "number") {
			floor = floorInf;
			towerInf = ConfigManager.mgRuneCopy.getByPk(floor)
		} else {
			floor = floorInf.floor;
			towerInf = floorInf;
		}
		this._isCurPassFloor = floor <= this.curPassFloor;
		this.btnChallenge.enabled = !this._isCurPassFloor;
		if (floor > 0 && this.curSelectFloor != floor) {
			this.curSelectFloor = floor;
			!towerInf ? towerInf = ConfigManager.mgRuneCopy.getByPk(floor) : null;
			var openInf: any;
			if (!this._isCurPassFloor && towerInf.openType) {
				//当前选中层就可以开启符文
				openInf = towerInf;
			} else {
				//寻找最近一个可以开启符文的层数据 openTypeCode
				openInf = ConfigManager.mgRuneCopy.getOpenTypeInf(floor);
			}
			if (openInf) {
				var openDatas: any[] = [];
				if(openInf.openTypeCode){
					var openTypeCodes: string[] = (<string>openInf.openTypeCode).split("#");					
					for (var i: number = 0; i < openTypeCodes.length - 1; i++) {
						if(!openTypeCodes[i]){
							continue;
						}
						openDatas.push({ "item": new ItemData(Number(openTypeCodes[i])) })
					}
				}								
				if(openInf.openHole){
					openDatas.push({ type: openInf.openHole });
				}
				this.listNewreward.data = openDatas; //更新符文列表显示
				this.txtTarget.text = openInf.floor+"";
			} else {
				this.listNewreward.data = [];
			}
			var itemDatas: ItemData[] = [];
			/*
			var itemIds: string[] = (<string>towerInf.rewardShow).split("#");
			itemIds.pop();
			var len: number = itemIds.length;
			
			if (len > 0) {
				for (var i: number = 0; i < len; i++) {
					var itemData: ItemData = new ItemData(Number(itemIds[i]));
					i == len - 1 ? itemData.itemAmount = towerInf.runeExp : null; //最后一个肯定是符文经验										
					itemDatas.push(itemData);
				}
			}
			*/
			if(towerInf.rewardShow){
				itemDatas = RewardUtil.getStandeRewards(towerInf.rewardShow);
			}
			this.listReward.data = itemDatas; //更新奖励列表显示
		}		 
		//this.txtFloorreward.text = floor+"";
		let roleStatu:number = CacheManager.role.getRoleState();
		let limitRoleState:number = towerInf.roleState?towerInf.roleState:0;
		let isOk:boolean = roleStatu>=limitRoleState; 
		this.txtLimit.text = App.StringUtils.substitude(LangCopyHall.L28,limitRoleState);
		this.txtLimit.visible = !isOk;
		this.btnChallenge.visible = isOk;
		 
	}

	private updateFloors():void{
		let len:number = this.towerFloors.length;
		let tarFloor:number = this.curPassFloor+1; //即将要挑战的层 
		let maxFloor:number = Math.min(tarFloor+2,ConfigManager.mgRuneCopy.MAX_FLOOR);
		maxFloor = Math.max(maxFloor,len);
		tarFloor = Math.min(ConfigManager.mgRuneCopy.MAX_FLOOR,tarFloor);
		let minFloor:number = maxFloor - len+1;		
		for(let i:number = 0;i<len;i++){
			let info:TowerFloorInfo = this.towerFloors[i];
			info.updateAll({floor:minFloor,tarFloor:tarFloor,curPassFloor:this.curPassFloor});
			minFloor++;
			
		}
	}

	private onClickRankTxt(e:egret.TouchEvent):void{
		//Tip.showTip("功能未开启");
		//HomeUtil.open(ModuleEnum.Rank,false,{type:EToplistType.EToplistTypeCopyMgRune});
		if(!CacheManager.copy.isLookupTowerRank){
			CacheManager.copy.isLookupTowerRank = true;
			EventManager.dispatch(LocalEventEnum.GetRankList,EToplistType.EToplistTypeCopyMgRune);
		}		
	}
	private onClickRuneItem(e:fairygui.ItemEvent):void{
		let item:TowerRewardItem =<TowerRewardItem>e.itemObject;
		 let data:any = item.getData();
		 if(data.item){
			 ToolTipManager.showByCode(data.item);
		 }
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnChallenge:
				//进入副本
				EventManager.dispatch(LocalEventEnum.CopyReqEnter, CopyEnum.CopyTower);
				EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CopyHall);
                break;
            case this.btnTurntable:
				HomeUtil.open(ModuleEnum.TowerTurntable,false);
                break;
            case this.btnDailyreward:
				EventManager.dispatch(LocalEventEnum.CopyGetTowerDayRewardForOpen);				
                break;			

        }
    }


}