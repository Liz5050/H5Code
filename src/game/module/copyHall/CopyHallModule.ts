/**
 * 副本大厅 新
 * @author zhh
 * @time 2018-05-24 19:37:50
 */
class CopyHallModule extends BaseTabModule {
    private c1:fairygui.Controller;
    private tipBtn: fairygui.GButton;

	public constructor() {
		super(ModuleEnum.CopyHall,PackNameEnum.CopyHall)
		
	}
	public initOptUI():void{
        //---- script make start ----
        super.initOptUI();
        this.title = "CopyHall_0";
        this.c1 = this.getController("c1");      
        //---- script make end ----
        

        //注册标签页
		let tabButtonItem: TabButtonItem;
		let panelTypeType: PanelTabType;
		let targetName: string = null;
		for(let item of this.tabBtnList.list._children) {
			tabButtonItem = item as TabButtonItem;
            panelTypeType = tabButtonItem.getData();
			if (panelTypeType == PanelTabType.CopyHallTower) {
				targetName = GuideTargetName.CopyHallModuleCopyHallTowerTab;
			} else {
                targetName = null;
            }
            if (targetName) {
			    GuideTargetManager.reg(targetName, item);
            }
		}
	}

    protected initTabInfo():void{
        this.className = {
            [PanelTabType.CopyHallMaterial]:["CopyHallMaterialsPanel",CopyHallMaterialsPanel],
			[PanelTabType.CopyHallDaily]:["DailyCopyPanel",DailyCopyPanel,PackNameEnum.CopyDaily],
            [PanelTabType.CopyHallTower]:["CopyHallRuneTowerPanel",CopyHallRuneTowerPanel,PackNameEnum.CopyTower],
            //[PanelTabType.CopyHallLegend]:["CopyHallLegendPanel",CopyHallLegendPanel,PackNameEnum.CopyLengend],
            [PanelTabType.Team2]:["Team2Panel",Team2Panel,PackNameEnum.Team2]};

        this.tipBtn = this.getGObject("btn_des").asButton;
        this.tipBtn.addClickListener(this.onOpenTips,this);

	}

    private onOpenTips():void {
        let tipStr:string = LangLegend.LANG31;
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:tipStr});
    }

	public updateAll(data?:any):void{
        if(this.curPanel){
            this.curPanel.updateAll();
        }                          
        this.checkBtnTips();
	}
    public updateRank(data:any[]):void{
        if(this.isTypePanel(PanelTabType.CopyHallTower)){
            (this.curPanel as CopyHallRuneTowerPanel).updateRank(data);
        }
    }
    public updateTowerTips():void{
        this.checkTowerTips();
        if(this.isTypePanel(PanelTabType.CopyHallTower)){
            (this.curPanel as CopyHallRuneTowerPanel).updateTurnableTip();
        }
    }
    public updateTowerReward():void{
        if(this.isTypePanel(PanelTabType.CopyHallTower)){
            (this.curPanel as CopyHallRuneTowerPanel).updateDayReward();
        }
    }

    public updateDailyPanel():void{
        if(this.isTypePanel(PanelTabType.CopyHallDaily)){
            this.curPanel.updateAll();
        }
        this.checkDailyTips();
    }

    public updateExpTickets(): void{
        /*
        if(this.isTypePanel(PanelTabType.CopyHallDaily)){

        }
        */
    }

    public checkBtnTips():void{
        this.setBtnTips(PanelTabType.CopyHallMaterial,CacheManager.copy.checkMaterialsCopyTips());
        this.checkDailyTips();
        this.checkTowerTips();
        // this.setBtnTips(PanelTabType.CopyHallLegend,false/*CacheManager.copy.checkLegendCopyTips()*/);
        this.setBtnTips(PanelTabType.Team2,CacheManager.team2.checkTips());
    }

    public checkDailyTips():void{
        let isDaily:boolean = CacheManager.copy.checkExpCopyTips() || CacheManager.copy.checkDefendTips();
        this.setBtnTips(PanelTabType.CopyHallDaily,isDaily);
    }

    public checkTowerTips():void{
        this.setBtnTips(PanelTabType.CopyHallTower,CacheManager.copy.checkTowerTips());
    }
  

    protected updateSubView():void {        
        if(this.isTypePanel(PanelTabType.CopyHallMaterial) || this.isTypePanel(PanelTabType.CopyHallDaily) || this.isTypePanel(PanelTabType.CopyHallLegend)){
            this.tabBgType = TabBgType.None;
        }else if(this.isTypePanel(PanelTabType.Team2) ){
            this.tabBgType = TabBgType.High;
        }else{
            this.tabBgType = TabBgType.Default;
        }

        if(this.isTypePanel(PanelTabType.Team2)){
            this.title = "CopyHall_3";
        }else{
            this.title = "CopyHall_0";
        }

        this.tipBtn.visible = this.isTypePanel(PanelTabType.CopyHallLegend);
        if (this.isTypePanel(PanelTabType.Team2)) {
            ControllerManager.team2.setModule(this);
        }
    }

    public updateTeamInfo():void {
        if(this.isTypePanel(PanelTabType.Team2)) {
            this.curPanel.updateTeamInfo();
        }
    }

    public updateTeamList():void {
        if(this.isTypePanel(PanelTabType.Team2)) {
            this.curPanel.updateTeamList();
        }
    }
    protected onMainTabChanged(e: any): void {
	}
    protected changeTitle():void{
    }


    protected onSelectBtnChange(): void {
        super.onSelectBtnChange();
        if (this.curType == PanelTabType.Team2) {
            this.descBtn.visible = true;
        }
        else {
            this.descBtn.visible = false;
        }
        
    }

    public clickDesc(): void {
		let desc: string = "";
		if(this.isTypePanel(PanelTabType.Team2)) {
			desc = LangTeam2.LANG28;
		}
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:desc}); 
	}

}