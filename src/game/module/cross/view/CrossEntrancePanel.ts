/**
 * 跨服玩法入口
 * @author Chris
 */
class CrossEntrancePanel extends BaseTabView{
    private loaderCrossBoss:GLoader;
    private loaderQualifying:GLoader;
    private ctlCrossBoss: fairygui.Controller;
    private ctlQualifying: fairygui.Controller;
    private loaderCrossBossGuild: GLoader;
    private ctlCrossBossGuild: fairygui.Controller;

    public constructor() {
        super();
    }

    protected initOptUI():void{
        this.loaderCrossBoss = this.getGObject('g_CrossBoss') as GLoader;
        this.loaderCrossBoss.name = PanelTabType[PanelTabType.CrossBossCross];
        this.loaderCrossBoss.addClickListener(this.onClick, this);
        this.ctlCrossBoss = this.getController('c1');
        this.loaderQualifying = this.getGObject('g_Qualifying') as GLoader;
        this.loaderQualifying.name = PanelTabType[PanelTabType.Qualifying];
        this.loaderQualifying.addClickListener(this.onClick, this);
        this.ctlQualifying = this.getController('c2');
        this.loaderCrossBossGuild = this.getGObject('g_CrossBossGuild') as GLoader;
        this.loaderCrossBossGuild.name = PanelTabType[PanelTabType.CrossBossGuild];
        this.loaderCrossBossGuild.addClickListener(this.onClick, this);
        this.ctlCrossBossGuild = this.getController('c3');
    }

    public updateAll(data?:any):void{
        this.ctlCrossBoss.selectedIndex = CacheManager.crossBoss.checkTips(null, PanelTabType.CrossBossCross) ? 1 : 0;
        this.ctlQualifying.selectedIndex = CacheManager.qualifying.checkOpenTips() || CacheManager.qualifying.checkFunTips() ? 1 : 0;
    }

    private onClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        let openKey:string = btn.name;
        if (!ConfigManager.mgOpen.isOpenedByKey(openKey,true)) {
            return;
        }
        switch (btn) {
            case this.loaderCrossBoss:
                HomeUtil.openCrossBoss();
                break;
            case this.loaderQualifying:
                HomeUtil.openQualifying();
                break;
        }
    }
}