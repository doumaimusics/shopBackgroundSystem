<template>
  <div class="addAct">
    <PulicForm :isEdit="true"></PulicForm>
  </div>
</template>
<script>
  import PulicForm from './components/pulicForm'

  export default {
    data() {
      return {}
    },

    created() {},

    methods: {},

    components: { PulicForm }
  }
</script>

<style lang="less" scoped>
  .addAct{
    padding: 20px;
  }
</style>
