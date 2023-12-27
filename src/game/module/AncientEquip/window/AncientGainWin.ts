/**
 * 获取途径组件
 * @author zhh
 * @time 2018-08-27 17:14:00
 */
class AncientGainWin extends BaseWindow {
        private baseItem: BaseItem;
        private loaderBg: GLoader;
        private txtName: fairygui.GTextField;
        private gainView: AncientEquipGainView;
        public constructor() {
                super(PackNameEnum.AncientEquip, "AncientGainWin")

        }
        public initOptUI(): void {
                //---- script make start ----
                this.baseItem = <BaseItem>this.getGObject("baseItem");
                this.baseItem.isShowName = false;
                this.loaderBg = <GLoader>this.getGObject("loader_bg");
                this.txtName = this.getGObject("txt_name").asTextField;

                this.gainView = new AncientEquipGainView(this.getGObject("gain_com").asCom);
                this.loaderBg.load(URLManager.getModuleImgUrl("bg/popup_bg.png",PackNameEnum.Common));
                //---- script make end ----
                // this.titleIcon = "AncientEquip_path";
                // this.title = "";
        }

        public updateAll(data?: any): void {
                if (data && data.itemCode) {
                        let itemData: ItemData = new ItemData(data.itemCode);
                        this.baseItem.itemData = itemData;
                        this.txtName.text = itemData.getName(true);
                        this.gainView.updateAll(data);
                        this.frame.height = 555 + this.gainView.listAddH;
                        this.view.setSize(this.view.width,this.view.height);
                        this.center();
                }

        }


}