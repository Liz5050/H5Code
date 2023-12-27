/**
 * 神兵item
 * @author zhh
 * @time 2018-08-17 14:28:11
 */
class ForgeImmortalsItem extends ListRenderer {
    private txtName:fairygui.GRichTextField;
	private modelShow:ModelShow;
	private model:fairygui.GComponent
	private imgUse:fairygui.GImage;
	private c1:fairygui.Controller;

	private isCanAct: boolean;
	public constructor() {
		super();
		this.modelShow = new ModelShow(EShape.EShapeMagic);
		this.modelShow.scaleX = this.modelShow.scaleY = 0.95;
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
		this.c1 = this.getController("c1");		
        this.txtName = this.getChild("txt_name").asRichTextField;
		this.imgUse = this.getChild("img_use").asImage;
		this.model = this.getChild("model").asCom;
		(<egret.DisplayObjectContainer>this.model.displayObject).addChild(this.modelShow);
        //---- script make end ----
		
		
	}

	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let immInfo:any = ConfigManager.cltImmortal.getByPk(data.subType);
		this.modelShow.setData(immInfo.modelid);
		this.c1.setSelectedPage(String(immInfo.modelid));
		let suitLv:number = CacheManager.forgeImmortals.getSuitLevel(data.roleIndex,data.subType,true); //套装等级
		this.txtName.text = immInfo.name+HtmlUtil.html(`(${suitLv}阶)`,"#f3f232");
		this.imgUse.visible = CacheManager.forgeImmortals.isImmortalUse(data.roleIndex,data.subType);
		//有红点的情况:1.有部件可激活 2.已经激活 并且身上没有穿戴；3.该神兵可激活，
		let isTip:boolean = CacheManager.forgeImmortals.isSubTypePosCanUp(data.roleIndex,data.subType);
		let isAct:boolean = CacheManager.forgeImmortals.isImmortalAct(data.roleIndex,data.subType);
		this.isCanAct = false;
		if(!isTip){
			//已经激活 并且身上没有穿戴
			this.isCanAct = !isAct && CacheManager.forgeImmortals.isImmortalCanAct(data.roleIndex,data.subType);
			isTip = (isAct && !CacheManager.forgeImmortals.isImmortalHasUse(data.roleIndex)) || this.isCanAct;
		}
		CommonUtils.setBtnTips(this,isTip,173,490);		
		this.modelShow.setMcGrayed(!isAct);
		
	}

	public get isCanActive(): boolean{
		return this.isCanAct;
	}


}