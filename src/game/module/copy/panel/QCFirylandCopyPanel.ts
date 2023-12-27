class QCFirylandCopyPanel extends BaseCopyPanel{
	private _starView:CopyStarPanel;

	public constructor(copyInf: any) {
		super(copyInf,"QCFirylandCopyPanel");
	}
	public initOptUI(): void {
		super.initOptUI();		
		this.XPSetBtn.visible = true;//默认隐藏
		this._starView = new CopyStarPanel(this.getGObject("cnt").asCom);
	}

	public updateAll():void{
		super.updateAll();
		if(!this._starView.isShow){
			this._starView.show(this.copyInf);
		}
		//let process:number = CacheManager.copy.getCopyProcess(CopyEnum.CopyQC);
		//console.log("process",process);			
	}
	public setTimeTipsText(text: string,type:number):void{
		
	}
	public onHide(data?:any):void{
		super.onHide(data);
		if(this._starView){
			this._starView.hide();
		}
	}
	
}