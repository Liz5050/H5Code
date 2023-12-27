/**
 * buff面板
 */
class BuffPanel extends BasePopupView {
	private buffList: List;

	public constructor() {
		super(PackNameEnum.Home, "BuffPanel");
	}

	public initUI(): void {
		super.initUI();
		this.buffList = new List(this.getChild("list_buff").asList);
	}

	public updateBuff(buffs:Array<any> = null): void {
		if(buffs == null){
			buffs = CacheManager.buff.getShowBuffs();
		}
		this.buffList.data = buffs;
		this.buffList.list.resizeToFit();
	}

	public onHidden(): void {
		super.onHidden();
		for(let item of this.buffList.list._children){
			(item as BuffItem).stopTimer();
		}
	}
}