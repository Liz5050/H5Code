/**
 * 仙盟排行榜item
 * @author zhh
 * @time 2019-01-09 16:55:13
 */
class GuildDefendRankItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loaderIco:GLoader;
    private txtName:fairygui.GTextField;
    private txtScore:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtScore = this.getChild("txt_score").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        //SeqMgGuildDefenseRank
        this.c1.setSelectedIndex(this._data.rank_I-1);
        this.txtName.text = this._data.name_S;
        this.txtScore.text = App.MathUtils.formatNum(this._data.points_L64,false);
        this.loaderIco.load(URLManager.getPackResUrl(PackNameEnum.Common,`rank${this._data.rank_I}`));
	}


}