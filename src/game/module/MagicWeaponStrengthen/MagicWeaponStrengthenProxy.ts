/**
 * 法器升星 协议处理
 */

class MagicWeaponStrengthenProxy extends BaseProxy {
    
    public constructor() {
		super();
	}

    /**
     * 升星请求
     * @param shape
     * 
     */
    public uplevelMagicWeapon(shape : number) : void {
        this.send("ECmdGameShapeUpgradeEx", {shape : shape});
    }


}