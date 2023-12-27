/**
 * 副本中需要弹出一个框操作的基类
 */
class CopyBasePopupWin extends BaseWindow {
	protected btn_cancel: fairygui.GButton;
	protected btn_confirm: fairygui.GButton;
	protected hasBtn: boolean;
	protected _data:any;
	public constructor(pkgName: string, contentName: string, hasBtn: boolean = true) {
		super(pkgName, contentName);
		this.hasBtn = hasBtn;

	}

	public initOptUI(): void {

		if (this.hasBtn) {
			this.btn_confirm = this.getGObject("btn_confirm").asButton;
			this.btn_cancel = this.getGObject("btn_cancel").asButton;

			this.btn_confirm.addClickListener(()=>{
				this.onBtnClick(true);
			},this);
			this.btn_cancel.addClickListener(()=>{
				this.onBtnClick(false);
			},this);
		}

	}

	protected onBtnClick(isOk:boolean): void {
		if(!isOk){
			this.hide();
		}
	}

	public updateAll(data: any = null): void {
		this._data = data;
	}
}