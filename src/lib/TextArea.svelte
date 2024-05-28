<script>
    import { MDCTextField } from '@material/textfield';
    import { onMount } from 'svelte';

    export let value = '';
    export let label = ''

    let textfield

    onMount(() => {
        let mdcTextArea = new MDCTextField(textfield)
        textfield.addEventListener('input', function() {
            var valorInput = textfield.querySelector('textarea')
            value = valorInput.value
        });
        console.log('mdcTextArea -> ', mdcTextArea)
    })

</script>
<label bind:this={textfield} class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--custom">
    <span class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__notch">
        <span class="mdc-floating-label" id="my-label-id">{label}</span>
      </span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
    <span class="span-custom">
      <textarea 
        class="mdc-text-field__input textarea-custom" 
        {value}
        cols="40" 
        aria-label="Label"
    ></textarea>
    </span>
</label>

<style>
  .mdc-text-field--textarea, .span-custom {
    height: 100%;
  }

  .textarea-custom {
    height: 100%;
    margin-top: 0;
    margin-bottom: 0;
    padding: 11px 16px;
  }

  .mdc-text-field--textarea.mdc-text-field--outlined .mdc-text-field__input {
    margin: 0;
  }

</style>