class SettingHangupPanel extends BaseTabPanel
{
	private allScreenBtn:fairygui.GButton;//当前屏幕挂机
	private standBtn:fairygui.GButton;//定点挂机

	/**拾取类 */
	private pickUpTypes:LocalEventEnum[];
	private pickUpBtns:fairygui.GButton[];

	/**挂机类 */
	private switchTypes:LocalEventEnum[];
	private switchBtns:fairygui.GButton[];
	// btn_open1 2 3 4
	public initOptUI(): void 
	{
		this.allScreenBtn = this.getGObject("btn_setallscreen").asButton;
		this.standBtn = this.getGObject("btn_setstand").asButton;
		this.allScreenBtn.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHookRangeChange, this);
		this.standBtn.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHookRangeChange, this);

		this.pickUpTypes = [
			LocalEventEnum.PickUpWhite,
			LocalEventEnum.PickUpBlue,
			LocalEventEnum.PickUpPurple,
			LocalEventEnum.PickUpOrange,
			LocalEventEnum.PickUpCopper,
			LocalEventEnum.PickUpOther,
		];
		this.pickUpBtns = [];
		for(let i:number = 0; i < this.pickUpTypes.length; i++)
		{
			let _btn:fairygui.GButton = this.getGObject("btn_check" + (i+1)).asButton;
			_btn.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onPickUpChangeHandler, this);
			this.pickUpBtns.push(_btn);
		}

		this.switchTypes = [
			LocalEventEnum.AutoSell,
			LocalEventEnum.AutoRecycle,
			LocalEventEnum.AutoTeam,
			LocalEventEnum.AutoRelive
		];
		this.switchBtns = [];
		for(let i:number = 0; i < this.switchTypes.length; i++)
		{
			let _btn:fairygui.GButton = this.getGObject("btn_open" + (i+1)).asButton;
			_btn.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onSwitchChangeHandler, this);
			this.switchBtns.push(_btn);
		}
	}

	public updateAll(): void 
	{
		for(let i:number = 0; i < this.pickUpBtns.length; i++)
		{
			this.pickUpBtns[i].selected = CacheManager.sysSet.getValue(LocalEventEnum[this.pickUpTypes[i]]);
		}
		for(let i:number = 0; i < this.switchBtns.length; i++)
		{
			this.switchBtns[i].selected = CacheManager.sysSet.getValue(LocalEventEnum[this.switchTypes[i]]);
		}
	}

	private onHookRangeChange():void
	{
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.Onhook_Point],this.standBtn.selected);
	}

	private onPickUpChangeHandler(evt:egret.Event):void
	{
		let _btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let _index:number = this.pickUpBtns.indexOf(_btn);
		if(_index == -1) return;
		CacheManager.sysSet.setValue(LocalEventEnum[this.pickUpTypes[_index]],_btn.selected);

		for(let i:number = 0; i < this.pickUpBtns.length; i++)
		{
			if(this.pickUpBtns[i].selected) 
			{
				CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.AutoPickUp],true);
				return;
			}
		}
		//自动拾取选项全部未勾选，直接将自动拾取总开关设false
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.AutoPickUp],false);
	}

	private onSwitchChangeHandler(evt:egret.Event):void
	{
		let _btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let _index:number = this.switchBtns.indexOf(_btn);
		if(_index == -1) return;
		CacheManager.sysSet.setValue(LocalEventEnum[this.switchTypes[_index]],_btn.selected);
	}
}