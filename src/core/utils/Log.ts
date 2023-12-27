
class Log {

    public static PRINT_ALL: number = 0;

    public static TASK: number = 2;

    public static GAME: number = 1;

    public static FIGHT: number = 3;

    public static UI: number = 4;

    public static MODULE: number = 5;

    public static SKILL: number = 6;

    public static RPG: number = 6;

    public static MOUNT: number = 7;

    public static LOAD: number = 8;

    public static TEST: number = 9;

    public static SERR: number = 10;

    public static FATAL: number = 11;

    public static CLEANUP: number = 13;

    public static MODEL: number = 14;

    public static CHECKPOINT: number = 15;
    public static MSG_BROAD: number = 16;
    public static RECHARGE: number = 17;
    public static TEST_MONHIT: number = 18;
    public static ENCOUNTER: number = 20;
    public static MINING: number = 21;
    public static LOAD_ERR: number = 22;
    public static SOUND: number = 23;
    public static PEAK: number = 24;
    public static JUMP: number = 25;
    public static OVN: number = 26;
    public static TVT: number = 27;
    /**排除打印列表-各自功能调试时打开 */
    public static EXCLUDE_LIST: Array<number> = [Log.FIGHT];
    /**日志缓存 */
    public static logCache:string[] = [];
    /**日志缓存最大值 */
    public static LOG_CACHE_MAX:number = 500;
    /**
     * Debug_Log
     * @param type 类型
     * @param optionalParams 内容
     * @constructor
     */
    public static trace(type: number, ...optionalParams: any[]): void {
        let isInclude:boolean = Log.EXCLUDE_LIST.indexOf(type) == -1;
        if (App.DebugUtils.isDebug && isInclude) {
            optionalParams[0] = Log.toTypeStr(type) + optionalParams[0];
            console.log.apply(console, optionalParams);
        }
        if (isInclude) {
            if (Log.logCache.length > Log.LOG_CACHE_MAX) Log.logCache.shift();
            Log.logCache.push(optionalParams.toString());
        }
    }

    // public static info(message?: any, ...optionalParams: any[]): void {
    //     // console.log(message);
    //     // Tip.showTip(message, Color.White, false);
    // }

    public static toTypeStr(type: number): string {
        switch (type) {
            case Log.GAME: return "【游戏进程】";
            case Log.TASK: return "【任务】";
            case Log.FIGHT: return "【战斗】";
            case Log.UI: return "【UI】";
            case Log.MODULE: return "【模块】";
            case Log.RPG: return "【场景】";
            case Log.MOUNT: return "【坐骑】";
            case Log.LOAD: return "【加载】";
            case Log.TEST: return "【测试】";
            case Log.SERR: return "【错误提示】";
            case Log.FATAL: return "【严重错误】";
            case Log.CLEANUP: return "【资源清理】";
            case Log.MODEL: return "【模型】";
            case Log.CHECKPOINT: return "【关卡进度】";
            case Log.MSG_BROAD: return "【广播信息】";
            case Log.RECHARGE: return "【充值消息】";
            case Log.TEST_MONHIT: return "【怪物伤害】";
            case Log.ENCOUNTER: return "【遭遇战】";
            case Log.MINING: return "【挖矿】";
            case Log.LOAD_ERR: return "【加载错误】";
            case Log.SOUND: return "【声音】";
            case Log.PEAK: return "【巅峰竞技】";
            case Log.JUMP: return "【跳跃】";
            case Log.OVN: return "【1VN】";
            case Log.TVT: return "【3V3】";
            default: return "";
        }
    }

    public static getLog():string {
        let log:string = "";
        for (let logStr of Log.logCache) {
            log += logStr + "\n";
        }
        return log;
    }
}