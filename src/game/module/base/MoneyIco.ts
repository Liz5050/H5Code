/**
 * 通用的货币图标
 * @author zhh
 * @time 2018-09-19 11:33:35
 */
class MoneyIco extends ListRenderer {
    private c1:fairygui.Controller;

	public constructor() {
		super();
		this.constructFromXML
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        //---- script make end ----

	}

	public setData(data?:any):void{
		
	}

	/**
	 * 设置图标
	 * @param idx 0铜钱 1元宝
	 */
	public setIcoByIdx(idx:number):void{
		this.c1.setSelectedIndex(idx);
	}

	public setIcoByUnit(unit:EPriceUnit):void{
		let idx:number = 0;
		switch(unit){
			case EPriceUnit.EPriceUnitCoinBind:
				idx = 0;
				break;
			case EPriceUnit.EPriceUnitGold:
				idx = 1;
				break;
		}
		this.setIcoByIdx(idx);
	}

}