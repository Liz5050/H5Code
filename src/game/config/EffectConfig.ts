/**Effect配置 */
class EffectConfig extends BaseConfig {
    public constructor() {
        super("t_effect", "effectId");
    }

    /**获取Effect配置 */
    public getVo(effectId: number): any {
        return this.getByPk(effectId);
    }
}