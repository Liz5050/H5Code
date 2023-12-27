class QualifyingTeamModelItem extends TeamModelItem {
    private c3: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c3 = this.getController('c3');
    }

    public updateAll(data:any, index:number):void {
        if (this._data != data) {
            this._data = data;

            if (data) {
                let msgWeapons:any = data.roleWeapons ? data.roleWeapons.value[0] : null;
                this.playerModel.updatePlayerModelAll(msgWeapons, data.career_SH);
                this.c1.selectedIndex = 1;
                this.c2.selectedIndex = EntityUtil.isMainPlayer(data.entityId) ? 1 : 0;
                this.c3.selectedIndex = EntityUtil.isSame(CacheManager.team2.teamInfo.captainId, data.entityId) ? 1 : 0;
                this.nameTxt.text = data.name_S;
            } else {
                this.nameTxt.text = LangLegend.LANG24;
                this.playerModel.reset();
                this.c1.selectedIndex = this.c3.selectedIndex = 0;
            }
        }
    }

    protected onAddClick() {
        // if (!CacheManager.team2.captainIsMe) {
        //     Tip.showTip(LangLegend.LANG27);
        //     return;
        // }
        EventManager.dispatch(UIEventEnum.TeamInviteSendOpen, 1);
    }
}