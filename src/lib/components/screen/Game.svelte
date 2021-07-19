<script lang="ts">
    export let game: Game;
    import Canvas from '$lib/components/Canvas.svelte';
    import type Game from '$lib/core/Game';
    import type Actor from '$lib/core/Actor';
    import { vec } from '$lib/math/Vector';
    import Grid from '$lib/traits/Grid';
    import Robot from '$lib/traits/Robot';
    import {sleep} from '$lib/core/util';
    import { flip } from 'svelte/animate';
    import { scale, fly } from 'svelte/transition';
    import { circOut } from 'svelte/easing';
    import {colorStringToNumber} from '$lib/core/util';
    import defaultTheme from 'tailwindcss/defaultTheme';
    import createQueue from '$lib/stores/createQueue';

    console.log(defaultTheme.colors.blue[500]);

    let robots: Actor[] = [];
    let commands = [
        { mehod: 'move', params: [-1], name: 'Move back' },
        { mehod: 'move', params: [1], name: 'Move forward 1' },
        { mehod: 'move', params: [2], name: 'Move forward 2' },
        { mehod: 'move', params: [3], name: 'Move forward 3' },
        { mehod: 'rotate', params: [true], name: 'Turn clockwise' },
        { mehod: 'rotate', params: [false], name: 'Turn anti-clockwise' },
    ]
    let commandQueue = createQueue(Array.from({length: 6}, () => commands[Math.floor(Math.random() * commands.length)]));

    let colors = [
        'bg-blue-500',
        'bg-red-400',
        'bg-green-500',
    ]

    async function start (game: Game) {
        let center = vec(game.width / 2, game.height / 2);
        let size = Math.min(game.width, game.height) - 50;
        let grid = new Grid(center, vec(size, size), vec(10, 10));
        game.createActor({
            draw (actor) {
                if (actor.hasTrait(Grid)) {
                    center = vec(game.width / 2, game.height / 2);
                    size = Math.min(game.width, game.height) - 50;
                    grid.center = center;
                    grid.size = vec(size, size);
                }
            }
        },
            grid
        );
        robots.push(game.createActor(new Robot(colorStringToNumber(defaultTheme.colors.blue[500]), vec(4, 2), 0.0, grid)));
        robots.push(game.createActor(new Robot(colorStringToNumber(defaultTheme.colors.red[400]), vec(2, 2), 0.0, grid)));
        robots.push(game.createActor(new Robot(colorStringToNumber(defaultTheme.colors.green[500]), vec(6, 2), 0.0, grid)));

        while (true) {
            let command = $commandQueue[0];
            commandQueue.dequeue();
            commandQueue.enqueue(commands[Math.floor(Math.random() * commands.length)]);
            await robots[command.key % 3].getTrait(Robot)[command.value.mehod](...command.value.params);
            await sleep(2000);
        }
    }
</script>

<div class="h-screen w-full bg-gray-800 grid grid-cols-8 overflow-hidden">
    <div class="h-full grid grid-cols-1 gap-8 px-8 py-16">
        {#each $commandQueue as command (command.key)}
            <div class="{colors[command.key % 3]} rounded-3xl grid" animate:flip in:fly={{delay: 250, y: 500, easing: circOut}} out:scale>
                <div class="m-auto text-center">{command.value.name}</div>
            </div>
        {/each}
    </div>
    <Canvas game={game} start={start} backgroundAlpha={0} classList="h-screen col-span-7" />
</div>
