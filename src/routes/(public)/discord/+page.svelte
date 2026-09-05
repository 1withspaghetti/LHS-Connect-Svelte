<script lang="ts">
	import { discordRequestValidator } from '$api/contact/validator';
	import ContactForm from '$components/ContactForm.svelte';
	import ExternalLink from '$components/ExternalLink.svelte';
	import SectionHeader from '$components/SectionHeader.svelte';
</script>

<div class="flex w-full flex-col items-center gap-16 p-4 pb-16">
	<div class="w-full max-w-4xl">
		<SectionHeader title="Join our discord server" />
		<div class="mb-4 mt-4 grid place-items-center text-xl">
			<ExternalLink
				href="https://seattleschools-my.sharepoint.com/:w:/g/personal/1rcmclain_seattleschools_org/IQDdTy6CDx8_TatHAPkj-TrbARQ2VadEAwxXiliuI6vu_CI?e=nOO3vJ"
				text="discord link (access restricted)"
			/>
		</div>
		<p class="text-center">
			If you are outside of SPS please use the form below to request access to the server
		</p>
		<SectionHeader title="Request access" />
		<ContactForm emailRequired feedbackType="discord" validator={discordRequestValidator} />
	</div>
</div>
