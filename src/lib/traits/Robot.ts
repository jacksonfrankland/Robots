import type Trait from '$lib/core/Trait';
import type Vector from '$lib/math/Vector';
import { vec } from '$lib/math/Vector';
import { tweened } from 'svelte/motion';
import type  { Tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import type Actor from '$lib/core/Actor';
import Grid from './Grid';
import type { Unsubscriber } from 'svelte/store';

export default class Robot implements Trait {

    public transform: Tweened<{position: Vector, rotation: number}>
    private unsubscribeTransform: Unsubscriber;

    constructor (private color: number = 0, position: Vector = vec(0, 0), rotation = 0, private grid: Grid = new Grid()) {
        this.transform = tweened({position, rotation}, {
            duration: 600,
            easing: cubicOut
        })
    }

    async draw (actor: Actor) {
        const Pixi = await import('pixi.js');
        let graphics = new Pixi.Graphics();
        graphics.beginFill(this.color);
        graphics.drawRect(0, 0, 1, 1);
        graphics.endFill();

        graphics.beginFill(0);
        graphics.drawRect(.3, .1, .1, .1);
        graphics.drawRect(.6, .1, .1, .1);
        graphics.endFill();

        actor.addPixiChild(graphics);
        actor.size = this.grid.unit.scaledBy(.6);
        actor.pivot = vec(0.5, 0.5);
        this.unsubscribeTransform?.();
        this.unsubscribeTransform = this.transform.subscribe(transform => {
            console.log(transform);
            actor.position = this.grid.coordinatesToPosition(transform.position);
            actor.angle = transform.rotation * 90;
        });
    }

    rotate (clockwise: boolean = true) {
        return this.transform.update(transform => ({...transform, rotation: transform.rotation + (clockwise ? 1 : -1)}));
    }

    move (spaces: number) {
        return this.transform.update(transform => {
            let direction = vec(0, 0);
            if (Math.abs(transform.rotation % 2) === 0) {
                direction.y = Math.abs(transform.rotation % 4) === 0 ? -1 : 1;
            } else {
                direction.x = Math.abs((transform.rotation + 1) % 4) === 0 ? -1 : 1;
            }
            let position = transform.position.plus(direction.scaledBy(spaces)).clamp(vec(0, 0), this.grid.axisSize.minus(1, 1));
            return {...transform, position};
        });
    }

}
