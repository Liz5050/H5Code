class ContestGambleItem extends fairygui.GComponent {
    private iconLoader: GLoader;
    private c1: fairygui.Controller;
    private nameTxt: fairygui.GTextField;
    private _data: simple.ISContestPlayer;
    private serTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.iconLoader = this.getChild("icon_loader") as GLoader;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.serTxt = this.getChild("txt_ser").asTextField;
    }

    public update(data: simple.ISContestPlayer, index:number): void {
        this._data = data;
        this.iconLoader.load(URLManager.getPlayerHead(data.career_I));
        this.nameTxt.text = index == 0 ? data.name_S : LangContest.LANG38;
        // this.serTxt.text = CacheManager.peak.isCrossOpen ? `S.${data.entityId.typeEx_SH}` : "";
    }

    public set select(value:boolean) {
        this.c1.selectedIndex = value ? 1 : 0;
    }

    public getPlayerId():any {
        return this._data.entityId;
    }
}