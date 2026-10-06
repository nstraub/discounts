<template>
  <form @submit.prevent>
    <input
      class="rounded border border-gray-400 px-2 py-1"
      data-testid="new-rate"
    >
    <button
      type="submit"
      class="rounded border px-3 py-1"
      data-testid="change-rate"
    />
  </form>
</template>
