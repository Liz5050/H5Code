class HeartMethodDecomposeItem extends ListRenderer {
    private icon_loader : GLoader;
    private border_loader : GLoader;
    private txt_name: fairygui.GTextField;
    private cfg : any;
    public itemData : any;
    public addCoin : number;


    public constructor() {
		super();
	}

    protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
        this.icon_loader = <GLoader>this.getChild("icon_loader");
        this.border_loader = <GLoader>this.getChild("item_border");
        this.txt_name = this.getChild("txt_name").asTextField;
	}

	public setData(data: any) {
        this._data = data;
        this.itemData = data;
        this.cfg = data.getItemInfo();
        if(data) {
            this.icon_loader.load(data.getIconRes());
            this.txt_name.text = this.cfg.name;
            this.txt_name.color = Color.ItemColor[this.cfg.color];
            this.border_loader.load(data.getColorRes());
            this.addCoin = this.cfg.effectEx;
        }
	}


}