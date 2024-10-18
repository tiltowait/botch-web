<script lang="ts">
  import CharacterSheetLayout from './CharacterSheetLayout.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  const { characterSheet } = data
</script>

<!-- <div class="container h-full mx-auto flex">
	<div class="space-y-10 text-center flex flex-col items-center">
    <TraitSelector trait="Investigation" />
  </div>
</div> -->

<CharacterSheetLayout {characterSheet} />
