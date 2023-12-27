/**
 * 合成细分按钮（道具等合成，不包括装备合成）
 */
class ComposeTypeItem extends ListRenderer{
	public constructor() {
		super();
	}

	public setData(data: any): void{
		this._data = data;
		this.title = (new ItemData(data.showItemCode)).getName();
	}
}