<script lang="ts">
    import {onMount} from 'svelte';
    import Game from '$lib/core/Game';
    import GameScreen from '$lib/components/screen/Game.svelte';

    let game: Game;

    onMount(() => {
        game = new Game();
    });
</script>

{#if game}
    <GameScreen game={game} />
{/if}




