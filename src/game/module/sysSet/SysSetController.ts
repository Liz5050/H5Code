/**
 * 系统设置
 */
class SysSetController extends BaseController {

	private module: SettingWindow;
	private offlineRewardData: any;
	private initOfflineReward: boolean;
	private offlineRewardWin: OfflineWorkRewardWindow;
	private initQuickBuy: boolean;
	private sysSetWindow: SysSetWindow;
	private commonIsLoaded: boolean;

	public constructor() {
		super(ModuleEnum.SysSet);
        this.onCommonLoaded(PackNameEnum.Common);
	}

	public initView(): BaseGUIView {
		this.module = new SettingWindow(this.moduleId);
		return this.module;
	}

	protected addListenerOnInit(): void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSysSetting], this.onSysSetMsg, this);
		// this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicOfflineWorkShowReward], this.onOfflineWorkShowReward, this);
		// this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicOfflineWorkSec], this.onOfflineWorkSec, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameOfflineWorkShowReward], this.onOfflineWorkShowReward, this);

		this.addListen0(LocalEventEnum.MusicVolume, this.onSoundVolumeUpdate, this);
		this.addListen0(LocalEventEnum.EffectVolume, this.onSoundVolumeUpdate, this);

		this.addListen0(LocalEventEnum.HaveNoSound, this.onSoundVolumeUpdate, this);
		this.addListen0(UIEventEnum.SceneMapUpdated, this.onSceneMapUpdate, this);
		this.addListen0(UIEventEnum.SyssetWindowOpen, this.syssetWindowOpen, this);
		this.addListen0(UIEventEnum.PackageLoaded, this.onCommonLoaded, this);
		this.addListen0(LocalEventEnum.HaveNoSound, this.onSetHaveNoSound, this);
	}

	private onSoundVolumeUpdate(type: LocalEventEnum): void {
		let _bgVolume: number = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.MusicVolume]);
		let _effectVolume: number = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.EffectVolume]);
		if (type == LocalEventEnum.MusicVolume) {
			App.SoundManager.setBgVolume(_bgVolume);
		}
		else if (type == LocalEventEnum.EffectVolume) {
			App.SoundManager.setEffectVolume(_effectVolume);
		}
		else {
			this.updateVolume(true);
		}
	}

	private onSysSetMsg(data: any): void {
		CacheManager.sysSet.data = data;
		let followList:any = CacheManager.sysSet.getValue(LocalEventEnum.BossFollow);
		let setList:any[] = CacheManager.sysSet.getValue(LocalEventEnum.BossSetList);
		if(!setList) {
			setList = [];
		}
		if(!followList) {
			followList = [];
		}
		let bossList: any[] = ConfigManager.mgGameBoss.getCanFollowList();
		let roleLv:number = CacheManager.role.getRoleLevel();
		let roleState:number = CacheManager.role.getRoleState();
		for (let i: number = 0; i < bossList.length; i++) {
			let isOpen:boolean = CacheManager.bossNew.getBossIsOpened(bossList[i].bossCode);
			let setIndex:number = setList.indexOf(bossList[i].bossCode);
			let followIndex:number = followList.indexOf(bossList[i].bossCode);
			let copyCfg:any = ConfigManager.copy.getByPk(bossList[i].copyCode);
			let bossLv:number = ConfigManager.boss.getByPk(bossList[i].bossCode).level;
			let bossState:number = bossList[i].roleState;
			let levelFlag:boolean = false;
			if(roleState > 0) {
				roleLv = 80 + roleState*10;
			}
			if(bossState > 0 && roleState > 0) {
				if(ConfigManager.mgGameBoss.isQCMaxBoss(bossList[i].bossCode)) {
					levelFlag = isOpen;
				}
				else {
					levelFlag = roleState - bossState < 2;
				}
			}
			else if(roleState <= 0){
				//玩家未转生，始终取60 80级boss关注
				levelFlag = bossLv >= 60 && roleLv >= bossLv;//roleLv - bossLv <= 20;
			}
			else if(!bossState && roleState > 0){
				levelFlag = roleLv - bossLv <= 10;
			}

			let state:boolean;//角色等级大于boss等级30级以上的不关注
			if(copyCfg.copyType == ECopyType.ECopyMgSecretBoss) {
				//秘境boss不可主动设置关注状态，不用判断setIndex，只判断isOpen
				state = isOpen;
			}
			else {
				//setIndex == -1代表从未设置过关注状态，已开启的Boss默认设置为关注状态
				//setIndex != -1已经主动设置过关注状态，存在主动取消关注设置，直接取得系统设置中关注列表的followIndex为是否关注了该Boss
				state = ((setIndex == -1 && levelFlag) || followIndex != -1) && isOpen;
			}
			CacheManager.bossNew.setFollowBoss(bossList[i].bossCode, state);
			if(state) {
				if(followIndex == -1) followList.push(bossList[i].bossCode);
				if(setIndex == -1) setList.push(bossList[i].bossCode);
			}
			else if(!levelFlag) {
				if(followIndex != -1) followList.splice(followIndex,1);
			}
		}
		CacheManager.sysSet.setValue(LocalEventEnum.BossSetList, setList,false);
		CacheManager.sysSet.setValue(LocalEventEnum.BossFollow, followList,true);

		// if(!followList) {
		// 	//未设置过关注
		// 	followList = [];
		// 	let bossList: any[] = ConfigManager.mgGameBoss.getCanFollowList();
		// 	// ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgNewWorldBoss);
		// 	// bossList = bossList.concat(ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgNewBossHome));
		// 	for (let i: number = 0; i < bossList.length; i++) {
		// 		let isOpen:boolean = CacheManager.bossNew.getBossIsOpened(bossList[i].bossCode);
		// 		// let index:number = followList.indexOf(bossList[i].bossCode);
		// 		// if(index == -1) {
		// 		// }
		// 		followList.push(bossList[i].bossCode);
		// 		CacheManager.bossNew.setFollowBoss(bossList[i].bossCode, isOpen);
		// 	}
		// 	CacheManager.sysSet.setValue(LocalEventEnum.BossFollow, followList,true);
		// }
		// else {
		// 	EventManager.dispatch(LocalEventEnum.BossFollow);
		// }

		egret.setTimeout(this.onSceneMapUpdate,this,3000);
		this.updateVolume();

		if (this.module && this.module.isShow) {
			this.module.updateAll();
		}
		this.onSetHaveNoSound();
		EventManager.dispatch(LocalEventEnum.HaveNoSound);
	}

	/**
	 * 更新音量
	 * @param isClick 是否主动勾选静音选项
	 */
	private updateVolume(isClick: boolean = false): void {
		let _isMute: boolean = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound]);
		if (_isMute) {
			App.SoundManager.setBgVolume(0);
			App.SoundManager.setEffectVolume(0);
		}
		else {
			let _bgVolume: number;
			let _effectVolume: number;
			if (isClick) {
				//手动取消静音操作取默认值
				_bgVolume = CacheManager.sysSet.getDefaultValue(LocalEventEnum[LocalEventEnum.MusicVolume]);
				_effectVolume = CacheManager.sysSet.getDefaultValue(LocalEventEnum[LocalEventEnum.EffectVolume]);
			}
			else {
				_bgVolume = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.MusicVolume])
				_effectVolume = CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.EffectVolume])
			}
			App.SoundManager.setBgVolume(_bgVolume);
			App.SoundManager.setEffectVolume(_effectVolume);
		}
	}

	private onSceneMapUpdate(): void {
		//播放背景音乐
		// CacheManager.map.mapId;
		if (!CacheManager.sysSet.isInit) return;
		App.SoundManager.playBg(ConfigManager.client.getSceneMusic(CacheManager.map.getMapResId()));
		// if (this.initOfflineReward) {
		// 	this.showReward();
		// }
		// let sellItemCode: number = CacheManager.sysSet.getAdviceOfflineWorkItemCode();
		// if (this.initQuickBuy && CacheManager.sysSet.offlineWorkLeftTime < 7200 && sellItemCode) {
		// 	let itemData: ItemData = new ItemData(sellItemCode);
		// 	EventManager.dispatch(UIEventEnum.PackQuickUseItem, { "itemData": itemData, "quickUseType": EQuickUseType.SHOP });
		// 	this.initQuickBuy = false;
		// }
	}

	private syssetWindowOpen(): void {
		if (this.sysSetWindow == null) {
			this.sysSetWindow = new SysSetWindow();
		}
		this.sysSetWindow.show();
	}

	private onCommonLoaded(packageName: string): void {
		if (packageName == PackNameEnum.Common && ResourceManager.isPackageLoaded(packageName)) {
			this.removeListener(UIEventEnum.PackageLoaded, this.onCommonLoaded, this);
			this.commonIsLoaded = true;
			if (this.commonIsLoaded && this.initOfflineReward) {
				this.showReward();//home打开后再显示
			}
		}
	}

	private onSetHaveNoSound(): void {
		let volumeScale: number = 1;
		if (CacheManager.sysSet.getValue(LocalEventEnum[LocalEventEnum.HaveNoSound])) {
			volumeScale = 0;
		}
		fairygui.GRoot.inst.volumeScale = volumeScale;
	}

    /**
	 * 离线挂机显示奖励 Message::Game::S2C_SOfflineWorkReward
     */
	private onOfflineWorkShowReward(mb: any): void {
		this.offlineRewardData = {
			"workTime": mb.workTime,
			"rewardCoin": mb.rewardCoin,
			"rewardExp": mb.rewardExp,
			"rewardEquip": mb.rewardEquip,
			"rewardProp": mb.rewardProp,
			"extraCoin": mb.extraCoin || 0,
			"extraExp": mb.extraExp || 0
		};
		this.initOfflineReward = true;
		if (this.commonIsLoaded) {
			this.showReward();
		}
	}

	private showReward(): void {
		this.offlineRewardWin || (this.offlineRewardWin = new OfflineWorkRewardWindow());
		this.offlineRewardWin.show(this.offlineRewardData);
		this.initOfflineReward = false;
	}

    /**
	 * 离线挂机剩余时间（秒） Message::Public::SSeqInts
     */
	private onOfflineWorkSec(msg: any): void {
		CacheManager.sysSet.offlineWorkLeftTime = msg.intSeq.data_I[0];
		this.module && this.module.updateHangLeftTime();
		this.initQuickBuy = true
	}

	public offlineWindowOpen() : boolean{
		return this.offlineRewardWin && this.offlineRewardWin.isShow;
	}
}