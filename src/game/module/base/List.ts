class List {
	/**已经滚动到最左 */
	public static SCROLL_LEFT:number = 0;
	/**中间位置,左右按钮都显示 */
	public static SCROLL_MIDDLE:number = 1;
	/**已经滚动到最右 */
	public static SCROLL_RIGHT:number = 2;
	public static SCROLL_NONE:number = 3;

	private _list: fairygui.GList;
	private _data: Array<any>;

	private _pageNum:number = 0;
	private _scrollCbFn:Function;
	private _scrollCbObj:any;
	private _isScrollStatus:boolean;

	/**提供一个额外修改listRender属性的接口 */
	protected _renderProps: any;
	protected _autoRecycle: boolean;
	protected _isVirtual: boolean;
	/**解决虚拟列表设置-1位selectIndex无效 */
	public isVirtualLastIndex:boolean = true;
	/**
	 * @param list
	 * @param renderProps 提供一个额外修改listRender属性的接口
	 */
	public constructor(list: fairygui.GList, renderProps: any = null) {
		this._list = list;
		this._renderProps = renderProps;
		this.bouncebackEffect = false;
	}

	public set autoRecycle(value: boolean) {
		this._autoRecycle = value;
	}
	/**是否自己管理(回收)item里面的内容 */
	public get autoRecycle(): boolean {
		return this._autoRecycle;
	}

	public set list(list: fairygui.GList) {
		this._list = list;
	}

	public get list(): fairygui.GList {
		return this._list;
	}

	public set data(data: Array<any>) {
		this._data = data;
		this._isVirtual = false;
		this.removeItemsToPool();
		this.addItemsFromPool(data);
		if(this._isScrollStatus){
			this.checkScrollStatus();
		}
	}

	public get data(): Array<any> {
		return this._data;
	}

	/**
	 * 设置虚拟列表
	 * @param datas 数据列表
	 * 		  itemRenderer(number number, GObject item);
	 * @param itemRenderer 初始化或滚动时触发回调，去根据索引设置Item数据
	 * @param thisObj 回调作用域
	 * @param getListItemResource  可支持不同item类型混合 回调中根据索引判断
	 */
	public setVirtual(datas: any[], itemRenderer: Function = null, thisObj: any = null, getListItemResource: Function = null,isLoop:boolean = false): void {
		this._data = datas;
		this._isVirtual = true;
		if (itemRenderer == null) {
			itemRenderer = this.setItemRenderer;
			thisObj = this;
		}
		if (this._list.itemRenderer != itemRenderer) {
			this._list.itemRenderer = itemRenderer;
		}
		if (getListItemResource != null && this._list.itemProvider != getListItemResource) {
			this._list.itemProvider = getListItemResource;
		}
		if (this._list.callbackThisObj != thisObj) {
			this._list.callbackThisObj = thisObj;
		}
		if(isLoop) {
			this._list.setVirtualAndLoop();	
		}
		else {
			this._list.setVirtual();
		}
		if(!datas) this._list.numItems = 0;
		else this._list.numItems = datas.length;
		if(this._isScrollStatus){
			this.checkScrollStatus();
		}
		
	}

	public getVirtualChild(itemIdx:number):any {
        this.scrollToView(itemIdx);
        let childIdx:number = this.list.itemIndexToChildIndex(itemIdx);
        return this.list.getChildAt(childIdx);
	}

	public setSrcollStatus(pageNum:number,scrollCbFn:Function,scrollCbObj:any):void{
		this._isScrollStatus = true;
		this._pageNum = pageNum;
		this._scrollCbFn = scrollCbFn;
		this._scrollCbObj = scrollCbObj;
		if(this._scrollCbFn && this._scrollCbObj){
			this.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL,this.onScrollHanler,this);
		}
		this.checkScrollStatus();
	}

	private onScrollHanler(e:any):void{
		this.checkScrollStatus();
	}
	private checkScrollStatus():void{
		if(!this.data){
			return;
		}
		let maxPos:number = this.list.scrollPane.contentWidth - this.list.scrollPane.viewWidth;
        let curPos:number = this.list.scrollPane.posX;
		let status:number = List.SCROLL_NONE;
		let isLeft:boolean = curPos>0;
		let isRight:boolean = this.data.length>this._pageNum && curPos!=maxPos;
		if(isLeft && isRight){
			status = List.SCROLL_MIDDLE;
		}else if(!isLeft && isRight){
			status = List.SCROLL_RIGHT;
		}else if(isLeft && !isRight){
			status = List.SCROLL_LEFT;
		}
		if(this._scrollCbFn && this._scrollCbObj){
			this._scrollCbFn.call(this._scrollCbObj,status);
		}
	}
    public changPage(isRight:boolean):void{
        let tarIdx:number = this.list.getFirstChildInView();       
        if(isRight){
            tarIdx = Math.min(this.data.length-1,tarIdx+this._pageNum);
        }else{
            tarIdx = Math.max(tarIdx-this._pageNum,0);
        }
        this.scrollToView(tarIdx,false,true);
    }

	private setItemRenderer(index: number, item: fairygui.GObject): void {
		if (item["setData"] == undefined) return;
		if(this._autoRecycle && item instanceof ListRenderer){
			item.recycleChild();
		}
		this.setItemProps(item);
		item["setData"](this._data[index], index);
		
	}

	protected removeItemsToPool(): void {
		if (this._autoRecycle) {
			while (this.list.numChildren > 0) {
				let item: ListRenderer = <ListRenderer>this.list.removeChildAt(0);
				item.recycleChild();
				this.list.returnToPool(item);
			}
		} else {
			this.list.removeChildrenToPool();
		}
	}

	protected addItemsFromPool(data: Array<any>): void {
		if (data != null && data.length > 0) {
			let len: number = data.length;
			for (let i: number = 0; i < len; i++) {
				let listRenderer: ListRenderer = <ListRenderer>this.list.addItemFromPool();
				this.setItemProps(listRenderer);
				listRenderer.setData(data[i], i);				
			}
		}
	}

	protected setItemProps(item: fairygui.GObject):void{
		if (this._renderProps) {
			ObjectUtil.copyProToRef(this._renderProps,item);
		}
	}

	public set renderProps(value:any){
		this._renderProps = value;
	}
	
	/**
	 * 更新单个列表项
	 */
	public updateListItem(index: number, data: any): void {
		this._data[index] = data;
		let listRenderer: ListRenderer = <ListRenderer>this.list.getChildAt(index);
		listRenderer.setData(data, index);
	}

	/**
	 * 删除单个列表项
	 */
	public deleteListItem(index: number): void {
        let item: ListRenderer = <ListRenderer>this.list.removeChildAt(index);
		this.list.returnToPool(item);
		if (this._autoRecycle) {
			item.recycleChild();
		}
		this._data.splice(index, 1);
	}

	public scrollToView(index: number, ani: boolean = false, setFirst: boolean = false): void {
		if (this.data && this.data.length > 0) {
			this.list.scrollToView(index, ani, setFirst);
		}
	}

	/**获取视野内最后一个item的下标 */
	public getLastChildInView(): number {
        let cnt: number = this.list._children.length;
		let firstInView: number = this.list.getFirstChildInView();
		firstInView = Math.max(firstInView, 0);
		for (let i: number = firstInView; i < cnt; ++i) {
			let child: fairygui.GObject = this.list._children[i];
			if (!this.list.isChildInView(child)) {
				let idx: number = i - 1;
				return idx;
			}
		}
		return -1;
	}
	/**对应垂直方向的list 或者后面不在视野内的item个数 */
	public getLastNotInViewChildNum(): number {
		let n: number = 0;
		let inViewIdx: number = this.getLastChildInView();
		if (inViewIdx > -1) {
			inViewIdx++;
			n = this.list._children.length - inViewIdx;
		}
		return n;
	}
	/**
	 * 判断某个item是否在视野内
	 */
	public isChildInView(index: number): boolean {
		index = this.list.itemIndexToChildIndex(index);
		let b: boolean = false;
		if (index >= 0) {
			let child: fairygui.GObject = this.list.getChildAt(index);
			b = this.checkInView(child);//this.list.isChildInView(child);
		}
		return b;
	}

	public checkInView(child: fairygui.GObject): boolean {
		if (this.list._rootContainer.scrollRect != null) {
			return child.x + child.width >= 0 && child.x <= this.list.width
				&& child.y + child.height >= 0 && child.y <= this.list.height;
		}
		else if (this.list._scrollPane != null) {
			let dist: number = child.y + this.list._container.y;
			if (dist < -child.height || dist > this.list._scrollPane.viewHeight) {
				return false;
			}
			dist = child.x + this.list._container.x;
			// -(child.x + child.width) >= this.list._container.x
			if (dist <= -child.width || dist >= this.list._scrollPane.viewWidth) {
				return false;
			}
			return true;
		}
		else
			return true;
	}

	/**
	 * 获取选中的项
	 */
	public get selectedItem(): any {
		let selectedIndex: number = this.selectedIndex;
		if (selectedIndex != -1) {
			let childIndex: number = selectedIndex;
			if (this._isVirtual) {
				childIndex = this._list.itemIndexToChildIndex(selectedIndex);
			}
			return this._list.getChildAt(childIndex);
		}
		return null;
	}

	/**
	 * 获取选中的数据
	 */
	public get selectedData(): any {
		if(this._data instanceof Array) {
            let selectedIndex: number = this.selectedIndex;
            if (selectedIndex != -1 && selectedIndex < this._data.length) {
                return this._data[selectedIndex];
            }
        }
		return null;
	}

	public set selectedIndex(selectedIndex: number) {
		this._list.selectedIndex = selectedIndex;
	}

	public get selectedIndex(): number {
		if (this._isVirtual && this.isVirtualLastIndex) {
			return this._list["_lastSelectedIndex"];
		} else {
			return this._list.selectedIndex;
		}
	}
	/**
	 * 设置回弹效果
	 */
	public set bouncebackEffect(value: boolean) {
		if (this._list.scrollPane != null) {
			this._list.scrollPane.bouncebackEffect = value;
		}
	}

	/**
	 * 列表项是否溢出了
	 */
	public get canScroll():boolean {
		let itemNums:number = 0;
		if(this.data) {
			itemNums = this.data.length;
		}
		return this.list.width <= this.list.getMaxItemWidth() * itemNums + (itemNums-1) * this.list.columnGap;
	}

	public refresh(): void {
		let selectedIndex: number = this.selectedIndex;
		this.data = this._data;
		this.selectedIndex = selectedIndex;
	}

	public callItemsFunc(funcName:string, ...args): void {
		let idx:number = 0;
		let item:any;
		while (idx < this.list.numChildren) {
			item = this.list.getChildAt(idx);
            item[funcName].apply(item, args);
			idx++;
		}
	}
}