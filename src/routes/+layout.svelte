<script lang="ts">
  import '../app.css';
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from '../tanstack/query-client';
</script>

<svelte:head>
  <title>Match Maker</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div id="header" class="flex py-2 mb-12">
    <div class="mx-auto text-6xl"><a style="text-decoration: none" href="/">Match Maker</a></div>
  </div>
  <div class="pb-8">
    <slot/>
  </div>
</QueryClientProvider>
