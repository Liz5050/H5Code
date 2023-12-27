/**
 * 守护仙盟结算Item
 * @author zhh
 * @time 2019-01-10 14:58:58
 */
class GuildDenfendResultItem extends ListRenderer {
    private txtRank:fairygui.GTextField;
    private txtName:fairygui.GTextField;
    private txtExp:fairygui.GTextField;
    private txtCoin:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtRank = this.getChild("txt_rank").asTextField;
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtExp = this.getChild("txt_exp").asTextField;
        this.txtCoin = this.getChild("txt_coin").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		//SMgGuildDefenseRank
		this._data = data;
		this.itemIndex = index;
		this.txtRank.text = this._data.rank_I+"";
		this.txtName.text = this._data.name_S+"";
		this.txtExp.text = App.MathUtils.formatNum(this._data.value_L64,false)+"";
		this.txtCoin.text = App.MathUtils.formatNum(this._data.points_L64,false)+"";

	}


}