enum ECmdBroadCast {
	ECmdBroadcastEntityInfo = 1, //单个实体信息 Message::BroadCast::SEntityInfo
	ECmdBroadcastEntityInfos = 2, //批量实体信息 Message::BroadCast::SSeqEntityInfo
	ECmdBroadcastEntityMoveInfo = 3, //实体移动信息 Message::BroadCast::SEntityMoveInfo
	ECmdBroadcastEntityLeftInfo = 4, //实体离开信息 Message::BroadCast::SEntityLeft
	ECmdBroadcastEntityAttributeUpdate = 5, //实体更新信息 Message::BroadCast::SEntityUpdate
	ECmdBroadcastEntityAttributeUpdates = 6, //批量实体更新 Message::BroadCast::SSeqEntityUpdate
	ECmdBroadcastEntityLeftInfos = 7, //批量离线信息 Message::BroadCast::SEntityLeftArray
	ECmdBroadcastEntityFlashInfo = 8, //个体闪动信息 Message::BroadCast::SEntityMoveInfo
	ECmdBroadcastEntityOwner = 9, //实体归属更新 Message::BroadCast::SEntityIdPair
	ECmdBroadcaseEntityInfoToMySelf = 10,//给自己发送实体信息	Message::BroadCast::SEntityInfo

	ECmdBroadcastMapEntity = 11,//地图实体更新 Message::BroadCast::SEntityInfo
	ECmdBroadcastMapEntityPoint = 12,//地图实体移动 Message::BroadCast::SEntityMoveInfo
	ECmdBroadcastMapEntityLeft = 13,//地图实体离开 Message::Public::SEntityId
	ECmdBroadcastMapSharp = 14,//地图形状信息 Message::BroadCast::SMapSharpInfo
	ECmdBroadcastMapBossEntityPoint = 15,	//地图怪物位置信息
	ECmdBroadcastMapAllEntityPoint = 16,//地图所有实体位置 Message::BroadCast::SMapAllEntityPoint

	ECmdBroadcastEntityBeginFight = 20, //实体开始战斗 Message::BroadCast::SBeginFight
	ECmdBroadcastEntityDoFight = 21, //执行战斗操作 Message::BroadCast::SDoFight
	ECmdBroadcastEntityFightBack = 22, //战斗后返回   Message::BroadCast::SDoFight
	ECmdBroadcastEntityBeginCollect = 23, //开始采集物品 Message::BroadCast::SBeginFight
	ECmdBroadcastEntityToEntityUpdate = 24, //目标对象更新 Message::BroadCast::SEntityIdPair
	ECmdBroadcastEntityGroupUpdate = 25, //队伍信息改变 Message::BroadCast::SEntityGroupInfo
	ECmdBroadcastEntityDoFights = 26, //执行战斗(一次一批) Message::BroadCast::SDoFights

	ECmdBroadcastEntityDropItem = 30, //广播物品掉落 Message::Public::SPacket
	ECmdBroadcastEntityNpcShop = 31, //Npc商店掉落  Message::Public::SNpcShop [Message/Public/GamePublic.cdl]
	ECmdBroadcastEntityDropSimpleItem = 32, //广播单个物品掉落 Message::Public::SDropItem[Message/Public/GamePublic.cdl]
	ECmdBroadcastEntityDropLottery = 33,	//广播抽奖掉落 Message::Public::SDropLottery[Message/Public/GamePublic.cdl]
	ECmdBroadcastEntityLoveTaskPairs = 34, //广播情缘对象集 Message::BroadCast::SLoveTaskPairs

	ECmdBroadcastEntityStartMove = 35, //开始移动广播 Message::BroadCast::SEntityStartMove
	ECmdBroadcastEntityStopMove = 36, //停止移动广播 Message::BroadCast::SEntityStartMove
}