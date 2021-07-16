<script lang="ts">
    export let game: Game;
    import Canvas from '$lib/components/Canvas.svelte';
    import type Game from '$lib/core/Game';
    import { vec } from '$lib/math/Vector';
    import Grid from '$lib/traits/Grid';
    import { flip } from 'svelte/animate';
    import { scale, fly } from 'svelte/transition';
    import { circOut } from 'svelte/easing';
    import createQueue from '$lib/stores/createQueue';

    let numbers = createQueue(Array.from({length: 7}, () => Math.floor(Math.random() * 8)));
    let colors = [
        'bg-blue-500',
        'bg-red-400',
        'bg-green-500',
    ]
    setInterval(() => {
        numbers.dequeue();
        numbers.enqueue(Math.floor(Math.random() * 8));
    }, 2000);

    function start (game: Game) {
        let center = vec(game.width / 2, game.height / 2);
        let size = Math.min(game.width, game.height) - 50;
        game.createActor({
            draw (actor) {
                if (actor.hasTrait(Grid)) {
                    center = vec(game.width / 2, game.height / 2);
                    size = Math.min(game.width, game.height) - 50;
                    actor.getTrait(Grid).center = center;
                    actor.getTrait(Grid).size = vec(size, size);
                }
            }
        },
            new Grid(center, vec(size, size), vec(8, 8))
        );
    }
</script>

<div class="h-screen w-full bg-gray-800 grid grid-cols-8 overflow-hidden">
    <div class="h-full grid grid-cols-1 gap-8 px-8 py-16">
        {#each $numbers as number (number.key)}
            <div class="{colors[number.key % 3]} rounded-3xl grid" animate:flip in:fly={{delay: 250, y: 500, easing: circOut}} out:scale>
                <span class="m-auto">{number.value}</span>
            </div>
        {/each}
    </div>
    <Canvas game={game} start={start} backgroundAlpha={0} classList="h-screen col-span-7" />
</div>
