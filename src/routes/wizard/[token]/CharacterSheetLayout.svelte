<script lang="ts">
  import { goto } from '$app/navigation'
  import { currentTheme } from '$lib/stores/theme'

  import { sendProxiedPost, generateUrl } from '$lib/httpMethods'
  import { creationInfoStore } from '$lib/stores/CreationStore'

  import { WizardSchema } from '$lib/types/WizardSchema'

  import TraitSelector from './TraitSelector.svelte'
  import Selector from '$lib/components/Selector.svelte'

  export let token: string
  export let wizardSchema: WizardSchema
  const characterSheet = wizardSchema.traits // For convenience

  const labelClass = 'block uppercase tracking-wide font-bold mb-2'
  const inputClass = 'input input-bordered block w-full border py-3 px-4 mb-3 leading-tight'
  const splats = characterSheet.splats.map(titleCase).sort()

  function titleCase(str: string): string {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1))
    }).join(' ')
  }

  interface ValidationResponse {
    valid: boolean,
    details?: string
  }

  async function characterAllowed(): Promise<ValidationResponse> {
    const response = await sendProxiedPost(generateUrl(token, '/character/valid-name'), {
      token: characterState.token,
      name: characterState.name
    })
    const check: ValidationResponse = await response.json()
    return check
  }

  async function submitCharacter(event: Event): Promise<void> {
    event.preventDefault()
    console.log(characterState)

    // Check if the user is allowed to create this character
    const validity = await characterAllowed()
    if (!validity.valid) {
      alert(validity.details ?? `${characterState.name} is not a valid name!`)
      return
    }

    if(characterState.splat !== 'Vampire') {
      characterState.generation = null
    }

    const response = await sendProxiedPost(generateUrl(token, '/character/create'), characterState)
    console.log(await response.json())

    creationInfoStore.set({
      guildName: wizardSchema.guildName,
      guildIcon: wizardSchema.guildIcon,
      characterName: characterState.name,
    })
    await goto('/wizard/success')
  }

  // Store the character state
  type Grounding = {
    path: string,
    rating: number,
  }

  type Virtue = {
    name: string
    rating: number
  }

  interface CharacterState {
    token: string
    splat: string
    name: string
    grounding: Grounding
    health: number
    willpower: number
    generation: number | null
    traits: Record<string, number>
    virtues: Virtue[]
    special: Record<string, string | number | Record<string, number>>
    ready: () => boolean
  }

  let characterState: CharacterState = {
    token: token,
    splat: '',
    name: '',
    grounding: getDefaultGrounding(splats[0]),
    health: 7,
    willpower: 5,
    generation: 13,
    traits: {},
    virtues: (characterSheet.virtues ?? []).map(va => ({
      name: va[0] ?? '',
      rating: 1,
    })),
    special: initialSpecialValues(splats[0]),

    ready: function(): boolean {
      return this.name.trim() !== '' && this.grounding.path.trim() !== ''
    }
  }

  function initialSpecialValues(splat: string): Record<string, string | number | Record<string, number>> {
    const result: Record<string, string | number | Record<string, number>> = {}

    const relevantSpecials = (characterSheet.special ?? [])

    for (const special of relevantSpecials) {
      if (!special.splats.includes(splat.toLowerCase())) continue

      for (const trait of special.traits) {
        if (trait.type === 'trait-group') {
          const groupValues: Record<string, number> = {}
          for (const item of (trait.items ?? [])) {
            groupValues[item] = trait.default ?? 0
          }
          result[trait.name] = groupValues
        } else {
          result[trait.name] = trait.default ?? 0
        }
      }
    }

    return result
  }

  function getDefaultGrounding(splat: string): Grounding {
    return {
      path: characterSheet.grounding[splat.toLowerCase()],
      rating: characterSheet.line == 'wod' ? 5 : 7
    }
  }

  let previousSplat = characterState.splat
  $: if (characterState.splat !== previousSplat) {
    characterState.special = initialSpecialValues(characterState.splat)
    characterState.grounding = getDefaultGrounding(characterState.splat)
    previousSplat = characterState.splat

    const splatThemes: Record<string, string> = {
      Mortal: 'wintry',
      Mummy: 'mummy',
      Vampire: 'sahara',
    }
    currentTheme.set(splatThemes[characterState.splat] ?? 'skeleton')
    console.log($currentTheme)
  }
</script>

