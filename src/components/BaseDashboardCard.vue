<template>
  <section class="panel">
    <h2 v-if="$slots.header" class="panel-header">
      <slot name="header"></slot>
    </h2>
    <slot></slot>
  </section>
</template>

<style scoped>
.panel {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px -12px rgba(15, 23, 42, 0.12);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dbe2ea;
}
</style>
