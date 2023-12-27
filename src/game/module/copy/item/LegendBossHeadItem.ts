class LegendBossHeadItem extends ListRenderer {
    private headLoader: GLoader;
    private nameTxt: fairygui.GTextField;
    private c1: fairygui.Controller;
    private c2: fairygui.Controller;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        let comp:fairygui.GComponent = this.getChild("comp").asCom;
        this.headLoader = comp.getChild("loader") as GLoader;
        this.nameTxt = comp.getChild("txt_name").asTextField;
        this.c1 = comp.getController('c1');
        this.c2 = this.getController('c2');
        // this.addClickListener(this.onClick, this);
    }

    public setData(data: RpgGameObject): void {
        this._data = data;
        this.c1.selectedIndex = CacheManager.king.getLeaderBattleObj() == this._data ? 1 : 0;
        let entityInfo:EntityInfo = data.entityInfo;
        if (entityInfo) {
            this.nameTxt.text = entityInfo.name_S;
            let avatarId:string = ConfigManager.boss.getAvatarId(entityInfo.code_I);
            this.headLoader.load(URLManager.getIconUrl(avatarId, URLManager.AVATAR_ICON));
        }
        this.c2.selectedIndex = EntityUtil.isBoss(entityInfo) || EntityUtil.isEliteBoss(entityInfo) ? 1 : 0;
    }

    private onClick() {
        if (this._data) {
        }
    }
}