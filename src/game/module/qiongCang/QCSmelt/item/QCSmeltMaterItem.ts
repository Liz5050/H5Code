/**
 * 圣物合成列表
 * @author zhh
 * @time 2018-10-29 20:06:12
 */
class QCSmeltMaterItem extends ListRenderer {
    private c2:fairygui.Controller;
    private txtName:fairygui.GTextField;
    private txtCount:fairygui.GTextField;
	private loaderIco:GLoader;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----        
        this.c2 = this.getController("c2");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtCount = this.getChild("txt_count").asTextField;
		this.loaderIco = <GLoader>this.getChild("loader_ico");
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let itemData:ItemData = <ItemData>this._data; 
		let cIdx2:number = 3;
		if(itemData){
			 let icoName:string = URLManager.getModuleImgUrl(`smelt/color_${itemData.getColor()}.png`,PackNameEnum.QiongCang);
			 this.loaderIco.load(icoName);
			 this.txtName.text = itemData.getName(true);
			 let car:number =itemData.getCareer();
			 car = CareerUtil.getBaseCareer(car);
			 cIdx2 = Math.floor(car/2); 
			 this.txtCount.text = ""+itemData.getItemAmount();
		}else{
			this.txtName.text = "";
			this.txtCount.text = "";
			this.loaderIco.clear();
		}
		this.c2.setSelectedIndex(cIdx2);
	}


}