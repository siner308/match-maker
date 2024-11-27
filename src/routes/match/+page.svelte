<script>
	import Loading from '../../components/Loading.svelte';
	// get id from query
	const id = new URLSearchParams(window.location.search).get('id')
	if (!id) {
		throw new Error('id is required');
	}

	// get match histories
	const generatePlayer = () => {
		return {
			id: crypto.randomUUID().slice(0, 8),
			name: Math.random() > 0.5 ? '사이너' : '안정현',
			score: Math.floor(Math.random() * 10)
		};
	};

	const data = fetch(`/api/matches/${id}`)
		.then(response => response.json())
		.catch(data => {

			return {
				name: '포켓몬 카드 게임 대회 1회',
				rounds: [
					{
						round: 1,
						matches: [
							{
								players: [
									generatePlayer(),
									generatePlayer()
								],
								is_finished: true
							},
							{
								players: [
									generatePlayer(),
									generatePlayer()
								],
								is_finished: true
							},
							{
								players: [
									generatePlayer(),
									generatePlayer()
								],
								is_finished: true
							}
						]
					},
					{
						round: 2,
						matches: [
							{
								players: [
									generatePlayer(),
									generatePlayer()
								],
								is_finished: Math.random() > 0.5
							},
							{
								players: [
									generatePlayer(),
									generatePlayer()
								],
								is_finished: Math.random() > 0.5
							},
							{
								players: [
									generatePlayer(),
									generatePlayer()
								],
								is_finished: Math.random() > 0.5
							}
						]
					}
				]
			};
		});
</script>

<div>
	{#await data}
		<div class="fixed text-center w-full h-full">
			<Loading />
		</div>
	{:then value}
		<h1 class="mb-8">{value.name}</h1>
		<div class="flex gap-4 justify-center">
			{#each value.rounds as round}
				<div class="flex flex-col gap-4 m-2"
						 class:is_finished_round={round.matches.every(match => match.is_finished)}
						 class:is_not_finished_round={round.matches.some(match => !match.is_finished)}
				>
					<h2
						class="text-2xl font-bold"
					>
						Round {round.round} ({round.matches.filter(match => match.is_finished).length}/{round.matches.length})
					</h2>
					{#each round.matches as match}
						<div
							class="flex flex-col gap-2 bg-gray-300 p-2 rounded-xl w-32 mx-auto"
							class:is_finished_match={match.is_finished}
							class:is_not_finished_match={!match.is_finished}
						>
							{#each match.players as player}
								<div class="flex gap-4 items-center mx-auto border-b-2 border-black">
									<p>{player.name}</p>
									<p class="text-2xl">{player.score}</p>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/each}
			<div class="my-auto">
				<button
					id="next-round"
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					disabled={value.rounds.some(round => round.matches.some(match => !match.is_finished))}
					class:disabled={value.rounds.some(round => round.matches.some(match => !match.is_finished))}
				>
					>> Next Round
				</button>
			</div>
		</div>
	{:catch error}
		<p>{error.message}</p>
	{/await}
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
