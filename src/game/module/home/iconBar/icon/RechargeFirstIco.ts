class RechargeFirstIco extends BaseIcon {
	private icoView:fairygui.GComponent;
	private packageName:string;

	private mcShow:UIMovieClip;
	private mcShow1:UIMovieClip;

	public constructor(iconId:number) {
		super(iconId);
	}

	protected initView():void{
		super.initView();
		this.iconImg.visible = false;
		this.packageName = PackNameEnum.RechargeFirstIco;
		if(!ResourceManager.isPackageLoaded(this.packageName)){
			ResourceManager.load(this.packageName, UIManager.getPackNum(this.packageName), new CallBack(this.onLoadComplete, this));
		}else{
			this.onLoadComplete();
		}		
		this.setPivot(0.5,0.5,false);
		
	}
	private onLoadComplete(): void {
		 this.icoView = FuiUtil.createComponent(this.packageName, this.packageName).asCom;		 
		 this.addChild(this.icoView);		 
		 let cnt:fairygui.GComponent =  this.icoView.getChild("cnt").asCom;
		 if(!this.mcShow){
			 this.mcShow = UIMovieManager.get(PackNameEnum.MCRechargeFirstIco);
		 }
		 cnt.addChild(this.mcShow);
		 /*
		 let cnt1:fairygui.GComponent = this.icoView.getChild("cnt1").asCom;
		 if(!this.mcShow1){
			 this.mcShow1 = UIMovieManager.get(PackNameEnum.MCRCFCircle);
		 }
		 cnt1.addChild(this.mcShow1);
		 */
		 this.setChildIndex(this.icoView,0);
		 
	 }

	 protected changeScale(scale:number):void {
		egret.Tween.removeTweens(this);
		egret.Tween.get(this).to({scaleX:scale,scaleY:scale},50);
	}

	 public setIconSize(width:number,height:number):void{
		 super.setIconSize(155,92);
		 
	 }
	 public showEffect():void {
		 		
		
	}
	 public destroy():void {
		 super.destroy();
		 if(this.icoView){
			 this.icoView.dispose();
			 this.icoView = null;
		 }
		 if(this.mcShow){
			 this.mcShow.destroy();
			 UIMovieManager.push(this.mcShow);
			 this.mcShow = null;
		 }
		 if(this.mcShow1){
			 this.mcShow1.destroy();
			 this.mcShow1 = null;
		 }
	 }
}