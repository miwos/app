<template>
	<nav class="m-nav-bar"><slot></slot></nav>
</template>

<style scoped lang="scss">
@use '@/assets/mixins.scss';

.m-nav-bar {
	@include mixins.glass;

	position: absolute;
	display: flex;
	align-items: center;
	height: 2.5rem;
	border-radius: calc(2.5rem / 2);

	gap: 0.5em;
	padding: 0 1em;
}
</style>
