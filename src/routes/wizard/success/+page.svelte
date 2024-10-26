<script lang="ts">
import { onMount } from 'svelte'
import { goto } from '$app/navigation'

import { creationInfoStore } from '$lib/stores/CreationStore'
import type { CreationInfo } from '$lib/stores/CreationStore'

let characterInfo: CreationInfo | null = null

onMount(() => {
  const unsubscribe = creationInfoStore.subscribe(value => {
    characterInfo = value
    if (!characterInfo) {
      // If there's no character data, redirect to the wizard
      goto('/wizard')
    }
  })

  return unsubscribe
})
</script>

<div class="card variant-ghost card-hover p-5">
  <h1 class="h1 mb-3">{characterInfo?.characterName} created successfully!</h1>

  {#if characterInfo}
    <h3 class="flex h3 items-center mb-9">
      {#if characterInfo.guildIcon}
        <img class="rounded-full h-[1.5em] w-auto mr-2" src={characterInfo.guildIcon} alt={characterInfo.guildName}>
      {/if}
      {characterInfo.guildName}
    </h3>
    <p>Congratulations! Your character {characterInfo.characterName} has been created.</p>
  {:else}
    <p>Loading character data...</p>
  {/if}
</div>
