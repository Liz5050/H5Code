/**
 * 穹苍副本爬塔item
 * @author zhh
 * @time 2018-09-29 16:27:32
 */
class QCCopyFloorItem extends ListRenderer {
    private imgSelect:fairygui.GImage;
    private imgGet:fairygui.GImage;
    private txtFloor:fairygui.GTextField;
    private listReward:List;
    private loaderStar:GLoader;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderStar = <GLoader>this.getChild("loader_star");
        this.imgSelect = this.getChild("img_select").asImage;
        this.imgGet = this.getChild("img_get").asImage;
        this.txtFloor = this.getChild("txt_floor").asTextField;
        this.listReward = new List(this.getChild("list_reward").asList,{enableToolTip:false});
        //---- script make end ----
        

	}
	public setData(data:any,index:number):void{		
		this._data = data;
        let cfg:any = ConfigManager.copy.getQCCopyInfo(this._data.floor_I);
		this.itemIndex = index;
        this.imgGet.visible = CacheManager.qcCopy.isMaxStar(this._data);
        let rewards:ItemData[] = [];
        rewards = rewards.concat(RewardUtil.getStandeRewards(cfg.reward));
        rewards = rewards.concat(RewardUtil.getStandeRewards(cfg.firstReward));
        this.listReward.setVirtual(rewards);
        this.txtFloor.text = `第${this._data.floor_I}层`;
        let scale:number = this._data.star_I==0?0.72:0.65;
        this.loaderStar.scaleX = this.loaderStar.scaleY = scale;
        this.loaderStar.load(ConfigManager.copy.getCopyStarUrl(this._data.star_I));
	}


}