/**
 * 增加模块
 */
class LoadingModule extends BaseModule{
	private loadingProgress:fairygui.GProgressBar;

	public constructor() {
		super(ModuleEnum.Loading, PackNameEnum.Loading, "Main", LayerManager.Loading);
	}

	public initOptUI():void{
		this.loadingProgress = this.getGObject("progressBar_loading").asProgress;
	}

	public updateAll():void{

	}

	public setProgress(current:number, total:number):void {
        // this.txtMsg.text = "资源加载中..." + current + "/" + total;
		this.loadingProgress.max = total;
		this.loadingProgress.value = current;
    }
}