/**
 * 五色药品Tips
 * @author zhh
 * @time 2018-10-17 11:07:59
 */
class ToolTipDrug2 extends ToolTipBase {
    private baseitem:BaseItem;
    private windowItemtip:fairygui.GImage;
    private line1:fairygui.GImage;
    private txtName:fairygui.GRichTextField;
    private txtUseNum:fairygui.GRichTextField;
    private txtDesc:fairygui.GRichTextField;
	private txtUsageDesc:fairygui.GTextField;
	private txtGain:fairygui.GTextField;
    private txtOpenLevel:fairygui.GRichTextField;
    private txtHadNum:fairygui.GRichTextField;
    private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;
    private extData:any;
    private itemData: ItemData;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipDrug2");
	}

	public initUI(): void {
		super.initUI();
        //---- script make start ----
        this.baseitem = <BaseItem>this.getGObject("baseitem");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.line1 = this.getGObject("line1").asImage;
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.txtUseNum = this.getGObject("txt_useNum").asRichTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
		this.txtUsageDesc = this.getGObject("txt_usageDesc").asTextField;
		this.txtGain = this.getGObject("txt_gain").asTextField;
        this.txtOpenLevel = this.getGObject("txt_openLevel").asRichTextField;
        this.txtHadNum = this.getGObject("txt_hadNum").asRichTextField;

        //---- script make end ----
		this.baseitem.isShowName = false;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);		
		this.toolTipSource = toolTipData.source;
		this.extData = toolTipData.extData;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			let hadNum:number = 0;
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				this.txtName.text = this.itemData.getName(true);
				this.txtDesc.text = this.itemData.getDesc();
				this.txtUsageDesc.text = this.itemData.getItemInfo().usageDesc;
				this.txtGain.text = this.itemData.getItemInfo().gainDesc;
				hadNum = CacheManager.pack.getItemCount(this.itemData.getCode());
				this.txtHadNum.text = HtmlUtil.html('数量：',Color.Color_7)+hadNum;
			}

			this.baseitem.itemData = this.itemData;

            if(toolTipData.extData){
				let num: number = toolTipData.extData["useNum"];
				let maxNum: number = toolTipData.extData["maxNum"];
				let color: string = Color.Color_4;
				if(num >= maxNum){ //已达上限
					color = Color.Color_8;
				}
				this.txtUseNum.text = HtmlUtil.html('当前使用：',Color.Color_7)+`${HtmlUtil.html(num+"/"+maxNum,color)}`;
				let isMax:boolean = toolTipData.extData.isMax; 	
				//this.txtOpenLevel.visible = isMax; 	
				this.txtOpenLevel.text = `(五色石达${HtmlUtil.html(toolTipData.extData.next+"阶",Color.Color_8)}后增加使用上限)`;
			}

		}		
	}

	
}