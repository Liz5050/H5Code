
class RpgGameData {
    public static GameTileWidth: number = 500;
    public static GameTileHeight: number = 500;

    public static GameCellWidth: number = 80;
    public static GameCellHeight: number = 40;
    public static GameCellBase: number = 40;
    public static GameCellWMH: number = RpgGameData.GameCellWidth / RpgGameData.GameCellHeight;

    public static GameAoiWidth: number = 256;
    public static GameAoiHeight: number = 256;

    public static WalkSpeed: number = 200; //像素每秒

    public static PlayerMaxNum:number = 10;//场景内最大同屏玩家数量
    public static CacheAsBitmapLimit:number = 20;

    // public static RushGridMax: number = 7;//见battle_config.json
    // public static RushGridMin: number = 4;//见battle_config.json
}

enum ERpgRenderLevel {
    FULL,//场景渲染全开
    ONLY_MAP,//只渲染地图
    NONE//场景渲染全关
}