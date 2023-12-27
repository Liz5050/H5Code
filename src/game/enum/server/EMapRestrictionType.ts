enum EMapRestrictionType
{
	EMapRestrictionTypeSave           = 1,           //不可以保存
	EMapRestrictionTypeGroup          = 4,           //不可以组队
	EMapRestrictionTypePass           = 8,           //不可使用传送道具
	EMapRestrictionTypeSingleMount    = 16,          //不可以使用单人坐骑
	EMapRestrictionTypeTransformMount = 32,          //不可以使用变身坐骑
	EMapRestrictionTypeFlyMount       = 64,          //不可以使用飞行坐骑
	EMapRestrictionTypeTransform      = 128,         //不可以变身
	EMapRestrictionTypeRevivalInSitu  = 256,         //不可以原地复活
	EMapRestrictionTypeRevivalInBackToTheCity = 512, //不可以回城复活
	EMapRestrictionTypeRecover        = 1024,        //不可以生命恢复(系统自动)
	EMapRestrictionTypeJump           = 2048,        //不可以跳跃
	EMapRestrictionTypeNoPk           = 4096,        //杀人增加pk值（默认不增加）
}