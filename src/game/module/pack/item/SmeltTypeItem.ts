/**
 * 合成小类item
 * @author zhh
 * @time 2018-10-09 11:54:03
 */
class SmeltTypeItem extends ListRenderer {


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.text = this._data.smeltTypeName;
		CommonUtils.setBtnTips(this,CacheManager.pack.isCateTypeSmlet(this._data.smeltCategory,this._data.smeltType));
	}


}