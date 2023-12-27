/**
 * 对话模块
 */
class TalkWindow extends BaseWindow {
    private thisGroup: fairygui.GGroup;
    private bgLoader: GLoader;
    private titleTxt: fairygui.GTextField;
    private descTxt: fairygui.GRichTextField;

    private npc: any;

    public constructor() {
        super(PackNameEnum.TaskDialog, "TalkWindow", null, LayerManager.UI_Tips);
    }

    public initOptUI(): void {
        this.titleTxt = this.getGObject("txt_title").asTextField;
        this.descTxt = this.getGObject("txt_desc").asRichTextField;
        this.thisGroup = this.getGObject("group_this").asGroup;
        this.thisGroup.visible = false;
        this.bgLoader = <GLoader>this.getGObject("loader_bg");
        this.bgLoader.addEventListener(GLoader.RES_READY, this.onBgLoaded, this);
        this.bgLoader.load(URLManager.getModuleImgUrl("bg2.png", PackNameEnum.TaskDialog));
    }

    public updateAll(data: any = null): void {
        if (data && data.npcId) {
            this.npc = ConfigManager.npc.getByPk(data.npcId);
            if (this.npc) {
                this.titleTxt.text = this.npc.name;
                this.descTxt.text = this.npc.talk;
            }
        }
    }

    private onBgLoaded(): void {
        this.thisGroup.visible = true;
    }
}