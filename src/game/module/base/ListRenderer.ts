/**
 * 列表项
 */
abstract class ListRenderer extends fairygui.GButton {
	/**单项数据 */
	protected _data: any;
	protected _itemIndex: number;
	private _enabledSound: boolean = false;

	public constructor() {
		super();
	}

	public abstract setData(data: any, index: number): void;

	public getData(): any {
		return this._data;
	}

	public set itemIndex(itemIndex: number) {
		this._itemIndex = itemIndex;
	}

	public get itemIndex(): number {
		return this._itemIndex;
	}

	/**
	 * 该函数是用于管理在Item中自己创建的对象或者某些数据,虚拟列表会在setData之前执行;
	 * 比如聊天的item创建了很多表情动画需要重用 所有自己管理 不交给list管理
	 */
	public recycleChild(): void {
		//自动回收或重置一些数据 子类实现
	}

	protected setState(val: string): void {
		super.setState(val);
		if(this.enabledSound) {
			this.soundVolumeScale = val == fairygui.GButton.DOWN ? 0 : 1;
		} else {
			this.soundVolumeScale = 0;
		}
	}

	/**
	 * 是否启用点击音效
	 */
	public set enabledSound(enabledSound: boolean) {
		this._enabledSound = enabledSound;
	}

	public get enabledSound(): boolean {
		return this._enabledSound;
	}

}