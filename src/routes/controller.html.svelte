<script lang="ts">
    enum State {WAITING_FOR_PLAYERS, READY, PLAYING}

    import {onMount} from 'svelte';
    import GameController from '$lib/components/controller/Game.svelte';
    let airconsole: AirConsole;
    let deviceId = -1;
    let masterDeviceId = -1;
    let state = State.WAITING_FOR_PLAYERS;
    $: master = deviceId === masterDeviceId;

    onMount(() => {
        airconsole = new AirConsole({orientation: AirConsole.ORIENTATION_PORTRAIT});
        airconsole.onConnect = _ => {
            deviceId = airconsole.getDeviceId();
            masterDeviceId = airconsole.getMasterControllerDeviceId();
            state = state === State.WAITING_FOR_PLAYERS && airconsole.getControllerDeviceIds().length >= 2 ? State.READY : state;
        }
        airconsole.onDisconnect = _ => {
            deviceId = airconsole.getDeviceId();
            masterDeviceId = airconsole.getMasterControllerDeviceId();
            state = state === State.READY && airconsole.getControllerDeviceIds().length < 2 ? State.WAITING_FOR_PLAYERS : state;
        }
        airconsole.onMessage = (from, data) => {
            triggers[data.event]?.({...data, from});
        }
        let triggers = {
            start () {
                state = State.PLAYING;
            }
        }
    });

    function start () {
        airconsole.broadcast({event: 'start'});
        state = State.PLAYING;
    }
</script>

{#if airconsole}
    {#if state === State.PLAYING}
        <GameController />
    {:else}
        <div class="bg-gray-700 w-full h-screen py-16 px-8">
            <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div class="px-4 py-5 sm:px-6 text-center">
                    {#if master && state === State.WAITING_FOR_PLAYERS}
                        Waiting for another player
                    {:else if master}
                        Everybody ready?
                    {:else}
                        Waiting for {airconsole.getNickname(masterDeviceId)} to start
                    {/if}
                </div>
                <div class="px-4 py-5 sm:p-6 text-center">
                    {#if master}
                    <button disabled={state != State.READY} type="button" on:click={start} class="
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        inline-flex
                        items-center
                        px-6
                        py-3
                        border
                        border-transparent
                        text-base
                        font-medium
                        rounded-md
                        shadow-sm
                        text-white
                        bg-indigo-600
                        hover:bg-indigo-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-offset-2
                        focus:ring-indigo-500"
                    >
                        Play
                    </button>
                {/if}
                </div>
            </div>
        </div>
    {/if}
{/if}
