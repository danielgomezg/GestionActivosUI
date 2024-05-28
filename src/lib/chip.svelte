<script>
    
    import { MDCChipSet } from '@material/chips';
    import { onMount, createEventDispatcher } from 'svelte';

    // export let chip = {}
    export let chips = []

    let chipset
    let chipsetComponent

    let dispatch = createEventDispatcher();

    onMount(() => {
        chipset = new MDCChipSet(chipsetComponent);
    })

</script>
<span bind:this={chipsetComponent} class="mdc-evolution-chip-set" role="listbox" aria-orientation="horizontal">
    <span class="mdc-evolution-chip-set__chips" role="presentation">
      {#each chips as chip }
        <span class="mdc-evolution-chip" role="presentation" id={chip.id} >
          <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
            <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0" data-mdc-deletable="true" on:click>
              <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
              <span class="mdc-evolution-chip__text-label">{chip.label}</span>
            </button>
          </span>
          <button 
            class="mdc-evolution-chip__action mdc-evolution-chip__action--trailing" 
            type="button" 
            tabindex="-1" 
            data-mdc-deletable="true" 
            aria-hidden="true"
            on:click={ () => {
              // Eliminar el chip de chips
              dispatch('deleteFilter', chip)
            } }
          >
            <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--trailing"></span>
            <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing material-symbols-rounded">close</span>
            <!-- <span class="material-symbols-rounded">close</span> -->

          </button>
        </span>
      {/each}
    </span>
</span>

<style>
    .mdc-evolution-chip__action {
      margin-right: 8px;
    }
</style>