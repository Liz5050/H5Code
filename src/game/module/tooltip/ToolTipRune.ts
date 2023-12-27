/**
 * 符文Tip
 */
class ToolTipRune extends ToolTipBase {
    private nameTxt: fairygui.GTextField;
    private numTxt: fairygui.GTextField;
    private levelTxt: fairygui.GTextField;
    private descTxt: fairygui.GRichTextField;
    private gainTxt: fairygui.GTextField;
    private tipImg: fairygui.GImage;
    private baseItem: BaseItem;
    private itemData: ItemData;

    public constructor() {
        super(PackNameEnum.Common, "ToolTipRune");
    }

    public initUI(): void {
        super.initUI();
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.numTxt = this.getChild("txt_num").asTextField;
        this.levelTxt = this.getChild("txt_level").asTextField;
        this.descTxt = this.getChild("txt_desc").asRichTextField;
        this.gainTxt = this.getChild("txt_gain").asTextField;
        this.baseItem = <BaseItem>this.getChild("loader_item");
        this.baseItem.isShowName = false;
        this.tipImg = this.getChild("window_itemtip").asImage;
    }

    public setToolTipData(toolTipData: ToolTipData) {
        super.setToolTipData(toolTipData);
        if (toolTipData) {
            this.itemData = <ItemData>toolTipData.data;
            if (ItemsUtil.isTrueItemData(this.itemData)) {
                let level: number = 1;
                let extInfo: any = this.itemData.getItemExtInfo();
                if (extInfo.level != null) {
                    level = extInfo.level;
                }
                // this.nameTxt.text = `<font color='${Color.ItemColor[this.itemData.getColor()]}'>${this.itemData.getName()} Lv.${level}</font>`;
                this.numTxt.text = App.MathUtils.formatItemNum(this.itemData.getItemAmount());
                this.levelTxt.text = this.itemData.getItemLevel().toString();
                this.gainTxt.text = this.itemData.getGainDesc();

                if (this.itemData.getType() == ERune.ERuneZero) {
                    this.nameTxt.text = `<font color='${Color.ItemColor[this.itemData.getColor()]}'>${this.itemData.getName()}</font>`;
                    this.descTxt.text = this.itemData.getDesc();
                } else {
                    this.nameTxt.text = `<font color='${Color.ItemColor[this.itemData.getColor()]}'>${this.itemData.getName()} Lv.${level}</font>`;

                    let runeData: any = ConfigManager.mgRune.getByPk(`${this.itemData.getEffect()},${level}`);
                    let attrDict: any = runeData ? WeaponUtil.getAttrDict(runeData.attrList) : null;
                    if (attrDict) {
                        this.descTxt.text = "";
                        let valueStr: string;
                        for (let key in attrDict) {
                            // this.descTxt.text += `${GameDef.EJewelName[key][0]} <font color='${Color.GreenCommon}'>+${attrDict[key]}</font>\n`;
                            if (WeaponUtil.isPercentageAttr(Number(key))) {
                                valueStr = `+${attrDict[key] / 100}%\n`;
                            } else {
                                valueStr = `+${attrDict[key]}\n`;
                            }
                            this.descTxt.text += HtmlUtil.html(`${GameDef.EJewelName[key][0]}`, Color.Color_7) + HtmlUtil.html(valueStr, Color.Color_6);
                        }
                    }
                }
            }
            this.baseItem.itemData = this.itemData;
            this.baseItem.numTxt.text = "";
        }
    }
}