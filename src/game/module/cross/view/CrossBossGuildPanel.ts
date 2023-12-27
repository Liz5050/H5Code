/**
 * 仙盟抢boss
 * @author zhh
 * @time 2018-12-10 11:38:02
 */
class CrossBossGuildPanel extends BaseTabView{
    private loaderBg:GLoader;
    private loaderName:GLoader;
    private btnAttend:fairygui.GButton;
    private btnBelong:fairygui.GButton;
    private btnGo:fairygui.GButton;
    private btnLeft:fairygui.GButton;
    private btnRight:fairygui.GButton;
    private txtTime:fairygui.GTextField;
    private listBoss:List;
    private cnt:fairygui.GComponent;
    protected bossMc: RpgMovieClip;

	public constructor() {
		super();
	}

	public initOptUI():void{
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderName = <GLoader>this.getGObject("loader_name");
        this.btnAttend = this.getGObject("btn_attend").asButton;
        this.btnBelong = this.getGObject("btn_belong").asButton;
        this.btnGo = this.getGObject("btn_go").asButton;
        this.btnLeft = this.getGObject("btn_left").asButton;
        this.btnRight = this.getGObject("btn_right").asButton;
        this.listBoss = new List(this.getGObject("list_boss").asList);
        this.cnt = this.getGObject("cnt").asCom;
        this.txtTime = this.getGObject("txt_time").asTextField;

        this.btnAttend.addClickListener(this.onGUIBtnClick, this);
        this.btnBelong.addClickListener(this.onGUIBtnClick, this);
        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        this.btnLeft.addClickListener(this.onGUIBtnClick, this);
        this.btnRight.addClickListener(this.onGUIBtnClick, this);
        this.listBoss.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listBoss.setSrcollStatus(4,this.setBtnShow,this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("bg3.jpg",PackNameEnum.CrossBoss));
        let info:any = ConfigManager.const.getByPk("GuildBossIntruderCrossOpenPerDayTime");
        if(info){
            this.txtTime.text = HtmlUtil.colorSubstitude(LangBoss.L28,info.constValue+":"+info.constValueEx);
        }
        
	}

	public updateAll(data?:any):void{
        let bossInfos:any[] = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgCrossGuildBossIntruder); //实际是根据服务器推回来的
        this.listBoss.setVirtual(bossInfos);
        this.listBoss.selectedIndex = 0;
        if(this.listBoss.selectedData){
            this.selectBoss(this.listBoss.selectedData);
        }
	}
	 protected setBossMc(mgGameBoss:any): void {
        let bossInf:any = ConfigManager.boss.getByPk(mgGameBoss.bossCode);
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
        this.cnt.displayListContainer.addChild(this.bossMc);
    }

    private setBtnShow(status:number):void{
        let isMid:boolean = status==List.SCROLL_MIDDLE;
        this.btnLeft.visible = status==List.SCROLL_LEFT || isMid; 
        this.btnRight.visible = status==List.SCROLL_RIGHT || isMid; 
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnAttend: //参与
                this.showReward(CrossBossGuildRewardWin.TYPE_JOIN);
                break;
            case this.btnBelong: //归属
                this.showReward(CrossBossGuildRewardWin.TYPE_REWARD);
                break;
            case this.btnGo:
                //挑战boss
                if(!CacheManager.guildNew.isJoinedGuild()){
                    Tip.showLeftTip(LangBoss.L26);
                    EventManager.dispatch(LocalEventEnum.GuildNewReqSearch,{ "name": "", "includeFull": true } );
                    return;
                }       
                if(CacheManager.crossBoss.isHasSelectGuildBoss()){
                    this.dealChallenge();
                }else{
                    Alert.alert(LangBoss.L25,this.dealChallenge,this);
                }                
                break;
            case this.btnLeft:
                this.listBoss.changPage(false);
                break;
            case this.btnRight:
                this.listBoss.changPage(true);
                break;

        }
    }

    private dealChallenge():void{
        EventManager.dispatch(LocalEventEnum.CrossReqGuildBoss,this.listBoss.selectedData.copyCode,this.listBoss.selectedData.mapId);
    }

    private showReward(type:number):void{
        if(this.listBoss.selectedData){
            let arg:any = {type:type,from:CrossBossGuildRewardWin.FROM_UI,codeOrInfo:this.listBoss.selectedData};
            EventManager.dispatch(LocalEventEnum.CrossBossGuildRewardWin,arg);
        }        
    }

    private selectBoss(mgBoss:any):void{
        this.setBossMc(mgBoss);
        let isCan:boolean = CacheManager.crossBoss.isCanEnterGuildBoss(mgBoss.bossCode);
        App.DisplayUtils.grayButton(this.btnGo,!isCan,!isCan);
        this.loaderName.load(URLManager.getModuleImgUrl(`${mgBoss.bossCode}.png`,PackNameEnum.CrossBoss));
    }

    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            let mgBoss:any = item.getData();
            this.selectBoss(mgBoss);
            if( CacheManager.crossBoss.isHasSelectGuildBoss() &&                
                !CacheManager.crossBoss.isCurSelectGuildBoss(mgBoss.bossCode) ){
                let bossInfo:any = ConfigManager.boss.getByPk(CacheManager.crossBoss.curCrossGuildBoss); 
                Tip.showLeftTip(App.StringUtils.substitude(LangBoss.L27,bossInfo.name));
            }
        }   
    }


}