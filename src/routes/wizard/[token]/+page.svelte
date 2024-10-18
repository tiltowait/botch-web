<script lang="ts">
  import CharacterSheetLayout from './CharacterSheetLayout.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  const { wizardSchema } = data
</script>

<CharacterSheetLayout {wizardSchema} />
