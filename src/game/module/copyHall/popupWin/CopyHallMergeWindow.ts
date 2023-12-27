
/**合并次数弹窗 */
class CopyHallMergeWindow extends BaseWindow {

	private txt_consume1:fairygui.GTextField;
	private txt_consume3:fairygui.GTextField;

	private btn_confirm:fairygui.GButton;
	private btn_cancel:fairygui.GButton;
	private btn_add:fairygui.GButton;
	private btn_explain:fairygui.GButton;

	public constructor() {
		super(PackNameEnum.Copy,"WindowCopymerge");
	}

	public initOptUI():void{
		this.txt_consume1 = this.getGObject("txt_consume1").asTextField;
		this.txt_consume3 = this.getGObject("txt_consume3").asTextField;

		this.btn_add = this.getGObject("btn_add").asButton;
		this.btn_explain = this.getGObject("btn_explain").asButton;
		this.btn_confirm = this.getGObject("btn_confirm").asButton;
		this.btn_cancel = this.getGObject("btn_cancel").asButton;
		
	}

	public updateAll():void{

	}

}