/**
 * 神羽大师tips组件
 * @author zhh
 * @time 2018-08-13 22:19:40
 */
class GodWingMasterInfo extends BaseView{
    private c1:fairygui.Controller;
    private windowItemtip:fairygui.GImage;
    private txtTitle:fairygui.GTextField;
    private txtDesc:fairygui.GRichTextField;

	public constructor(view:fairygui.GComponent) {
		super(view)
	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtTitle = this.getGObject("txt_title").asTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;

        //---- script make end ----


	}
	public updateAll(data?:any):void{
		let idx:number = data.isAct?0:1;
        this.c1.setSelectedIndex(idx);
        this.txtTitle.text = data.info.suitName;
        let str:string = "";
        if(!data.isAct){
            let n:number = CacheManager.godWing.getSuitLevelNum(data.roleIndex,data.info.level)
            str = HtmlUtil.html("  "+n+"/4","#ec422e",false);
        }
        this.txtDesc.text = App.StringUtils.substitude(LangGodWing.L6,data.info.level)+str+HtmlUtil.brText+data.info.effectDesc;
	}


}