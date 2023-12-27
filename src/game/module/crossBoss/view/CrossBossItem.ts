class CrossBossItem extends fairygui.GComponent {
    private bgLoader: GLoader;
    private condsTxt: fairygui.GTextField;
    private timeTxt: fairygui.GTextField;
    private _data: any;
    private bossRefreshDt: number;
    private c1: fairygui.Controller;
    private serverTxt: fairygui.GTextField;
    public minRoleState: number;
    private c2: fairygui.Controller;
    private nameLoader: GLoader;
    private _index: number;
    private c3: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.c3 = this.getController('c3');
        this.bgLoader = this.getChild("loader_bg") as GLoader;
        this.condsTxt = this.getChild("txt_conds").asTextField;
        this.timeTxt = this.getChild("txt_time").asTextField;
        this.serverTxt = this.getChild("txt_server").asTextField;
        this.nameLoader = this.getChild("loader_name") as GLoader;
    }

    public updateAll(crossData:any, index:number):void {
        this._data = crossData;
        this._index = index;
        let bossInf:any = ConfigManager.mgGameBoss.getByPk(crossData.bossCode_I);
        if (!bossInf) {Log.trace(Log.FATAL, `code:${crossData.bossCode_I} 的怪物找不到配置`);return;}
        this.condsTxt.text = App.StringUtils.substitude(LangCrossBoss.LANG3, bossInf.roleState || 0, bossInf.maxRoleState || 13);
        this.minRoleState = bossInf.roleState || 0;
        if (crossData.type_I == ECrossBossField.SINGLE) {
            this.serverTxt.text = App.StringUtils.substitude(CacheManager.role.player.serverId_I != crossData.serverKey.serverId_I ?
                LangCrossBoss.LANG5 : LangCrossBoss.LANG6, crossData.serverKey.serverId_I);
        } else {
            this.serverTxt.text = LangCrossBoss["LANG" + (20 + index)];
        }

        this.updateRefreshDt();
        let isLocal:boolean = crossData.type_I == ECrossBossField.LOCAL;
        let isCross:boolean = crossData.type_I == ECrossBossField.CROSS;
        this.c2.selectedIndex = isLocal || isCross ? 1 : 0;
        this.bgLoader.setScale(1,1);
        if (isLocal) {
            this.nameLoader.load(URLManager.getPackResUrl(PackNameEnum.CrossBoss, "Name_" + (index + 1)));
            this.c3.selectedIndex = index;
        }
        else if (isCross) {
            this.nameLoader.load(URLManager.getPackResUrl(PackNameEnum.CrossBoss, "Name_0"));
            this.c3.selectedIndex = 2;
            this.bgLoader.setScale(1.1,1.15);
        } else {
            this.c3.selectedIndex = 1;
        }
    }

    public updateRefreshDt() {
        this.bossRefreshDt = CacheManager.bossNew.getBossDt(this._data.bossCode_I);
        if (this.countDown() > 0) {
            this.c1.selectedIndex = 1;
            App.TimerManager.doTimer(1000, 0, this.countDown, this);
        }
        this.setTips();
    }

    private countDown():number {
        let leftTime:number = this.bossRefreshDt - CacheManager.serverTime.getServerTime();
        if (leftTime > 0) {
            this.timeTxt.text = App.DateUtils.getTimeStrBySeconds(leftTime, "{2}:{1}:{0}", false);
        } else {
            this.c1.selectedIndex = 0;
            App.TimerManager.removeAll(this);
            this.setTips();
        }
        return leftTime;
    }

    private setTips():void {
        let tips:boolean = CacheManager.crossBoss.checkTips(this._data);
        CommonUtils.setBtnTips(this, tips, this.width - 72, 64);
        this.bgLoader.grayed = !tips;
    }

    getData(): any {
        return this._data;
    }

    public hide():void {
        App.TimerManager.removeAll(this);
    }

}