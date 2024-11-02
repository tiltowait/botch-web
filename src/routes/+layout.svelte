<script lang="ts">
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import { currentTheme } from '$lib/stores/theme'

	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	const baseTitle = 'BOTCH'

	$: title = $page.data.title ? `${baseTitle} | ${$page.data.title}` : baseTitle

	$: if (browser) {
		document.body.setAttribute('data-theme', $currentTheme)
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Botch.lol</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://discord.gg/QHnCdSPeEE"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/tiltowait/botch"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<div class="container mx-auto p-4">
		<slot />
	</div>
</AppShell>
