
class LoginModel extends BaseModel {
    public userInfo: any;
    public accountName: string;
    public pwd: string;
    public hasReqLogin:boolean;

    /**
     * 构造函数
     * @param $controller 所属模块
     */
    public constructor($controller: BaseController) {
        super($controller);
    }
}
