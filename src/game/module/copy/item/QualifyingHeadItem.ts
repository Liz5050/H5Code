class QualifyingHeadItem extends ListRenderer {
    private headLoader: GLoader;
    private nameTxt: fairygui.GTextField;
    private c1: fairygui.Controller;//0本服1跨服
    private c2: fairygui.Controller;//0敌方1我方
    private c3: fairygui.Controller;//0无死亡倒计时1有
    private mcClick: UIMovieClip;
    private serverTxt: fairygui.GTextField;
    private lifeBar0: UIProgressBar;
    private lifeBar1: UIProgressBar;
    private reliveDt: number;
    private reliveCdTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.headLoader = this.getChild("loader") as GLoader;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.serverTxt = this.getChild("txt_server").asTextField;
        this.reliveCdTxt = this.getChild("txt_relive_cd").asTextField;
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.c3 = this.getController('c3');
        this.addClickListener(this.onClick, this);

        this.lifeBar0 = this.getChild("progressBar0") as UIProgressBar;
        this.lifeBar0.setStyle(URLManager.getCommonIcon("progressBar_1"), URLManager.getCommonIcon("bg_1"), 95, 12, 2, 2,UIProgressBarType.Normal,true);
        this.lifeBar1 = this.getChild("progressBar1") as UIProgressBar;
        this.lifeBar1.setStyle(URLManager.getCommonIcon("progressBar_2"), URLManager.getCommonIcon("bg_1"), 95, 12, 2, 2,UIProgressBarType.Normal,true);
    }

    public setData(data: simple.ISQualifyingPlayerCopyInfo): void {
        this._data = data;
        if (data) {
            this.c1.selectedIndex = 1;//EntityUtil.isCrossPlayer(data.entityId) ? 1 : 0;
            this.c2.selectedIndex = CacheManager.qualifying.myCopyForce == data.force_I ? 1 : 0;
            this.nameTxt.text = data.name_S;
            this.serverTxt.text = `S${data.entityId.typeEx_SH}`;
            this.headLoader.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(data.career_I)));
            this.updateLife();
        }
    }

    private onClick() {
        if(!this.mcClick) {
            this.mcClick = UIMovieManager.get(PackNameEnum.MCClick);
            this.mcClick.x = -185;
            this.mcClick.y = -195;
            this.addChild(this.mcClick);
        }
        this.mcClick.setPlaySettings(0,-1,1,-1,function(){
            this.mcClick.destroy();
            this.mcClick = null;
        },this);
    }

    public getTarget():RpgGameObject {
        if (this._data) {
            let target:RpgGameObject = CacheManager.map.getEntity(this._data.entityId);
            if (!target || target.isDead()) {
                let list: RpgGameObject[] = CacheManager.map.getOtherPlayers(this._data.entityId);
                for (let go of list) {
                    if (!go.isDead()) return go;
                }
            }
            return target;
        }
        return null;
    }

    public get entityId():any {
        return this._data ? this._data.entityId : null;
    }

    public get force():EForce {
        return this._data ? this._data.force_I : null;
    }

    public updateLife():any {
        let target = this.getTarget();
        if (!target) {//玩家没进来
            this['lifeBar' + this.c2.selectedIndex].setValue(1, 1);
            this.grayed = true;
            this.c3.selectedIndex = 0;
            return;
        }
        let lifeAll:any = CacheManager.map.getPlayerLifeAll(this.entityId);
        if(lifeAll.life > 0 || lifeAll.maxLife > 0) {
            this['lifeBar' + this.c2.selectedIndex].setValue(lifeAll.life, lifeAll.maxLife, true, true);
            this.grayed = lifeAll.life <= 0;
        }
        else {
            this['lifeBar' + this.c2.selectedIndex].setValue(1, 1);
            this.grayed = false;
        }
        if (this.reliveDt > 0) {
            let leftTime:number = CacheManager.serverTime.getLeftSecsUtilDate(this.reliveDt);
            if (leftTime >= 0) {
                this.c3.selectedIndex = 1;
                this.reliveCdTxt.text = `${leftTime}S`;
                this.reliveCdTxt.grayed = false;
                this.reliveCdTxt.color = Color.toNum(Color.Color_4);
            } else {
                this.c3.selectedIndex = 0;
            }
        } else {
            this.c3.selectedIndex = 0;
        }
    }

    public updateReliveCd(reliveDt: number) {
        this.reliveDt = reliveDt;
    }
}