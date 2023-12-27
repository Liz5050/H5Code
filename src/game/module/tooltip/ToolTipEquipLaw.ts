/**法阵道具tips */
class ToolTipEquipLaw extends ToolTipBase {
    private txt_name : fairygui.GRichTextField;
    private txt_num : fairygui.GTextField;
    private txt_lvl : fairygui.GTextField;
    private baseItem: BaseItem;
    private txt_desc : fairygui.GTextField;
    private txt_law_desc : fairygui.GRichTextField;
    private txt_skill : fairygui.GRichTextField;

    private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;
    private itemData: ItemData;

    public constructor() {
        super(PackNameEnum.Common, "ToolTipEquipLaw");
    }

    public initUI(): void {
        super.initUI();
        this.txt_name = this.getChild("txt_name").asRichTextField;
        this.txt_num = this.getChild("txt_num").asTextField;
        this.txt_lvl = this.getChild("txt_level").asTextField;
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.baseItem.isShowName = false;

        this.txt_desc = this.getChild("desc").asTextField;
        this.txt_law_desc = this.getChild("law_desc").asRichTextField;
        this.txt_skill = this.getChild("skill").asRichTextField;
    }

    public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
        this.toolTipSource = toolTipData.source;
        if(toolTipData) {
            this.itemData = <ItemData>toolTipData.data;
            if (ItemsUtil.isTrueItemData(this.itemData)) {
                this.txt_name.text = this.itemData.getName(true);
                this.txt_lvl.text = `${this.itemData.getLevel()}级`;
                this.txt_num.text = this.itemData.getItemAmount().toString();
                this.txt_desc.text = this.itemData.getDesc();
            }
            this.baseItem.itemData = this.itemData;
        }
    }




}