<script>
    import {MDCRipple} from '@material/ripple';
    import { onMount } from 'svelte';

    export let disabled = false;

    let fab;
    let fabComponent;

    onMount(() => {
        fab = new MDCRipple(fabComponent);
    });

</script>
<!-- <div class="mdc-touch-target-wrapper"> -->
    <button 
        {disabled}
        bind:this={fabComponent} 
        class="mdc-fab mdc-fab--mini mdc-fab--touch"
        class:mdc-fab--disabled={disabled}
        on:click
    >
        <div class="mdc-fab__ripple"></div>
        <!-- <span class="material-icons mdc-fab__icon">add</span> -->
        <span class="material-symbols-rounded">add</span>

        <div class="mdc-fab__touch"></div>
    </button>
<!-- </div> -->