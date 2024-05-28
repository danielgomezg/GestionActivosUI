<script>
  	import { onMount } from "svelte";
    import Tooltip from "./Tooltip.svelte";
    import { MDCRipple } from '@material/ripple';

    export let icon; 
    export let disabled = false;
    export let tooltipText = '';
    export let tooltipId = '';
    export let custom = false;
    export let fill = false;

    let iconButtonElement

    onMount(async () => {
        const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button')); 
    })

</script>

<button 
    bind:this={iconButtonElement} 
    type="button" 
    class="mdc-icon-button mdc-icon-button--touch material-icons" 
    class:mdc-icon-button--custom={custom}
    on:click 
    {disabled} 
    aria-describedby={tooltipId}
>
  <span 
    class="material-symbols-rounded"
    class:fill={fill}
  >{icon}</span>
</button>

{#if tooltipId != '' && tooltipText != ''}
    <Tooltip id={tooltipId} text={tooltipText} />
{/if}

<style>
  .mdc-icon-button--custom {
    position: absolute;
    top: 0px;
    right: -12%;
    /* left: 115%; */
    border: solid 1px;
    border-radius: 50%;
    padding: 0;
    margin: 0;
    width: fit-content;
    height: fit-content;
    margin: auto;
    display: flex;
    background: #fff;
  }
</style>