/**
 * 列表项
 */
abstract class ListRenderer2 extends fairygui.GButton{
	/**列表数据 */
	private _listData:Array<any>;
	/**单项数据 */
	private _data:any;

	public constructor() {
		super();
	}

	public setListData(listData: Array<any>):void{
		this._listData = listData;
	}

	public abstract setData(data:any, index: number, component:fairygui.GComponent):void;

	public getData():any{
		return this._data;
	}

	public renderListItem(index: number, obj: fairygui.GObject): void {
		this._data = this._listData[index];
		this.setData(this._data, index, obj.asCom);
	}
}