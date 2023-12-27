class BossBasePanel extends BaseTabPanel  {
	protected copyCode:number=0;
	protected btn_solo:fairygui.GButton;
	protected btn_shuoming:fairygui.GButton;
	protected btn_attention:fairygui.GButton;
	protected btn_record:fairygui.GButton;
	protected btn_information:fairygui.GButton;
	protected txt_number:fairygui.GTextField;
	protected txt_time:fairygui.GTextField;
	protected txt_note:fairygui.GTextField;
	protected list_item:List;
	protected list_boss:List;
	//protected list_information:List;
	protected bossMc:RpgMovieClip;
	protected attention:fairygui.GImage;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
		super(view,controller,index,false);
	}
	public initOptUI():void{

		this.btn_solo = this.getGObject("btn_solo").asButton;
		this.btn_solo.text = "立即前往";
		this.btn_shuoming = this.getGObject("btn_shuoming").asButton;
		this.btn_attention = this.getGObject("btn_attention").asButton;
		this.btn_record = this.getGObject("btn_record").asButton;
		this.btn_information = this.getGObject("btn_information").asButton;
		this.attention = this.getGObject("attention").asImage;
		

		
		this.txt_time = this.getGObject("txt_time").asTextField;
		this.txt_note = this.getGObject("txt_note").asTextField;

		this.list_item = new List(this.getGObject("list_item").asList);
		this.list_boss = new List(this.getGObject("list_boss").asList);
		//this.list_information = new List(this.getGObject("list_information").asList);

		this.list_boss.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickBoss,this);
		this.btn_solo.addClickListener(this.onClickSolo,this);
		this.btn_attention.addClickListener(this.onClickFollow,this);
		this.btn_record.addClickListener(this.onClickKillRecord,this);
		this.btn_shuoming.addClickListener(this.onExplain,this);
		this.btn_information.addClickListener(this.onClickInf,this);
				
	}

	public updateAll():void{
		this.updateTireValue();
	}

	public updateTireValue():void{
		if(this.txt_number){
			this.txt_number.text = CacheManager.role.role.tire_BY+"/"+CopyEnum.TIRE_MAX_VALUE;
		}		
	}

	protected setBossMc(resId:string):void{
		if(!this.bossMc){
			this.bossMc = ObjectPool.pop('RpgMovieClip');
		}		
		this.bossMc.setData(ResourcePathUtils.getRPGGameMonster(),resId,AvatarType.Monster, ELoaderPriority.UI_EFFECT); //9101002  9201203
		this.bossMc.gotoAction(Action.Stand,Dir.Bottom);
		this.bossMc.x = 360;
		this.bossMc.y = 450;
		var p:egret.DisplayObjectContainer = <egret.DisplayObjectContainer>this.view.displayObject;		
		if(p){
			p.addChild(this.bossMc);
			p.setChildIndex(this.bossMc,1);
		}
	}

	protected onClickBoss(e:fairygui.ItemEvent):void{
		
		var item:BossHeadItem = <BossHeadItem>e.itemObject;
		var data:any = item.getData();
		this.updateReward(data);
	}

	protected startTimer():void{
		this.stopTimer();
		App.TimerManager.doTimer(1000,0,this.onTimerRun,this);
	}
	protected stopTimer():void{
		App.TimerManager.remove(this.onTimerRun,this);
	}

	protected onTimerRun():void{
		var bossInf:any = this.list_boss.selectedData;
		var dt:number = CacheManager.boss.getBossDt(bossInf.bossCode);
		var servT:number = CacheManager.serverTime.getServerTime();
		var s:number = dt-servT;
		this.txt_time.text = App.DateUtils.getFormatBySecond(s,1);		

	}

	protected onClickInf(e:any):void{
		EventManager.dispatch(UIEventEnum.BossShowAttr,this.list_boss.selectedData);
	}

	protected onExplain(e:any):void{
		EventManager.dispatch(UIEventEnum.BossExplainShow);
	}

	protected onClickKillRecord(e:any):void{
		var bossInf:any = this.list_boss.selectedData;
		EventManager.dispatch(UIEventEnum.BossReqKillRecord,bossInf.copyCode,bossInf.bossCode);		
	}

	protected onClickFollow(e:any):void{
		
		if(this.btn_attention.selected){
			Alert.alert("关注成功,BOSS刷新前一分钟会通知你",null,this,null,"今日不再提示",AlertCheckEnum.KEY_BOSS_FOLLOW,"",Alert.YES);
		}
		var bossInf:any = this.list_boss.selectedData;
		CacheManager.boss.setFollowBoss(bossInf.bossCode,this.btn_attention.selected);
		this.setFollowImg(bossInf.bossCode);
		var item:BossHeadItem = <BossHeadItem>this.list_boss.selectedItem;
		if(item){
			item.updateFllow();
		}
	}

	protected onClickSolo(e:any):void{
		var bossInf:any = this.list_boss.selectedData;
		if(bossInf){
			EventManager.dispatch(LocalEventEnum.BossReqEnterCopy,bossInf.copyCode,bossInf.mapId,bossInf.bossCode);			
		}
	}

	protected selectBoss(bossDatas:Array<any>):void{
		var roleLv:number = CacheManager.role.role.level_I;
		var len:number = bossDatas.length;
		var idx:number = 0;
		for(var i:number = 0;i<len;i++){
			var bossInf:any = ConfigManager.boss.getByPk(bossDatas[i].bossCode);
			if(bossInf.level==roleLv){
				idx = i;				
				break;
			}else if(bossInf.level==roleLv){
				idx = i-1;				
				break;
			}
		}
		idx = Math.max(idx,0);
		this.list_boss.list.addSelection(idx,true);
		this.updateReward(bossDatas[idx]);
	}

	protected updateReward(data:any):void{
		var itemIds:string[] = CommonUtils.configStrToArr(data.showReward);
		this.list_item.setVirtual(itemIds);
		//var showAttr:string[] = CommonUtils.configStrToArr(data.showAttr,false);
		//this.list_information.data = showAttr;

		this.setFollowImg(data.bossCode);
		var bossCfg:any = ConfigManager.boss.getByPk(data.bossCode);
		this.setBossMc(bossCfg.modelId);
		var isCd:boolean = CacheManager.boss.isBossCd(data.bossCode);
		this.txt_time.visible = isCd;
		var roleLv:number = CacheManager.role.getRoleLevel();
		this.txt_note.visible = (roleLv-bossCfg.level)>=100;
		if(isCd){
			this.startTimer();
			this.onTimerRun();
		}else{
			this.stopTimer();
		}
	}

	protected setFollowImg(bossCode:number):void{
		var isFollow:boolean = CacheManager.boss.isFollowBoss(bossCode);
		this.attention.visible = isFollow;
		this.btn_attention.selected = isFollow;
	}

	public destroy():void{
		this.stopTimer();
		if(this.bossMc){
			this.bossMc.stop();
		}
	}

	
}