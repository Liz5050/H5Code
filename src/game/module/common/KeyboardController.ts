/**
 * 键盘模块
 */
class KeyboardController extends BaseController {

	public constructor() {
		super(ModuleEnum.Keyboard);
		if (App.DeviceUtils.IsPC) {
			App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
		}
	}

	protected addListenerOnInit(): void {

	}

	private onKeyUp(keyCode: number): void {
        if (ControllerManager.scene.sceneState != SceneStateEnum.AllReady) {
            return;
		}
		
        switch (keyCode) {
            case Keyboard.ENTER:
                EventManager.dispatch(UIEventEnum.ChatClickSend);
		}
	}
}