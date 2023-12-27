class WorldBossAttrTipsPanel extends BaseContentView {
	private list_information:List
	public constructor() {
		super(PackNameEnum.WorldBoss,"BossAttrTips")
		this.isCenter = true;
		this.modal = true;
	}
	public initOptUI():void{
		this.list_information = new List(this.getGObject("list_information").asList);
		
		this.addClickListener(this.onClickSelf,this);
	}
	public updateAll(data:any=null):void{
		var showAttr:string[] = CommonUtils.configStrToArr(data.showAttr,false);
		this.list_information.setVirtual(showAttr);
	}
	public showModal(isShow: boolean): void {
		super.showModal(isShow);
		if(this._modalLayer){
			if(isShow){
				this._modalLayer.addClickListener(this.onClickSelf,this);
			}else{
				this._modalLayer.removeClickListener(this.onClickSelf,this);
			}			
		}
	}
	private onClickSelf(e:any):void{
		this.hide();
	}
}