<script lang="ts">
  import CharacterSheetLayout from './CharacterSheetLayout.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  const { characterSheet } = data
</script>

<CharacterSheetLayout {characterSheet} />
