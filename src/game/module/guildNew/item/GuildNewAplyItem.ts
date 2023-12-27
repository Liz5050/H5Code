/**
 * 申请的成员列表Item
 * @author zhh
 * @time 2018-07-18 15:12:47
 */
class GuildNewAplyItem extends ListRenderer {
    private loaderIco:GLoader;
    private imgVip:fairygui.GImage;
    private txtName:fairygui.GTextField;
    private txtFight:fairygui.GRichTextField;
    private btnAgree:fairygui.GButton;
    private btnRefuse:fairygui.GButton;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.imgVip = this.getChild("img_vip").asImage;
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtFight = this.getChild("txt_fight").asRichTextField;
        this.btnAgree = this.getChild("btn_agree").asButton;
        this.btnRefuse = this.getChild("btn_refuse").asButton;

        this.btnAgree.addClickListener(this.onGUIBtnClick, this);
        this.btnRefuse.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data; //SeqPublicMiniPlayer
		this.itemIndex = index; // SPublicMiniPlayer
        this.imgVip.visible = this._data.vipLevel_BY > 0;
        this.txtName.text = this._data.name_S;
        this.txtFight.text = "战斗力："+HtmlUtil.html(""+this._data.warfare_L64,Color.Color_5);
        var icoUrl: string = URLManager.getPlayerHead(this._data.career_SH);
        this.loaderIco.load(icoUrl);
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        let isAgree:boolean = false;
        switch (btn) {
            case this.btnAgree:
                isAgree = true;
                break;
            case this.btnRefuse:
                break;
        }
        EventManager.dispatch(LocalEventEnum.GuildNewReqDealAply,{playerId:this._data.entityId.id_I,isAgree:isAgree});
    }


}