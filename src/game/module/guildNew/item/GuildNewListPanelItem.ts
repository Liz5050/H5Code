/**
 * 
 * @author zhh
 * @time 2018-07-19 16:00:47
 */
class GuildNewListPanelItem extends ListRenderer {
    private loaderRank:GLoader;
    private txtRank:fairygui.GTextField;
    private txtGuildName:fairygui.GTextField;
    private txtLeader:fairygui.GTextField;
    private txtLv:fairygui.GTextField;
    private txtCount:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderRank = <GLoader>this.getChild("loader_rank");
        this.txtRank = this.getChild("txt_rank").asTextField;
        this.txtGuildName = this.getChild("txt_guild_name").asTextField;
        this.txtLeader = this.getChild("txt_leader").asTextField;
        this.txtLv = this.getChild("txt_lv").asTextField;
        this.txtCount = this.getChild("txt_count").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let isLater:boolean = this._data.rank_I>3;
        this.txtRank.visible = isLater;
        if(isLater){
            this.loaderRank.clear();
            this.txtRank.text = ""+this._data.rank_I;
        }else{
            this.loaderRank.load(URLManager.getPackResUrl(PackNameEnum.Common,`rank${this._data.rank_I}`));
        }
        this.txtGuildName.text = this._data.guildName_S;
        this.txtLeader.text = this._data.leaderName_S;
        this.txtLv.text = "等级:"+HtmlUtil.html(this._data.level_I+"",Color.Color_8);
        let clr:string = this._data.playerNum_I==this._data.maxPlayerNum_I?Color.Color_4:Color.Color_6;
        this.txtCount.text = "人数："+HtmlUtil.html(this._data.playerNum_I + "/" + this._data.maxPlayerNum_I,clr);
	}


}