enum EMapEntityFightMode
{
    EMapEntityFightModeDefault        = 0,           //不改变玩家战斗模式
    EMapEntityFightModePeace          = 1,           //默认和平（可切换到其他模式）
    EMapEntityFightModeCompulsion     = 2,           //默认强制（可切换到其他模式）
    EMapEntityFightModeFight          = 3,           //默认全体（可切换到其他模式）
    EMapEntityFightModePeaceOnly      = 4,           //限制和平（不可切到其他模式）
    EMapEntityFightModeCompulsionOnly = 5,           //限制强制（不可切到其他模式）
    EMapEntityFightModeFightOnly      = 6,           //限制全体（不可切到其他模式）
    EMapEntityFightModePK             = 7,           //默认强制（只能在强制、全体间切换）
}