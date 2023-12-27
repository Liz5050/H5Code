/**
 * 创建列表item
 * @author zhh
 * @time 2018-07-17 21:18:44
 */
class GuildNewCreatItem extends ListRenderer {
    private imgSelect:fairygui.GImage;
    private txtGuildLv:fairygui.GTextField;
    private txtVip:fairygui.GTextField;
    private txtMember:fairygui.GRichTextField;
    private txtCost:fairygui.GRichTextField;
    private txtCostVip:fairygui.GRichTextField;
    private txtBack:fairygui.GRichTextField;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.imgSelect = this.getChild("img_select").asImage;
        this.txtGuildLv = this.getChild("txt_guild_lv").asTextField;
        this.txtVip = this.getChild("txt_vip").asTextField;
        this.txtMember = this.getChild("txt_member").asRichTextField;
        this.txtCost = this.getChild("txt_cost").asRichTextField;   
        this.txtCostVip = this.getChild("txt_cost_vip").asRichTextField;
        this.txtBack = this.getChild("txt_back").asRichTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        this.txtGuildLv.text = ""+data.guildLv+"级";
        this.txtVip.text = ""+this.fmt(LangGuildNew.L2,data.vipLv);
        this.txtMember.text = ""+(data.memberNum>0?this.fmt(LangGuildNew.L1,HtmlUtil.html(""+data.memberNum,"#0df14b")):"");
        this.txtBack.text = data.contrNum>0?this.fmt(LangGuildNew.L4,HtmlUtil.html(""+data.contrNum,"#0df14b")):"";
        if (index == 0) {
            this.txtCostVip.visible = true;
            this.txtVip.visible = false;
            this.txtCost.text = this.fmt(LangGuildNew.L3, HtmlUtil.html(data.costGold2 + GameDef.EPriceUnitName[data.costUnit2], Color.Color_5));
            this.txtCostVip.text = this.fmt(LangGuildNew.L18, data.vipLv, data.costGold + GameDef.EPriceUnitName[data.unit]);
        } else {
            this.txtCostVip.visible = false;
            this.txtVip.visible = true;
            this.txtCost.text = this.fmt(LangGuildNew.L3, HtmlUtil.html(data.costGold + GameDef.EPriceUnitName[data.unit], Color.Color_5));
        }
	}

    private fmt(str:string,...rest):string{
        return App.StringUtils.substitude(str,rest);
    }

}