<script lang="ts">
	// Team members data
	const team = [
		{
			name: 'Alex Johnson',
			role: 'Founder & CEO',
			image: 'https://placehold.co/400x600',
			bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.'
		},
		{
			name: 'Sarah Chen',
			role: 'Chief Technology Officer',
			image: 'https://placehold.co/400x600',
			bio: 'Fusce quis urna eget arcu blandit faucibus vel vel odio. Vivamus mattis.'
		},
		{
			name: 'Michael Rodriguez',
			role: 'Head of Content',
			image: 'https://placehold.co/400x600',
			bio: 'Quisque consectetur, nisl eget vestibulum convallis, velit enim porta ligula.'
		},
		{
			name: 'Emma Wilson',
			role: 'Lead Designer',
			image: 'https://placehold.co/400x600',
			bio: 'Maecenas eget consectetur magna. Etiam in justo et enim scelerisque ultrices.'
		}
	];

	// Company stats
	const stats = [
		{ value: '10M+', label: 'Active users' },
		{ value: '50M+', label: 'Videos' },
		{ value: '195', label: 'Countries' },
		{ value: '2018', label: 'Founded' }
	];

	// Testimonials
	const testimonials = [
		{
			quote:
				'Play revolutionized how I share and discover content. The platform is intuitive and the community is incredible.',
			author: 'Jane Doe',
			title: 'Content Creator',
			image: 'https://placehold.co/80x80'
		},
		{
			quote:
				'As a new creator, I was amazed at how quickly my content reached audiences. The analytics tools help me understand exactly what my viewers enjoy.',
			author: 'John Smith',
			title: 'Filmmaker',
			image: 'https://placehold.co/80x80'
		}
	];

	// Timeline events
	const timeline = [
		{
			year: '2018',
			title: 'Founded in a garage',
			description: 'Play started as a simple idea to help people share videos more easily'
		},
		{
			year: '2019',
			title: 'First million users',
			description: 'Reached our first milestone of one million active users'
		},
		{
			year: '2020',
			title: 'Mobile app launched',
			description: 'Expanded our reach with iOS and Android applications'
		},
		{
			year: '2021',
			title: 'Creator program',
			description: 'Launched our creator monetization program'
		},
		{
			year: '2022',
			title: 'International expansion',
			description: 'Opened offices in Europe and Asia'
		},
		{
			year: '2023',
			title: 'AI recommendations',
			description: 'Implemented advanced AI-powered content recommendations'
		}
	];
</script>

<svelte:head>
	<title>About Play | Video Sharing Platform</title>
	<meta
		name="description"
		content="Learn about Play - the modern video sharing platform helping creators connect with audiences worldwide."
	/>
</svelte:head>

