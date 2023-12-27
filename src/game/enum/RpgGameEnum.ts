/////////////////////////////////////
///////////游戏场景常量枚举定义
/////////////////////////////////////
/**
 * 场景物件类型
 * @author Chris
 */
enum RpgObjectType
{
    MainPlayer = 1,//不能拿这个来判断主角，多角色都是这个类型，见RpgGameObject.isLeaderRole
    OtherPlayer,
    Monster,
    Npc,
    Pet,    
    PassPoint,
    Tomstone,
	Drop,
    DropPublic,
    Miner,
    SceneEffect,
}