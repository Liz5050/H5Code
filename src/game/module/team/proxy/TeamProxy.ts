class TeamProxy extends BaseProxy
{
	public constructor() 
	{
		super();
	}

	/**
	 * 创建队伍
	 * @param target 目标点结构
	 *			type 组队目标类型
	 * 			targetValue 目标值(地图id或者copy code)
	 *  		minLevel 最小等级
	 *  		maxLevel 最大等级
	 * @param memberInvite 队员可以邀请
	 * @param autoEnter 申请者可以自动加入
	 */
	public createTeam(target:any,memberInvite:boolean = true,autoEnter:boolean = true):void
	{
		let _data:any = {
			memberInvite: memberInvite,
			autoEnter: autoEnter,
			targetType: target.type,
			targetValue: target.targetValue,
			minLevel: target.enterMinLevel,
			maxLevel: target.enterMaxLevel};
		this.send("ECmdGameGroupCreateGroup",_data);
	}

	/**
	 * @param entityId [GamePublic.cdl SEntityId]
	 * byte type;
	 * byte typeEx2; 
	 * short typeEx; 
	 * int id;  
	 */
	public kickOutMember(entityId:any):void
	{
		this.send("ECmdGameGroupKickOut",{entityId:entityId});
	}

	/**
	 * 刷新队伍列表
	 */
	public refreshTeamList(targetType:EGroupTargetType,targetValue:number):void
	{
		this.send("ECmdGameGroupGetGroupList",{"targetType":targetType, "targetValue":targetValue});
	}

	/**
	 * 申请入队
	 * 根据 entityId 入队
	 */
	public applyTeam(entityId:any):void
	{
		this.send("ECmdGameGroupApply",entityId);
	}

	/**
	 * 申请入队
	 * 根据 groupId 入队
	 */
	public applyExTeam(groupId:any, copyCode:number):void
	{
		this.send("ECmdGameGroupApplyEx",{groupId:groupId, copyCode:copyCode});
	}

	/**
	 * 改变组队目标点
	 */
	public changeTeamTarget(type:EGroupTargetType,targetValue:number,minLv:number,maxLv:number):void
	{
		this.send("ECmdGameGroupModifyGroupTarget",
		{targetType:type, targetValue:targetValue, minLevel:minLv, maxLevel:maxLv});
	}

	/**退出队伍 */
	public exitTeam():void
	{
		this.send("ECmdGameGroupLeft",{});
	}

	/**
	 * 有队伍匹配
	 * @param cancel 是否取消匹配
	 */
	public groupMatch(cancel:boolean):void
	{
		this.send("ECmdGameGroupGroupMatch",{cancel:cancel})
	}

	/**
	 * 无队伍匹配
	 * @param cancel 是否取消匹配
	 * @param targetType 组队目标类型
	 * @param targetValue 目标值
	 */
	public playerMatch(cancel:boolean,targetType:EGroupTargetType,targetValue:number):void
	{
		this.send("ECmdGameGroupPlayerMatch",{cancel : cancel, targetType : targetType, targetValue : targetValue})
	}

	public teamWorldShow():void
	{
		this.send("ECmdGameGroupWorldShow",{});
	}

	/**
	 * 是否同意进入副本
	 */
	public enterCopyCheck(isEnter:boolean):void
	{
		this.send("ECmdGameGroupCopyCheckConfirm",{agree:isEnter});
	}

	/**获取申请列表 null*/
	public getApplyList():void
	{
		this.send("ECmdGameGroupGetApplyList",{});
	}

	/**
	 * 同意组队 
	 * C2S_SGroupAgree
	 * EGroupMsgType type 类型（0--邀请组队 1--申请组队）
	 * SEntityId entityId 对方实体ID
	 * string certId = 3 	证书ID(弃用)
	 */
	public agreeTeam(entityId:any,certId:string,type:EGroupMsgType = EGroupMsgType.EGroupMsgTypeApply):void
	{
		this.send("ECmdGameGroupAgree",{"type" : type, "entityId" : entityId, "certId" : certId});	
	}

	/**
	 * 邀请组队
	 * C2S_SGroupInvite
	 * SEntityId entityId 对方实体ID
	 * int32 type 	0 - 普通邀请， 1 - 镜像邀请
	 */
	public inviteTeam(entityId:any,type:number = 0):void
	{
		this.send("ECmdGameGroupInvite",{"entityId" : entityId , "type" : type});
	}

	/**
	 * 拒绝组队
	 * C2S_SGroupReject
	 * EGroupMsgType type 类型（0--邀请组队 1--申请组队）
	 * SEntityId entityId 对方实体ID（拒绝申请时，entityId-id 为 0 表示拒绝全部）
	 * string certId  	证书ID(弃用)
	 */
	public rejectTeam(entityId:any,certId:string,type:EGroupMsgType = EGroupMsgType.EGroupMsgTypeApply):void
	{
		this.send("ECmdGameGroupReject",{"type" : type, "entityId" : entityId, "certId" : certId});
	}

	/**
	 * 队伍设置
	 * C2S_SGroupSetGroup
	 * @param autoEnter 申请者可以自动加入
	 * @param memberInvite 队员可以邀请（不填）
	 */
	public teamSetting(autoEnter:boolean,memberInvite:boolean = true):void
	{
		this.send("ECmdGameGroupSetGroup",{"autoEnter" : autoEnter, "memberInvite" : memberInvite});
	}

	/**
	 * 获取附近玩家列表
	 * null
	 */
	public getNearbyPlayer():void
	{
		this.send("ECmdGameGroupGetNearbyPlayerList",{});
	}

	/**
	 * 变更队长
	 * C2S_SGroupModifyCaptain
	 */
	public changeTeamCaptain():void
	{
		// optional SEntityId entityId = 1;			// 交给对象ID
		this.send("ECmdGameGroupModifyCaptain",{});
	}

	public sendChat(type:number):void {
		if (type == 1) {
            this.send("ECmdPublicCrossTeamGuildInvite",{});
		} else if (type == 2) {
            this.send("ECmdPublicCrossTeamWorldInvite",{});
		}
	}
}