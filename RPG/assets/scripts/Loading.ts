/*
 * @Author: Xiong ZhiCheng 
 * @Date: 2021-02-06 14:14:33 
 * @Description: 加载
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class Loading extends cc.Component {

    @property({ displayName: "背景1", type: cc.Node })
    private bg1: cc.Node = null;

    @property({ displayName: "背景2", type: cc.Node })
    private bg2: cc.Node = null;

    private screenWidth: number = 0;

    public onLoad(): void {
        this.screenWidth = cc.Canvas.instance.node.width;
        this.bg1.x = -this.screenWidth / 2;
        this.bg2.x = this.bg1.width + this.bg1.x;
    }

    public update(dt: number): void {
        this.checkBGPosition(dt);
    }

    private checkBGPosition(dt: number): void {
        let speed = 500;
        this.bg1.x -= dt * speed;
        this.bg2.x -= dt * speed;

        let bg1MinX = -(this.screenWidth / 2 + this.bg1.width);
        if (this.bg1.x < bg1MinX) {
            this.bg1.x = this.bg2.x + this.bg2.width;
        }

        let bg2MinX = -(this.screenWidth / 2 + this.bg2.width);
        if (this.bg2.x < bg2MinX) {
            this.bg2.x = this.bg1.x + this.bg1.width;
        }
    }
}
