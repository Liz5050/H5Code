class CopyHallTowerPanel extends BaseCopyTabPanel {
	private _towerList: List;
	private _runeList: List;

	private _txt_floorReward: fairygui.GTextField;
	private _txt_floorOpen: fairygui.GTextField;
	private _rewardList: List;
	private _btn_fight: fairygui.GButton;
	private _loader_pass: fairygui.GLoader;
	private _leftImg: fairygui.GImage;
	private _arrowPoint: egret.Point;
	/**当前已经通关的层 */
	private curPassFloor: number = -1;
	private curSelectFloor: number = -1;
	private _isCurPassFloor: boolean;
	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}
	public initOptUI(): void {
		this._towerList = new List(this.getGObject("loader_tower").asList);
		this._towerList.list.scrollPane.bouncebackEffect = false;
		this._runeList = new List(this.getGObject("list_openType").asList);
		this._towerList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onTwerScrollEnd, this);
		//this._towerList.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onTwerScrolling, this);
		this._rewardList = new List(this.getGObject("list_reward").asList);
		this._txt_floorReward = this.getGObject("txt_floorReward").asTextField;
		this._txt_floorOpen = this.getGObject("txt_floorOpen").asTextField;
		this._loader_pass = this.getGObject("loader_pass").asLoader;
		this._leftImg = this.getGObject("left").asImage;

		this._arrowPoint = this._leftImg.parent.localToGlobal(this._leftImg.x, this._leftImg.y);
		this._arrowPoint.y += 45;

		this._btn_fight = this.getGObject("btn_fight").asButton;
		this._btn_fight.addClickListener(this.onFight, this);	

	}
	public updateAll(): void {
		var inf: any = CacheManager.copy.playerCopiesInf;
		if (inf) {
			var floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
			if (floor != this.curPassFloor) {
				this.curPassFloor = floor;
				//初始化塔列表
				var floors: any[] = [];
				var len:number = Math.min(this.curPassFloor + 2,ConfigManager.mgRuneCopy.MAX_FLOOR+1);
				for (var i: number = 0; i <= len; i++) { //
					floors.push(ConfigManager.mgRuneCopy.getByPk(i));
				}
				var topInf: any = floors.shift();
				var floorInfs: any[] = [topInf];
				floorInfs = floorInfs.concat(floors.reverse());
				this._towerList.data = floorInfs;// 0 是塔顶0层的数据;1是最高层;2是当前可以打的最高层,默认选中				
			}
			var dfIdx: number = 2;
			this._towerList.list.scrollToView(0);
			this.selectFloorHandler(this._towerList.data[dfIdx]);
		}
		EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);

	}
	public update(data?: any): void {


	}

	/**选中某层后的处理函数 */
	public selectFloorHandler(floorInf: any): void {
		var floor: number = 0;
		var towerInf: any;
		if (typeof floorInf == "number") {
			floor = floorInf;
		} else {
			floor = floorInf.floor;
			towerInf = floorInf;
		}
		this._isCurPassFloor = floor <= this.curPassFloor;
		this._btn_fight.enabled = !this._isCurPassFloor;
		if (floor > 0 && this.curSelectFloor != floor) {
			this.curSelectFloor = floor;
			this._txt_floorReward.text = "" + floor;
			this._loader_pass.visible = this._isCurPassFloor;
			!towerInf ? towerInf = ConfigManager.mgRuneCopy.getByPk(floor) : null;
			var openInf: any;
			if (!this._isCurPassFloor && towerInf.openType) {
				//当前选中层就可以开启符文
				openInf = towerInf;
			} else {
				//寻找最近一个可以开启符文的层数据 openTypeCode
				openInf = ConfigManager.mgRuneCopy.getOpenTypeInf(floor);
			}
			if (openInf) {
				var openTypeCodes: string[] = (<string>openInf.openTypeCode).split("#");
				var openDatas: any[] = [];
				for (var i: number = 0; i < openTypeCodes.length - 1; i++) {
					openDatas.push({ "item": new ItemData(Number(openTypeCodes[i])) })
				}
				var types: string[] = (<string>openInf.openType).split("#");
				for (i = 0; i < types.length - 1; i++) {
					openDatas.push({ type: Number(types[i]) });
				}
				this._runeList.data = openDatas;
				this._txt_floorOpen.text = "" + openInf.floor;
			} else {
				this._runeList.data = [];
			}

			var itemIds: string[] = (<string>towerInf.rewardShow).split("#");
			itemIds.pop();
			var len: number = itemIds.length;
			var itemDatas: ItemData[] = [];
			if (len > 0) {
				for (var i: number = 0; i < len; i++) {
					var itemData: ItemData = new ItemData(Number(itemIds[i]));
					i == len - 1 ? itemData.itemAmount = towerInf.runeExp : null; //最后一个肯定是符文经验										
					itemDatas.push(itemData);
				}
			}
			this._rewardList.data = itemDatas;
		}


	}

	private onFight(): void {
		EventManager.dispatch(LocalEventEnum.CopyReqEnter, CopyEnum.CopyTower);
		EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.CopyHall);
	}

	private onTwerScrollEnd(evt: any): void {
		var scrollPanel: fairygui.ScrollPane = this._towerList.list.scrollPane;
		var maxDist:number = scrollPanel.contentHeight - scrollPanel.viewHeight; //最大滚动位置		
		var firstIdx: number = this._towerList.list.getFirstChildInView();
		var dataLen: number = this._towerList.data.length;
		var itemObj: TowerCopyItem = <TowerCopyItem>this._towerList.list.getChildAt(firstIdx);
		var curP: egret.Point = itemObj.parent.localToGlobal(itemObj.x, itemObj.y - scrollPanel.posY);
		var preP: egret.Point;
		var preIdx: number = firstIdx;
		while (curP.y < this._arrowPoint.y) {
			preIdx = firstIdx;
			firstIdx++;
			if (firstIdx >= dataLen) {
				break;
			}
			var itemObj: TowerCopyItem = <TowerCopyItem>this._towerList.list.getChildAt(firstIdx);
			preP = curP;
			curP = itemObj.parent.localToGlobal(itemObj.x, itemObj.y - scrollPanel.posY);
		}

		var step: number = 190;
		if (preP) {
			scrollPanel.posY=(preIdx-1)*step;	
			//this._towerList.list.scrollToView(preIdx - 1, false, true);
		}
		if (firstIdx > 0 && firstIdx < dataLen) {
			this.selectFloorHandler(this._towerList.data[firstIdx]);
		}
		
	}
	
	/*
	private onTwerScrolling(evt: any): void {
		this.resetAll();
		this._towerList.list.setBoundsChangedFlag();
	}

	private resetAll(firstIdx:number=-1): void {
		var len: number = this._towerList.data.length - 1;
		var towerItem: TowerCopyItem;
		while (len >= 0) {
			if (len != firstIdx || firstIdx==-1) {
				towerItem = <TowerCopyItem>this._towerList.list.getChildAt(len);
				towerItem.resetTower();
			}
			len--;
		}
	}
	*/


}