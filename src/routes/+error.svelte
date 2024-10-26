<script>
  import { page } from '$app/stores'
</script>

<div class="block card variant-ghost-error p-4">
  <header class="card-header">
    <h1 class="h1 mb-2">Oops</h1>
    <h5 class="h5 mb-6">Something went wrong.</h5>
  </header>
  <section>{$page.error?.message}</section>
</div>
