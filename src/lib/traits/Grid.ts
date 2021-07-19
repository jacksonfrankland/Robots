import type Trait from "$lib/core/Trait";
import type Actor from "$lib/core/Actor";
import type Vector from "$lib/math/Vector";
import {vec} from '$lib/math/Vector';

export default class Grid implements Trait {

    constructor (public center: Vector = vec(50, 50), public size: Vector = vec(100, 100), public axisSize: Vector = vec(10, 10)) {}

    async draw (actor: Actor) {
        const Pixi = await import('pixi.js');
        let graphics = new Pixi.Graphics();
        graphics.lineStyle(.03, 0xaaaaaa);
        for (let i = 0; i < this.axisSize.x + 1; i++) {
            graphics.moveTo(i, 0);
            graphics.lineTo(i, this.axisSize.y);
        }
        for (let i = 0; i < this.axisSize.y + 1; i++) {
            graphics.moveTo(0, i);
            graphics.lineTo(this.axisSize.x, i);
        }
        actor.addPixiChild(graphics);
        actor.size = this.size;
        actor.pivot = this.axisSize.scaledBy(.5);
        actor.position = this.center;
    }

    get unit () {
        return vec(this.size.x / this.axisSize.x, this.size.x / this.axisSize.x);
    }

    coordinatesToPosition (coordinates: Vector) {
        let topLeft = this.center.minus(this.size.scaledBy(.5));
        return topLeft.plus(coordinates.x * this.unit.x, coordinates.y * this.unit.y).plus(this.unit.scaledBy(.5));
    }

}
