/**
 * 隐藏boss界面
 * @author zhh
 * @time 2018-11-27 20:35:57
 */
class HideBossWindow extends BaseWindow {
    private loaderBg:GLoader;
    private btnGo:fairygui.GButton;
    private listReward:List;
    private curBoss:any;
    protected cnt: fairygui.GComponent;
    protected bossMc: RpgMovieClip;
	public constructor() {
		super(PackNameEnum.HideBoss,"HideBossPanel")

	}
	public initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.btnGo = this.getGObject("btn_go").asButton;
        this.listReward = new List(this.getGObject("list_reward").asList);
        this.cnt = this.getGObject("cnt").asCom;
        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("hide_boss.jpg",PackNameEnum.Boss));
	}

	public updateAll(data?:any):void{
        this.curBoss = data;
        let items:ItemData[] = RewardUtil.getRewards(this.curBoss.showReward);
        this.listReward.setVirtual(items);
        let bossInf:any = ConfigManager.boss.getByPk(this.curBoss.bossCode);
        this.setBossMc(bossInf);
        
	}
    protected setBossMc(bossInf): void {
        let resId: string = bossInf.modelId
        if (!this.bossMc) {
            this.bossMc = ObjectPool.pop('RpgMovieClip');
        }
        this.bossMc.setData(ResourcePathUtils.getRPGGameMonster(), resId, AvatarType.Monster, ELoaderPriority.UI_EFFECT); //9101002  9201203
        this.bossMc.gotoAction(Action.Stand,Dir.BottomLeft);
        let modelScale:number = bossInf?ObjectUtil.getConfigVal(bossInf,"modelScale",0):0;
        modelScale>0?modelScale /= 100:modelScale = 1;
        this.bossMc.scaleX = modelScale*this.bossMc.scaleX;
        this.bossMc.scaleY = modelScale;           
        this.bossMc.x = 200;
        this.bossMc.y = 400;
        this.cnt.displayListContainer.addChild(this.bossMc);
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                if(this.curBoss){
                    EventManager.dispatch(LocalEventEnum.CopyReqEnter,this.curBoss.copyCode);			
                }	
                break;

        }
    }


}