/**
 * 运营礼包tabitem
 * @author zhh
 * @time 2018-11-23 15:32:21
 */
class OperatingBtnItem extends ListRenderer {
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
		this.loaderIco.load(this.getBtnLblUrl());
	}
	protected getBtnLblUrl():string{
        let name:string = PanelTabType[this._data].toLowerCase();
        return URLManager.getModuleImgUrl(`ico/${name}.png`,PackNameEnum.Operating);
    }

	public set btnSelected(value:boolean){
		this.selected = value;
	}
	public get btnSelected():boolean{
		return this.selected;
	}

}