class RpgTeamHeadItem extends ListRenderer {
    private headImg: GLoader;
    private nameTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.headImg = this.getChild("loader") as GLoader;
        this.nameTxt = this.getChild("txt_name").asTextField;
    }

    public setData(data: any): void {
        this._data = data;
        this.nameTxt.text = data.name_S;
        this.headImg.load(URLManager.getPlayerHead(data.career_SH));
        this.updateState();
    }

    public updateState():void {
        if (this._data) {
            let otherPlayer:RpgGameObject = CacheManager.map.getEntity(this._data.entityId);
            this.headImg.grayed = (!otherPlayer || otherPlayer.isDead()) && !CacheManager.map.getOtherPlayer(this._data.entityId);
        }
    }

    public recycleChild(): void {
        this.headImg.grayed = false;
    }
}