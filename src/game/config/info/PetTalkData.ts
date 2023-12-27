/**
 * 宠物说话配置
 * @author lizhi
 */
class PetTalkData 
{
	public id:number;
	/**类型0通用 1宠物 2仙娃 */
	public type:number;
	/**触发条件 1进入地图 2玩家等级 3宠物星级 4间隔时间 5宠物等级*/
	public condition:number;
	/**玩家最小等级 */
	public minLv:number;
	/**玩家最大等级 */
	public maxLv:number;
	/**玩家最小转生等级 */
	public minRoleState:number;
	/**玩家最大转生等级 */
	public maxRoleState:number;
	/**各条件对应的具体值 */
	public value:string;
	/**持续时长 */
	public durationTime:number;
	/**内容id 对应talk_content配置 */
	public talkIds:string;
	/**触发概率 */
	public rate:number;
	public constructor() 
	{
	}

	public parseConfig(data:any):void
	{
		this.id = data.id;
		this.type = data.type;
		this.condition = data.condition;
		this.minLv = data.playerMinLevel > 0 ? data.playerMinLevel : 0;
		this.maxLv = data.playerMaxLevel > 0 ? data.playerMaxLevel : 0;
		this.minRoleState = data.minRoleState > 0 ? data.minRoleState : 0;
		this.maxRoleState = data.maxRoleState > 0 ? data.maxRoleState : 0;
		this.value = String(data.value);
		this.durationTime = data.timeDuration;
		this.talkIds = data.talkIds;
		this.rate = data.rate;
	}

	/**主角等级是否在触发范围内 */
	public get inRangeLevel():boolean
	{
		let _level:number = CacheManager.role.getRoleLevel();
		let roleState:number = CacheManager.role.getRoleState();
		if(this.maxLv > 0 && _level > this.maxLv) return false;
		if(this.minLv > 0 && _level < this.minLv) return false;
		if(this.minRoleState > 0 && roleState < this.minRoleState) return false;
		if(this.maxRoleState > 0 && roleState > this.maxRoleState) return false;
		return true;
	}

	public get content():string
	{
		let _talkId:number;
		let _ids:string[] = this.talkIds.split("#");
		if(_ids.length == 1) _talkId = Number(_ids[0]);
		else _talkId = Number(App.RandomUtils.randomArray(_ids));

		let _content:string;
		let _contentData:any = ConfigManager.talkContent.getByPk(_talkId);
		if(_contentData)
		{
			_content = _contentData.content;
		}
		else 
		{
			_content = "config error talkId:" + _talkId + "---id" + this.id + "," + this.talkIds;
			Log.trace(Log.RPG,_content);
		}
		return _content;
	}
}