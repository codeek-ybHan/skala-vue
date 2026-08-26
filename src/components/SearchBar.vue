<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

defineEmits(['update-query'])
</script>

<template>
  <input type="text" :value="searchQuery" @input="$emit('update-query', $event.target.value)" class="search-input" placeholder="검색할 도시 이름 입력"/>
  <p class="search-status">검색 중인 도시: {{ searchQuery }}</p>
</template>

<style scoped>
.search-input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  box-sizing: border-box;
  background: #ffffff;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  outline: none;
  border-color: #0ea5e9;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

.search-status {
  margin: 0.75rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}
</style>
