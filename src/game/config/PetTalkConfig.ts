enum PetTalkCondition
{
	/**进入地图 */
	EnterMap = 1,
	/**主角升级 */
	RoleLevelUp = 2,
	/**宠物升星 */
	PetStarUp = 3,
	/**固定时间间隔触发 */
	TimeCD = 4,
	/**宠物升级触发 */
	PetLeveUp = 5,
	/**通关关卡触发 */
	PassCheckPoint = 6,

}
/**宠物说话配置 */
class PetTalkConfig extends BaseConfig 
{
	private gTalkTypeList:{[condition:number]:PetTalkData[]};
	public constructor() 
	{
		super("t_pet_talk","id");
		this.parseTalkList();
	}

	private parseTalkList():void
	{
		this.gTalkTypeList = {};
		let _dict:any = this.getDict();
		for(let index in _dict)
		{
			let _condition:number = _dict[index].condition;
			let _list:PetTalkData[] = this.gTalkTypeList[_condition];
			if(!_list)
			{
				_list = [];
				this.gTalkTypeList[_condition] = _list;
			}
			let _talkData:PetTalkData = new PetTalkData();
			_talkData.parseConfig(_dict[index]);
			_list.push(_talkData);
		}
	}

	/**
	 * 获取宠物随机说话数据 
	 * @param condition 触发条件类型
	 */
	public getRandomTalkData(condition:PetTalkCondition):PetTalkData
	{
		let _list:PetTalkData[] = this.gTalkTypeList[condition];
		if(!_list) return;
		let _curValue:number = -1;
		switch(condition)
		{
			case PetTalkCondition.EnterMap:
				_curValue = CacheManager.map.mapId;
				break;
			case PetTalkCondition.RoleLevelUp:
				_curValue = CacheManager.role.entityInfo.level_SH;
				break;
			// case PetTalkCondition.PetStarUp:
			// 	_curValue = (CacheManager.petMountPet.getstage() - 1) * 10 + CacheManager.petMountPet.getstar();
			// 	break;
			case PetTalkCondition.TimeCD:
				//时间间隔类型走计时器逻辑更新说话
				break;
			case PetTalkCondition.PetLeveUp:
				let _pet:RpgGameObject = CacheManager.map.getBelongMineEntity(EEntityType.EEntityTypePet);
				if(_pet && _pet.entityInfo) _curValue = _pet.entityInfo.level_SH;
				break;
			case PetTalkCondition.PassCheckPoint:
				_curValue = CacheManager.checkPoint.passPointNum;
				break;
		}
		let _resultList:PetTalkData[] = [];
		for(let _talkData of _list)
		{
			/**排除不符合当前条件值的数据 */
			if(!_talkData.inRangeLevel) continue;
			if(_talkData.condition == PetTalkCondition.EnterMap) {
				let values:string[] = _talkData.value.split("#");
				if(values.indexOf(String(_curValue)) == -1) continue;
			}
			else {
				if(_talkData.condition != PetTalkCondition.TimeCD && Number(_talkData.value) != _curValue) continue;
			}
			_resultList.push(_talkData);
		}
		let _result:PetTalkData = App.RandomUtils.randomArray(_resultList);
		if(!_result) return null;
		let _rate:number = Math.random()*100;
		if(_rate <= _result.rate) return _result;
		return null;
	}

	/**
	 * 随机获取触发条件为TimeCD的宠物说话
	 */
	public getTimeCdTalk():PetTalkData
	{
		let _list:PetTalkData[] = this.gTalkTypeList[PetTalkCondition.TimeCD];
		if(!_list) return null;
		let _result:PetTalkData = App.RandomUtils.randomArray(_list);
		return _result;
	}
}