const { ccclass, property } = cc._decorator;

@ccclass
export class Cell extends cc.Component {

    public isSelect: boolean = false;

    private oldColor: cc.Color = null;

    public x: number = 0;
    public y: number = 0;

    public init(x: number, y: number, color: cc.Color, isSelect: boolean): void {
        this.x = x;
        this.y = y;
        this.oldColor = color;
        this.isSelect = isSelect;

        this.updateUI();
    }

    public onEnable(): void {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.touchDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.touchUp, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.touch, this);
    }

    public onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touch, this);
    }

    private touchDown(): void {
        if (!testContext.isEditing) {
            return;
        }
        testContext.isTouch = true;
        this.touch();
    }

    private touchUp(): void {
        if (!testContext.isEditing) {
            return;
        }
        testContext.isTouch = false;
    }

    private touch(): void {
        if (!testContext.isEditing) {
            return;
        }
        if (!testContext.isTouch) {
            return;
        }
        this.isSelect = !this.isSelect;

        this.updateUI();
        testContext.changeCell(this.x, this.y, this.isSelect);
    }

    public updateUI(): void {
        if (this.isSelect) {
            this.node.color = cc.Color.BLACK;
        } else {
            this.node.color = this.oldColor;
        }
    }
}
