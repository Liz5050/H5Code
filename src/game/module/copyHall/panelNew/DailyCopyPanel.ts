/**
 * 日常副本面板
 * @author zhh
 * @time 2019-03-14 10:16:44
 */
class DailyCopyPanel extends BaseTabView {
        private listCopy: List;
        public constructor() {
            super();
        }

        protected initOptUI(): void {
            //---- script make start ----
            this.listCopy = new List(this.getGObject("list_copy").asList);
            //---- script make end ----


        }

        public updateAll(data?: any): void {
            let expCopy: any = ConfigManager.copy.getCopysByType(ECopyType.ECopyMgNewExperience)[0];                
            let dataArr: any[] = [];     
            dataArr.push(expCopy);          
            let flag: boolean = ConfigManager.mgOpen.isTypeOpen(PanelTabType[PanelTabType.CopyDefend], EOpenCondType.EOpenCondTypeServerOpenDays);
            if(flag){
                let dfCopy: any = ConfigManager.copy.getRoleDefendCopy();
                dataArr.push(dfCopy);
            }
            /*
            let dfNum:number = 4;
            for(let i:number = dataArr.length;i<dfNum;i++){
                dataArr.push(CopyItem.NONE_DATA);
            }        
            */
            this.listCopy.setVirtual(dataArr);
        }

        /**
         * 销毁函数
         */
        public destroy(): void {
            super.destroy();
        }

}