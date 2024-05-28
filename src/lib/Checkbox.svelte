<script>
    import { onMount } from 'svelte';
    import { MDCCheckbox } from '@material/checkbox';
    import { MDCFormField } from '@material/form-field';

    export let id = 0
    export let label = "";
    export let checked = false;
    export let disabled = false;

    let formComponent;
    let checkboxComponent;

    const handleChange = (event) => {
      checked = event.target.checked;
    }

    onMount(() => {
        const checkbox = new MDCCheckbox(checkboxComponent);
        const formField = new MDCFormField(formComponent);
    });

</script>

<div bind:this={ formComponent } class="mdc-form-field">
  <div bind:this={ checkboxComponent } 
    class="mdc-checkbox"
    class:mdc-checkbox--disabled={disabled}
    >
    <input 
      type="checkbox"
      {checked}
      class="mdc-checkbox__native-control"
      {id}
      {disabled}
      aria-labelledby={id}
      on:change={ handleChange }
    />
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark"
            viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <div class="mdc-checkbox__ripple"></div>
  </div>
  <label for="checkbox-1">{ label }</label>
</div>