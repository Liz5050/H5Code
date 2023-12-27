class HomeTopIconBar extends BaseIconContainer {
	// private loginRewardIcon: LoginRewardIcon;//登录奖励图标
	private _isShow:boolean = true;
	private line2Num: number = 0;//第3行图标个数
	public constructor() {
		super();
		// this.dirY = -1;
		this.maxCount = 99;//行数固定，确保一行能排下所有图标
		this.iconWidth = 98;
		this.iconHeight = 92;
		this.iconVSpace = 0;
		this.iconHSpace = 5;
		this._isShow = true;
	}

	protected addIconSuccess():void {
		if(!this.isShow) {
			//缩进状态，新增图标自动弹出
			// this.goTween(true);
			EventManager.dispatch(UIEventEnum.HomeTopIconShowChange);
		}
	}

	public goTween(isShow:boolean): void {
		if(this._isShow == isShow) return;
		this._isShow = isShow;
		let _posX: number;
		if (this._isShow) {
			_posX = fairygui.GRoot.inst.width - 130;
		} 
		else {
			_posX = fairygui.GRoot.inst.width + this.allIcons.length * (this.iconWidth + this.iconHSpace);
		}
		egret.Tween.removeTweens(this.parent);
		egret.Tween.get(this.parent).to({ x: _posX }, 400, egret.Ease.backInOut);
		// SwitchBossLifeBarVisible
		CacheManager.checkPoint.isShowBossLife = !this._isShow;
	}

	protected updateIconPosition(): void {
		this.line2Num = 0;
		this.allIcons.sort(this.iconSortFuc);
		let num: number = -1;
		let count: number = 0;
		let lastLine: number = -1;
		let line:number;
		let waitList:{[line:number]:BaseIcon[]} = {};
		let iconLimit:number = 7;
		for (let i: number = 0; i < this.allIcons.length; i++) {
			let _col: number;
			let _row: number;
			let _icon: BaseIcon = this.allIcons[i];
			line = HomeUtil.getTopIconLine(_icon.iconResId);
			if (line == 2) {
				this.line2Num += 1;
			}
			if(line == 0) iconLimit = 4;
			else iconLimit = 6;
			let waitCount:number = waitList[line] != null ? waitList[line].length : 0;
			if(line != lastLine) {
				let lastWaitCount:number = waitList[lastLine] != null ? waitList[lastLine].length : 0;
				if(lastWaitCount > 0) {
					count = count - waitCount;//上一行本身排了几个图标，补位起始列数就是几
					for(let k:number = 0; k < waitList[lastLine].length; k++) {
						_col = ((count + k) % this.rowMaxCount) * this.dirX;
						_row = lastLine * this.dirY;
						waitList[lastLine][k].setXY(_col * (this.iconWidth + this.iconHSpace), _row * (this.iconHeight + this.iconVSpace));
					}
				}
				lastLine = line;
				count = 0;
			}
			else if(count + waitCount >= iconLimit) {
				let nextLine:number = line + 1;
				if(!waitList[nextLine]) {
					waitList[nextLine] = [];
				}
				waitList[nextLine].push(_icon);
			}
			_col = (count % this.rowMaxCount) * this.dirX;
			_row = line * this.dirY;
			_icon.setXY(_col * (this.iconWidth + this.iconHSpace), _row * (this.iconHeight + this.iconVSpace));
			count ++;

			if(i == this.allIcons.length - 1 && waitCount > 0) {
				let nextLine:number = line + 1;
				let nextWaitCount:number = waitList[nextLine] != null ? waitList[nextLine].length : 0;
				//count当前行原本总图标数 - 需要补位到下一行的图标数 = 当前行已排图标数
				//当前行本身已排的图标数量即为补位起始列数
				count = count - nextWaitCount;
				//最后一个图标了,补齐剩余补位图标
				let j:number = 0;
				for(j = 0; j < waitCount; j++) {
					_col = ((count + j) % this.rowMaxCount) * this.dirX;
					_row = line * this.dirY;
					waitList[line][j].setXY(_col * (this.iconWidth + this.iconHSpace), _row * (this.iconHeight + this.iconVSpace));
				}
				if(waitList[nextLine] != null) {
					for(j = 0; j < waitList[nextLine].length; j++) {
						_col = (j % this.rowMaxCount) * this.dirX;
						_row = nextLine * this.dirY;
						waitList[nextLine][j].setXY(_col * (this.iconWidth + this.iconHSpace), _row * (this.iconHeight + this.iconVSpace));
					}
				}
			}
		}
	}

	// /**
    //  * 更新登录奖励图标
    //  */
    // public updateLoginRewardIcon(): void {
    //     let isShow: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Welfare, false) && CacheManager.welfare2.isLoginRewardPanelShow();
    //     if(isShow) {
    //         if (this.loginRewardIcon == null) {
    //             this.loginRewardIcon = FuiUtil.createComponent(PackNameEnum.Home, "LoginRewardIcon") as LoginRewardIcon;
    //             this.addChild(this.loginRewardIcon);
    //         }
    //         let index: number = this.line2Num;//从0开始
    //         let col: number = index * this.dirX;
    //         let row: number = 2;
    //         this.loginRewardIcon.setXY(col * (this.iconWidth + this.iconHSpace), row * (this.iconHeight + this.iconVSpace));
    //         this.loginRewardIcon.updateAll();
    //     } else {
    //         if(this.loginRewardIcon != null) {
    //             this.loginRewardIcon.removeFromParent();
    //         }
    //     }
    // }

	public get isShow():boolean {
		return this._isShow;
	}
}