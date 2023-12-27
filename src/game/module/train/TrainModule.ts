/**
 * 历练模块窗口
 * @author zhh
 * @time 2018-06-11 19:32:50
 */
class TrainModule extends BaseTabModule {
    /*
    private c1: fairygui.Controller;
    private btnGodweapon: fairygui.GButton;
    private btnMedal: fairygui.GButton;
    private btnIllustrated: fairygui.GButton;
    private tabCtrl:TabPanelCtrl;
    */
    public constructor() {
        super(ModuleEnum.Train, PackNameEnum.Train)

    }
    public initOptUI(): void {
        super.initOptUI();
        this.guideRegTab(GuideTargetName.TrainModuleNobilityTab, PanelTabType.TrainNobility);
        
    }
    protected initTabInfo():void{
        this.className = {
            [PanelTabType.TrainDaily]:["TrainDailyMissionPanel",TrainDailyMissionPanel,PackNameEnum.TrainNobilityPanel],            
            [PanelTabType.TrainNobility]:["TrainNobilityPanel",TrainNobilityPanel,PackNameEnum.TrainNobilityPanel],            
            [PanelTabType.TrainMedal]:["TrainMedalPanel",TrainMedalPanel,PackNameEnum.TrainMedalPanel],
            [PanelTabType.GamePlay]:["GamePlayPanel",GamePlayPanel,PackNameEnum.GamePlay]
        }			
	}

    protected addListenerOnShow(): void {
		super.addListenerOnShow()
		this.addListen1(LocalEventEnum.ActivityWarTipsUpdate,this.updateGamePlayTips,this);
        this.addListen1(UIEventEnum.ExamBtnTips,this.updateGamePlayTips,this);
        this.addListen1(UIEventEnum.SceneMapUpdated,this.updateGamePlayTips,this);
    }

    public updateAll(data?: any): void {
        // if(!data || !data.tabType){
        //     if(ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.TrainNobility])){
        //         this.setIndex(PanelTabType.TrainNobility);
        //     }else{
        //         this.setIndex(PanelTabType.TrainGodWeapon);
        //     }
            
        // }
        this.updateBtnTips();
    }
    
    
    public updateNobility(delayScore:boolean=true):void{
        if(this.isTypePanel(PanelTabType.TrainNobility) || this.isTypePanel(PanelTabType.TrainDaily)){
            this.curPanel.updateAll({delayScore:delayScore});
        }
        this.updateNobilityTips();
    }

    public updateMedal():void{
        if(this.isTypePanel(PanelTabType.TrainMedal)){
            this.curPanel.updateAll();
        }
        this.updateMedalTips();
    }

    public updateBtnTips():void{
        this.updateNobilityTips();
        this.updateMedalTips();
        this.updateGamePlayTips();
    }

    public onPackPropChange():void {
    }

    protected updateSubView():void{
        this.descBtn.visible = this.curType==PanelTabType.TrainNobility;
    }

    protected clickDesc(): void {
        if(this.curType==PanelTabType.TrainNobility){
            EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:HtmlUtil.colorSubstitude(LangTrain.L17)});
        }  		
	}
    
    private updateNobilityTips():void{
        this.setBtnTips(PanelTabType.TrainNobility,CacheManager.nobility.checkTips());
        this.setBtnTips(PanelTabType.TrainDaily,CacheManager.daily.checkTips());
    }
    private updateMedalTips():void{
        this.setBtnTips(PanelTabType.TrainMedal,CacheManager.medal.checkTips());
    }
    private updateGamePlayTips():void {
        this.setBtnTips(PanelTabType.GamePlay,CacheManager.train.checkGamePlayTips());
        if(this.isTypePanel(PanelTabType.GamePlay)) {
            this.curPanel.updateAll();
        }
    }

    public showGetTrainScoreEffet(gx:number,gy:number):void{        
        if(this.isTypePanel(PanelTabType.TrainDaily)){
            (this.curPanel as TrainDailyMissionPanel).showEff(gx,gy);
        }
    }

}