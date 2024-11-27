<script lang="ts">
	import { goto } from '$app/navigation';

	let createMatchModal = $state(false);
	let searchMatchModal = $state(false);

	const openCreateMatchModal = () => {
		createMatchModal = !createMatchModal;
		if (createMatchModal) {
			searchMatchModal = false;
		}
	};

	const openSearchMatchModal = () => {
		searchMatchModal = !searchMatchModal;
		if (searchMatchModal) {
			createMatchModal = false;
		}
	};

	const onSubmitCreateMatch = async (e: Event) => {
		e.preventDefault();
		const data = await fetch('/api/match', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: e.target['name'].value
			})
		})
			.then((res) => res.json())
			.catch(() => {
			return { id: crypto.randomUUID() };
		});
		await goto(`/match/${data.id}`);
	};

</script>

<main class="flex flex-col items-center p-10 gap-8">
	<div class="flex gap-8">
		<button class="button" onclick={openCreateMatchModal}>Create</button>
		<button class="button" onclick={openSearchMatchModal}>Search</button>
	</div>

	{#if createMatchModal}
		<div class="items-center flex flex-col gap-8 bg-gray-500 p-8 rounded-2xl min-w-[50%]">
			<p class="text-4xl">Create Match</p>
			<form class="flex flex-col gap-4 w-full">
				<input class="input" type="text" placeholder="Match Name" />
				<button class="button submit" onclick={onSubmitCreateMatch}>Create</button>
			</form>
		</div>
	{/if}

	{#if searchMatchModal}
		<div class="items-center flex flex-col gap-8 bg-gray-500 p-8 rounded-2xl min-w-[50%]">
			<p class="text-4xl">Search Match</p>
			<form class="flex flex-col gap-4 w-full">
				<input class="input" type="text" placeholder="Match Name" />
				<button class="button submit">Search</button>
			</form>
		</div>
	{/if}

</main>

<style lang="postcss">
  .button {
    background-color: white;
    color: black;
    padding: 1rem;
    @apply rounded-xl;
    @apply text-xl;

    &.submit {
      background-color: #FF5F00;
      color: white;
    }
  }

  .input {
    @apply text-black;
    @apply placeholder-gray-400;
    padding: 1rem;
    @apply rounded-xl;
    @apply text-xl;
  }
</style>
