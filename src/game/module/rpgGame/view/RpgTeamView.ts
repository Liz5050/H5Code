class RpgTeamView extends BaseContentView {
    private teamList:List;
    private c1: fairygui.Controller;

    //队员列表

    public constructor() {
        super(PackNameEnum.RpgTeam, "RpgTeamView");
        this.thisParent = LayerManager.UI_Home;
    }

    public initUI():void{
        super.initUI();
        if (this.view) {
            this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
        }
    }

    public initOptUI(): void {
        this.teamList = new List(this.getGObject("list_head").asList);
        this.c1 = this.getController('c1');
    }

    /**模块显示时开启的监听 */
    protected addListenerOnShow(): void {
    }

    public updateAll(): void {
        if (this.teamListUpdate()) {
            App.TimerManager.doTimer(1000,0,this.teamListUpdate,this);
        }
    }

    public hide():void {
        super.hide();
        App.TimerManager.remove(this.teamListUpdate,this);
    }

    private teamListUpdate():boolean {
        if (CacheManager.team.hasTeam) {
            let teamInfo:any = CacheManager.team.teamInfo;
            let teamMems:simple.SPublicMiniPlayer[] = teamInfo.players.data;
            let memsExceptMe:simple.SPublicMiniPlayer[] = [];
            for (let data of teamMems) {
                if (!EntityUtil.isMainPlayer(data.entityId)) {
                    memsExceptMe.push(data);
                }
            }
            this.teamList.data = memsExceptMe;
        } else {
            this.teamList.data = [];
        }
        this.teamList.list.resizeToFit(2);//动态高度
        let len:number = this.teamList.data.length;
        this.c1.selectedIndex = len > 0 ? 0 : 1;
        return len > 0;
    }
}