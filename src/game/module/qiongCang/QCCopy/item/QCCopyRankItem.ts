/**
 * 穹苍副本爬塔排行
 * @author zhh
 * @time 2018-09-29 16:27:45
 */
class QCCopyRankItem extends ListRenderer {
    private static clrs:string[] = [Color.Color_5,Color.Color_2,Color.Color_8];
    private c1:fairygui.Controller;
    private txtName:fairygui.GTextField;
    private txtFloor:fairygui.GTextField;
    private txtTime:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtFloor = this.getChild("txt_floor").asTextField;
        this.txtTime = this.getChild("txt_time").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let clr:string = QCCopyRankItem.clrs[index];
        this.txtName.text = HtmlUtil.html(this._data.entityName_S,clr);
        this.txtFloor.text = HtmlUtil.html(this._data.valueOne_L64+"层",clr);
        this.txtTime.text = HtmlUtil.html(App.DateUtils.formatSeconds(Math.abs(this._data.valueTwo_L64),DateUtils.FORMAT_SECONDS_4),clr);
        this.c1.setSelectedIndex(this._data.rank_I-1);
	}
    
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