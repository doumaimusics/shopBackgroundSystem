<template>
  <div class="addAct">
    <InputActivity :isEdit="true"></InputActivity>
  </div>
</template>
<script>
  import InputActivity from './components/InputActivity'

  export default {
    data() {
      return {

      }
    },

    created() {

    },

    methods: {

    },

    components: { InputActivity }
  }
</script>

<style lang="less" scoped>
  .addAct{
    padding: 20px;
  }
</style>
