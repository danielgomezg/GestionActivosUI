<script>
    import { MDCTooltip } from '@material/tooltip';
    import { onMount } from 'svelte';

    export let id = '';
    export let text;

    let tooltip;
    let tooltipComponent;

    onMount(() => {
        tooltip = new MDCTooltip(tooltipComponent);
        tooltip.setShowDelay(0)
        tooltip.setHideDelay(0)
    });

</script>

<div bind:this={tooltipComponent} id={id} class="mdc-tooltip" role="tooltip" aria-hidden="true">
    <div class="mdc-tooltip__surface mdc-tooltip__surface-animation">
      { text }
    </div>
</div>
  
