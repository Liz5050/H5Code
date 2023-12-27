class SettingBasicPanel extends BaseTabPanel
{
	// private hideOther:fairygui.GButton;
	// private hideMonster:fairygui.GButton;
	// private hideOtherEffect:fairygui.GButton;
	// private hideTitle:fairygui.GButton;
	// private hide9Flower:fairygui.GButton;
	// private hideFlower:fairygui.GButton;
	// private noShake:fairygui.GButton;
	// private muteBtn:fairygui.GButton;

	private switchBtn:fairygui.GButton;
	private sureBtn:fairygui.GButton;

	private gSettingData:any;
	private evtList:LocalEventEnum[];
	private btnList:fairygui.GButton[];

	private bgmSlider:fairygui.GSlider;
	private effectSlider:fairygui.GSlider;
	public initOptUI(): void 
	{
		this.btnList = [];
		this.evtList = [
			LocalEventEnum.HideOther,
			LocalEventEnum.HideOtherEffect,
			//九朵花以下屏蔽
			null,
			LocalEventEnum.NoShake,
			LocalEventEnum.HideMonster,
			LocalEventEnum.HideTitle,
			//飘花屏蔽
			null,
			LocalEventEnum.HaveNoSound
		]
		for(let i:number = 0; i < this.evtList.length; i++)
		{
			if(this.evtList[i] == null) 
			{
				this.btnList.push(null);
				continue;
			}
			let _key:string = LocalEventEnum[this.evtList[i]];
			let _btn:fairygui.GButton = this.getGObject("btn_check" + (i+1)).asButton;
			_btn.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
			this.btnList.push(_btn);
		}
		// this.hideOther = this.getGObject("btn_check1").asButton;
		// this.hideMonster = this.getGObject("btn_check5").asButton;
		// this.hideOtherEffect = this.getGObject("btn_check2").asButton;
		// this.hideTitle = this.getGObject("btn_check6").asButton;
		// this.hide9Flower = this.getGObject("btn_check3").asButton;
		// this.hideFlower = this.getGObject("btn_check7").asButton;
		// this.noShake = this.getGObject("btn_check4").asButton;
		// this.muteBtn = this.getGObject("btn_check8").asButton;

		this.bgmSlider = this.getGObject("slider_bgmsound").asSlider;
		this.bgmSlider.max = 100;
		this.bgmSlider.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onBgmVolChangeHandler, this);

		this.effectSlider = this.getGObject("slider_effectsound").asSlider;
		this.effectSlider.max = 100;
		this.effectSlider.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onEffectVolChangeHandler, this);

		this.switchBtn = this.getGObject("btn_switch").asButton;
		this.switchBtn.addClickListener(this.onSwitchClickHandler,this);
		this.sureBtn = this.getGObject("btn_confirm").asButton;
		this.sureBtn.addClickListener(this.onSureClickHandler,this);
		// ControllerManager.login.returnToLogin();
		// this.hideOther.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
		// this.hideMonster.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
		// this.hideOtherEffect.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
		// this.hideTitle.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
		// this.hide9Flower.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
		// this.hideFlower.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
		// this.noShake.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
		// this.muteBtn.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onHideChangeHandler, this);
	}

	public updateAll(data?: any): void 
	{
		for(let i:number = 0; i < this.btnList.length; i++)
		{
			if(this.btnList[i] == null) continue;
			this.btnList[i].selected = CacheManager.sysSet.getValue(LocalEventEnum[this.evtList[i]]);
		}

		this.updateSoundSlider();

		// this.hideOther.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOther]);
		// this.hideMonster.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideMonster]);
		// this.hideOtherEffect.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOtherEffect]);
		// this.hideTitle.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideTitle]);
		// this.hide9Flower.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOther]);
		// this.hideFlower.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HideOther]);
		// this.noShake.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.NoShake]);
		// this.muteBtn.selected = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound]);
	}

	private onHideChangeHandler(evt:egret.Event):void
	{
		let _btn:fairygui.GButton = evt.currentTarget as fairygui.GButton;
		let _index:number = this.btnList.indexOf(_btn);
		CacheManager.sysSet.setValue(LocalEventEnum[this.evtList[_index]],_btn.selected);

		if(this.evtList[_index] == LocalEventEnum.HaveNoSound)
		{
			this.updateSoundSlider(true);
		}
	}

	/**
	 * 更新音量滑块
	 */
	private updateSoundSlider(isClick:boolean = false):void
	{
		let _isMute:boolean = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound]);
		let _bgVolume:number;
		let _effectVolume:number;
		if(_isMute)
		{
			this.bgmSlider.value = 0;
			this.effectSlider.value = 0;
			_bgVolume = 0;
			_effectVolume = 0;
		}
		else
		{
			if(isClick)
			{
				_bgVolume = CacheManager.sysSet.getDefaultValue(LocalEventEnum[LocalEventEnum.MusicVolume]);
				_effectVolume = CacheManager.sysSet.getDefaultValue(LocalEventEnum[LocalEventEnum.EffectVolume]);
			}
			else
			{
				_bgVolume = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.MusicVolume]);
				_effectVolume = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.EffectVolume]);
			}
			this.bgmSlider.value = _bgVolume * 100;
			this.effectSlider.value = _effectVolume * 100;
		}
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.MusicVolume],_bgVolume);
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.EffectVolume],_effectVolume);
	}

	private onBgmVolChangeHandler():void
	{
		let _volume:number = this.bgmSlider.value / 100;
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.MusicVolume],_volume);
		this.updateMuteBtn();
	}

	private onEffectVolChangeHandler():void
	{
		let _volume:number = this.effectSlider.value / 100;
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.EffectVolume],_volume);
		this.updateMuteBtn();
	}

	private updateMuteBtn():void
	{
		let _index:number = this.evtList.indexOf(LocalEventEnum.HaveNoSound);
		this.btnList[_index].selected = this.bgmSlider.value == 0 && this.effectSlider.value == 0;
		CacheManager.sysSet.setValue(LocalEventEnum[LocalEventEnum.HaveNoSound],this.btnList[_index].selected,false);
	}

	private onSureClickHandler():void
	{
		EventManager.dispatch(UIEventEnum.ModuleClose,ModuleEnum.SysSet);
	}

	private onSwitchClickHandler():void
	{
		Sdk.switchAccount();
	}
}