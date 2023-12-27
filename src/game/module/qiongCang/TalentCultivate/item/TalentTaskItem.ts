class TalentTaskItem extends ListRenderer {
	private iconLoader: GLoader;
    private nameTxt: fairygui.GTextField;
    private descTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.descTxt = this.getChild("txt_desc").asTextField;
    }

    public setData(skillId: number): void {
        let cfg: any = ConfigManager.cultivateEffectType.getByPk(skillId);
        if(cfg){
            this.iconLoader.load(URLManager.getIconUrl(cfg.icon, URLManager.SKIL_ICON));
            this.nameTxt.text = cfg.name;
            this.descTxt.text = cfg.desc;
        }
    }
}