<script setup>
import { ref } from 'vue'
import { useFloating, offset, flip, shift } from '@floating-ui/vue'
import { ITEM_COMPONENTS } from '../data/items'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const reference = ref(null)
const floating = ref(null)
const isVisible = ref(false)

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'right',
  strategy: 'fixed',
  middleware: [offset(15), flip(), shift({ padding: 10 })]
})

function getRecipeNames(recipeIds) {
  if (!recipeIds || !recipeIds.length) return '';
  return recipeIds.map(id => ITEM_COMPONENTS[id].name).join(' + ');
}
</script>

<template>
  <div 
    class="item-tooltip-wrapper" 
    ref="reference" 
    @mouseenter="isVisible = true" 
    @mouseleave="isVisible = false"
  >
    <slot></slot>

    <Teleport to="body">
      <div v-if="isVisible" ref="floating" :style="[floatingStyles, { position: 'fixed' }]" class="item-tooltip-content">
        <div v-if="item.lore" class="tt-lore">"{{ item.lore }}"</div>
        <div v-if="item.recipe" class="tt-recipe">
          <strong>Receta:</strong> {{ getRecipeNames(item.recipe) }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.item-tooltip-wrapper {
  position: relative;
  width: 100%;
}

.item-tooltip-content {
  background: rgba(30, 20, 35, 0.95);
  border: 2px dashed var(--color-stitch);
  padding: 12px;
  border-radius: 8px;
  color: white;
  width: max-content;
  max-width: 320px;
  z-index: 10000;
  box-shadow: 0 10px 25px rgba(0,0,0,0.8);
  pointer-events: none;
  font-family: var(--body-font, sans-serif);
  backdrop-filter: blur(5px);
}

.tt-lore {
  font-style: italic;
  color: #d8f576;
  margin-bottom: 8px;
  line-height: 1.4;
}

.tt-recipe {
  font-size: 0.9em;
  color: #ffd700;
  border-top: 1px solid #444;
  padding-top: 8px;
  margin-top: 5px;
}
</style>
