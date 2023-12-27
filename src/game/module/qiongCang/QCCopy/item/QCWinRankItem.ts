/**
 * 穹苍副本排行榜界面item
 * @author zhh
 * @time 2018-10-08 15:01:35
 */
class QCWinRankItem extends ListRenderer {
    private loaderRank:GLoader;
    private txtName:fairygui.GTextField;
    private txtFloor:fairygui.GTextField;
    private txtTime:fairygui.GTextField;
    private txtRank:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderRank = <GLoader>this.getChild("loader_rank");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtFloor = this.getChild("txt_floor").asTextField;
        this.txtTime = this.getChild("txt_time").asTextField;
        this.txtRank = this.getChild("txt_rank").asTextField;
        
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        this.txtName.text = this._data.entityName_S;
        this.txtFloor.text = "第"+this._data.valueOne_L64+"层";
        this.txtTime.text = App.DateUtils.formatSeconds(Math.abs(this._data.valueTwo_L64),DateUtils.FORMAT_SECONDS_4);
        
        if(this._data.rank_I>3){
            this.txtRank.text = "" + this._data.rank_I;
            this.loaderRank.clear();
        }else{
            this.txtRank.text = "";
            this.loaderRank.load(URLManager.getPackResUrl(PackNameEnum.Common,"rank"+this._data.rank_I));
        }
	}


}