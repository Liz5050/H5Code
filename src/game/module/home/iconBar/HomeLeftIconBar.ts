class HomeLeftIconBar extends BaseIconContainer {
    // private loginRewardIcon: LoginRewardIcon;//登录奖励图标

    private _isShow: boolean = true;

    public constructor() {
        super();
        this.dirY = 1;
        this.dirX = 1;
        this.maxCount = 4;
        this.iconWidth = 98;
        this.iconHeight = 92;
        this.iconVSpace = 6;
        this.iconHSpace = 0;
        this._isShow = true;
    }

    protected updateIconPosition(): void {
        this.allIcons.sort(this.iconSortFuc);
        for (let i: number = 0; i < this.allIcons.length; i++) {
            let _icon: BaseIcon = this.allIcons[i];
            let _col: number = Math.floor(i / this.rowMaxCount) * this.dirX;
            let _row: number = (i % this.rowMaxCount) * this.dirY;
            _icon.setXY(_col * (this.iconWidth + this.iconHSpace), _row * (this.iconHeight + this.iconVSpace));
        }
        // this.updateLoginRewardIcon();
    }

    /**
     * 更新登录奖励图标
     */
    // public updateLoginRewardIcon(): void {
    //     let isShow: boolean = ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Welfare, false) && CacheManager.welfare2.isLoginRewardPanelShow();
    //     if(isShow) {
    //         if (this.loginRewardIcon == null) {
    //             this.loginRewardIcon = FuiUtil.createComponent(PackNameEnum.Home, "LoginRewardIcon") as LoginRewardIcon;
    //             this.addChild(this.loginRewardIcon);
    //         }
    //         let index: number = this.numChildren - 1;//从0开始
    //         let col: number = Math.floor(index / this.rowMaxCount) * this.dirX;
    //         let row: number = (index % this.rowMaxCount) * this.dirY;
    //         this.loginRewardIcon.setXY(col * (this.iconWidth + this.iconHSpace), row * (this.iconHeight + this.iconVSpace));
    //         this.loginRewardIcon.updateAll();
    //     } else {
    //         if(this.loginRewardIcon != null) {
    //             this.loginRewardIcon.removeFromParent();
    //         }
    //     }
    // }

    public get isShow(): boolean {
        return this._isShow;
    }

    public goTween(isShow:boolean): void {
		if(this._isShow == isShow) return;
		this._isShow = isShow;
		let _posX: number;
		if (this._isShow) {
			_posX = 10;
		} 
		else {
			_posX = -this.allIcons.length * (this.iconWidth + this.iconHSpace) - 20 - 400;//因为会存在首冲Tip图片
		}
		egret.Tween.removeTweens(this.parent);
		egret.Tween.get(this.parent).to({ x: _posX }, 400, egret.Ease.backInOut);
	}
}