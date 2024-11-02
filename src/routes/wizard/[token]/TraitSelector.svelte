<script lang="ts">
  export let trait: string | null = null
  export let defaultRating: number | null = null
  export let selectedRating: number = defaultRating || 0;

  const outerClass = trait ? 'grid grid-cols-[minmax(100px,auto)_1fr] items-center gap-4' : 'flex justify-center'

  function handleClick(rating: number): void {
    if(rating == 1 && selectedRating == 1) {
      selectedRating = 0
    } else {
      selectedRating = rating;
    }
  }

  const circles: number[] = Array.from({ length: 5 }, (_, i) => i + 1);

  const traitMappings: Record<string, string> = {
    'Animalken': 'Animal Ken',
    'Herbalwisdom': 'Herbal Wisdom',
  }
  if (trait) {
    trait = traitMappings[trait] || trait
  }

</script>

<div class={outerClass}>
  {#if trait}
    <div class="text-left">{trait}</div>
  {/if}
  <div class="flex gap-2">
    {#each circles as rating}
      <button
        type="button"
        class="btn rating-circle"
        class:selected={rating <= selectedRating}
        on:click={() => handleClick(rating)}
        aria-label="{trait ?? 'Rating'}: {rating} dots"
      ></button>
    {/each}
  </div>
</div>

<style lang="postcss">
  .rating-circle {
    width: 1.45rem;
    height: 1.45rem;
    border-radius: 50%;
    border: 2px solid #ccc;
    background-color: transparent;
    padding: 0;
    transition: all 0.3s ease;
  }

  .rating-circle.selected {
    background-color: rgb(var(--color-secondary-500)) !important;
    border-color: rgb(var(--color-secondary-500)) !important;
  }

  .rating-circle:hover {
    border-color: rgb(var(--color-secondary-500)) !important;
  }

  .rating-circle:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(var(--color-secondary-500), 0.3) !important;
  }
</style>
