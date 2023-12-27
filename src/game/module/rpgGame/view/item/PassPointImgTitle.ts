class PassPointImgTitle extends egret.DisplayObjectContainer {
    private floor:number;
    private bg: GLoader;
    private floorTxt: fairygui.GTextField;
    public constructor(floor:number){
        super();
        this.floor = floor;
        this.init();
    }

    private init() {
        this.bg = ObjectPool.pop("GLoader");
        this.bg.load(URLManager.getModuleImgUrl("mining/head_pass.png", PackNameEnum.Scene));
        this.bg.x = this.bg.y = 0;
        this.addChild(this.bg.displayObject);

        this.floorTxt = new fairygui.GTextField();
        this.floorTxt.font = FontType.VIP_FONT;
        this.floorTxt.text = this.floor + '';
        this.floorTxt.x = 120;
        this.addChild(this.floorTxt.displayObject);
    }

    public dispose():void {
        this.bg && this.bg.destroy();
        this.floorTxt && this.floorTxt.dispose();
    }
}