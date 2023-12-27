/**
 * 首充团购人数item
 * @author zhh
 * @time 2018-11-05 15:22:01
 */
class ActGroupBuyCateItem extends ListRenderer {


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data; //得到的团购人数
		this.itemIndex = index;		
		let idx:number = this._data.index;
		let infos:any[] = ConfigManager.mgRecharge.getGroupBuyInfos(idx,this._data.groupNum);
		let showNum:number = infos && infos[0].groupNumShow?infos[0].groupNumShow:this._data.groupNum;
		this.text = `团购${showNum}人`;
		let b:boolean = infos && CacheManager.recharge.isGroupBuyHasGet(infos);
		CommonUtils.setBtnTips(this,b);
	}


}