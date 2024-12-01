<script lang="ts">
	import type { Room } from '../supabase/entieies/room.entity';

	let name = $state.raw('');
	import { goto } from '$app/navigation';
	import { createRoom } from '../api/api';

	const mutation = createRoom(async (room: Room) => {
		await goto(`/match?id=${room.id}`);
	});
	const onSubmitCreateMatch = async (e: Event) => {
		e.preventDefault();
		$mutation.mutate(name);
	};

	const onChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		name = target.value;
	};

</script>

<main class="flex flex-col items-center p-10 gap-8">
	<div class="items-center flex flex-col gap-8 bg-gray-500 p-8 rounded-2xl min-w-[50%]">
		<p class="text-4xl">Create Match</p>
		<form class="flex flex-col gap-4 w-full">
			<input class="input" type="text" placeholder="Match Name" onchange={onChange} value="{name}" />
			<button class="button submit" onclick={onSubmitCreateMatch}>Create</button>
		</form>
	</div>
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
