<template>
	<div class="addAct">
		<InputActivity :isAdd="true"></InputActivity>
	</div>
</template>

<script>
	import InputActivity from './components/InputActivity'

	export default {
	  data() {
	    return {

	    }
	  },

	  methods: {

	  },

	  components: { InputActivity }
	}
</script>

<style lang="less" scoped>
	.addAct {
		padding: 20px;
	}
</style>
