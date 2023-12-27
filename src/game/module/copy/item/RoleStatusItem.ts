/**
 * 守卫神剑副本角色头像item
 * @author zhh
 * @time 2018-09-25 16:48:58
 */
class RoleStatusItem extends ListRenderer {
    private loader:GLoader;
    private imgIco:fairygui.GImage;
	private lifeBar:UIProgressBar;
	private txtTime:fairygui.GTextField;
	private _roleIndex:number = 0;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
		this.lifeBar = <UIProgressBar>this.getChild("progressBar");
        this.loader = <GLoader>this.getChild("loader");
        this.imgIco = this.getChild("img_ico").asImage;
		this.txtTime = this.getChild("txt_time").asTextField;
        //---- script make end ----
		this.lifeBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_6"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_8"),105,12,2,0);		
		this.lifeBar.labelType = BarLabelType.None;
		this.txtTime.text = "";
	}

	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this._roleIndex = data.index_I?data.index_I:0;
		let entitiInfo:EntityInfo = CacheManager.role.getEntityInfo(this._roleIndex);
		this.lifeBar.setValue(entitiInfo.life_L64,entitiInfo.maxLife_L64);
		this.loader.load(URLManager.getPlayerHead(data.career_I));
		let isDe:boolean = entitiInfo.life_L64<=0;
		this.loader.grayed = isDe;		
		if(!CacheManager.copy.isDfReliveCd(this._roleIndex) && this.txtTime.text!=""){
			this.txtTime.text = "";
		}
		let isShow:boolean = CacheManager.copy.isDefendBuff(0); //0号角色通用所有角色
		this.imgIco.visible = isShow && !isDe;
	}

	public updateTime():void{
		CacheManager.copy.dfReliveCD[this._roleIndex]--;		
		let sec:number = CacheManager.copy.dfReliveCD[this._roleIndex];
		if(sec>0){
			this.txtTime.text = sec+"";
		}else{
			
			this.txtTime.text = "";
		}
		if(CacheManager.copy.dfReliveCD[this._roleIndex]==0){
			this.txtTime.text = "";
			//发送复活接口
			EventManager.dispatch(LocalEventEnum.Revive,{revivalType:ERevivalType.ERevivalTypeInSitu,
				priceUnit:EPriceUnit.EPriceUnitGold,
				roleIndex:this._roleIndex});
		}		
	}

	public get roleIndex():number{
		return this._roleIndex;
	}

}