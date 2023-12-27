/**
 * 神羽属性显示组件
 * @author zhh
 * @time 2018-08-10 11:50:03
 */
class GodWingAttrShowCom extends BaseView{
    private txtTitle:fairygui.GTextField;
    private txtFight:fairygui.GTextField;
    private txtAttr:fairygui.GRichTextField;

	public constructor(view:fairygui.GComponent) {
		super(view)
	}
	public initOptUI():void{
        //---- script make start ----
        this.txtTitle = this.getGObject("txt_title").asTextField;
        this.txtFight = this.getGObject("txt_fight").asTextField;
        this.txtAttr = this.getGObject("txt_attr").asRichTextField;
        //---- script make end ----

	}
    /**
     * 刷新 {attr:string,title:string,titleCenter:boolean}
     * @param data {color?:string,attr:string,title:string,titleCenter:boolean}
     */
	public updateAll(data?:any):void{
        let attrDict:any = WeaponUtil.getAttrDict(data.attr);
        let attrStr:string = WeaponUtil.getAttrText2(attrDict,true,Color.Color_8,Color.Color_7,true,false);
		this.txtAttr.text = attrStr;
        this.txtFight.text = "战斗力：" + WeaponUtil.getCombat(attrDict);
        this.txtTitle.text = data.title;
        if(data.titleCenter){
            this.txtTitle.x = 30;
        }else{
            this.txtTitle.x = 0;
        }
	}

    

}