<!-- Character basics -->
<h1 class="h1 mb-3">New character</h1>
<h3 class="flex h3 items-center mb-9">
  {#if wizardSchema.guildIcon}
    <img class="rounded-full h-[1.5em] w-auto mr-2" src={wizardSchema.guildIcon} alt={wizardSchema.guildName}>
  {/if}
  {wizardSchema.guildName}
</h3>

<form on:submit={submitCharacter}>
  <div class="flex flex-wrap -mx-3 mb-6">
    <div class="w-full px-3 mb-6 md:mb-0">
      <!-- Splat -->
      <Selector
        label="Character type"
        options={splats}
        bind:value={characterState.splat}
        id="character-type"
        placeholder="Select a character type"
      />

      {#if characterState.splat !== ''}
        <!-- Character name -->
        <label class={labelClass} for="character-name">
          Character name
        </label>
        <input
          bind:value={characterState.name}
          class={inputClass}
          id="character-name"
          type="text"
          maxlength="37"
          placeholder="John Wilcox"
        >
        <!-- End character name -->
        <!-- Rating wrapper -->
        <div class="flex flex-wrap -mx-3">
          <!-- Path -->
          <div class="w-full md:w-1/2 px-3">
            <label class={labelClass} for="path">
              Path
            </label>
            <input
              bind:value={characterState.grounding.path}
              class={inputClass}
              id="path"
              type="text"
            >
          </div>
          <!-- End path -->
          <!-- Path rating -->
          <div class="w-full md:w-1/2 px-3">
            <Selector
              label="Rating"
              options={Array.from({ length: 10 }, (_, i) => i + 1)}
              bind:value={characterState.grounding.rating}
              id="path-rating"
            />
          </div>
          <!-- End humanity rating -->
        </div>
        <!-- Rating wrapper -->
        <!-- HP/WP wrapper -->
        <div class="flex flex-wrap -mx-3">
          <!-- HP -->
          <div class="w-full md:w-1/2 px-3">
            <Selector
              label="Health"
              options={Array.from({ length: 10 }, (_, i) => i + 1)}
              bind:value={characterState.health}
              id="health"
            />
          </div>
          <!-- End HP -->
          <!-- WP -->
          <div class="w-full md:w-1/2 px-3">
            <Selector
              label="Willpower"
              options={Array.from({ length: 10 }, (_, i) => i + 1)}
              bind:value={characterState.willpower}
              id="willpower"
            />
          </div>
          <!-- End WP -->
        </div>
        <!-- End HP/WP wrapper -->

        <!-- Splat-specific -->
        {#each characterSheet.special ?? [] as special}
          {#if special.splats.includes(characterState.splat?.toLowerCase())}
            {#each special.traits as trait}
              {#if trait.type === 'select'}
                <Selector
                  label={trait.label}
                  options={trait.options ?? []}
                  bind:value={characterState.special[trait.name]}
                  id={trait.name}
                />
              {/if}
            {/each}
          {/if}
        {/each}
        <!-- End splat-specific -->
      {/if}
    </div> <!-- This is the missing closing div -->
  </div>


  {#if characterState.splat !== ''}
    <!-- Trait selection -->

    <!-- Inherent Attributes -->
    <h2 class="text-2xl font-bold mb-4">{titleCase(characterSheet.inherent.category)}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {#each characterSheet.inherent.subcategories as subcategory}
        <div class="card variant-ghost p-4">
          <h3 class="text-xl font-semibold mb-2">{titleCase(subcategory.name)}</h3>
          {#each subcategory.traits as trait}
            <div class="mb-2">
              <TraitSelector
                defaultRating={1}
                trait={titleCase(trait)}
                bind:selectedRating={characterState.traits[trait]}
              />
                <!-- bind:selectedRating={characterState.inherent[subcategory.name][trait]} -->
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <!-- Learned Abilities -->
    <h2 class="text-2xl font-bold mb-4">{titleCase(characterSheet.learned.category)}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each characterSheet.learned.subcategories as subcategory}
        <div class="card variant-ghost p-4">
          <h3 class="text-xl font-semibold mb-2">{titleCase(subcategory.name)}</h3>
          {#each subcategory.traits as trait}
            <div class="mb-2">
              <TraitSelector
                trait={titleCase(trait)}
                bind:selectedRating={characterState.traits[trait]}
              />
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <!-- Virtues -->
    {#if characterSheet.virtues}
      <h2 class="text-2xl font-bold mt-8 mb-4">Virtues</h2>
      <div class="flex flex-wrap -mx-3">
        {#each characterSheet.virtues as virtueGroup, i}
          <div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-2">
            <Selector
              options={virtueGroup}
              bind:value={characterState.virtues[i].name}
              id="character-type"
            />
            <TraitSelector
              bind:selectedRating={characterState.virtues[i].rating}
            />
          </div>
        {/each}
      </div>
    {/if}

    <!-- Optional trait groups -->
    {#each characterSheet.special ?? [] as special}
      {#if special.splats.includes(characterState.splat?.toLowerCase())}
        {#each special.traits as trait}
          {#if trait.type === 'trait-group'}

            <h2 class="text-2xl font-bold mt-8 mb-4">{trait.label}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="card variant-ghost p-4">
                {#each trait.items ?? [] as item}
                  <div class="mb-2">
                    <TraitSelector
                      defaultRating={trait.default}
                      trait={item}
                      bind:selectedRating={characterState.special[trait.name][item]}
                    />
                  </div>
                {/each}
              </div>
            </div>

          {/if}
        {/each}
      {/if}
    {/each}
    <!-- End optional trait groups -->

    <!-- Submit button -->
    <div class="flex justify-center">
      <button
        type="submit"
        class="btn variant-filled-error mt-6 w-full"
        disabled={!characterState.ready()}
      >
        Create {characterState.name}
      </button>
    </div>
  {/if}
</form>
