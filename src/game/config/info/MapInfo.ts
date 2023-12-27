/**
 * 一张地图所有信息
 * smallMapScaleRatio 小地图缩放比例
 */
class MapInfo {
	public mapId: number;
	public sourceData: any;

	public constructor(mapId: number, soueceData:any) {
		this.mapId = mapId;
		this.sourceData = soueceData;
	}

	public getByKey(key:string):any{
		if(this.sourceData != null){
			return this.sourceData[key];
		}
		return null;
	}

	/**
	 * 获取本地图所有传送点
	 */
	public getPassPoints():Array<any>{
		return this.sourceData["passPoints"];
	}

	public getPassPoint(passPointId:number):any{
		for(let passPoint of this.getPassPoints()){
			if(passPoint.passPointId == passPointId){
				return passPoint;
			}
		}
		return null;
	}

	public getNpcs():Array<any>{
		return this.sourceData["npcs"];
	}

	/**
	 * 获取小地图资源
	 */
	public getSmallMapRes():string{
		return `resource/assets/rpgGame/map/${this.mapId}/${this.mapId}_mini.jpg`;
	}

}