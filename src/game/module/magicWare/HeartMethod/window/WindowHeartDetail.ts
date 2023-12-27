class WindowHeartDetail extends BaseWindow {

    private txt_title : fairygui.GTextField;
    private detail : fairygui.GRichTextField;

    public constructor() {
        super(PackNameEnum.MagicWare , "WindowMethodDetail");
    }

    public initOptUI() : void {
        this.txt_title = this.getGObject("txt_title").asTextField;
        this.detail = this.getGObject("txt_attr").asRichTextField;
    }

    public updateAll(data : any) {
        this.txt_title.text = data[0];
        this.detail.text = data[1];
    }
}