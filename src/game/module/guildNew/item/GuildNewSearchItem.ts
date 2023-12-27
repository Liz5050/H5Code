/**
 * 搜索列表item
 * @author zhh
 * @time 2018-07-17 21:18:30
 */
class GuildNewSearchItem extends ListRenderer {
    private txtRank:fairygui.GTextField;
    private txtGuildName:fairygui.GRichTextField;
    private txtLeaderName:fairygui.GRichTextField;
    private txtNum:fairygui.GRichTextField;
    private txtFight:fairygui.GRichTextField;
    private btnAply:fairygui.GButton;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.btnAply = this.getChild("btn_aply").asButton;
        this.txtRank = this.getChild("txt_rank").asTextField;
        this.txtGuildName = this.getChild("txt_guild_name").asRichTextField;
        this.txtLeaderName = this.getChild("txt_leader_name").asRichTextField;
        this.txtNum = this.getChild("txt_num").asRichTextField;
        this.txtFight = this.getChild("txt_fight").asRichTextField;

        //---- script make end ----
        this.btnAply.addClickListener(this.onClick,this);

	}
	public setData(data:any,index:number):void{		
		this._data = data; //SMiniGuildInfo
		this.itemIndex = index;
        this.txtRank.text = ""+this._data.rank_I;
        this.txtGuildName.text = ""+this._data.guildName_S+HtmlUtil.html(`(Lv${this._data.level_I})`,Color.Color_2);
        this.txtLeaderName.text = "盟主：" + this._data.leaderName_S; //HtmlUtil.html(,"#0178fe");
        let clr:string = this._data.playerNum_I>=this._data.maxPlayerNum_I?Color.Color_4:Color.Color_6;
        this.txtNum.text = "人数："+HtmlUtil.html(`${this._data.playerNum_I}/${this._data.maxPlayerNum_I}`,clr);
        this.txtFight.text = "战力要求：" + App.MathUtils.formatNum(this._data.ApplyWarfare_L64,false);
        this.setAplyStatus(this._data.apply_B);
	}

    private setAplyStatus(isAply:boolean):void{
        App.DisplayUtils.grayButton(this.btnAply,isAply,isAply);
        this.btnAply.text = isAply?"已申请":"申  请";  
    }

    private onClick():void{        
        if(CacheManager.role.combatCapabilities<this._data.ApplyWarfare_L64){
            Tip.showTip(LangGuildNew.L11);
            return;
        }
        //点击申请        
        if(!CacheManager.guildNew.isAplyJoin(this._data.guildId_I)){
            this.setAplyStatus(true);
            EventManager.dispatch(LocalEventEnum.GuildNewReqAplyJoin,this._data.guildId_I);
            
        }
        
    }

}