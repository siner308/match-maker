<script lang="ts">
  import Loading from '../../components/Loading.svelte';
  import { addPlayer, getPlayersByRoomId, getRoomDetailsByRoomId, startRound } from '../../api/api';
  import { Match } from '../../supabase/entieies/match.entity';

  // get id from query
  const roomId = new URLSearchParams(window.location.search).get('id');
  if (!roomId) {
    throw new Error('id is required');
  }

  const addPlayerMutation = addPlayer(roomId);
  const players = getPlayersByRoomId(roomId);

  const room = getRoomDetailsByRoomId(roomId);

  let newPlayerName = $state.raw('');
  const onNewPlayerNameChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    newPlayerName = target.value;
  };
  const onSubmitAddPlayer = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!$room.isSuccess || !$room.data.id || !newPlayerName) {
      return;
    }
    $addPlayerMutation.mutate(newPlayerName);
    newPlayerName = '';
  };

  const startRoundMutation = startRound(roomId);
  const onStartRound = async () => {
    if (!$room.isSuccess) {
      return;
    }
    $startRoundMutation.mutate();
  };
</script>

<div class="flex flex-col gap-8 items-center">
  {#if $room.isLoading}
    <div class="fixed text-center w-full h-full">
      <Loading/>
    </div>
  {/if}
  {#if $room.isError}
    <div class="fixed text-center w-full h-full">
      <p>{$room.error.message}</p>
    </div>
  {/if}
  {#if $room.isSuccess}
    <h1>{$room.data.name}</h1>
    <div class="flex gap-4 justify-center">
      {#each $room.data.rounds as round}
        <div class="flex flex-col gap-4 m-2"
             class:is_finished_round={round.matches.every(match => Match.isFinished(match))}
             class:is_not_finished_round={round.matches.some(match => !Match.isFinished(match))}
        >
          <h2 class="text-2xl font-bold">Round {round.round_number}</h2>
          <!--            match progress bar-->
          <div class="flex gap-1 h-4">
            {#each round.matches as match}
              <div class="h-full" style="width: {100 / round.matches.length}%">
              {#if Match.isFinished(match)}
                <div class="bg-green-500 w-full h-full"></div>
              {:else}
                <div class="bg-gray-300 w-full h-full"></div>
              {/if}
              </div>
            {/each}
          </div>
          {#each round.matches as match}
            <div
                    class="flex flex-col gap-2 bg-gray-300 p-2 rounded-xl w-32 mx-auto"
                    class:is_finished_match={Match.isFinished(match)}
                    class:is_not_finished_match={!Match.isFinished(match)}
            >
              <div class="px-2 w-full flex items-center justify-between">
                <p class="text-lg">{match.player1.name}</p>
                <p class="text-2xl">{match.player1_score ?? '-'}</p>
              </div>
              <hr/>
              <div class="px-2 w-full flex items-center justify-between">
                <p class="text-lg">{match.player2.name}</p>
                <p class="text-2xl">{match.player2_score ?? '-'}</p>
              </div>

            </div>
          {/each}
        </div>
      {/each}
    </div>
    <div class="my-auto">
      <button
              id="start-round"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={$room.data.rounds.some(round => round.matches.some(match => !Match.isFinished(match)))}
              class:disabled={$room.data.rounds.some(round => round.matches.some(match => !Match.isFinished(match)))}
              onclick={onStartRound}
      >
        {#if !$room.data.rounds.length}
          Start Round
        {:else}
          Next Round
        {/if}
      </button>
    </div>
    {#if $players.isLoading}
      <div class="fixed text-center w-full h-full">
        <Loading/>
      </div>
    {/if}
    {#if $players.isSuccess}
      <div>
        <h2 class="text-2xl font-bold">Players</h2>
        {#each $players.data as player}
          <li>{player.name}</li>
        {/each}
      </div>
      <form onsubmit={onSubmitAddPlayer} class="h-10">
        <input
                class="h-full rounded py-2 px-4"
                type="text"
                placeholder="Player Name"
                onchange={onNewPlayerNameChange}
                value={newPlayerName}
        />
        <button
                id="add-player"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-full"
                type="submit"
        >
          Add Player
        </button>
      </form>
    {/if}
  {/if}
</div>

<style>
  .is_finished_round {
    h2 {
      @apply text-green-500;
    }
  }

  .is_finished_match {
    @apply bg-green-500;
  }

  .is_not_finished_round {
    h2 {
      @apply text-orange-400;
    }
  }

  .is_not_finished_round .is_not_finished_match {
    @apply bg-gray-300;
  }

  .is_not_finished_round .is_finished_match {
    @apply bg-green-500;
  }

  .disabled {
    @apply bg-gray-500;
  }
</style>
