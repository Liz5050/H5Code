/**自选礼包 */
class ChooseGiftBagConfig extends BaseConfig {
    public constructor() {
        super("t_chose_gift_bag", "itemCode");
    }

    public getRewards(itemCode: number): Array<ItemData> {
        let cfg: any = this.getByPk(itemCode);
        if (cfg != null) {
            return RewardUtil.getStandeRewards(cfg.rewards);
        } else {
            return [];
        }
    }
}