/**
 * 唯一ID创建工具
 * @author Chris
 */
class IDCreatorUtil
{
    /** 模型id*/
    private static AVATAR_ID_INDEX:number = 0;

    public constructor()
    {
    }

    /**
     * 生成聊天信息id
     * */
    public static createAvatarID():string
    {
        return ++IDCreatorUtil.AVATAR_ID_INDEX + "";
    }

}