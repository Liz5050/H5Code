class RankProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**请求排行榜数据 */
	public getRankListCMD(type:EToplistType):void {
		this.send("ECmdGameGetToplist",{toplistType:type});
	}
}