class SecretBossPanel extends BossNewBasePanel {
	private static INDEX_TYPE_SECRET:number = 1; //秘境boss类型
	private static INDEX_TYPE_DARK:number = 2;//暗之boss类型

	private txt_guildName:fairygui.GTextField;
	private txt_num:fairygui.GTextField;
	private btnSetup:fairygui.GButton;
	private img_item:GLoader;
	private enterNum:number;
	private c2:fairygui.Controller;
	public constructor() {
		super();
		this.isDestroyOnHide = false;
	}

	public initOptUI():void{
        super.initOptUI();
		this.c2 = this.getController("c2");
		this.btnSetup = this.getGObject("btn_setup").asButton;		
		this.txt_guildName = this.getGObject("txt_guildName").asTextField;
		this.txt_num = this.getGObject("txt_num").asTextField;
		this.img_item = <GLoader>this.getGObject("img_item");
		let itemCfg:any = CacheManager.bossNew.secretAddItemInfo;
		this.img_item.load(URLManager.getIconUrl(itemCfg.icon,URLManager.ITEM_ICON));
		(this.getGObject("btn_privilegeSet") as PrivilegeSetBtn).fromCode = CopyEnum.CopySecretBoss;

		this.txtLimit.text = "";
        // let green:string = "#ff7610";
        // let clrStr2:string = HtmlUtil.html("0点刷新挑战次数",green);
        // this.tips = "1、不同转数的玩家只能挑战对应转数的秘境BOSS\n2、秘境BOSS每天限制挑战次数，每天<font color='#ff7610'>0点刷新挑战次数</font>\n3、获得BOSS归属当BOSS死亡，即可获得BOSS归属奖励\n4、对BOSS造成伤害，直到BOSS死亡处于场景中，即可获得奖励\n5、击杀拥有归属权的玩家，可以获得归属权"
		this.img_item.addClickListener(this.onClickHandler,this);
		this.btnSetup.addClickListener(this.onClickHandler,this);
    }
	public updateAll(data?:any):void{
		super.updateAll(data);
		this.btnSetup.visible = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.darkSecret],false);
		this.listBossname.scrollToView(0,false,false);
		App.TimerManager.doTimer(1000,0,this.onTimer,this);
	}
	public updateLastKiller(data:any):void{
		if(data){
			this.txt_guildName.text = HtmlUtil.html("上次归属：","#c8b185")+HtmlUtil.html(data.playerName_S,"#fea700");
		}else{
			this.txt_guildName.text = "";
		}		
	}
	public updateTicketItem():void{
		let itemInfo:any = CacheManager.bossNew.secretAddItemInfo;
		let itemNum:number = CacheManager.pack.propCache.getItemCountByCode2(itemInfo.code);
		let numOk:boolean = itemNum>0; 
		//this.txt_num.visible = numOk;
		//this.img_item.visible = numOk;
		let isSecret:boolean=true;
		if(this.curMgBossInf){
			let copyInfo:any = ConfigManager.copy.getByPk(this.curMgBossInf.copyCode);
			if(copyInfo){
				isSecret = copyInfo.copyType==ECopyType.ECopyMgSecretBoss;
			}
		}
		let clr:string = numOk?Color.Color_6:Color.Color_4; 
		this.txt_num.text = HtmlUtil.html(itemNum+"",clr);
		let idx:number = isSecret?0:1; //始终显示副本卷
		this.c2.setSelectedIndex(idx);
	}
	protected updateInf(mgBossInf:any):void{
		
        this.curMgBossInf = mgBossInf;
        let bossInf:any = ConfigManager.boss.getByPk(mgBossInf.bossCode);
        let items:ItemData[] = RewardUtil.getRewards(mgBossInf.showReward);
        
        let isCanKill:boolean = !CacheManager.bossNew.isBossCd(this.curMgBossInf.bossCode);
        this.imgSymbol.visible = isCanKill;
        let idx:number = isCanKill?0:1;
        this.c1.setSelectedIndex(idx);
		let roleStateMini:number = ObjectUtil.getConfigVal(this.curMgBossInf,"roleState",0);
		let maxRoleState:number = ObjectUtil.getConfigVal(this.curMgBossInf,"maxRoleState",0);
        this.txtBossname.text = bossInf.name+"("+roleStateMini+"转-"+maxRoleState+"转)";
		this.setBossMc(bossInf);
        this.updateReward(items.slice(1));
		this.enterNum = CacheManager.copy.getEnterLeftNum(this.curMgBossInf.copyCode);
		let clr:string = this.enterNum>0?Color.Color_6:Color.Color_4; 
		this.txtLimit.text = "剩余次数："+HtmlUtil.html(this.enterNum+"次",clr);
		this.updateTicketItem();
		EventManager.dispatch(UIEventEnum.BossReqKillRecord,this.curMgBossInf.copyCode,this.curMgBossInf.bossCode);
		
    }
	protected setBossInfs():void{
		let retInfs:any[] = CopyUtils.getSecretBossList().concat();
		ArrayUtils.insert({typeIndex:SecretBossPanel.INDEX_TYPE_SECRET},0,retInfs);
		if(ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.darkSecret],false)){
			let darkBoss:any[] = CopyUtils.getDarkSecretBoss();
			ArrayUtils.insert({typeIndex:SecretBossPanel.INDEX_TYPE_DARK},0,darkBoss);
			retInfs = retInfs.concat(darkBoss);
		}
		this.bossInfs = retInfs;
    }
	protected getDfIndex():number{
		let idx:number = this.lastIndex==-1 || !this.lastIndex?1:this.lastIndex;
        return idx;
    }
	protected sortInfs():void{
		
	}
	protected setItemRenderer(index: number, item: fairygui.GObject): void {
		super.setItemRenderer(index,item);
		let renderItem:PersonnalBossItem = <PersonnalBossItem>item;
		let data:any = renderItem.getData();		
		//暂时去掉红点
		if(data.typeIndex==SecretBossPanel.INDEX_TYPE_SECRET){
			CommonUtils.setBtnTips(renderItem,CacheManager.bossNew.isSecetBossTips());
		}else if(data.typeIndex==SecretBossPanel.INDEX_TYPE_DARK){
			CommonUtils.setBtnTips(renderItem,CacheManager.bossNew.isDarkBossTips());			
		}else{
			CommonUtils.setBtnTips(renderItem,false);
		}
		
	}
	
	private onTimer():void{
		for(let i:number = 0;i<this.listBossname.list._children.length;i++){
			var child: PersonnalBossItem = <PersonnalBossItem>this.listBossname.list._children[i];
			if(child){
				child.updateSecretBossName();
			}
		}
	}
	protected handlerChallange():void{		
		var cdT:number = CacheManager.copy.getCopyCdTime(this.curMgBossInf.copyCode);
		var svt:number = CacheManager.serverTime.getServerTime();
		let sec:number = cdT - svt;
		if(CacheManager.bossNew.isBossCd(this.curMgBossInf.bossCode)){
			Tip.showTip("BOSS已被击杀");
		}else if(sec>0){
			Tip.showTip(`冷却中，${sec}秒后可挑战`);
		}else if(this.enterNum<=0){
			let itemInfo:any = CacheManager.bossNew.secretAddItemInfo;
			//let count:number = CacheManager.pack.getItemCount(itemInfo.code);
			let bagItem:ItemData = CacheManager.pack.propCache.getItemByCode(itemInfo.code);
			if(bagItem){
				let tips: string = App.StringUtils.substitude(LangBoss.L15,bagItem.getName(true)) //"是否消耗一个" + HtmlUtil.html(itemInfo.name, "#01ab24") + "增加一次BOSS挑战次数？";
				Alert.alert(tips,()=>{								
					EventManager.dispatch(LocalEventEnum.PackUseByCode,bagItem,1);
					egret.setTimeout(()=>{
						EventManager.dispatch(LocalEventEnum.BossReqEnterCopy,this.curMgBossInf.copyCode,this.curMgBossInf.mapId,this.curMgBossInf.bossCode);
					},this,35);
				},this);
			}else{
				Tip.showTip("今日挑战次数已用完");
			}			
		}else if(!ItemsUtil.checkSmeltTips()){
			EventManager.dispatch(LocalEventEnum.BossReqEnterCopy,this.curMgBossInf.copyCode,this.curMgBossInf.mapId,this.curMgBossInf.bossCode);	
		}

	}
	protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:PersonnalBossItem = <PersonnalBossItem>e.itemObject;        
		this.lastIndex = this.listBossname.selectedIndex;
        if(item && item.getData().copyCode){			            
			this.changeCurSelect(false);
			this.curSelectItem = item;
			this.changeCurSelect(true);
			this.updateInf(item.getData());           
        }               
    }

	private onClickHandler(e:egret.TouchEvent):void{
		let itemInfo:any = CacheManager.bossNew.secretAddItemInfo;
		switch(e.target){
			case this.img_item:				
				ToolTipManager.showByCode(itemInfo.code);
				break;			
			case this.btnSetup:
				EventManager.dispatch(UIEventEnum.BossSetOpen,CopyEnum.DarkSecret);
				break;
		}		
	}
	public hide():void{
		super.hide();
		this.lastIndex = 1;
		App.TimerManager.remove(this.onTimer,this);
	}
}