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

    @property({ displayName: "进度条", type: cc.Sprite })
    private progressBar: cc.Sprite = null;

    private screenWidth: number = 0;

    private loadComplete: boolean = false;

    private sceneLoadComplect: boolean = false;

    private progress: number = 0;

    public onLoad(): void {
        this.screenWidth = cc.Canvas.instance.node.width;
        this.bg1.x = -this.screenWidth / 2;
        this.bg2.x = this.bg1.width + this.bg1.x;
        this.progressBar.fillRange = 0;
        this.loadComplete = false;
        this.sceneLoadComplect = false;

        cc.director.preloadScene("main", null, (error) => {
            if (error) {
                console.error("load main scene fail");
                return;
            }
            this.sceneLoadComplect = true;
        });
    }

    public update(dt: number): void {
        this.refreshProgress(dt);
        this.checkBGPosition(dt);

        if (this.progress >= 1 && this.sceneLoadComplect && !this.loadComplete) {
            this.loadComplete = true;
            this.loadScene();
        }
    }

    private refreshProgress(dt: number): void {
        this.progress += 0.003;
        this.progress = Math.min(this.progress, 1);
        this.progressBar.fillRange = this.progress;
    }

    private checkBGPosition(dt: number): void {
        let speed = 100;
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

    private loadScene(): void {
        cc.director.loadScene("main");
    }
}
