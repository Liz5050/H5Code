class TeamModelItem extends fairygui.GComponent {
    private addButton: fairygui.GButton;
    protected c1: fairygui.Controller;
    protected _data:any;
    protected playerModel: PlayerModel;
    protected container: egret.DisplayObjectContainer;
    protected c2: fairygui.Controller;
    protected nameTxt: fairygui.GTextField;

    public constructor(){
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.addButton = this.getChild("btn_add").asButton;
        this.addButton.addClickListener(this.onAddClick, this);
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.container = this.getChild("model_container").asCom.displayObject as egret.DisplayObjectContainer;
        this.playerModel = new PlayerModel();
        this.container.addChild(this.playerModel);
        this.addClickListener(this.onClick, this);
    }

    public updateAll(data:any, index:number):void {
        if (this._data != data) {
            this._data = data;

            if (data) {
                let msgWeapons:any = data.roleWeapons ? data.roleWeapons.value[0] : null;
                this.playerModel.updatePlayerModelAll(msgWeapons, data.career_SH);
                this.c1.selectedIndex = 1;
                this.c2.selectedIndex = CacheManager.team.getEntityIsCaptain(data.entityId) ? 1 : 0;
                this.nameTxt.text = data.name_S;
            } else {
                this.nameTxt.text = LangLegend.LANG24;
                this.playerModel.reset();
                this.c1.selectedIndex = 0;
            }
        }
    }

    protected onAddClick() {
        // EventManager.dispatch(UIEventEnum.TeamInvitePlayerOpen);
        if (!CacheManager.team.captainIsMe) {
            Tip.showTip(LangLegend.LANG27);
            return;
        }
        EventManager.dispatch(UIEventEnum.TeamInviteSendOpen);
    }

    private onClick() {
        if (!this._data) {
            this.onAddClick();
        } else {
            if (EntityUtil.isMainPlayer(this._data.entityId)) return;
            EventManager.dispatch(UIEventEnum.TeamModelTipsOpen, this._data);
        }
    }
}