<div class="bg-gray-50 dark:bg-gray-900">
	<!-- Hero section -->
	<section
		class="relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 py-16 md:py-24"
	>
		<div class="absolute inset-0 opacity-20">
			<div
				class="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
			></div>
		</div>
		<div class="relative z-10 container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center text-white">
				<h1 class="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">Our Mission</h1>
				<p class="mb-10 text-xl font-light md:text-2xl">
					Empowering creators and connecting people through video
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href="/signup"
						class="rounded-full bg-white px-6 py-3 text-lg font-medium text-red-600 transition-colors duration-200 hover:bg-gray-100"
						>Join Play</a
					>
					<a
						href="/watch"
						class="rounded-full border-2 border-white bg-transparent px-6 py-3 text-lg font-medium text-white transition-colors duration-200 hover:bg-white/10"
						>Explore Content</a
					>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats section -->
	<section class="bg-white py-16 dark:bg-gray-800">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				{#each stats as stat}
					<div class="text-center">
						<div class="mb-2 text-3xl font-bold text-red-600 md:text-4xl dark:text-red-500">
							{stat.value}
						</div>
						<div class="text-sm text-gray-600 md:text-base dark:text-gray-300">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- About content section -->
	<section class="bg-gray-50 py-16 md:py-24 dark:bg-gray-900">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
						About Play
					</h2>
					<div class="mx-auto mb-8 h-1 w-20 bg-red-600"></div>
				</div>

				<div class="prose prose-lg dark:prose-invert max-w-none text-white">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies
						lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl nec nisl. Sed euismod, nisl vel
						ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl nec nisl.
					</p>

					<p>
						Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
						egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
						Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris
						placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
					</p>

					<h3 class="mt-10 mb-4 text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>

					<p>
						Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
						libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat
						eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
					</p>

					<blockquote class="my-8 border-l-4 border-red-600 pl-4 italic">
						We believe in a world where anyone can share their story through video, connecting with
						audiences across the globe regardless of borders or backgrounds.
					</blockquote>

					<p>
						Fusce quis urna eget arcu blandit faucibus vel vel odio. Vivamus mattis auctor ligula,
						id vestibulum ipsum venenatis ut. Donec sodales, velit in molestie cursus, tortor ante
						malesuada nulla, at elementum tortor dui non enim.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Timeline section -->
	<section class="bg-white py-16 md:py-24 dark:bg-gray-800">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
					Our Journey
				</h2>
				<div class="mx-auto mb-8 h-1 w-20 bg-red-600"></div>
			</div>

			<div class="mx-auto max-w-4xl">
				<div class="relative">
					{#each timeline as event, i}
						<div class="mb-12 flex">
							<div class="w-24 flex-none pr-4 text-right md:w-32 md:pr-8">
								<div class="text-lg font-bold text-red-600 md:text-xl dark:text-red-500">
									{event.year}
								</div>
							</div>

							<div class="relative flex-grow border-l-2 border-gray-300 pl-8 dark:border-gray-600">
								<div class="absolute top-1.5 -left-[9px] h-4 w-4 rounded-full bg-red-600"></div>
								<div>
									<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
										{event.title}
									</h3>
									<p class="text-gray-600 dark:text-gray-300">{event.description}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Team section -->
	<section class="bg-gray-50 py-16 md:py-24 dark:bg-gray-900">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
					Meet Our Team
				</h2>
				<div class="mx-auto mb-8 h-1 w-20 bg-red-600"></div>
				<p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
					The passionate individuals behind Play who work tirelessly to create the best video
					platform for creators and viewers alike.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each team as member}
					<div
						class="overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-300 hover:-translate-y-2 dark:bg-gray-800"
					>
						<div class="aspect-square bg-gray-200 dark:bg-gray-700">
							<img
								src={member.image}
								alt={member.name}
								class="h-full w-full object-cover"
							/>
						</div>
						<div class="p-6">
							<h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
							<p class="mb-3 text-red-600 dark:text-red-400">{member.role}</p>
							<p class="text-gray-600 dark:text-gray-300">{member.bio}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials section -->
	<section class="bg-white py-16 md:py-24 dark:bg-gray-800">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
					What Our Users Say
				</h2>
				<div class="mx-auto mb-8 h-1 w-20 bg-red-600"></div>
			</div>

			{#each testimonials as testimonial}
				<div class="rounded-xl bg-gray-50 p-8 shadow-md dark:bg-gray-900 mb-4">
					<div class="mb-6 flex items-center">
						<div
							class="mr-4 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
						>
							<img
								src={testimonial.image}
								alt={testimonial.author}
								class="h-full w-full object-cover"
							/>
						</div>
						<div>
							<div class="font-bold text-gray-900 dark:text-white">{testimonial.author}</div>
							<div class="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</div>
						</div>
					</div>
					<p class="text-gray-700 italic dark:text-gray-300">"{testimonial.quote}"</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- CTA section -->
	<section class="bg-gradient-to-r from-red-600 to-pink-600 py-16 text-white md:py-20">
		<div class="container mx-auto px-4 text-center">
			<h2 class="mb-6 text-3xl font-bold md:text-4xl">Ready to be part of our story?</h2>
			<p class="mx-auto mb-10 max-w-2xl text-xl">
				Join millions of creators and viewers on Play and discover a new way to connect through
				video.
			</p>
			<a
				href="/signup"
				class="inline-block rounded-full bg-white px-8 py-4 text-lg font-bold text-red-600 transition-colors duration-200 hover:bg-gray-100"
				>Get Started Today</a
			>
		</div>
	</section>
</div>
