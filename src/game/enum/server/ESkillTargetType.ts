enum ESkillTargetType
{
    ESkillTargetTypeSelf = 1,              // 对自己
    ESkillTargetTypeFriend = 2,            // 对友方
    ESkillTargetTypeEnemy = 4,             // 对敌方
    ESkillTargetTypeMaster = 8,            // 对主人
    ESkillTargetTypeGroup = 16,            // 对队友
    ESkillTargetTypeSelfWeak = 32,         // 对所有角色中血量最少的角色
}