
class ComponentSystem {
    private static _Components: any = {};

    public static addComponent(component: Component): void {
        if (!this._Components[component.type]) {
            this._Components[component.type] = [];
        }
        this._Components[component.type].push(component);
    }

    public static removeComponent(component: Component): void {
        if (!this._Components[component.type]) {
            return;
        }

        var index: number = this._Components[component.type].indexOf(component);
        if (index != -1) {
            this._Components[component.type].splice(index, 1);
        }
    }

    public static start(): void {
        App.TimerManager.doFrame(1, 0, this.onEnterFrame, this);
    }

    public static stop(): void {
        App.TimerManager.remove(this.onEnterFrame, this);
    }

    private static onEnterFrame(advancedTime: number): void {
        let self = this;
        // self.dealComponents(self._Components[ComponentType.Ai], advancedTime);
        self.dealComponents(self._Components[ComponentType.Move], advancedTime);
        self.dealComponents(self._Components[ComponentType.Aoi], advancedTime);
        self.dealComponents(self._Components[ComponentType.Avatar], advancedTime);
        self.dealComponents(self._Components[ComponentType.AvatarMc], advancedTime);
        // self.dealComponents(self._Components[ComponentType.AvatarSkill], advancedTime);
        // self.dealComponents(self._Components[ComponentType.AvatarWeapon], advancedTime);
        self.dealComponents(self._Components[ComponentType.Camera], advancedTime);
        self.dealComponents(self._Components[ComponentType.Sort], advancedTime);
        self.dealComponents(self._Components[ComponentType.MainControl], advancedTime);
        self.dealComponents(self._Components[ComponentType.AvatarSpirit], advancedTime);
        self.dealComponents(self._Components[ComponentType.AvatarSprite], advancedTime);
        self.dealComponents(self._Components[ComponentType.AvatarSoul], advancedTime);
        self.dealComponents(self._Components[ComponentType.TomstoneHead], advancedTime);
        self.dealComponents(self._Components[ComponentType.Talk], advancedTime);
        self.dealComponents(self._Components[ComponentType.Arrow], advancedTime);
        // self.dealComponents(self._Components[ComponentType.Follow], advancedTime);
        self.dealComponents(self._Components[ComponentType.AutoFight], advancedTime);
        self.dealComponents(self._Components[ComponentType.Follow2], advancedTime);
        self.dealComponents(self._Components[ComponentType.AvatarSwordPool], advancedTime);
        self.dealComponents(self._Components[ComponentType.Head], advancedTime);
    }

    private static dealComponents(arr: Component[], advancedTime: number): void {
        if (!arr) {
            return;
        }
        let component:Component;
        for(let i:number = 0; i < arr.length; i++)
        {
            component = arr[i];
            if (!component.isRuning) {
                return;
            }
            component.dealTime += advancedTime;
            if (component.dealTime >= component.dealInterval) {
                component.dealTime = 0;
                component.update(advancedTime);
            }
        }
    }
}