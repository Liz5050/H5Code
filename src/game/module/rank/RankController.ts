class RankController extends BaseController {
	private rankModule:RankModule;
	public constructor() {
		super(ModuleEnum.Rank);
	}

	public initView():BaseModule {
		this.rankModule = new RankModule(this.moduleId);
		return this.rankModule;
	}

	protected addListenerOnInit(): void {
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetToplist],this.onRankListUpdate,this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetEncounterRank],this.onEncounterRankUpdate,this);

		this.addListen0(LocalEventEnum.GetRankList,this.onGetRankListHandler,this);
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.LookUpPlayerUpdate,this.onLookUpUpdateHandler,this);
	}

	/**请求排行榜数据 */
	private onGetRankListHandler(type:EToplistType):void {
		if(type == EToplistType.EClientToplistTypeEncounter) {
			ProxyManager.arena.encounterRank();
		}
		else {
			ProxyManager.rank.getRankListCMD(type);
		}
	}

	/**排行榜数据更新 */
	private onRankListUpdate(data:any):void {
		if(this.isShow) {
			this.rankModule.updateRankView(data);
		}
		EventManager.dispatch(LocalEventEnum.GetRankInfoUpdate,data.toplists.data);
	}

	/**
	 * 遭遇战排行榜数据更新
	 * SeqEncounterRank
	 */
	private onEncounterRankUpdate(data:any):void {
		let rankList:any[] = data.data;
		if(rankList && rankList.length > 0) {
			for(let i:number = 0; i < rankList.length; i++) {
				rankList[i].toplistType_I = EToplistType.EClientToplistTypeEncounter;
				rankList[i].entityId_I = rankList[i].entityId.id_I;
			}
		}
		if(this.isShow) {
			this.rankModule.updateRankView({toplists:data});
		}

		// {toplists:data}
	}

	private onLookUpUpdateHandler(data:any):void {
		if(this.isShow) {
			this.rankModule.updateFirstModel(data);
		}
	}

	// struct TToplist
	// {
	// 	int id;
	// 	int version;
	// 	int toplistType;
	// 	int rank;
	// 	int entityId;
	// 	string entityName;
	// 	string entityUid;
	// 	int vipLevel;
	// 	int realmLevel;
	// 	int propertyOne;
	// 	int propertyTwo;
	// 	int propertyThree;
	// 	int ownerId;
	// 	string ownerName;
	// 	long valueOne;
	// 	long valueTwo;
	// 	long valueThree;
	// 	int serverId;
	// 	int proxyId;
	// 	int lastRank;
	// 	date createDt;
	// 	int reverse1;
	// 	int reverse2;
	// };
	// sequence<TToplist> SeqTToplist;
}