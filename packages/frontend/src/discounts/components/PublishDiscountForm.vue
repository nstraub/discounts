<template>
  <form @submit.prevent>
    <input data-testid="discount-item">
    <input data-testid="discount-rate">
    <input data-testid="discount-store-name">
    <input data-testid="discount-store-address">
    <button
      type="submit"
      class="rounded border px-3 py-1"
      data-testid="publish-discount"
    />
  </form>
</template>
