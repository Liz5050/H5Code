class QualifyingInviteItem extends ListRenderer {
    private headIcon: GLoader;
    private nameTxt: fairygui.GTextField;
    private fcTxt: fairygui.GTextField;
    private inviteBtn: fairygui.GButton;
    private scoreTxt: fairygui.GTextField;
    private vipTxt: fairygui.GTextField;
    private rateTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.headIcon = this.getChild("loader_icon") as GLoader;
        this.nameTxt = this.getChild("txt_PlayerName").asTextField;
        this.vipTxt = this.getChild("txt_vip").asTextField;
        this.fcTxt = this.getChild("txt_fc").asTextField;
        this.scoreTxt = this.getChild("txt_score").asTextField;
        this.rateTxt = this.getChild("txt_rate").asTextField;

        this.inviteBtn = this.getChild("btn_invite").asButton;
        this.inviteBtn.addClickListener(this.onInviteHandler, this);
    }

    public setData(data: simple.ISQualifyingPlayer, index: number): void {
        this._data = data;
        this.itemIndex = index;
        this.headIcon.load(URLManager.getPlayerHead(data.career_I));
        this.nameTxt.text = data.name_S;
        this.vipTxt.text = data.vipLevel_I > 0 ? `V${data.vipLevel_I}` : "";
        this.fcTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG28, data.warfare_I);
        let rateStr = HtmlUtil.colorSubstitude(LangQualifying.LANG30, (data.winCount_I / data.totalCount_I * 100).toFixed(2).replace('.00','') + '%');
        this.rateTxt.text = rateStr;
        this.scoreTxt.text = HtmlUtil.colorSubstitude(LangQualifying.LANG29, data.score_I);
    }

    private onInviteHandler(): void {
        EventManager.dispatch(LocalEventEnum.TeamCrossInviteFriend, this._data.entityId);//发送邀请链接
    }
}