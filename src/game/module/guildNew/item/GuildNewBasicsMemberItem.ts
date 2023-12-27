/**
 * 成员列表Item
 * @author zhh
 * @time 2018-07-18 14:21:23
 */
class GuildNewBasicsMemberItem extends ListRenderer {
    private c1:fairygui.Controller;
    private txtName:fairygui.GTextField;
    private txtVip:fairygui.GTextField;
    private txtPos:fairygui.GTextField;
    private txtContri:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtVip = this.getChild("txt_vip").asTextField;
        this.txtPos = this.getChild("txt_pos").asTextField;
        this.txtContri = this.getChild("txt_contri").asTextField;

        //---- script make end ----

	}
	public setData(data:any,index:number):void{		
		this._data = data; // sGuildPlayer
		this.itemIndex = index;
        this.c1.setSelectedIndex(index%2==0?0:1);
        // sGuildPlayer.miniPlayer SPublicMiniPlayer
        this.txtVip.visible = this._data.miniPlayer.vipLevel_BY > 0;
        this.txtVip.text = "V";//+this._data.miniPlayer.vipLevel_BY;
        this.txtName.text = this._data.miniPlayer.name_S;
        this.txtPos.text = CacheManager.guildNew.getPosName(this._data.position_I);
        this.txtContri.text = ""+this._data.totalContribution_I;
	}
   

}