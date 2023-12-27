class List2 {
	private _list: fairygui.GList;
	private _listRenderer: ListRenderer2;
	private _data: Array<any>;

	public constructor(list: fairygui.GList, listRenderer: ListRenderer2) {
		this._list = list;
		this.listRenderer = listRenderer;
	}

	public set listRenderer(listRenderer: ListRenderer2) {
		this._listRenderer = listRenderer;
		this._list.itemRenderer = this._listRenderer.renderListItem;
		this._list.callbackThisObj = this._listRenderer;
	}

	public set list(list: fairygui.GList) {
		this._list = list;
	}

	public get list(): fairygui.GList {
		return this._list;
	}

	public set data(data: Array<any>) {
		this._data = data;
		this._listRenderer.setListData(data);
		this._list.numItems = data.length;
	}

	/**
	 * 更新单个列表项
	 */
	public updateListItem(index:number, data:any):void{
		this._data[index] = data;
		this._listRenderer.renderListItem(index, this._list.getChildAt(index));
	}
}