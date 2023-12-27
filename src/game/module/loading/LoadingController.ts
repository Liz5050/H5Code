/**
 * 加载过渡场景
 */
class LoadingController extends BaseController {

    private module: LoadingModule;

    public constructor() {
        super(ModuleEnum.Loading);
        if (!Sdk.IsOnlineVersion) {
            this.show();
        }
    }

    public initView(): LoadingModule {
        this.module = new LoadingModule();
        return this.module;
    }

	public addListenerOnShow():void{
        this.addListen0(LocalEventEnum.LoadingProgressUpdate, this.setProgress, this);
	}

    public setProgress(current: number, total: number): void {
        if (this.module.isShow) {
            this.module.setProgress(current, total);
        }
    }
}
