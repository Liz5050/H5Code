//队伍分配方案
enum EAllocation
{
	EAllocation1  = 1,  //分配方案1
	EAllocation2  = 2,  //分配方案2
};

enum EGroupMsgType 
{
	EGroupMsgTypeApply  = 0,  //组队申请
	EGroupMsgTypeInvite = 1,  //组队邀请
};

enum EGroupType
{
	EGroupTypeNomal = 0,            // --普通队伍
	EGroupTypeGangFightTeam = 1,    // -- 3v3战队
};
	
enum EGroupReplyType
{
	EGroupReplyAgree   = 1,      //同意邀请
	EGroupReplyReject   = 2,      //拒绝邀请
};

//组队目标
enum EGroupTargetType
{
	EGroupTargetNull   = 0,     //无
	EGroupTargetNormal = 1,     //野外地图
	EGroupTargetCopy   = 2,     //副本
};

//离开队伍原因
enum EGroupLeftReason
{
	EGroupLeftNormal   = 1,     //主动离队
	EGroupLeftKicked   = 2,     //被除出队伍
	EGroupLeftDisband  = 3,     //队伍解散
};

/**队员状态 */
enum ETeamMemberState
{
	/**离线 */
	OffLine,
	/**远离 */
	Faraway,
	/**附近 */
	Nearby,
}