/**
 * 符文总览窗口
 */
class RunePandectWindow extends BaseWindow{
	private runeList: List;
	private packItem: Array<any>;

	public constructor() {
		super(PackNameEnum.Rune, "WindowRunePandect");
	}
	public initOptUI():void{
		this.runeList = new List(this.getGObject("list_rune").asList);
		this.updateRuneList();
		
	}

	public updateAll():void{
		// this.updateRuneList();
		this.runeList.scrollToView(0);
	}

	/**更新符文总览列表 */
	public updateRuneList(): void{
		let towerCopyData: Array<any> = ConfigManager.mgRuneCopy.getAllOpenTypeInf();
		// this.runeList.data = towerCopyData;
		this.runeList.setVirtual(towerCopyData);
	}
}