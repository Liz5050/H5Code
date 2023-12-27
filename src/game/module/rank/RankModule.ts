class RankModule extends BaseModule {
	private c1:fairygui.Controller;
	private bgLoader:GLoader;
	private model_0:PlayerModel;
	private model_1:PlayerModel;
	private model_2:PlayerModel;
	private playerModels:PlayerModel[];
	private titleMc:MovieClip;

	private firstView:RankItemFirstView;
	private listRank:List;
	private listType:List;
	private txt_myRank:fairygui.GRichTextField;
	private touchArea:fairygui.GGraph;

	private selectItem:RankTypeItem;
	private curIndex:number = -1;
	/**第一名id*/
	private entityId:number;

	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.Rank);
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.bgLoader = this.getGObject("loader_bg") as GLoader;
		this.bgLoader.load(URLManager.getModuleImgUrl("bg.jpg",PackNameEnum.Rank));

		this.txt_myRank = this.getGObject("txt_myRank").asRichTextField;

		this.listRank = new List(this.getGObject("list_rank").asList);
		this.listType = new List(this.getGObject("list_type").asList);
		this.listType.data = CacheManager.rank.rankTypes;
		this.listType.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectBtnChange,this);

		this.firstView = this.getGObject("rank_first") as RankItemFirstView;
		this.touchArea = this.getGObject("touch_area").asGraph;
		this.touchArea.addClickListener(this.onFirstViewClickHandler,this);

		this.descBtn.visible = true;

		this.playerModels = [];
		for(let i:number = 0; i < 3; i++) {
			let modelContainer:egret.DisplayObjectContainer = this.getGObject("model_container" + i).displayObject as egret.DisplayObjectContainer;
			let model:PlayerModel = new PlayerModel();
			modelContainer.addChild(model);
			this.playerModels.push(model);
		}
		this.titleMc = ObjectPool.pop("MovieClip");
		let container:egret.DisplayObjectContainer = this.getGObject("title_container").asCom.displayObject as egret.DisplayObjectContainer;
		container.addChild(this.titleMc);
		
		// let modelContainer:egret.DisplayObjectContainer = this.getGObject("model_container0").displayObject as egret.DisplayObjectContainer;
		// this.model_0 = new PlayerModel();
		// modelContainer.addChild(this.model_0);

		// modelContainer = this.getGObject("model_container1").displayObject as egret.DisplayObjectContainer;
		// this.model_1 = new PlayerModel();
		// modelContainer.addChild(this.model_1);

		// modelContainer = this.getGObject("model_container2").displayObject as egret.DisplayObjectContainer;
		// this.model_2 = new PlayerModel();
		// modelContainer.addChild(this.model_2);
	}

	public updateAll(data?:any):void {
		let idx:number = 0;
		if(data && data.type) {
			idx = CacheManager.rank.rankTypes.indexOf(data.type);
		}
		idx = Math.max(idx,0);
		this.setIndex(idx);
	}

	private onSelectBtnChange():void {
		let index:number = this.listType.selectedIndex;
		this.setIndex(index);
	}

	private setIndex(index:number):void {
		if(this.curIndex == index) return;
		this.listType.list.scrollToView(index);
		if(this.selectItem) {
			this.selectItem.btnSelected = false;
		}
		this.curIndex = index;
		this.listType.selectedIndex = index;
		this.selectItem = this.listType.selectedItem;
		this.selectItem.btnSelected = true;
		let rankType:EToplistType = this.selectItem.getData();
		let rankInfo:RankInfo = CacheManager.rank.getClientRankInfo(rankType);
		for(let i:number = 0; i < this.playerModels.length; i++) {
			this.playerModels[i].reset();
		}
		this.entityId = -1;
		this.titleMc.reset();
		EventManager.dispatch(LocalEventEnum.GetRankList,rankType);
	}

	public updateRankView(data:any):void {
		let rankInfos:any[] = [];
		let ranks:any[] = data.toplists.data;
		if(ranks && ranks.length > 0) {
			this.c1.selectedIndex = 1;
			this.firstView.visible = true;
			this.touchArea.touchable = true;
			let selfEntityId:any = CacheManager.role.getSEntityId();
			let entityId:any = {
				roleIndex_BY:0, 
				id_I: ranks[0].entityId_I, 
				type_BY: EEntityType.EEntityTypePlayer, 
				typeEx_SH: selfEntityId.typeEx_SH, 
				typeEx2_BY: selfEntityId.typeEx2_BY 
			};
			
			this.entityId = ranks[0].entityId_I;
			EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:entityId,showError:false},false,false);
		}
		else {
			this.c1.selectedIndex = 0;
			this.firstView.visible = false;
			this.touchArea.touchable = false;
		}

		let myRank:number = -1;
		for(let i:number = 0; i < ranks.length; i++) {
			if(i == 0) {
				this.firstView.setData(ranks[i]);
			}
			else {
				rankInfos.push(ranks[i]);
			}
			if(myRank == -1) {
				if(ranks[i].entityId_I == CacheManager.role.entityInfo.entityId.id_I){
					myRank = ranks[i].rank_I;
				}
			}
		}
		this.listRank.setVirtual(rankInfos);
		this.listRank.scrollToView(0);
		if(myRank != -1) {
			this.txt_myRank.text = HtmlUtil.colorSubstitude(LangRank.L2,myRank);
		}
		else {
			this.txt_myRank.text = LangRank.L3;
		}
		
		// this.updateFirstModel({roleDatas:{
		// 	data:[
		// 		{
		// 			roleIndex_I:0,
		// 			weapons:{
		// 				key_I:[EEntityAttribute.EAttributeClothes],
		// 				value_I:[CacheManager.role.getEntityInfo(0).getModelId(EEntityAttribute.EAttributeClothes)]
		// 			}
		// 		},
		// 		{
		// 			roleIndex_I:1,
		// 			weapons:{
		// 				key_I:[EEntityAttribute.EAttributeClothes],
		// 				value_I:[CacheManager.role.getEntityInfo(1).getModelId(EEntityAttribute.EAttributeClothes)]
		// 			}
		// 		},
		// 		{
		// 			roleIndex_I:2,
		// 			weapons:{
		// 				key_I:[EEntityAttribute.EAttributeClothes],
		// 				value_I:[CacheManager.role.getEntityInfo(2).getModelId(EEntityAttribute.EAttributeClothes)]
		// 			}
		// 		},

		// 	]
		// }});
	}

	public updateFirstModel(data:any):void {
		if(data.miniPlayer.entityId.id_I != this.entityId) return;
		let roleDates:any[] = data.roleDatas.data;
		roleDates.sort(roleDataSort);
		function roleDataSort(value1:any,value2:any):number {
			return value1.roleIndex_I - value2.roleIndex_I;
		}
		for(let i:number = 0; i < this.playerModels.length; i++) {
			if(i < roleDates.length) {
				let weapons:any = {};
				for(let k:number = 0; k < roleDates[i].weapons.key_I.length; k++) {
					let type:number = roleDates[i].weapons.key_I[k];
					let modelId:number = roleDates[i].weapons.value_I[k];
					weapons[type] = modelId;
				}
				this.playerModels[i].updatePlayerModelAll(weapons,roleDates[i].career_SH);
				if(roleDates[i].roleIndex_I == 0) {
					let rankType:EToplistType = CacheManager.rank.rankTypes[this.curIndex];
					let titleCfg:any = ConfigManager.title.getRankRewardTitleByRank(rankType);
					if(titleCfg) {
						// this.playerModels[i].updateTitle(Number(titleCfg.icon));
						this.titleMc.playFile(ResourcePathUtils.getRPGGame() + "title/" + titleCfg.icon,-1, ELoaderPriority.UI_EFFECT);
					}
				}
			}
			else {
				this.playerModels[i].reset();				
			}
		}
	}

	protected clickDesc():void {
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:LangRank.LANG1});
	}

	private onFirstViewClickHandler():void {
		if(this.firstView && this.firstView.visible) {
			let selfEntityId:any = CacheManager.role.getSEntityId();
			let entityId:any = {
				roleIndex_BY:0, 
				id_I: this.firstView.rankData.entityId_I, 
				type_BY: EEntityType.EEntityTypePlayer, 
				typeEx_SH: selfEntityId.typeEx_SH, 
				typeEx2_BY: selfEntityId.typeEx2_BY 
			};
			EventManager.dispatch(LocalEventEnum.CommonViewPlayerMenu,{toEntityId:entityId},true);
		}
	}

	public hide():void {
		this.curIndex = -1;
		if(this.selectItem) {
			this.selectItem.btnSelected = false;
			this.selectItem = null;
		}
		for(let i:number = 0; i < this.playerModels.length; i++) {
			this.playerModels[i].reset();
		}
		this.titleMc.reset();
		this.entityId = -1;
		super.hide();
	}
}