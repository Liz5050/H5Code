/**
 * 跨服BOSS模块
 * @author Chris
 */
class CrossBossModule extends BaseModule{
    private panel: CrossBossPanel;

    public constructor() {
        super(ModuleEnum.CrossBoss, PackNameEnum.CrossBoss, "Main");
    }

    public initOptUI():void{
        this.panel = this.getGObject("panel") as CrossBossPanel;
        this.descBtn.visible = true;
    }

    public updateAll(data: any = null):void{
        this.panel.updateAll(data);
    }

    public updateCrossBoss() {
        this.panel.updateAll();
    }

    public updateBossListCD() {
        this.panel.updateBossListCD();
    }

    public updateBossLeftTimes() {
        this.panel.updateBossLeftTimes();
    }

    protected clickDesc():void {
        let tipStr:string = LangCrossBoss.LANG11;
        EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:tipStr});
    }
}