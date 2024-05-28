<script>
  import { Menu, IconButton, Checkbox } from "$lib";
  import { MDCList } from "@material/list";
  import { MDCRipple } from "@material/ripple";
  import { onMount, createEventDispatcher } from "svelte";

  export let options = [];
  export let level = 0;
  export let parent_id = 0;
  export let customClass = '';
  export let origin = 0;
  export let actions = false;
  export let disabledOptions = false;

  let list;
  let listComponent;
  let openActions = [];
  let dispatch = createEventDispatcher();

  function handleClick(e, option) {
    e.stopPropagation();
    e.preventDefault();
    let actives = document.querySelectorAll(`ul.${customClass}:not([data-level='0']):not([data-parent='${option.parent_id}'])`);

    if (option.active) {
      // remove ul con data-parent = option.id
      actives.forEach((ul) => {
        if (ul.getAttribute('data-parent') == option.id) {
          ul.remove();
        }
      })
      option.children = [];

      option.active = false;

      let op = options.find((o) => o.id == option.id);
      op.active = false;
      op.children = [];

      // reeplazar op en options
      options = options.map((o) => {
        if (o.id == op.id) {
          return op;
        }
        return o;
      })

      return;
    }

    option.active = true;
    dispatch('select', option.id)
  }
  
</script>

{#if options.length > 0}
<ul
  data-level={ level }
  data-parent={ parent_id }
  data-root={origin}
  bind:this={listComponent}
  class="mdc-list mdc-list-main {customClass}"
  data-evolution="true"
  role="listbox"
  aria-label="List with caterogies"
  style="padding-left: { level * 10 }px; "
>
  {#each options as option, index}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-role-has-required-aria-props -->
    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->   
    <li 
      id={option.id}
      class:list-active={option.active}
      class="mdc-list-item__custom" 
      tabindex={option.parent_id}
      on:click|self={ (e) => handleClick(e, option) }
    >
      <span class="mdc-list-item__ripple"></span>
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span class="mdc-list-item__text" on:click|self={ (e) => handleClick(e, option) }>{ option.code + ' - ' +  option.description}</span>
      {#if actions}
        <span class="mdc-list-item__meta">
          <!-- <div class="menu-container"> -->
            {#key option.active}
              <IconButton icon={ option.active ? 'expand_less' : 'expand_more' } on:click={ (e) => handleClick(e, option) } />
            {/key}
            <Menu
                  bind:open={openActions[index]}
                  options={
                      [
                        { label: "Añadir", dispatch: "add" },
                        { label: "Editar", dispatch: "edit"},
                        { label: "Eliminar", dispatch: "delete" }
                      ]  
                  }
                  on:add={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch("add", option)
                  }}
                  on:edit={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch("edit", { ...option }) 
                  }}
                  on:delete={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch("delete", option)
                  }}
              >
                
            </Menu>
            {#if !disabledOptions}
              <IconButton 
                icon="more_vert" 
                on:click={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openActions[index] = !openActions[index]
                } } 
              />
            {/if}
          <!-- </div> -->
        </span>
      {/if}
    </li>
    <!-- <li role="separator" class="mdc-list-divider"></li> -->
    {#key option.children}
      {#if option.children}
        <svelte:self
          {disabledOptions}
          origin={ level == 0 ? option.id : origin }
          {customClass}
          level={level + 1} 
          parent_id={option.id}
          options={option.children} 
          actions={actions}
          on:select 
          on:edit
          on:delete
          on:add
        />
      {/if}
    {/key}

  {/each}
</ul>
{/if}
<style>
  .mdc-list {
    /* border-radius: 3px; */
    background-color: #FFF;
    padding: 0;
  }
  
  .mdc-list-main {
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }


  .mdc-list-item__custom {
    height: 50px;
    display: flex;
    align-items: center;
    /* position: relative; */
    overflow: hidden;
    cursor: pointer;
    padding: 0px 10px;
  }

  .mdc-list-item__meta {
    margin-left: auto;
    display: flex;
  }

  .menu-container {
    position: absolute;
    top: 0;
    right: 0;
  }

  .has-children {
    padding-left: 20px; /* Ajusta este valor a lo que necesites */
    background-color: gray;
  }
</style>