/**
 * 诛仙榜
 * @author zhh
 * @time 2018-08-10 17:59:22
 */
class TowerRankWinItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loaderIco:GLoader;
    private txtName:fairygui.GTextField;
    private txtVip:fairygui.GTextField;
    private txtFloor:fairygui.GTextField;
    private txtRank:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtVip = this.getChild("txt_vip").asTextField;
        this.txtFloor = this.getChild("txt_floor").asTextField;
        this.txtRank = this.getChild("txt_rank").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let idx:number = this._data.rank_I%2==0?1:0;
        let infArr:string[] = CacheManager.rank.getRankPropertys(this._data);
        this.txtName.text = infArr[0];
        this.txtRank.text = this._data.rank_I+"";
        this.txtFloor.text = this._data.valueOne_L64+"层";
        this.txtVip.visible = this._data.vipLevel_I > 0;
        this.txtVip.text = "V";//this._data.vipLevel_I
        //this.c1.setSelectedIndex(idx);
        let isTop:boolean = this._data.rank_I<=3;
        if(isTop){
            this.loaderIco.load(URLManager.getPackResUrl(PackNameEnum.Common,`rank${this._data.rank_I}`));
        }else{
            this.loaderIco.clear();
        }
        this.txtRank.visible = !isTop; 

        
	}


}