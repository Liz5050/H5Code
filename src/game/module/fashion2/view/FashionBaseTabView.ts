/**
 * 预留时装基类，扩展共用视图
 */
class FashionBaseTabView extends BaseTabView {
	private _roleIndex:number = -1;
	public constructor() {
		super();
	}

	public initOptUI():void {
	}

	public set roleIndex(index:number) {
		this._roleIndex = index;
		this.updateRoleIndexView();
	}

	public get roleIndex():number {
		return this._roleIndex;
	}

	protected updateRoleIndexView():void {
	}
}