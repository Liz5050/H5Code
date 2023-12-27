/**
 * 合成类型的item
 * @author zhh
 * @time 2018-08-13 10:53:18
 */
class GodWingComposeTypeItem extends ListRenderer {
    private loaderIco:GLoader;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIco = <GLoader>this.getChild("loader_ico");

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.loaderIco.load(URLManager.getModuleImgUrl(`type${this._data}.png`,PackNameEnum.GodWing));
	}


}