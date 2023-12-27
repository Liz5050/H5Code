class TeamInviteSendWindow extends BaseWindow {
    private contentTxt: fairygui.GTextField;
    private friendInviteBtn: fairygui.GButton;
    private guildInviteBtn: fairygui.GButton;
    private worldInviteBtn: fairygui.GButton;
    private teamType: number;
    private timeCD : number = 60000;
    private sendTimeGuild : number = 0;
    private sendTimeWorld : number = 0;

    public constructor() {
        super(PackNameEnum.Team, "TeamInviteSendWindow");
    }

    public initOptUI(): void {
        this.contentTxt = this.getGObject("txt_content").asTextField;
        this.friendInviteBtn = this.getGObject("btn_friend").asButton;
        this.friendInviteBtn.addClickListener(this.onInviteSend, this);
        this.guildInviteBtn = this.getGObject("btn_guild").asButton;
        this.guildInviteBtn.addClickListener(this.onInviteSend, this);
        this.worldInviteBtn = this.getGObject("btn_world").asButton;
        this.worldInviteBtn.addClickListener(this.onInviteSend, this);
    }

    public updateAll(teamType:number = 0): void {
        this.teamType = teamType;
        let content:string = "";
        if (teamType == 0) {
            let targetValue:any = CacheManager.team2.curTeamCopyCfg;
            content = App.StringUtils.substitude(LangLegend.LANG26, targetValue.name);
        }
        else {
            content = LangQualifying.LANG32;
        }
        this.contentTxt.text = content;
    }

    private onInviteSend(e:egret.TouchEvent):void {

        switch (e.target) {
            case this.friendInviteBtn:
                if (this.teamType == 0) EventManager.dispatch(UIEventEnum.TeamInvitePlayerOpen);
                else EventManager.dispatch(UIEventEnum.QualifyingWin, EQualifyingWinType.Invite);
                this.hide();
                break;
            case this.guildInviteBtn:
                if (!CacheManager.guildNew.isJoinedGuild()) {
                    Tip.showTip(LangLegend.LANG29);
                    return;
                }
                let timestamp = new Date().getTime();
                if(timestamp - this.sendTimeGuild < this.timeCD) {
                    let leftTime = 60 - Math.floor((timestamp - this.sendTimeGuild)/1000);
                    Tip.showTip(App.StringUtils.substitude(LangLegend.LANG33, leftTime ));
                    return;
                }
                this.sendTimeGuild = timestamp;
                EventManager.dispatch(LocalEventEnum.TeamCrossInviteGuild);
                this.hide();
                break;
            case this.worldInviteBtn:
                timestamp = new Date().getTime();
                if(timestamp - this.sendTimeWorld < this.timeCD) {
                    let leftTime = 60 - Math.floor((timestamp - this.sendTimeWorld)/1000);
                    Tip.showTip(App.StringUtils.substitude(LangLegend.LANG33, leftTime ));
                    return;
                }
                this.sendTimeWorld = timestamp;
                EventManager.dispatch(LocalEventEnum.TeamCrossInviteWorld);
                this.hide();
                break;
        }

    }
}