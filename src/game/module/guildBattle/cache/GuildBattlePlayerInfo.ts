class GuildBattlePlayerInfo {
	public miniPlayer:any;
	public score:number;
	public mapId:number;
	public constructor() {
	}

	public setData(data:any):void {
		this.score = data.score_I;
		if(this.mapId && this.mapId != data.mapId_I) {
			
		}
		this.mapId = data.mapId_I;
		this.miniPlayer = data.player;
	}
}