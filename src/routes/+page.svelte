<script>
	import Card from './_c/card.svelte';
</script>
<header>
	<h1>매커니즘 연구소</h1>
	<small>hyuckkim</small>
</header>
<Card
	title={"1"}
	description="손가락 세 개로 화살을 날립니다...
 1분의 제한시간이 있습니다."
	link="/1"
/>
<Card
	title={"prism"}
	description="그라데이션 블럭 여러 개를 연결합니다."
 link="/prism"
/>
<style>
	header {
		padding: 2px 12px;
	}
	h1 {
		padding: 0;
		margin: 0;
	}
</style>
