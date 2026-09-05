<script lang="ts">
	import SectionHeader from '$components/SectionHeader.svelte';
	import { Button, Card, Modal } from 'flowbite-svelte';

	import lincolnBuilding from '$assets/images/lincolnbuilding.webp?enhanced';
	import tylerAvatar from '$assets/images/avatars/tyler.jpg?enhanced';
	import nathanAvatar from '$assets/images/avatars/nathan.jpg?enhanced';
	import chainlynxAvatar from '$assets/images/avatars/chainlynx.webp?enhanced';
	import { DiscordSolid, InstagramSolid, GithubSolid, MailBoxOutline } from 'flowbite-svelte-icons';
	import ContactForm from '../../../lib/components/ContactForm.svelte';
	import ExternalLink from '$components/ExternalLink.svelte';

	let copyTextModal = $state(false);
	let copyTextContent = $state('');
	function copyText(text: string) {
		navigator.clipboard.writeText(text);
		copyTextContent = text;
		copyTextModal = true;
	}
</script>

<svelte:head>
	<title>LHS Connect | About</title>
</svelte:head>

<div class="flex w-full flex-col items-center gap-16 p-4 pb-16">
	<div class="w-full max-w-4xl">
		<enhanced:img
			src={lincolnBuilding}
			alt="Lincoln High School"
			class="h-32 w-full rounded-lg object-cover object-bottom sm:h-64"
		/>
	</div>
	<div class="w-full max-w-4xl">
		<SectionHeader title="About LHS Connect" />
		<p class="mt-4 indent-8 sm:mt-12">
			Built by students, for students, LHS Connect is a utility website that aims to provide
			students with a centralized location for all of their school-related information. Started in
			2022 in CS Projects at LHS, the website has since grown to include a variety of features from
			a short link generator to file transfer services.
		</p>
		<br />
		<p class="indent-8">
			This website is not affiliated with Lincoln High School nor Seattle Public Schools. However,
			most of the information on this website is sourced from official school sources and most
			features are ran by staff members. If you have any questions or concerns, please contact us
			using the information below.
		</p>
	</div>
	<div id="team" class="w-full max-w-4xl">
		<SectionHeader title="Meet the Team" />
		<div class="mx-auto flex flex-wrap justify-center gap-4">
			<Card padding="md" size="xs">
				<div class="flex flex-col items-center">
					<enhanced:img
						src={tylerAvatar}
						alt="Tyler"
						title="Thats meeeeee"
						class="m-4 h-24 w-24 rounded-full"
						sizes="96px, 192px"
					/>
					<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Tyler Place</h5>
					<span class="text-gray-500 dark:text-gray-400">Former Lead Developer</span>
					<p class="intent-8 mt-4 text-center">
						Graduated LHS Student with a passion for making websites, petting dogs, and thriving as
						your local <span title=":3">protogen cosplayer</span>.
					</p>
					<div class="mt-4 flex gap-4">
						<Button
							href="mailto:contact@lhsconnect.com"
							target="_blank"
							rel="noopener"
							title="Mail"
							color="light"
							class="dark:text-white"
						>
							<MailBoxOutline size="lg" />
						</Button>
						<Button
							on:click={() => copyText('1withspaghetti')}
							title="Discord"
							color="light"
							class="dark:text-white"
						>
							<DiscordSolid size="lg" />
						</Button>
						<Button
							href="https://www.instagram.com/tyler_the_spaghetti/"
							target="_blank"
							rel="noopener"
							title="Instagram"
							color="light"
							class="dark:text-white"
						>
							<InstagramSolid size="lg" />
						</Button>
					</div>
				</div>
			</Card>
			<Card padding="md" size="xs">
				<div class="flex flex-col items-center">
					<enhanced:img
						src={nathanAvatar}
						alt="Nathan"
						class="m-4 h-24 w-24 rounded-full"
						sizes="96px, 192px"
					/>
					<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Nathaniel Holden</h5>
					<span class="text-gray-500 dark:text-gray-400">Former Assistant Developer</span>
					<p class="intent-8 mt-4">
						I'm a Graduated LHS Student who likes to program as a hobby. In my free time I enjoy
						working on cars, skiing, snowboarding, mountain biking, and wakeboarding.
					</p>

					<div class="mt-4 flex gap-4">
						<Button
							on:click={() => copyText('.kanakun')}
							title="Discord"
							color="light"
							class="dark:text-white"
						>
							<DiscordSolid size="lg" />
						</Button>
						<Button
							href="https://www.instagram.com/kanakun2007/"
							target="_blank"
							rel="noopener"
							title="Instagram"
							color="light"
							class="dark:text-white"
						>
							<InstagramSolid size="lg" />
						</Button>
					</div>
				</div>
			</Card>
			<Card>
				<div class="flex flex-col items-center">
					<enhanced:img
						src={chainlynxAvatar}
						alt="ChainLynx Robotics logo"
						class="m-4 h-24 w-24"
						sizes="96px, 192px"
					/>
					<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">ChainLynx Robotics</h5>
					<span class="text-gray-500 dark:text-gray-400">Current Developers</span>
					<p class="intent-8 mt-4">
						ChainLynx Robotics is Lincoln High School's FIRST® Robotics Competition team. You can
						find out more at <ExternalLink
							text="chainlynx8248.com"
							href="https://chainlynx8248.com/"
						/>
					</p>

					<div class="mt-4 flex gap-4">
						<Button
							href="https://www.instagram.com/chainlynx.robotics/"
							target="_blank"
							rel="noopener"
							title="Instagram"
							color="light"
							class="dark:text-white"
						>
							<InstagramSolid size="lg" />
						</Button>
						<Button
							href="https://github.com/ChainlynxRobotics"
							target="_blank"
							rel="noopener"
							title="Github"
							color="light"
							class="dark:text-white"
						>
							<GithubSolid size="lg" /></Button
						>
					</div>
				</div>
			</Card>
		</div>
	</div>

	<div id="contact" class="w-full max-w-4xl">
		<SectionHeader title="Contact Us" />
		<ContactForm />
	</div>

	<Modal bind:open={copyTextModal} on:close={() => (copyTextModal = false)} size="sm">
		<div class="text-center">
			<p class="mb-4">
				The text <code>{copyTextContent}</code> has been copied to your clipboard.
			</p>
			<Button on:click={() => (copyTextModal = false)} color="alternative">Close</Button>
		</div>
	</Modal>
</div>
