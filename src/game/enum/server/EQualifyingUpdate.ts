enum EQualifyingUpdate
{
    EUpdateTypeStart = 1,	    	//开始倒计时    value - 开始时间戳
    EUpdateTypeEnd = 2,	    		//结束倒计时 	value - 结束时间戳
    EUpdateTypeWillWin = 3,	    	//胜利在望		value - 积分  valueEx - 势力
    EUpdateTypeKill = 4,	    	//杀怪			value - 积分  valueEx - 势力
    EUpdateTypeCollect = 5,	    	//采集			value - 积分  valueEx - 势力
    EUpdateTypeCollectCoolDown = 6,	//采集冷却		value - 冷却时间戳
    EUpdateTypeCollectStart = 7,	//采集开始		value - 结束时间戳
    EUpdateTypeCollectEnd = 8,		//采集结束
    EUpdateTypeRevial = 9,			//复活倒计时    valueEx2 - 复活时间戳
}