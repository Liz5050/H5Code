/**
 * 这里只定义优先级类型
 * 优先级排序见LoaderPriority.NORMAL_PLIST
 */
enum ELoaderPriority
{
    TOP,
    UI_PACKAGE,
    KING_CLOTH,
    KING_WEAPON,
    MAP,
    KING_WING,
    KING_MOUNT,
    KING_SKILL,
    KING_DECORATION,
    UI_EFFECT,
    OTHER_CLOTH,
    OTHER_WEAPON,
    OTHER_WING,
    OTHER_MOUNT,
    OTHER_SKILL,
    OTHER_DECORATION,
    DEFAULT,
}

class LoaderPriority
{
    public constructor()
    {
    }

    /**
     * 通用优先级列表
     * 越靠前优先级就越高
     * */
    public static NORMAL_PLIST = [
        ELoaderPriority.TOP
        ,ELoaderPriority.UI_PACKAGE
        ,ELoaderPriority.KING_CLOTH
        ,ELoaderPriority.KING_WEAPON
        ,ELoaderPriority.MAP
        ,ELoaderPriority.KING_WING
        ,ELoaderPriority.KING_MOUNT
        ,ELoaderPriority.KING_SKILL
        ,ELoaderPriority.KING_DECORATION
        ,ELoaderPriority.UI_EFFECT
        ,ELoaderPriority.OTHER_CLOTH
        ,ELoaderPriority.OTHER_WEAPON
        ,ELoaderPriority.OTHER_WING
        ,ELoaderPriority.OTHER_MOUNT
        ,ELoaderPriority.OTHER_SKILL
        ,ELoaderPriority.OTHER_DECORATION
        ,ELoaderPriority.DEFAULT
    ];

    public static getPriority(entity:RpgGameObject, componentType?:string):ELoaderPriority {
        if (entity) {
            let isKing:boolean = entity.objType == RpgObjectType.MainPlayer;
            switch (componentType)
            {
                case ComponentType.Avatar:
                case ComponentType.AvatarLayer:
                case ComponentType.AvatarMc:
                case ComponentType.AvatarDrop:
                    return !isKing ? ELoaderPriority.OTHER_CLOTH : ELoaderPriority.KING_CLOTH;
                case ComponentType.AvatarWeapon:
                    return !isKing ? ELoaderPriority.OTHER_WEAPON : ELoaderPriority.KING_WEAPON;
                case ComponentType.AvatarWing:
                    return !isKing ? ELoaderPriority.OTHER_WING : ELoaderPriority.KING_WING;
                case ComponentType.AvatarMount:
                case ComponentType.AvatarLaw:
                    return !isKing ? ELoaderPriority.OTHER_MOUNT : ELoaderPriority.KING_MOUNT;
                case ComponentType.AvatarSkill:
                    return !isKing ? ELoaderPriority.OTHER_SKILL : ELoaderPriority.KING_SKILL;
                default:
                    return !isKing ? ELoaderPriority.OTHER_DECORATION : ELoaderPriority.KING_DECORATION;
            }
        }
        return ELoaderPriority.DEFAULT;
    }
}