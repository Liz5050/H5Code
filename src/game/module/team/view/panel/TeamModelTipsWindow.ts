class TeamModelTipsWindow extends BaseWindow {
    private c1: fairygui.Controller;
    private headIcon: GLoader;
    private nameTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private guildTxt: fairygui.GTextField;
    private seeBtn: fairygui.GButton;
    private removeBtn: fairygui.GButton;
    private _data: simple.SPublicMiniPlayer;
    public constructor() {
        super(PackNameEnum.Team, "TeamModelTipsWindow");
    }

    public initOptUI(): void {
        this.c1 = this.getController('c1');
        this.headIcon = this.getGObject("loader_icon") as GLoader;
        this.nameTxt = this.getGObject("txt_name").asTextField;
        this.levelTxt = this.getGObject("txt_level").asTextField;
        this.guildTxt = this.getGObject("txt_guild").asTextField;
        this.seeBtn = this.getGObject("btn_see").asButton;
        this.seeBtn.addClickListener(this.onClick, this);
        this.removeBtn = this.getGObject("btn_remove").asButton;
        this.removeBtn.addClickListener(this.onClick, this);

    }

    public updateAll(data: any = null): void {
        this._data = data;
        this.c1.selectedIndex = CacheManager.team.captainIsMe ? 1 : 0;
        this.headIcon.load(URLManager.getPlayerHead(data.career_SH));
        this.nameTxt.text = data.name_S;
        this.levelTxt.text = CareerUtil.getLevelName(data.level_SH, data.career_SH);
        this.guildTxt.text = data.guildName_S;
    }

    private onClick(e:egret.TouchEvent):void {
        switch (e.target) {
            case this.seeBtn:
                EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:this._data.entityId},true);
                break;
            case this.removeBtn:
                EventManager.dispatch(LocalEventEnum.KickOutMember, this._data.entityId);
                break;
        }
        this.hide();
    }
}