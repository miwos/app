<template>
  <div class="list-input input">
    <button>
      <svg viewBox="0 0 5 10" class="chevron">
        <polyline points="5,0 0,5 5,10" />
      </svg>
    </button>
    <span class="list-input-value">Cm7</span>
    <button>
      <svg viewBox="0 0 5 10" class="chevron">
        <polyline points="0,0 5,5 0,10" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.list-input {
  display: flex;
  align-items: center;
  padding-left: 0;
  padding-right: 0;

  &-value {
    flex: 1;
  }
}

button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 1em;
  cursor: pointer;
}

.chevron {
  display: block;
  fill: none;
  stroke: hsl(0deg 0% 85%);
  height: 40%;

  * {
    vector-effect: non-scaling-stroke;
  }

  &.left {
    transform: rotate(-135deg);
  }

  &.right {
    transform: rotate(45deg);
  }
}
</style>
