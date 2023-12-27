
class ComponentType {
    public static Ai: string = "AiComponent";
    public static Aoi: string = "AoiComponent";
    public static AvatarLayer:string = "AvatarLayerComponent";
    public static AvatarMc:string = "AvatarMcComponent";
    public static EffectMc:string = "EffectMcComponent";
    public static AvatarDrop:string = "AvatarDropComponent";
    public static Avatar: string = "AvatarComponent";//通用key值
    public static MC: string = "MCComponent";
    public static AvatarWeapon: string = "AvatarWeaponComponent";
    public static AvatarWing: string = "AvatarWingComponent";
    public static AvatarMount:string = "AvatarMountComponent";
    public static AvatarLaw:string = "AvatarLawComponent";
    public static AvatarSpirit:string = "AvatarSpiritComponent";
    public static AvatarSprite:string = "AvatarSpriteComponent";
    public static AvatarSoul:string = "AvatarSoulComponent";
    public static AvatarSkill: string = "AvatarSkillComponent";
    public static Camera: string = "CameraComponent";
    public static Move: string = "MoveComponent";
    public static Control: string = "ControlComponent";
    public static MainControl: string = "MainControlComponent";
    public static OtherControl: string = "OtherControlComponent";
    public static Sort: string = "SortComponent";
    public static Head: string = "HeadComponent";
    public static Test:string = "TestComponent";
    public static TomstoneHead:string = "TomstoneHeadComponent";
    public static Buff:string = "BuffComponent";
    public static Talk:string = "TalkComponent";
    public static SkillTalk:string = "SkillTalkComponent";
    public static Arrow:string = "ArrowComponent";
    public static Follow:string = "FollowComponent";
    public static AutoFight:string = "AutoFightComponent";
    public static Follow2:string = "FollowComponent2";
    public static MinerHead:string = "MinerHeadComponent";
    public static Ancient:string = "AvatarAncientComponent"; //混元装备
    public static AvatarSwordPool : string = "AvatarSwordPoolComponent"; // 剑池

    public static getComponentKey(type:string):string
    {
        switch(type)
        {
            case ComponentType.AvatarLayer:
            case ComponentType.AvatarMc:
            case ComponentType.AvatarDrop:
                return ComponentType.Avatar;
        }
        return type;
    }
}