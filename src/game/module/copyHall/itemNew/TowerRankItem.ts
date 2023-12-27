/**
 * 诛仙塔显示排行榜item
 * @author zhh
 * @time 2018-06-06 12:08:08
 */
class TowerRankItem extends ListRenderer {
    private static colorArr:string[] = [Color.Color_5,Color.Color_2,Color.Color_8];

    private c1:fairygui.Controller;
    private img1:fairygui.GImage;
    private img2:fairygui.GImage;
    private img3:fairygui.GImage;
    private txtName:fairygui.GRichTextField;
    private txtFloor:fairygui.GRichTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.img1 = this.getChild("img_1").asImage;
        this.img2 = this.getChild("img_2").asImage;
        this.img3 = this.getChild("img_3").asImage;
        this.txtName = this.getChild("txt_name").asRichTextField;
        this.txtFloor = this.getChild("txt_floor").asRichTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let idx:number = this._data.rank_I-1;
        let infArr:string[] = CacheManager.rank.getRankPropertys(this._data);
        this.txtName.text = HtmlUtil.html(infArr[0],TowerRankItem.colorArr[idx]); 
        this.txtFloor.text = HtmlUtil.html(infArr[2],TowerRankItem.colorArr[idx]); 
        this.c1.setSelectedIndex(idx);
        /*
            message TToplist
            {
                optional int32 id_I = 1;
                optional int32 version_I = 2;
                optional int32 toplistType_I = 3;
                optional int32 rank_I = 4;
                optional int32 entityId_I = 5;
                optional string entityName_S = 6;
                optional string entityUid_S = 7;
                optional int32 vipLevel_I = 8;
                optional int32 realmLevel_I = 9;
                optional int32 propertyOne_I = 10;
                optional int32 propertyTwo_I = 11;
                optional int32 propertyThree_I = 12;
                optional int32 ownerId_I = 13;
                optional string ownerName_S = 14;
                optional int64 valueOne_L64 = 15;
                optional int64 valueTwo_L64 = 16;
                optional int64 valueThree_L64 = 17;
                optional int32 serverId_I = 18;
                optional int32 proxyId_I = 19;
                optional int32 lastRank_I = 20;
                optional int32 createDt_DT = 21;
                optional int32 reverse1_I = 22;
                optional int32 reverse2_I = 23;
            };
        */
	}


}