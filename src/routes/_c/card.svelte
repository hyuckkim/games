<script>
	import { base } from '$app/paths';

	export let title;
	export let description;
	export let link;
</script>

<section>
	<div>
		<article>
			<h1>{title}</h1>
			<p>{description}</p>
		</article>
	</div>
	<a href={`${base}${link}`}>play</a>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		margin: 30px;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 5px 5px 10px #444;
	}
	div {
		display: flex;
		flex-direction: row;
	}
	a {
		align-self: end;
		background-color: gray;
		padding: 8px 20px;
		border-radius: 5px;
		text-decoration: none;
		color: white;
	}
</style>
