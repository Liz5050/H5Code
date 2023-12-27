class GuildTeamMemberItem extends ListRenderer {
	private c1: fairygui.Controller;//0别人队伍1自己队伍
    private fightTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private nameTxt: fairygui.GTextField;
    private headIcon: GLoader;
    private kickLoader: fairygui.GButton;
    private otherNameTxt: fairygui.GTextField;
    private joinLoader: fairygui.GButton;
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

        this.kickLoader = this.getChild("loader_kick").asButton;
        this.kickLoader.addClickListener(this.onClickKick, this);

        this.otherNameTxt = this.getChild("txt_other_name").asTextField;
        this.joinLoader = this.getChild("loader_add").asButton;
        this.joinLoader.addClickListener(this.onClickJoin, this);
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;
        this.c1.selectedIndex = this.c2.selectedIndex = this.c3.selectedIndex = 0;
        if (data.gateChannelId_I != undefined) {//是自己队伍
            this.c1.selectedIndex = 1;

            this.levelTxt.text = CareerUtil.getLevelNameByState(data.level_SH, data.roleState_SH);
            this.nameTxt.text = data.name_S;
            this.headIcon.load(URLManager.getPlayerHead(data.career_SH));
            this.fightTxt.text = App.StringUtils.substitude(LangTeam2.LANG4, data.warfare_L64);

            if (index == 0) {
                this.c2.selectedIndex = 1;
            } else {
                if (CacheManager.team2.captainIsMe) {
                    this.c3.selectedIndex = 1;
                }
            }
        } else {//是其他人队伍
            this.otherNameTxt.text = App.StringUtils.substitude(LangTeam2.LANG5, data.name_S, data.players.data.length + '/' + data.maxPlayer_BY);
        }
    }

    private onClickKick() {
        EventManager.dispatch(LocalEventEnum.KickOutMemberCross, this._data.entityId);
    }

    private onClickJoin() {
        EventManager.dispatch(LocalEventEnum.ApplyEnterTeamCross, this._data.copyCode_I, this._data.groupId);
    }
}