<script>
  import Chip from "./chip.svelte";
  import Select from "./Select.svelte";
  import { fly } from 'svelte/transition';
  import IconButton from "./IconButton.svelte";
  import { MDCDataTable } from "@material/data-table";
  import { createEventDispatcher, onMount, tick } from "svelte";
  import { user } from "../stores/store";

  export let limit = 0;
  export let count = 0;
  export let data = [];
  export let offset = 0;
  export let headers = [];
  export let filters = {};
  export { setUnselectedAll };

  let dataTable;
  let dataTableComponent;
  let showSearch = false;
  let showActions = false;
  let dispatch = createEventDispatcher();

  const showActionsControl = () => {
    if (dataTable.getSelectedRowIds().length > 0) {
      showActions = true;
    } else {
      showActions = false;
    }
  }

  const checkedRow = (event) => {
    showActionsControl()
    
    let index = event.detail.rowIndex;
    let element = data[index];
    dispatch("rowSelected", element);
  };

  const unselectedAll = (event) => {
    showActionsControl()
    dispatch("unselectedAll")
  }

  const selectedAll = (event) => {
    showActionsControl()
    dispatch("selectedAll")
  }

  const setUnselectedAll = () => {
    console.log("setUnselectedAll")
    dataTable.setSelectedRowIds([]);
    unselectedAll();
  }

  const layotTable = async () => {
    await tick();
    dataTable.layout();
  }

  onMount(() => {
    // const checkbox = new MDCCheckbox(checkboxComponent);
    dataTable = new MDCDataTable(dataTableComponent);
    dataTable.listen("MDCDataTable:rowSelectionChanged", checkedRow);
    dataTable.listen("MDCDataTable:selectedAll", selectedAll);
    dataTable.listen("MDCDataTable:unselectedAll", unselectedAll);
    dataTable.layout();
    // dataTable.listen('MDCDataTable:rowSelectionChanged', (event) => {
    //     console.log(event.detail);
    // });
  });

  $: if (data.length > 0 && dataTable != undefined) {
    console.log(data)
    layotTable();
  }
  
</script>

