<!-- <template>
  <svg class="pie" viewbox="0 0 100 100">
    <circle
      cx="50%"
      cy="50%"
      r="25%"
      fill="red"
      stroke-width="50%"
      :stroke-dasharray="dashArray"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  time: number
}>()

const circumference = 70.6858

const dashArray = computed(
  () => `${circumference * (props.time / 1000)} ${circumference}`
)
</script>

<style scoped>
.pie {
  width: 100%;
  height: 100%;
  stroke: blue;
}
</style> -->
