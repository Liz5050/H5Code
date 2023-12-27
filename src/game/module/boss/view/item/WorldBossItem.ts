class WorldBossItem extends ListRenderer {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private c3:fairygui.Controller;
    private loader:GLoader;
    private txt_time:fairygui.GTextField;
    private txt_limit:fairygui.GTextField;
    private txt_name:fairygui.GTextField;
    private txt_level:fairygui.GTextField;
    private btn_challenge:fairygui.GButton;
    private list_reward:List;
    private hpProgressBar:UIProgressBar;
    private txt_price:fairygui.GTextField;
    private btn_revive:fairygui.GButton;

    private hasTimer:boolean;
    private leftTime:number;
    private curTime:number;

    private leftRefreshNum:number = 0;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.c3 = this.getController("c3");
        this.c3.setSelectedIndex(0);
        this.loader = <GLoader>this.getChild("loader");
        this.txt_time = this.getChild("txt_time").asTextField;
        this.txt_limit = this.getChild("txt_limit").asTextField;
        this.txt_name = this.getChild("txt_name").asTextField;
        this.txt_level = this.getChild("txt_level").asTextField;
        this.btn_challenge = this.getChild("btn_challenge").asButton;
        this.list_reward = new List(this.getChild("list_reward").asList);
        this.hpProgressBar = this.getChild("hp_progressBar") as UIProgressBar;
        this.hpProgressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Boss,"hp_progressBar"),URLManager.getPackResUrl(PackNameEnum.Boss,"hp_progressBg"),318,37,11,8,UIProgressBarType.Mask);
        this.hpProgressBar.labelType = BarLabelType.Percent;
        this.hpProgressBar.labelSize = 20;

        this.txt_price = this.getChild("txt_price").asTextField;
        this.btn_revive = this.getChild("btn_revive").asButton;
        this.btn_revive.addClickListener(this.onReviveBossHandler,this);

        this.btn_challenge.addClickListener(this.onGUIBtnClick, this);
	}

	public setData(data:any):void {		
		this._data = data;
        let bossCode:number = data.bossCode;
        let bossConfig:any = ConfigManager.boss.getByPk(bossCode);
        let gameBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
        let bossInfo:any = CacheManager.bossNew.getBossInfoByCode(bossCode);
        let roleLv:number = CacheManager.role.getRoleLevel();
        this.leftRefreshNum = CacheManager.bossNew.leftRefreshNum;

        this.txt_name.text = bossConfig.name;
        
        if(gameBoss && gameBoss.roleState) {
            //转生等级限制
            this.txt_limit.text = App.StringUtils.substitude(LangBoss.L18,gameBoss.roleState);
            this.txt_level.text = App.StringUtils.substitude(LangBoss.L17,gameBoss.roleState);
        }
        else {
            this.txt_limit.text = App.StringUtils.substitude(LangBoss.L20,bossConfig.level);
            this.txt_level.text = "Lv." + bossConfig.level;
        }
        
        this.c1.selectedIndex = CacheManager.bossNew.isFollowBoss(bossCode) ? 1 : 0;

        let url:string = URLManager.getIconUrl(bossConfig.avatarId + "",URLManager.AVATAR_ICON);
		this.loader.load(url);

        let itemDatas:ItemData[] = CommonUtils.configStrToArr(data.showReward);
        for(let i:number = 0; i < itemDatas.length; i++) {
            let itemCfg:any = itemDatas[i].getItemInfo();
            if(!itemCfg || itemCfg.type == EProp.EPropGodEquipfragment) {
                //神装碎片奖励不显示在boss界面（策划需求）
                itemDatas.splice(i,1);
                break;
            }
        }   
        // this.list_reward.scrollToView(0);
        this.list_reward.data = itemDatas;
        // this.c3.selectedIndex = 0;
        if(bossInfo) {
            let isOpened:boolean = CacheManager.bossNew.getBossIsOpened(bossCode);
            if(!CacheManager.bossNew.isBossCd(bossCode)) {
                //存活
                this.c2.selectedIndex = isOpened ? 0 : 1;
                if(this.hasTimer) {
                    this.removeTimer();
                }
                if(gameBoss.floor) {
                    this.hpProgressBar.setValue(1,1);
                }
                else {
                    this.hpProgressBar.setValue(Number(bossInfo.valEx2_L64),Number(bossInfo.valEx1_L64),true,true);
                }
            }   
            else {
                //死亡
                this.hpProgressBar.setValue(0,1);
                this.c2.selectedIndex = isOpened ? 2 : 3;
                // this.c3.selectedIndex = isOpened && gameBoss.copyCode == CopyEnum.CopyWorldBoss ? 1 : 0;//复活视图显示
                this.btn_revive.title = App.StringUtils.substitude(LangBoss.L21,this.leftRefreshNum);
                this.leftTime = bossInfo.dateVal_DT - CacheManager.serverTime.getServerTime();
                if(this.leftTime > 0) {
                    this.txt_time.text = App.StringUtils.substitude(LangBoss.L22,App.DateUtils.getFormatBySecond(this.leftTime));
                    if(!this.hasTimer){
                        this.hasTimer = true;
                        this.curTime = egret.getTimer();
                        App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
                    }
                }
            }
        }
        if (this._data.copyCode == CopyEnum.WorldBossGuide) {
            this.c2.selectedIndex = 0;
        }
	}

    private onTimerHandler():void {
        let time:number = egret.getTimer();
        this.leftTime -= Math.round((time - this.curTime) / 1000);
        this.curTime = time;
        if(this.leftTime <= 0) {
            this.removeTimer();
            return; 
        }
        this.txt_time.text = App.StringUtils.substitude(LangBoss.L22,App.DateUtils.getFormatBySecond(this.leftTime));
    }

    private onGUIBtnClick(e:egret.TouchEvent):void{
        if (this._data.copyCode == CopyEnum.WorldBossGuide) {
            EventManager.dispatch(LocalEventEnum.CopyReqEnter, this._data.copyCode);
            return;
        }
        EventManager.dispatch(LocalEventEnum.BossReqEnterCopy,this._data.copyCode,this._data.mapId,this._data.bossCode);
    }

    private onReviveBossHandler():void {
        if(this.leftRefreshNum <= 0) {
            Tip.showTip(LangBoss.L23);
            return;
        }
        let needMoney:number = ConfigManager.const.getConstValue("RefreshWorldBossCost");
        if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,needMoney)) {
            EventManager.dispatch(LocalEventEnum.BossReqEnterCopy,this._data.copyCode,this._data.mapId,this._data.bossCode,true);
        }
    }

    public removeTimer():void {
        App.TimerManager.remove(this.onTimerHandler,this);
        this.hasTimer = false;
    }
}