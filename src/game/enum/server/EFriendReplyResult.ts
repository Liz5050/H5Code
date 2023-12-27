/*
* 申请回复结果枚举
*/
enum EFriendReplyResult
{
	EFriendReplyResultAccept     	    = 1,	//同意
	EFriendReplyResultReject			= 2,	//拒绝
	EFriendReplyApplicantAmountLimit    = 3,    //申请人好友人数达到上限，不能添加
	EFriendReplyReplierAmountLimit		= 4,	//回复人好友人数达到上限，不能添加
	EFriendReplyApplicantOffline		= 5,	//申请人离线，不能添加
	EFriendReplyReplierOffline			= 6,	//回复人离线，不能添加
	EFriendReplyApplicantBacklist		= 7,	//申请人黑名单有回复人，不能添加
	EFriendReplyReplierBacklist			= 8,	//回复人黑名单有申请人，不能添加
	EFriendReplyApplicantFriend			= 9,	//申请人好友有回复人，不能添加
	EFriendReplyReplierFriend			= 10,	//回复人好友有申请人，不能添加
};