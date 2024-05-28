<script>
  import { MDCMenu } from "@material/menu";
  import IconButton from "./IconButton.svelte";
  import { onMount, createEventDispatcher } from "svelte";

  export let options = [];
  export let open = false;

  let menu;
  let menuComponent;
  let dispatch = createEventDispatcher();

  const selectedItem = (event) => {
    console.log("selectedItem -> ", event);
    // ejecutar la accion asociada al item seleccionado
    let index = event.detail.index;
    let option = options[index];
    console.log("option -> ", option);
    dispatch(option.dispatch);

  };

  const handleOpen = (open) => {
    console.log("handleOpen -> ", open);

    if (menu == undefined) return;
    console.log("menu -> ", menu.open);
    if (menu.open == open && !open) open = true;

    menu.open = open;
  };

  onMount(() => {
    menu = new MDCMenu(menuComponent);
    menu.setFixedPosition(true);
    menu.setAbsolutePosition(50, 50)
    menu.listen("MDCMenu:selected", selectedItem);
    // menu.open = true;
  });

  $: handleOpen(open);
</script>

<div id="toolbar" class="toolbar mdc-menu-surface--anchor">
  <!-- <IconButton icon="more_vert" on:click={() => (open = !open)} /> -->
  <slot />

  <div bind:this={menuComponent} class="mdc-menu mdc-menu-surface">
    <ul
      class="mdc-list"
      role="menu"
      aria-hidden="true"
      aria-orientation="vertical"
      tabindex="-1"
    >
      {#each options as option }
        <li 
          class="mdc-list-item" 
          class:mdc-list-item--disabled={option.disabled}
          class:hide-item={option.hide}
          role="menuitem" 
          custom-dispatch={ option.dispatch }
        >
          <span class="mdc-list-item__ripple"></span>
          <span class="mdc-list-item__text">{ option.label }</span>
        </li>        
      {/each}
      <!-- <li class="mdc-list-item" role="menuitem">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Historial</span>
      </li>
      <li class="mdc-list-item" role="menuitem">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Editar</span>
      </li>
      <li class="mdc-list-item" role="menuitem">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">Eliminar</span>
      </li> -->
    </ul>
  </div>
</div>
<style>
  .mdc-list-item {
    padding: 5px 16px;
  }
  .hide-item {
    display: none;
  }

</style>