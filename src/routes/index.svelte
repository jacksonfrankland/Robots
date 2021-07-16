<script lang="ts">
    import Canvas from '$lib/components/Canvas.svelte';
    import type Game from '$lib/core/Game';
    import { vec } from '$lib/math/Vector';
    import Grid from '$lib/traits/Grid';

    function air () {
    }

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
            new Grid(center, vec(size, size), vec(10, 10))
        );
    }
</script>
<svelte:head>
		<script type="text/javascript" src="https://www.airconsole.com/api/airconsole-1.7.0.js" on:load={air}></script>
</svelte:head>
<Canvas start={start} classList="w-full h-screen" />

