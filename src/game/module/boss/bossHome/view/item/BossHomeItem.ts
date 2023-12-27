class BossHomeItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loader:GLoader;
    private txtLevel:fairygui.GTextField;
    private txtName:fairygui.GTextField;
    private btnChallenge:fairygui.GButton;
    private listReward:List;
    private hpProgressBar:UIProgressBar;

    private hasTimer:boolean;
    private leftTime:number;
    private curTime:number;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.loader = <GLoader>this.getChild("loader");
        this.txtLevel = this.getChild("txt_level").asTextField;
        this.txtName = this.getChild("txt_name").asTextField;
        this.btnChallenge = this.getChild("btn_challenge").asButton;
        this.listReward = new List(this.getChild("list_reward").asList);

        this.hpProgressBar = this.getChild("hp_progressBar") as UIProgressBar;
        this.hpProgressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Boss,"hp_progressBar"),URLManager.getPackResUrl(PackNameEnum.Boss,"hp_progressBg"),318,37,11,8,UIProgressBarType.Mask);
        this.hpProgressBar.labelType = BarLabelType.Percent;
        this.hpProgressBar.labelSize = 20;

        this.btnChallenge.addClickListener(this.onGUIBtnClick, this);
	}

	public setData(data:any):void{		
		this._data = data;

        let bossCode:number = data.bossCode;
        let bossConfig:any = ConfigManager.boss.getByPk(bossCode);
        let gameBoss:any = ConfigManager.mgGameBoss.getByPk(bossCode);
        let bossInfo:any = CacheManager.bossNew.getBossInfoByCode(bossCode);
        let roleLv:number = CacheManager.role.getRoleLevel();
        this.txtName.text = bossConfig.name;
        if(gameBoss && gameBoss.roleState) {
            //转生等级限制
            // this.txt_limit.text = gameBoss.roleState + "转开启";
            this.txtLevel.text = gameBoss.roleState + "转";
        }
        else {
            // this.txt_limit.text = bossConfig.level + "级开启";
            this.txtLevel.text = "Lv." + bossConfig.level;
        }
        let url:string = URLManager.getIconUrl(bossConfig.avatarId + "",URLManager.AVATAR_ICON);
		this.loader.load(url);

        let itemDatas:ItemData[] = CommonUtils.configStrToArr(data.showReward);
        for(let i:number = 0; i < itemDatas.length; i++) {
            let itemCfg:any = itemDatas[i].getItemInfo();
            if(!itemCfg || itemCfg.category == ECategory.ECategoryMaterial) {
                //材料奖励不显示在boss界面（策划需求）
                itemDatas.splice(i,1);
                break;
            }
        }
        this.listReward.data = itemDatas;
        if(bossInfo) {
            this.hpProgressBar.setValue(Number(bossInfo.valEx2_L64),Number(bossInfo.valEx1_L64),true,true);
            if(bossInfo.bVal_B) {
                //存活
                this.c1.selectedIndex = CacheManager.bossNew.getBossIsOpened(bossCode) ? 0 : 1;
            }   
            else {
                //死亡
                this.c1.selectedIndex = CacheManager.bossNew.getBossIsOpened(bossCode) ? 2 : 3;
            }
        }
	}

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnChallenge:
                // ProxyManager.boss.reqEnterBossCopy(this._data.copyCode, this._data.mapId);
                EventManager.dispatch(LocalEventEnum.BossReqEnterCopy,this._data.copyCode,this._data.mapId,this._data.bossCode);
                break;
        }
    }
}