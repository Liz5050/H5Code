class MemDisplay extends fairygui.GComponent {
    private contentTxt:fairygui.GRichTextField;
    private c1: fairygui.Controller;
    public constructor() {
        super();
        this.addClickListener(this.onClick, this);
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.contentTxt = this.getChild("txt_content").asRichTextField;
    }

    public updateAll():void {
    }

    public start() {
        App.TimerManager.doTimer(1000, 0, this.step, this);
    }

    private step() {
        let data:any = CacheManager.res.checkBitmapSize();
        let screenPlayerNum:number = 1 + CacheManager.map.getEntityNum(RpgObjectType.MainPlayer)
            + CacheManager.map.getEntityNum(RpgObjectType.OtherPlayer);
        let screenObjNum:number = CacheManager.map.getEntityTotalNum();
        let screenEffectNum:number = ControllerManager.rpgGame.view ? ControllerManager.rpgGame.view.getGameEffectUpLayer().numChildren
            + ControllerManager.rpgGame.view.getGameEffectDownLayer().numChildren : 0;

        this.contentTxt.text = HtmlUtil.colorSubstitude(LangCommon.LANG20
            , (data.total/1024/1024).toFixed(2)+"M"
            , (data.ui/1024/1024).toFixed(2)+"M"
            , (data.ui/data.total*100).toFixed(2) + "%"
            , screenPlayerNum
            , screenObjNum
            , screenEffectNum);
    }

    private onClick() {
        this.c1.selectedIndex = 1-this.c1.selectedIndex;
    }
}