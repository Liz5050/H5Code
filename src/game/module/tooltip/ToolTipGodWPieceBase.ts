/**
 * 
 * @author zhh
 * @time 2018-06-11 17:34:44
 */
class ToolTipGodWPieceBase extends ToolTipBase {
    protected loaderImg:GLoader;
    protected windowItemtip:fairygui.GImage;
    protected line2:fairygui.GImage;
    
    protected txtBase:fairygui.GRichTextField;
    protected txtName:fairygui.GRichTextField;

	public constructor(pkg:string,contentName:string) {
		super(pkg,contentName);
	}

	public initUI(): void {
		super.initUI();
        //---- script make start ----
        this.loaderImg = <GLoader>this.getGObject("loader_img");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.line2 = this.getGObject("line2").asImage;
        
        this.txtBase = this.getGObject("txt_base").asRichTextField;
        this.txtName = this.getGObject("txt_name").asRichTextField;

        //---- script make end ----

	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);		
		if (toolTipData) {
			let data:any = toolTipData.data; //神器表配置
            let code:number = ObjectUtil.getConfigVal(data,"code");
		    let piece:number = ObjectUtil.getConfigVal(data,"piece");
            this.txtName.text = data.pieceName;
            let str:string = WeaponUtil.getAttrText2(WeaponUtil.getAttrDict(data.attr),true,"#f2e1c0","#c8b185",true,false);
            this.txtBase.text = str;  // 
            let url:string = ConfigManager.godWeapon.getPieceUrl(data);
            this.loaderImg.load(url);
		}		
	}

	
}