/**
 * 邮件枚举
 */

// 查询条件
enum EQueryCondition
{
	EQueryConditionByType = 1,		//按类型
	EQueryConditionByStatus = 2,	//按状态
	EQueryConditionByAttach = 4,	//按附件
};

// 发件人类型（邮件类型）
enum EMailType
{
	EMailTypeSystem = 1,			//系统
	EMailTypePlayer = 2,			//玩家
};

// 邮件状态
enum EMailStatus
{
	EMailStatusUnRead = 1,			//未读
	EMailStatusRead = 2,			//已读
};

// 附件状态
enum EMailAttach
{
	EMailAttachNo = 0,				//没附件
	EMailAttachHadGet = 1,			//已提取
	EMailAttachYes = 2,				//有附件
};