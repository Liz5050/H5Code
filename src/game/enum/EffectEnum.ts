/**
 * 特效
 */
enum EffectLayerEnum
{
    LayerSceneUp = 0,//0：场景上层
    LayerSceneDown,//1：场景下层
    LayerObjUp,//2：角色上层
    LayerObjDown,//3：角色下层
    LayerSpecified,//4：指定层
    LayerObjUp2,//5：添加在场景上层的角色上层
    LayerSceneUpBottom,//6：添加在场景上层的底层
    LayerUIXPSkillDown,//7：全屏技能下层
    LayerUIXPSkillUp//8：全屏技能上层
}

/**
 * 特效作用点
 */
enum EffectPosEnum
{
    PosStart = 1,//0：起始点
    PosEnd//1：目标点
}

/**
 * 特效层规则：优先级大于layer字段
 */
enum EEffectLayerSetRule {
    SEMI_CIRCLE = 1,//半球{rule:1, data:[上半球layer1, 上半球layer2]}
}