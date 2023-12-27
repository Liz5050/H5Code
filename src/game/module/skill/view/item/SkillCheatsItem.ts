/**
 * 秘境预览界面图标item
 * @author zhh
 * @time 2018-09-03 16:26:21
 */
class SkillCheatsItem extends ListRenderer {

	public isShowName:boolean = true;

    private loaderIco:GLoader;
    private txtName:fairygui.GTextField;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtName = this.getChild("txt_name").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.txtName.visible = this.isShowName;
		if(this._data){			
			let item:ItemData;
			if(this._data instanceof ItemData){
				item = this._data;
			}else{
				item = this._data.itemData;
			}
			this.txtName.text =item.getName();
			this.loaderIco.load(item.getIconRes());
		}else{
			this.loaderIco.clear();
			this.txtName.text = "";
		}
		
	}

	public setNameVisible(value:boolean):void{
		this.txtName.visible = value;
	}


}