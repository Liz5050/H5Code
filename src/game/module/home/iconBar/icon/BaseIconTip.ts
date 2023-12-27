class BaseIconTip extends BaseContentView {
	
	private ldr:GLoader;
	private iconResId:number;
	private onImgLoadCb:Function;
	private cbObj:any;
	private mcUI:UIMovieClip;
	private closeObj:fairygui.GComponent;
	public constructor(parent: fairygui.GComponent) {
		super(PackNameEnum.Common,"BaseIcoTip",null,parent);
		this.isPopup = false;
		this.modal = false;
	}
	public initOptUI():void{
		this.ldr = <GLoader>this.getGObject("load_bg");
		this.closeObj = this.getGObject("btn_close").asCom;
		this.closeObj.addClickListener(this.onClickClose,this);
		this.addClickListener(()=>{
			this.hide();
			if(this.iconResId){
				HomeUtil.openByIconId(this.iconResId);
			}
		},this);
	}
	public updateAll(data: any = null): void {
		//iconResId:number,onImgLoadCb:Function=null,cbObj:any=null
		this.iconResId = data.iconResId;
		this.onImgLoadCb = data.onImgLoadCb;		
		this.cbObj = data.cbObj;
		this.closeObj.visible = false;//this.iconResId==IconResId.RechargeFirst;
		if(!this.ldr) {
			this.ldr = ObjectPool.pop("GLoader");			
			this.addChild(this.ldr);
		}
		this.ldr.fill = fairygui.LoaderFillType.ScaleFree;
		this.ldr.autoSize = false;
		this.ldr.addEventListener(GLoader.RES_READY,this.onLdrReadyHandler,this);
		this.ldr.load(this.imgUrl);
	}

	private onLdrReadyHandler():void {
		if(this.ldr) {			
			let width:number = this.ldr.texture.textureWidth;
			let height:number = this.ldr.texture.textureHeight;
			this.ldr.width = width;
			this.ldr.height = height;
			this.setSize(width,height);
			this.ldr.x = 0;
			this.ldr.y = 0;
		}
		if(this.onImgLoadCb && this.cbObj){
			this.onImgLoadCb.call(this.cbObj);
		}
		
		this.setOtherContent(); //load完图片再设置其他内容 比如特效
	}

	private onClickClose(e:egret.TouchEvent):void{
		this.hide();
		e.stopImmediatePropagation();
	}

	private get imgUrl():string {
		return URLManager.getModuleImgUrl("tip/" + this.iconResId + ".png",PackNameEnum.Home);
	}

	private setOtherContent():void{
		switch(this.iconResId){
			case IconResId.RechargeFirst:				
				this.mcUI = UIMovieManager.get(PackNameEnum.MCRCFWeapon, -25,-416,1.2,1.2);
                this.mcUI.rotation = 8.5;
                this.addChild(this.mcUI);
				break;
		}
	}
	
	public destroy():void{
		this.removeFromParent();
		/*
		if(this.ldr){
			this.ldr.removeEventListener(GLoader.RES_READY,this.onLdrReadyHandler,this);
			this.ldr.destroy();
			this.ldr = null;
		}
		*/
		if(this.mcUI){
			this.mcUI.destroy();
			UIMovieManager.push(this.mcUI);
			this.mcUI = null;
		}
		
	}
	

}