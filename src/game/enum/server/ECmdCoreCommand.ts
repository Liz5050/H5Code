enum ECmdCoreCommand {
	ECmdCoreChannelUpdate = 11001, 					//更新频道列表  ::Message::Core::SSeqChannelUpdate
	ECmdCoreCellUpdate = 11011,					//CELL发生更新  ::Message::Core::SSeqCellUpdate

	ECmdCoreKillUser = 11021, 					//踢出玩家结构  ::Message::Public::SAttribute     [Message/Public/EntityUpdate.cdl]
	//value 原因    ::Message::Public::EKickOutReason [Message/Public/GameDef.cdl]

	ECmdCoreStopServer = 11031, 					//停止服务器
	ECmdCoreStartServer = 11041,					// 服务器启动成功
	ECmdCoreOnlineNum = 11051,				// 在线 	::Message::Public::SAttribute	[Message/Public/EntityUpdate.cdl]
	ECmdCoreUpdateInterSever = 11061,			//更新InterServer.
	ECmdCoreUpdateCrossServerId = 11062,			//更新跨服serverid Message::Core::SUpdateServerKey [Message/Core/CoreUpdate.cdl]
	ECmdCoreServerHasAddSessionNotice = 11063,		//用于通知加在自己Session中的服务器向自己发送SeverId
	ECmdCoreAddCrossServerId = 11064,			//跨服接收被通知的服ServerId
}