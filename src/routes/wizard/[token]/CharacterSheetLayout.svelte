<script lang="ts">
  import { CharacterSheet } from '$lib/types/CharacterSheet'
  import TraitSelector from './TraitSelector.svelte'
  export let characterSheet: CharacterSheet

  let labelClass = 'block uppercase tracking-wide font-bold mb-2'
  let inputClass = 'input input-bordered block w-full border py-3 px-4 mb-3 leading-tight'

  function titleCase(str: string): string {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  async function submitCharacter(event: Event): Promise<void> {
    event.preventDefault()
    console.log('Submitting character:', characterState.name)
    console.log(JSON.stringify(characterState))
  }

  // Store the character state
  type Grounding = {
    path: string,
    rating: number,
  }

  interface CharacterState {
    name: string;
    grounding: Grounding;
    generation: number;
    traits: Record<string, number>,
    ready: () => boolean;
  }

  let characterState: CharacterState = {
    name: '',
    grounding: {
      path: 'Humanity',
      rating: 5
    },
    generation: 13,
    traits: {},
    ready: function(): boolean {
      return this.name.trim() !== '' && this.grounding.path.trim() !== ''
    }
  }
</script>

<!-- Character basics -->
<div class="container mx-auto p-4">
  <form on:submit={submitCharacter}>
    <div class="flex flex-wrap -mx-3 mb-6">
      <!-- Character name -->
      <div class="w-full px-3 mb-6 md:mb-0">
        <label class={labelClass} for="grid-first-name">
          Character name
        </label>
        <input
          bind:value={characterState.name}
          class={inputClass}
          id="grid-first-name"
          type="text"
          placeholder="John Wilcox"
        >
        <!-- End character name -->
        <!-- Path -->
        <div class="flex flex-wrap -mx-3">
          <div class="w-full md:w-1/2 px-3">
            <label class={labelClass} for="grid-grounding">
              Path
            </label>
            <input
              bind:value={characterState.grounding.path}
              class={inputClass}
              id="grid-last-name"
              type="text"
            >
          </div>
          <!-- End grounding -->
          <!-- Humanity rating -->
          <div class="w-full md:w-1/2 px-3">
            <label class={labelClass} for="grid-humanity-rating">
              Rating
            </label>
            <div class="relative">
              <select
                bind:value={characterState.grounding.rating}
                class="appearance-none select select-bordered block w-full border py-3 px-4 mb-3 leading-tight"
                id="grid-state"
              >
                {#each Array.from({ length: 10 }, (_, i) => i + 1) as groundingRating}
                  <option
                    selected={groundingRating === 5}
                    value={groundingRating}
                  >
                    {groundingRating}
                  </option>
                {/each}
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>
        <!-- End humanity rating -->
        <!-- Generation -->
        <label class={labelClass} for="grid-generation">
          Generation
        </label>
        <div class="relative">
          <select
            bind:value={characterState.generation}
            class="appearance-none select select-bordered block w-full border py-3 px-4 mb-3 leading-tight"
            id="grid-state"
          >
            {#each Array.from({ length: 12 }, (_, i) => i + 4) as generation}
              <option value={generation}>{generation}</option>
            {/each}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
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

    <!-- Submit button -->
    <div class="flex justify-center">
      <button
        type="submit"
        class="btn variant-filled-error mt-6"
        disabled={!characterState.ready()}
      >
        Create {characterState.name}
      </button>
    </div>
  </form>
</div>