<div bind:this={dataTableComponent} class="mdc-data-table">
  <div class="table-head__custom">
    <div class="table-filters">
      <div>
        <span class="material-symbols-rounded">filter_list</span>
      </div>
      <div>
        <Chip chips={filters} on:deleteFilter />
      </div>
      <div class="align-right">
        <slot name="search" />
      </div>
    </div>
    {#if showActions}
      <div class="table-actions" >
        <div transition:fly="{{y: 0, x: -5, duration: 200}}">
          <IconButton icon="edit" disabled={ $user.profile_id != 2 } on:click={() => dispatch("edit")} />
            {#if $user.profile_id != 2}
              <IconButton icon="delete" on:click={() => dispatch("delete")} />
            {/if}
        </div>
      </div>
    {/if}
  </div>
  <div class="mdc-data-table__table-container">
    <table class="mdc-data-table__table" aria-label="activos">
      <thead>
        <tr class="mdc-data-table__header-row">
          <th
            class="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox"
            role="columnheader"
            scope="col"
          >
            <div
              class="mdc-checkbox mdc-data-table__header-row-checkbox mdc-checkbox--selected"
            >
              <input
                type="checkbox"
                class="mdc-checkbox__native-control"
                aria-label="Toggle all rows"
              />
              <div class="mdc-checkbox__background">
                <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                  <path
                    class="mdc-checkbox__checkmark-path"
                    fill="none"
                    d="M1.73,12.91 8.1,19.28 22.79,4.59"
                  />
                </svg>
                <div class="mdc-checkbox__mixedmark"></div>
              </div>
              <div class="mdc-checkbox__ripple"></div>
            </div>
          </th>
          {#each headers as header}
            <th
              class="mdc-data-table__header-cell"
              role="columnheader"
              scope="col"
              >{header.label}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody class="mdc-data-table__content">
        {#each data as row, index}
          <tr data-row-id={`u${index}`} class="mdc-data-table__row">
            <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
              <div class="mdc-checkbox mdc-data-table__row-checkbox">
                <input
                  type="checkbox"
                  class="mdc-checkbox__native-control"
                  aria-labelledby={`u${index}`}
                />
                <div class="mdc-checkbox__background">
                  <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                    <path
                      class="mdc-checkbox__checkmark-path"
                      fill="none"
                      d="M1.73,12.91 8.1,19.28 22.79,4.59"
                    />
                  </svg>
                  <div class="mdc-checkbox__mixedmark"></div>
                </div>
                <div class="mdc-checkbox__ripple"></div>
              </div>
            </td>

            {#each headers as header (header.name)}
              {#if row[header.name] !== undefined}
                {#if header.name == "bar_code"}
                  <th class="mdc-data-table__cell" scope="row" id={`u${index}`}
                    >{row[header.name]}</th
                  >
                {:else if header.name == "accounting_document"}
                  <td class="mdc-data-table__cell">
                    {#if row[header.name] != ""}
                      <IconButton
                        icon="description"
                        on:click={dispatch("getDocument", row[header.name])}
                      />
                    {/if}
                  </td>
                {:else}
                  <td class="mdc-data-table__cell">
                    {row[header.name]}
                  </td>
                {/if}
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="mdc-data-table__pagination">
    <div class="mdc-data-table__pagination-trailing">
      <div class="mdc-data-table__pagination-rows-per-page">
        <div class="mdc-data-table__pagination-rows-per-page-label">
          Activos por página
        </div>
        <div >
          <Select 
            customHeight
            selected={ limit }
            on:change={ (event) => {
              console.log(event.detail);
              // limite igual a event.detail en int
              limit = parseInt(event.detail);

              // dispatch("changeLimit", limit);
            } }
            options={ [ { label: 3, value: 3 } ,{ label: 10, value: 10 }, { label: 50, value: 50 }, { label: 100, value: 100 } ] }
          />
        </div>
      </div>

      <div class="mdc-data-table__pagination-navigation">
        <div class="mdc-data-table__pagination-total">{ (offset + 1) + ' - ' + (offset + limit > count ? count : offset + limit ) + ' de ' + count }</div>
        <button
          class="mdc-icon-button material-icons mdc-data-table__pagination-button"
          data-first-page="true"
          disabled={ offset == 0 }
          on:click={ () => {
            offset = 0;
            dispatch("changePage", offset);
          } }
        >
          <!-- <div class="mdc-button__icon">first_page</div> -->
          <span class="material-symbols-rounded">first_page</span>
        </button>
        <button
          class="mdc-icon-button material-icons mdc-data-table__pagination-button"
          data-prev-page="true"
          disabled={ offset == 0 }
          on:click={ () => {
            offset -= limit;
            if (offset < 0) offset = 0;
            dispatch("changePage", offset);
          } }
        >
          <!-- <div class="mdc-button__icon">chevron_left</div> -->
          <span class="material-symbols-rounded">chevron_left</span>
        </button>
        <button
          class="mdc-icon-button material-icons mdc-data-table__pagination-button"
          data-next-page="true"
          disabled={ offset + limit >= count }
          on:click={ () => {
            offset += limit;
            if (offset > count) offset = count - limit;
            // setUnselectedAll();
            dispatch("changePage", offset);
          } }
        >
          <!-- <div class="mdc-button__icon">chevron_right</div> -->
          <span class="material-symbols-rounded">chevron_right</span>
        </button>
        <button
          class="mdc-icon-button material-icons mdc-data-table__pagination-button"
          data-last-page="true"
          disabled={ offset + limit >= count }
          on:click={ () => {
            offset = count - limit;
            if (offset < 0) offset = 0;
            dispatch("changePage", offset);
          } }
        >
          <!-- <div class="mdc-button__icon">last_page</div> -->
          <span class="material-symbols-rounded">last_page</span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>

  .table-head__custom {
    /* padding: 6px 12px; */
    border-bottom: #ccc 2px solid;
  }
  .table-filters {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    gap: 24px;
  }
  .align-right {
    margin-left: auto;
  }
  
  .table-actions {
    border-top: #ccc 1px solid;
  }

  @media only screen and (max-width: 600px) {
    .mdc-data-table__pagination-rows-per-page {
      padding: 10px 5px 5px 5px;
      margin: auto;
    }

    .mdc-data-table__pagination-rows-per-page-label {
      white-space: break-spaces;
    }
  }
</style>
