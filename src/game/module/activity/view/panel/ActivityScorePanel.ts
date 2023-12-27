/**
 * 积分兑换活动界面
 * @author zhh
 * @time 2018-09-19 17:59:12
 */
class ActivityScorePanel extends ActivityBaseTabPanel{
    private loaderBg:GLoader;
    private txtReward:fairygui.GRichTextField;
    private btnBoss:fairygui.GButton;
    private btnScore:fairygui.GButton;
    private cnt:fairygui.GComponent;
    private bossMc: RpgMovieClip;

	public constructor() {
		super();
        this.activityType = ESpecialConditonType.ESpecialConditionTypeBossScore;
        this.desTitleStr = "";
	}

	public initOptUI():void{
        super.initOptUI();
        //---- script make start ----
        this.cnt = this.getGObject("cnt").asCom;
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.txtReward = this.getGObject("txt_reward").asRichTextField;
        this.btnBoss = this.getGObject("btn_boss").asButton;
        this.btnScore = this.getGObject("btn_score").asButton;

        this.btnBoss.addClickListener(this.onGUIBtnClick, this);
        this.btnScore.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("score_exc_bg.jpg",PackNameEnum.Activity));
	}

	public updateAll(data?:any):void{
        super.updateAll();
        this.txtReward.text = "积分："+HtmlUtil.html(""+CacheManager.activity.myBossScore,'#0df14b');        
        this.addBossMc();
        if(this.activityInfo){
            CommonUtils.setBtnTips(this.btnScore,CacheManager.activity.checkScoreExcTip(this.activityInfo));
        }
	}
    public updateActicityInfo(info:ActivityInfo):void {
        super.updateActicityInfo(info);
        CommonUtils.setBtnTips(this.btnScore,CacheManager.activity.checkScoreExcTip(this.activityInfo));
    }
    private addBossMc():void{        
        if (!this.bossMc) {
            this.bossMc = ObjectPool.pop('RpgMovieClip');            
        }
        let bossInf:any = ConfigManager.boss.getByPk(2001019);
        let resId: string = bossInf.modelId
        this.bossMc.setData(ResourcePathUtils.getRPGGameMonster(),resId, AvatarType.Monster, ELoaderPriority.UI_EFFECT); //9101002  9201203
        this.bossMc.gotoAction(Action.Stand,Dir.BottomLeft);
        let modelScale:number = bossInf?ObjectUtil.getConfigVal(bossInf,"modelScale",0):0;
        modelScale>0?modelScale /= 100:modelScale = 1;
        this.bossMc.scaleX = modelScale*this.bossMc.scaleX;
        this.bossMc.scaleY = modelScale;
        this.bossMc.x = 355;
        this.bossMc.y = 585;
        (this.cnt.displayObject as egret.DisplayObjectContainer).addChild(this.bossMc);
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnBoss:
                HomeUtil.open(ModuleEnum.Boss,false,{tabType:PanelTabType.WorldBoss});
                break;
            case this.btnScore:
                EventManager.dispatch(LocalEventEnum.ActivityScoreExcWin,this.activityInfo);
                break;

        }
    }
 
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}