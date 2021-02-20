import { Cell } from "./Cell";

/*
 * @Author: Xiong ZhiCheng 
 * @Date: 2021-02-18 13:43:22 
 * @Description: 
 */
declare global {
    interface Window {
        testContext: TestContext;
    }
    let testContext: TestContext;
}

const { ccclass, property } = cc._decorator;

@ccclass
export class TestContext extends cc.Component {

    @property({ displayName: "map", type: cc.Node })
    private map: cc.Node = null;

    @property({ displayName: "cell预制", type: cc.Prefab })
    private cellPre: cc.Prefab = null;

    public isEditing: boolean = false;

    private screenWidth: number = 0;

    private screenHeight: number = 0;

    public isTouch: boolean = false;

    private switchEdit(): void {
        this.isEditing = !this.isEditing;
        console.error("当前编辑状态", this.isEditing);
    }

    public onLoad(): void {
        window.testContext = this;

        let canvas = cc.Canvas.instance.node;
        this.screenWidth = canvas.width;
        this.screenHeight = canvas.height;

        this.map.x = -canvas.width / 2;
        this.map.y = -canvas.height / 2;

        this.createGird();
    }

    private allCellList: Cell[][] = [];

    private createGird(): void {
        let cellSize = 50;
        let colCount = this.map.width / cellSize;
        let rowCount = this.map.height / cellSize;

        for (let i = 0; i < colCount; i++) {
            this.allCellList[i] = [];
            for (let j = 0; j < rowCount; j++) {
                let node = cc.instantiate(this.cellPre);
                node.width = node.height = cellSize;
                if (i % 2 == 0) {
                    if (j % 2 == 0) {
                        node.color = cc.Color.WHITE;
                    } else {
                        node.color = cc.Color.YELLOW;
                    }
                } else {
                    if (j % 2 != 0) {
                        node.color = cc.Color.WHITE;
                    } else {
                        node.color = cc.Color.YELLOW;
                    }
                }
                node.opacity = 125;
                node.setParent(this.map);
                node.setPosition(cellSize / 2 + cellSize * i, cellSize / 2 + cellSize * j);
                let com = node.getComponent(Cell);
                com.init(i, j, node.color, false);
                this.allCellList[i][j] = com;
            }
        }
    }

    public curKey: string = "dhwBlockAreaList";

    public data: any = {};

    public index: number = 0;

    public changeCell(x: number, y: number, isSelect: boolean): void {
        if (!this.curKey) {
            return;
        }
        if (!this.data[this.curKey]) {
            this.data[this.curKey] = [];
        }

        let data = this.data[this.curKey];

        let index = -1;

        for (let i = 0; i < data.length; i++) {
            const pos = data[i];
            if (pos.x == x && pos.y == y) {
                index = i;
                break;
            }
        }

        if (index == -1 && isSelect) {
            data.push({ x: x, y: y });
        } else {
            if (isSelect) {
                console.log("已经被选择了", x, y);
            } else {
                data.splice(index, 1);
            }
        }
    }


    public onEnable(): void {
        this.map.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.map.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    }

    public onDisable(): void {
        this.map.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.map.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    }

    private lastTouchPos: cc.Vec2 = null;

    private touchStart(touch: cc.Event.EventTouch): void {
        if (this.isEditing) {
            return;
        }
        this.lastTouchPos = touch.getLocation().clone();
    }

    private touchMove(touch: cc.Event.EventTouch): void {
        if (this.isEditing) {
            return;
        }
        let curTouchPos = touch.getLocation().clone();
        let sub = curTouchPos.sub(this.lastTouchPos);

        let x = cc.misc.clampf(this.map.x + sub.x, -this.map.width + this.screenWidth / 2, -this.screenWidth / 2);
        let y = cc.misc.clampf(this.map.y + sub.y, -this.map.height + this.screenHeight / 2, -this.screenHeight / 2);
        this.map.setPosition(cc.v2(x, y));
        this.lastTouchPos = curTouchPos;
    }

    public downloadConfig(): void {
        console.log(this.data);
        const content = JSON.stringify(this.data);
        const blob = new Blob([content]);
        const href = URL.createObjectURL(blob);
        this.download(href, "mapGridConfig.json");
        URL.revokeObjectURL(href);
    }

    private download(href, title) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('download', title);
        a.click();
    }

}
