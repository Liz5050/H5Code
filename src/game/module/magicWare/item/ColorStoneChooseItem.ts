/**
 * 五色石升级消耗材料
 * @author zhh
 * @time 2018-10-16 19:11:20
 */
class ColorStoneChooseItem extends ListRenderer {
    private loaderIco:GLoader;
    private txtCount:fairygui.GRichTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtCount = this.getChild("txt_count").asRichTextField;

        //---- script make end ----
		this.loaderIco.addClickListener(this.onClick,this);

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let item:ItemData = <ItemData>this._data;
		let n:number = CacheManager.pack.getItemCount(item.getCode());
		let clr:string = n>0?Color.Color_6:Color.Color_4;
		this.txtCount.text = HtmlUtil.html(n+"",clr);
		this.loaderIco.load(item.getIconRes());
	}

	private onClick(e:any):void{
		let item:ItemData = <ItemData>this._data;
		ToolTipManager.showByCode(item);
	}


}