<script lang="ts">
  import { CharacterSheet } from '$lib/types/CharacterSheet'
  import TraitSelector from './TraitSelector.svelte'
  import Selector from '$lib/components/Selector.svelte'
  export let characterSheet: CharacterSheet

  const labelClass = 'block uppercase tracking-wide font-bold mb-2'
  const inputClass = 'input input-bordered block w-full border py-3 px-4 mb-3 leading-tight'
  const splats = characterSheet.splats.map(titleCase)

  function titleCase(str: string): string {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  async function submitCharacter(event: Event): Promise<void> {
    event.preventDefault()
    console.log('Submitting character:', characterState.name)
    if(characterState.splat !== 'Vampire') {
      characterState.generation = null
    }
    console.log(JSON.stringify(characterState))
  }

  // Store the character state
  type Grounding = {
    path: string,
    rating: number,
  }

  interface CharacterState {
    splat: string,
    name: string;
    grounding: Grounding;
    generation: number | null;
    traits: Record<string, number>,
    ready: () => boolean;
  }

  let characterState: CharacterState = {
    splat: splats[0],
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

  <h1 class="h1 mb-7">Create a character</h1>

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
        class="btn variant-filled-error mt-6 w-full"
        disabled={!characterState.ready()}
      >
        Create {characterState.name}
      </button>
    </div>
  </form>
</div>
