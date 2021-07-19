import type {Application, DisplayObject} from 'pixi.js';
import Actor from './Actor';
import type Trait from './Trait';

/**
 * A high level representation of the game.
 */
export default class Game {

    /**
     * All the actors currently in the game.
     */
    private actors: Actor[] = [];
    private sinceLastFixed = 0;
    private _app: Application;

    /**
     * @param app The pixi.js application instace all actors will be added to.
     */
    constructor (app?: Application) {
        window.onresize = () => {
            if (this.app) {
                this.actors.forEach(actor => actor.draw(this.app));
            }
        };
    }

    get width () {
        return this.app.screen.width;
    }

    get height () {
        return this.app.screen.height;
    }

    get app () {
        return this._app;
    }

    set app (app: Application) {
        if (this.app) {
            return;
        }
        this._app = app;
        this.app.ticker.add(delta => {
            this.sinceLastFixed += delta;
            if (this.sinceLastFixed >= 50) {
                this.sinceLastFixed -= 50;
                this.actors.forEach(actor => actor.fixedUpdate(50));
            }
            this.actors.forEach(actor => actor.update(delta));
        });
        this.actors.forEach(actor => actor.draw(this.app));
    }

    trigger (event: string, data?: any) {
        this.actors.forEach(actor => actor.trigger(event, data));
    }

    /**
     * Add an actor to the game.
     */
    addActor (actor: Actor) {
        actor.setup();
        if (this.app) {
            Promise.resolve(actor.draw(this.app));
        }
        actor.game = this;
        this.actors.push(actor);
        return actor;
    }

    createActor (...traits: Trait[]) {
        return this.addActor(new Actor(...traits))
    }

    /**
     * Add children to the application stage.
     */
    addPixiChildren (...children: DisplayObject[]) {
        this.app.stage.addChild(...children);
    }

}
