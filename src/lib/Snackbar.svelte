<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { MDCSnackbar } from "@material/snackbar";
  import { snackbar } from "../stores/store";

  export let open = false;
  export let message = '';
  export let type = 'dismiss';

  let snackbarComponent, mdcSnackbar;

  let dispath = createEventDispatcher();

  onMount(() => {
    mdcSnackbar = new MDCSnackbar(snackbarComponent);
   
    if (type == "confirm") mdcSnackbar.timeoutMs = -1;
    else mdcSnackbar.timeoutMs = 4000;
    
  });

  $: if (type == 'dismiss' && $snackbar.open && mdcSnackbar != undefined) mdcSnackbar.open()
  // $: if ($snackbar.type == "confirm" && mdcSnackbar != undefined) mdcSnackbar.timeoutMs = -1;
  // $: if ($snackbar.type == "confirm" && mdcSnackbar != undefined && !$snackbar.open) mdcSnackbar.close();
  // $: if (type == "dismiss" && mdcSnackbar != undefined) mdcSnackbar.timeoutMs = 4000;

  $: if (open && type == 'confirm' && mdcSnackbar != undefined) mdcSnackbar.open();
  // $: if ($snackbar.context != '') confirmAction = getContext($snackbar.context);


</script>

<!-- <div class="alert {type}">
    {message}
</div> -->
<aside bind:this={snackbarComponent} class="mdc-snackbar mdc-snackbar-custom">
  <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
    <div class="mdc-snackbar__label" aria-atomic="false">
      { message || $snackbar.message }
    </div>
    <div class="mdc-snackbar__actions" aria-atomic="true">
      {#if type == 'confirm'}
        <button 
          type="button" 
          class="mdc-button mdc-action" 
          on:click={ () => {
            // snackbar.update(snk => {
            //   return {
            //       ...snk,
            //       click: true
            //   }
            // })
            dispath('confirm')
            open = false;
            mdcSnackbar.close()
          } } >
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">confirmar</span>
        </button>
      {/if}
      <button 
        type="button" 
        class="mdc-button mdc-snackbar__dismiss"
        on:click={ () => {
          open = false;
          mdcSnackbar.close()
        } }
      >
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label"></span>
        <span class="material-symbols-rounded" style="color: #FFF;">close</span>
      </button>
    </div>
  </div>
</aside>
<style>

  .mdc-snackbar {
    bottom: none;
    top: 60px;
  }

  .mdc-snackbar__label {
    white-space: pre-line;
  }

  /* .alert {
    padding: 8px;
  }

  .error {
    border: solid 1px #d32f2f;
    color: #ffffff;
    background-color: #ff6659;
    border-radius: 5px;
  }

  .default {
    width: fit-content;
    background-color: #322f35;
    color: #f5eff7;
    border-radius: 4px;
    font-size: 15px;
    padding-left: 4px;
    font-weight: 500;
    padding-right: 8px;
    width: 260px;
  } */
</style>
