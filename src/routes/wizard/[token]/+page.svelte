<script lang="ts">
  import { CharacterSheet } from '$lib/types/CharacterSheet'
  import CharacterSheetLayout from './CharacterSheetLayout.svelte'
  import TraitSelector from "./TraitSelector.svelte"

  // TODO: Get this from +page.ts
  import characterSheetData from './vtm.json'
  const characterSheet = new CharacterSheet(characterSheetData)
</script>

<!-- <div class="container h-full mx-auto flex">
	<div class="space-y-10 text-center flex flex-col items-center">
    <TraitSelector trait="Investigation" />
  </div>
</div> -->

<CharacterSheetLayout {characterSheet} />
