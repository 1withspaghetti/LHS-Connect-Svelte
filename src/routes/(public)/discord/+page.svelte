<script lang="ts">
	import ExternalLink from '$components/ExternalLink.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';
</script>

<div class="flex w-full flex-col items-center gap-16 p-4 pb-16">
	<div class="w-full max-w-4xl">
		<SectionHeader title="Join our discord server" />
        <div class="mt-4 mb-4 grid place-items-center text-xl">
            <ExternalLink
				href="https://seattleschools-my.sharepoint.com/:w:/g/personal/1rcmclain_seattleschools_org/IQDdTy6CDx8_TatHAPkj-TrbARQ2VadEAwxXiliuI6vu_CI?e=nOO3vJ"
				text="discord link (access restricted)"
			/>
        </div>
        <p class="text-center">
			 the link is only accessible to sps students and staff. If you are not a student or staff please use the
			<a href="/about#contact" class="underline">contact form</a> making sure to add your email.
		</p>
	</div>
</div>
