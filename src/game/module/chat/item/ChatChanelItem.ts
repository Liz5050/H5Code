/**
 * 聊天频道item
 * @author zhh
 * @time 2018-10-25 11:10:00
 */
class ChatChanelItem extends ListRenderer {


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
		this.text = this._data.label;
	}


}