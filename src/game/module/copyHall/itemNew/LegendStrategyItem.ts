class LegendStrategyItem extends ListRenderer {
    private headLoader: GLoader;
    private descTxt: fairygui.GTextField;
    private nameTxt: fairygui.GTextField;
    private dangerTxt: fairygui.GRichTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.headLoader = this.getChild("loader_icon") as GLoader;
        this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.dangerTxt = this.getChild("txt_danger").asRichTextField;
        this.descTxt = this.getChild("txt_desc").asRichTextField;
    }

    public setData(data: any, index: number): void {
        this._data = data;

        let bossInf:any = ConfigManager.boss.getByPk(data.bossCode);
        let modelId:string = ConfigManager.boss.getAvatarId(data.bossCode);
        this.headLoader.load(URLManager.getIconUrl(modelId, URLManager.AVATAR_ICON));
        this.nameTxt.text = App.StringUtils.substitude(LangLegend.LANG11, bossInf.name);
        this.dangerTxt.text = App.StringUtils.substitude(LangLegend.LANG12, this.getColorTxt(data.danger));
        this.descTxt.text = App.StringUtils.substitude(LangLegend.LANG13, data.strategy);
    }

    private getColorTxt(danger: string) {
        switch (danger) {
            case "BOSS":danger = HtmlUtil.html(danger, "#eee43f");break;
            case "高":danger = HtmlUtil.html(danger, "#fea700");break;
            case "中等":danger = HtmlUtil.html(danger, "#f5e8ce");break;
        }
        return danger;
    }
}