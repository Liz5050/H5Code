class MiningManItem extends fairygui.GComponent {
    private nameTxt: fairygui.GRichTextField;
    private manImg: GLoader;
    private c1: fairygui.Controller;
    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.manImg = this.getChild("loader_man") as GLoader;
    }

    public update(quality:number, isShowMan:boolean = false):void {
        let minerData:any = ConfigManager.mining.getMinerData(quality);
        this.nameTxt.text = HtmlUtil.html(minerData.name, Color.getRumor((2 + quality) + ""));
        if (isShowMan) {
            this.c1.selectedIndex = 1;
            this.manImg.load(URLManager.getPackResUrl(PackNameEnum.MiningHire, "miner" + quality));
        } else {
            this.c1.selectedIndex = 0;
        }
    }
}