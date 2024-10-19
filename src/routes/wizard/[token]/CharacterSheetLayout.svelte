<script lang="ts">
  import { WizardSchema } from '$lib/types/WizardSchema'
  import TraitSelector from './TraitSelector.svelte'
  import Selector from '$lib/components/Selector.svelte'

  export let token: string
  export let wizardSchema: WizardSchema
  const characterSheet = wizardSchema.traits // For convenience

  const labelClass = 'block uppercase tracking-wide font-bold mb-2'
  const inputClass = 'input input-bordered block w-full border py-3 px-4 mb-3 leading-tight'
  const splats = characterSheet.splats.map(titleCase)

  function titleCase(str: string): string {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1))
    }).join(' ')
  }

  async function submitCharacter(event: Event): Promise<void> {
    event.preventDefault()

    if(characterState.splat !== 'Vampire') {
      characterState.generation = null
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/character/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterState),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.detail || `Failed to create ${characterState.name}`)
      }

    } catch (err) {
      console.log('ERROR:', err)
    }
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
    token: string,
    splat: string,
    name: string;
    grounding: Grounding;
    health: number,
    willpower: number,
    generation: number | null;
    traits: Record<string, number>,
    virtues: Virtue[],
    ready: () => boolean;
  }

  let characterState: CharacterState = {
    token: token,
    splat: splats[0],
    name: '',
    grounding: {
      path: 'Humanity',
      rating: 5
    },
    health: 7,
    willpower: 5,
    generation: 13,
    traits: {},
    virtues: (characterSheet.virtues ?? []).map(va => ({
      name: va[0] ?? '',
      rating: 1,
    })),

    ready: function(): boolean {
      return this.name.trim() !== '' && this.grounding.path.trim() !== ''
    }
  }
</script>

<!-- Character basics -->
<div class="container mx-auto p-4">

  <h1 class="h1 mb-3">New character</h1>
  <h3 class="flex h3 items-center mb-9">
    {#if wizardSchema.guildIcon}
      <img class="h-[1.5em] w-auto mr-2" src={wizardSchema.guildIcon} alt={wizardSchema.guildName}>
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
        />
        <!-- Character name -->
        <label class={labelClass} for="character-name">
          Character name
        </label>
        <input
          bind:value={characterState.name}
          class={inputClass}
          id="character-name"
          type="text"
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
        <!-- Generation -->
        {#if characterState.splat === 'Vampire'}
          <Selector
            label="Generation"
            options={Array.from({ length: 12 }, (_, i) => i + 4)}
            bind:value={characterState.generation}
            id="generation"
          />
        {/if}
        <!-- End generation -->
      </div> <!-- This is the missing closing div -->
    </div>


    <!-- Trait selection -->

    <!-- Inherent Attributes -->
    <h2 class="text-2xl font-bold mb-4">{titleCase(characterSheet.inherent.category)}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {#each characterSheet.inherent.subcategories as subcategory}
        <div class="card p-4">
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
        <div class="card p-4">
          <h3 class="text-xl font-semibold mb-2">{titleCase(subcategory.name)}</h3>
          {#each subcategory.traits as trait}
            <div class="mb-2">
              <TraitSelector
                trait={titleCase(trait)}
                bind:selectedRating={characterState.traits[trait]}
              />
                <!-- // bind:selectedRating={characterState.learned[subcategory.name][trait]} -->
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
          <div class="w-full md:w-1/2 lg:w-1/3 px-3">
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
  </form>
</div>
