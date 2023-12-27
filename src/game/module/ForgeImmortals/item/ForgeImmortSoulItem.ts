/**
 * 神兵信息
 * @author zhh
 * @time 2018-08-20 11:31:12
 */
class ForgeImmortSoulItem extends ListRenderer {
    private loaderIco:GLoader;
    private txtName:fairygui.GRichTextField;
    private txtLevel:fairygui.GTextField;
	private imgSelect:fairygui.GImage;

	private isCanAct: boolean;
	private isCanUp: boolean;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtName = this.getChild("txt_name").asRichTextField;
        this.txtLevel = this.getChild("txt_level").asTextField;
		this.imgSelect = this.getChild("img_select").asImage;
        //---- script make end ----

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let itemData:ItemData = new ItemData(this._data.info.itemCode);
		this.txtName.text = itemData.getName();
		this.loaderIco.load(itemData.getIconRes());
		this.imgSelect.visible = CacheManager.forgeImmortals.isPosAct(this._data.roleIndex,this._data.info.position);
		let isTip:boolean = CacheManager.forgeImmortals.isPosCanUp(this._data.roleIndex,this._data.info.position);
		CommonUtils.setBtnTips(this,isTip);

		this.isCanAct = !this.imgSelect.visible && isTip;//可激活
		this.isCanUp = this.imgSelect.visible && isTip;//可升级
	}
	public setLevel(lv:number):void{
		this.txtLevel.text = ""+lv;
	}

	public get isCanActive(): boolean{
		return this.isCanAct;
	}

	public get isCanUpgrade(): boolean{
		return this.isCanUp;
	}

}