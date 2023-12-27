class BaseIconContainer extends fairygui.GComponent {
	protected allIconDic: { [id: number]: BaseIcon } = {};
	protected allIcons: any[] = [];
	protected iconWidth: number;
	protected iconHeight: number;
	/**图标水平方向间隙 */
	protected iconHSpace: number = 10;
	/**图标竖直方向间隙 */
	protected iconVSpace: number = 8;
	/**一行最多显示图标数量 */
	protected rowMaxCount: number;

	//图标排序规则
	/**
	 * 水平方向 -1 索引越大位置越靠右 1则反之
	 * 竖直方向 -1 索引越大位置越靠下 1则反之
	 */
	protected dirX: number = -1;
	protected dirY: number = 1;
	public constructor() {
		super();
	}

	public addIcon(iconId: number): void {
		if(this.allIconDic[iconId] != null) {
			// Log.trace(Log.SERR,"已存在图标：",iconId);
			return;
		}
		if(!ConfigManager.mgOpen.isOpenedByKey(IconResId[iconId],false)) {
			let openCfg:any = ConfigManager.mgOpen.getByOpenKey(IconResId[iconId]);
			let previewLevel:number = openCfg.previewLevel > 0 ? openCfg.previewLevel : 0;
			if(openCfg.showStyleUnopen == UnOpenShowEnum.Hide_Entrance || (openCfg.showStyleUnopen == UnOpenShowEnum.Preview && CacheManager.role.getRoleLevel() < previewLevel)) {
				return;
			}
		}
		let className:any = HomeUtil.getIconClass(iconId);
		let icon:BaseIcon = new className(iconId);
		icon.setIconSize(this.iconWidth,this.iconHeight);
		this.allIconDic[icon.iconResId] = icon;
		icon.addClickListener(this.onIconClickHandler, this);
		this.addChild(icon);
		icon.updateAll();
		if(HomeUtil.initShowEffect(iconId) || HomeUtil.showEffectIcon(iconId)) {
			icon.showEffect();
		}
		this.allIcons.push(icon);
		this.updateIconPosition();
		this.addIconSuccess();

		if(iconId == IconResId.CopyHall){
			GuideTargetManager.reg(GuideTargetName.HomeCopyHallBtn, icon, true);
		} else if (iconId == IconResId.Boss) {
			GuideTargetManager.reg(GuideTargetName.HomeBossBtn, icon, true);
		}
	}

	public removeIcon(iconId: number): void {
		let icon = this.allIconDic[iconId];
		if (icon == null) {
			return;
		}
		this.remove(icon);
	}

	private remove(icon:BaseIcon):void {
		let _index: number = this.allIcons.indexOf(icon);
		this.allIcons.splice(_index, 1);
		this.removeChild(icon);
		delete this.allIconDic[icon.iconResId];
		icon.removeClickListener(this.onIconClickHandler, this);
		icon.destroy();
		icon = null;
		this.updateIconPosition();
	}

	protected onIconClickHandler(evt: egret.TouchEvent): void {
		App.SoundManager.playEffect(SoundName.Effect_DianJiAnNiu,1);
		let icon:BaseIcon = evt.currentTarget as BaseIcon;
		if(!ConfigManager.mgOpen.isOpenedByKey(IconResId[icon.iconResId])) {
			return;
		}
		let iconId:IconResId = icon.iconResId;
		if(HomeUtil.initShowEffect(iconId)) {
			icon.removeEffect();
		}
		if(HomeUtil.isClickHideImgTips(iconId)){
			icon.hideImgTip();
		}
		HomeUtil.openByIconId(iconId);
		if(iconId==IconResId.GuildNew){
			CacheManager.guildNew.setOpenRedTip(false,true);
		}

		// EventManager.dispatch(LocalEventEnum.HomeIconClick,icon.iconResId);
	}

	protected updateIconPosition(): void {
		this.allIcons.sort(this.iconSortFuc);
		for (let i: number = 0; i < this.allIcons.length; i++) {
			let _icon: BaseIcon = this.allIcons[i];
			let _col: number = (i % this.rowMaxCount) * this.dirX;
			let _row: number = Math.floor(i / this.rowMaxCount) * this.dirY;
			_icon.setXY(_col * (this.iconWidth + this.iconHSpace),_row * (this.iconHeight + this.iconVSpace));
		}
	}

	protected addIconSuccess():void {
	}

	protected iconSortFuc(icon1:BaseIcon,icon2:BaseIcon):number {
		return icon2.sortId - icon1.sortId;
	}

	public setPos(posX:number,posY:number):void {
		this.x = posX - this.iconWidth;
		this.y = posY;
	}

	// public set iconHSpace(cusSpace:number) {
	// 	this._iconHSpace = cusSpace;
	// }

	// public set iconVSpace(cusSpace:number) {
	// 	this._iconVSpace = cusSpace;
	// }

	public set maxCount(count:number) {
		this.rowMaxCount = count;
		this.updateIconPosition();
	}

	public getHomeIcon(iconId:number):BaseIcon {
		return this.allIconDic[iconId];
	}

	public getHomeIconPos(iconId:number):egret.Point {
		let _icon:BaseIcon = this.getHomeIcon(iconId);
		if(_icon) return _icon.localToGlobal();
		return null;
	}

	public showIconImgTip(iconId: number):void {
		let _icon:BaseIcon = this.getHomeIcon(iconId);
		if(_icon) {
			_icon.showImgTip();
		}
	}

	public hideIconImgTip(iconId: number):void {
		let _icon:BaseIcon = this.getHomeIcon(iconId);
		if(_icon) {
			_icon.hideImgTip();
		}
	}

	public isImgTipShow(iconId: number) : boolean {
		let _icon:BaseIcon = this.getHomeIcon(iconId);
		if(_icon) {
			return _icon.isImgTipShow();
		}
	}

	public checkHasHide(iconId: number) : boolean{
		let _icon:BaseIcon = this.getHomeIcon(iconId);
		if(_icon) {
			return _icon.checkHasHide();
		}
	}

	public removeAll():void {
		for(let iconId in this.allIconDic) {
			this.hideIconImgTip(Number(iconId));
			this.allIconDic[iconId].destroy();
			this.allIconDic[iconId].removeFromParent();
			this.allIconDic[iconId] = null;
			delete this.allIconDic[iconId];
		}
		this.allIcons = [];
	}
}