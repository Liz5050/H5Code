/**
 * 传世技能图标tips
 * @author zhh
 * @time 2018-08-28 20:27:44
 */
class AncientSkillItem extends ListRenderer {
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
		let iconUrl:string = URLManager.getIconUrl(data.skillIcon, URLManager.SKIL_ICON);
		this.loaderIco.load(iconUrl);
	}


}