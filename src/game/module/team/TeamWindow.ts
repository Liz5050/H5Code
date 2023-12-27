/**
 * 组队界面 - 目前只适用副本组队
 * @author Chris
 */
class TeamWindow extends BaseWindow {
    private static MAX_NUM:number = 3;

    private controller: fairygui.Controller;
    private challengeBtn: fairygui.GButton;
    private nameTxt: fairygui.GTextField;
    private itemList: List;
    private modelList: TeamModelItem[];
    private curCopy: any;
    private returnBtn: fairygui.GButton;
    private mcReturn: UIMovieClip;
    private chatPanel: HomeChatPanel;

    public constructor(moduleId: ModuleEnum) {
        super(PackNameEnum.Team, "Main", moduleId, LayerManager.UI_Cultivate);
        this.isCenter = false;
        this.isAnimateShow = false;
    }

    public initUI():void{
        super.initUI();
        if (this.view) {
            this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
        }
    }

    public initOptUI(): void {
        // this.controller = this.getController("c1");
        this.challengeBtn = this.getGObject("btn_challenge").asButton;
        this.challengeBtn.addClickListener(this.onChallenge, this);
        this.nameTxt = this.getGObject("txt_name").asTextField;
        this.itemList = new List(this.getGObject("list_item").asList);
        this.modelList = [];
        for (let i = 0; i < TeamWindow.MAX_NUM; i++) {
            this.modelList[i] = this.getGObject("model" + i) as TeamModelItem;
        }

        //返回
        this.returnBtn = this.getGObject("btn_return").asButton;
        this.returnBtn.addClickListener(this.returnClickHandler, this);
        this.mcReturn = UIMovieManager.get(PackNameEnum.MCReturn);
        this.mcReturn.x = -76;
        this.mcReturn.y = -74;
        this.mcReturn.playing = true;
        this.returnBtn.addChild(this.mcReturn);

        //聊天
        if(!this.chatPanel){
            this.chatPanel = new HomeChatPanel(this.getGObject("chat_cnt").asCom);
        }
        this.chatPanel.show();
    }

    public updateAll(data?: any): void {
        if (CacheManager.team.hasTeam) {
            let teamInfo:any = CacheManager.team.teamInfo;
            let teamTarget:any = CacheManager.team.teamTarget;
            if (!this.curCopy || this.curCopy.code != teamTarget.targetValue) {
                this.curCopy = ConfigManager.copy.getByPk(teamTarget.targetValue);
            }
            if (this.curCopy) {
                this.nameTxt.text = this.curCopy.name;
                let rewards:ItemData[] = RewardUtil.getStandeRewards(this.curCopy.reward);
                this.itemList.data = rewards;
            }
            let players:simple.SPublicMiniPlayer[] = CacheManager.team.teamMembers;
            for (let i=0; i < this.modelList.length; i++) {
                this.modelList[i].updateAll(players[i], i);
            }
        } else {
            this.hide();
        }
    }

    private onChallenge() {
        if (!CacheManager.team.captainIsMe) {
            Tip.showTip(LangLegend.LANG28);
            return;
        }
        CopyUtils.teamEnter(CacheManager.team.teamTarget.targetValue);
    }

    public onHide(data: any = null): void {
        super.onHide(data);
        for (let i=0; i < this.modelList.length; i++) {
            this.modelList[i].updateAll(null, i);
        }
    }

    private returnClickHandler() {
        HomeReturnInterceptor.intercept(this.moduleId)
    }

    public updateChanelList(): void {
        if (this.chatPanel && this.chatPanel.isShow) {
            this.chatPanel.visible = true;
            this.chatPanel.updateAll();
        }
    }
}