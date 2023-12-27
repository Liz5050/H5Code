class Team2TeamItem extends ListRenderer {
    private c1: fairygui.Controller;//0别人队伍1自己队伍
    private fightTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private nameTxt: fairygui.GTextField;
    private left_count:fairygui.GRichTextField;
    private headIcon: GLoader;
    private kickLoader: GLoader;
    private otherNameTxt: fairygui.GTextField;
    private joinLoader: GLoader;
    private btn_invite : fairygui.GButton;
    private c2: fairygui.Controller;//0队员1队长
    private c3: fairygui.Controller;//队员里-0自己不是队长1自己是队长

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.c3 = this.getController('c3');
        this.headIcon = this.getChild("loader_icon") as GLoader;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.levelTxt = this.getChild("txt_level").asTextField;
        this.fightTxt = this.getChild("txt_fight").asTextField;
        this.left_count = this.getChild("left_count").asRichTextField;

        this.kickLoader = this.getChild("loader_kick") as GLoader;
        this.kickLoader.addClickListener(this.onClickKick, this);

        this.otherNameTxt = this.getChild("txt_other_name").asTextField;
        this.joinLoader = this.getChild("loader_add") as GLoader;
        this.joinLoader.addClickListener(this.onClickJoin, this);
        this.btn_invite = this.getChild("btn_invite").asButton;
        this.btn_invite.addClickListener(this.onClickInvite, this);

    }

    public setData(data: any, index: number): void {
        this._data = data;
        if(!data) { 
             this.c1.selectedIndex = 2;
             return;
        }
        this.itemIndex = index;
        this.c1.selectedIndex = this.c2.selectedIndex = this.c3.selectedIndex = 0;
        let playerData:any = data.tinyPlayer;
        if (playerData != undefined) {//是自己队伍
            this.c1.selectedIndex = 1;

            this.levelTxt.text = CareerUtil.getLevelNameByState(playerData.level_SH, playerData.roleState_SH);
            this.nameTxt.text = playerData.name_S;
            this.headIcon.load(URLManager.getPlayerHead(playerData.career_SH));
            this.fightTxt.text = App.StringUtils.substitude(LangTeam2.LANG4, playerData.warfare_L64);

            if (index == 0) {
                this.c2.selectedIndex = 1;
            } else {
                if (CacheManager.team2.captainIsMe) {
                    this.c3.selectedIndex = 1;
                }
            }
        } else {//是其他人队伍
            let members:any[] = data.players.data;
            this.otherNameTxt.text = App.StringUtils.substitude(LangTeam2.LANG5, data.name_S, members.length + '/' + data.maxPlayer_BY);
            let left:number = 0;
            for(let i:number = 0; i < members.length; i++) {
                if(EntityUtil.isSame(members[i].tinyPlayer.entityId,data.captainId,true)) {
                    left = members[i].copyNum_BY;
                    break;
                }
            }
            let color:string = Color.Color_4;
            if(left > 0) {
                color = Color.Color_6
            }
            this.left_count.text = App.StringUtils.substitude(LangTeam2.L29, left, color);
        }
    }

    private onClickKick() {
        EventManager.dispatch(LocalEventEnum.KickOutMemberCross, this._data.tinyPlayer.entityId);
    }

    private onClickJoin() {
        EventManager.dispatch(LocalEventEnum.ApplyEnterTeamCross, this._data.copyCode_I, this._data.groupId);
    }

    private onClickInvite() {
        EventManager.dispatch(UIEventEnum.TeamInviteSendOpen, 0);
    }
}