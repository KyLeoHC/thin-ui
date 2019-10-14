<template>
  <div class="list-container">
    <thin-table
      :scroll="{ x: 1024, y: 500 }"
      :columns="columns"
      :data="data"
      border
    >
      <template v-slot:nameHead="{ value }">
        {{ value }}-head-slot
      </template>
      <template v-slot:sex="{ value }">
        {{ value === 0 ? '男' : '女' }}
      </template>
    </thin-table>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
  .list-container {
    padding: 20px;
    margin: 10px;
    border: 1px solid #eee;
    font-size: 12px;
  }
</style>
