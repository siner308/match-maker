<script lang="ts">
  import Loading from '../../components/Loading.svelte';
  import { addPlayer, getPlayersByRoomId, getRoomDetailsByRoomId, startRound } from '../../api/api';

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

<div>
  {#if $room.isLoading}
    <div class="fixed text-center w-full h-full">
      <Loading/>
    </div>
  {/if}
  {#if $room.isSuccess}
    <h1 class="mb-8">{$room.data.name}</h1>
    <div class="flex gap-4 justify-center">
      {#each $room.data.rounds as round}
        <div class="flex flex-col gap-4 m-2"
             class:is_finished_round={round.matches.every(match => match.finished_at)}
             class:is_not_finished_round={round.matches.some(match => !match.finished_at)}
        >
          <h2
                  class="text-2xl font-bold"
          >
            Round {round.round_number} ({round.matches.filter(match => match.finished_at).length}/{round.matches.length}
            )
          </h2>
          {#each round.matches as match}
            <div
                    class="flex flex-col gap-2 bg-gray-300 p-2 rounded-xl w-32 mx-auto"
                    class:is_finished_match={match.finished_at}
                    class:is_not_finished_match={!match.finished_at}
            >
              <div class="flex gap-4 items-center mx-auto">
                <p>{match.player1.name}</p>
                <p class="text-2xl">{match.player1_score || '-'}</p>
              </div>
              <hr />
              <div class="flex gap-4 items-center mx-auto">
                <p>{match.player2.name}</p>
                <p class="text-2xl">{match.player2_score || '-'}</p>
              </div>

            </div>
          {/each}
        </div>
      {/each}
      <div class="my-auto">
        <button
                id="start-round"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={$room.data.rounds.some(round => round.matches.some(match => !match.finished_at))}
                class:disabled={$room.data.rounds.some(round => round.matches.some(match => !match.finished_at))}
                onclick={onStartRound}
        >
          {#if !$room.data.rounds.length}
            Start Round
          {:else}
            Next Round
          {/if}
        </button>
      </div>
    </div>
    {#if $players.isLoading}
      <div class="fixed text-center w-full h-full">
        <Loading/>
      </div>
    {/if}
    {#if $players.isSuccess}
      <div>
        <h2 class="text-2xl font-bold">Players</h2>
        <ul>
          {#each $players.data as player}
            <li>{player.name}</li>
          {/each}
        </ul>
      </div>
      <form onsubmit={onSubmitAddPlayer}>
        <input
                type="text"
                placeholder="Player Name"
                onchange={onNewPlayerNameChange}
                value={newPlayerName}
        />
        <button
                id="add-player"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
    @apply bg-zinc-300;
  }

  .is_not_finished_round {
    h2 {
      @apply text-orange-400;
    }
  }

  .is_not_finished_round .is_not_finished_match {
    @apply bg-orange-300;
  }

  .is_not_finished_round .is_finished_match {
    @apply bg-blue-300;
  }

  .disabled {
    @apply bg-gray-500;
  }
</style>
