class ResultHeadItem extends ListRenderer{
    private controller:fairygui.Controller;
    private nameTxt: fairygui.GTextField;
    private headLoader: GLoader;
    private assetsTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml:any):void{
        super.constructFromXML(xml);
        this.controller = this.getController("c1");
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.assetsTxt = this.getChild("txt_assets").asTextField;
        this.headLoader = this.getChild("loader_icon") as GLoader;
    }

    public setData(data:any):void {
        this._data = data;
        this.nameTxt.text = data.name_S;
        this.headLoader.load(URLManager.getPlayerHead(data.career_I));
    }
}