<script lang="ts">
    import {onMount} from 'svelte';
    import Game from '$lib/core/Game';
    import type Trait from '$lib/core/Trait';
    import GameScreen from '$lib/components/screen/Game.svelte';

    enum State {LOBBY, PLAYING}

    let airconsole: AirConsole;
    let state = State.LOBBY;
    let deviceIds: number[] = [];
    let game: Game;

    onMount(() => {
        game = new Game();
        airconsole = new AirConsole();
        airconsole.onConnect = deviceId => {
            deviceIds = [...deviceIds, deviceId];
        }
        airconsole.onDisconnect = deviceId => {
            deviceIds = deviceIds.filter(id => id !== deviceId);
        }
        airconsole.onMessage = (from, data) => {
            game.trigger(data.event, {...data, from});
        }
        game.createActor({
            onStart () {
                state = State.PLAYING;
            }
        } as Trait);
    });
</script>

{#if airconsole}
    {#if state === State.PLAYING}
        <GameScreen game={game} />
    {:else}
        <div class="bg-gray-700 w-full h-screen p-16">
            <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 flex">
                    <div class="py-2 align-middle inline-block w-1/2 sm:px-6 lg:px-8 mx-auto">
                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table class="min-w-full divide-y divide-gray-200">
                                <tbody class="bg-white divide-y divide-gray-200">
                                    {#each deviceIds as deviceId}
                                        <tr> <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"> {airconsole.getNickname(deviceId)} </td> </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if}



