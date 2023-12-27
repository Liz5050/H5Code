/**
 * 通用激活
 */
class ActivationController extends BaseController {
    private module: ActivationPanel;

    public constructor() {
        super(ModuleEnum.Activation);
        this.viewIndex = ViewIndex.Two;
    }

    public initView(): BaseGUIView {
        this.module = new ActivationPanel();
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addListen0(LocalEventEnum.ActivationShow, this.onShowActivation, this);
    }

    /**
     * 显示通用的激活界面
     */
    private onShowActivation(data: any): void {
        EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Activation, data);
    }

    private isActivationOpen() : boolean {
        return this.module.isShow;
    }

}