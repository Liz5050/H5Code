
class HomeProxy extends BaseProxy{
    public constructor()
    {
        super();
    }

    public switchMount(getOn:boolean):void
    {
        if(getOn)
        {
             //上坐骑
            this.send("ECmdGameMountBeckon",{});
        }
        else
        {
           //下坐骑
            this.send("ECmdGameMountRecall",{});
        }
    }

    /**
	 * 改变战斗模式
	 */
	public setMode(mode: EEntityFightMode): void {
		this.send("ECmdGameSetMode", {mode: mode});
	}

    public setShowStateInfo() {
        this.send("ECmdGameClientShowStateInfo",{jsonStr: JSON.stringify(CacheManager.player.stateInfo)});
    }
}