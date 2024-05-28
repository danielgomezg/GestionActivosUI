<script>
    import { onMount } from 'svelte';
    import { MDCTextField } from '@material/textfield';
    import '@material/web/textfield/outlined-text-field.js';

    export let version = 2
    export let placeholder = ''
    export let required = false
    export let type = 'text'
    export let value = ''
    export let label = ""
    export let id = ''
    export let trailing = ''
    export let disabled = false
    export { setValid }

    let isValid;
    let textfield
    let mdcTextField;


    const setValid = (status) => {
        console.log('status', status)
        // mdcTextField.valid = status
        mdcTextField.foundation.setValid(status)
        isValid = status
    }

    onMount(() => {
        if (version == 2) {   
            mdcTextField = new MDCTextField(textfield) 
            textfield.addEventListener('input', function() {
                // Acceder al valor del input
                // console.log(textfield)
                var valorInput = textfield.querySelector('input') //textfield.value;

                // Hacer algo con el valor, como imprimirlo en la consola
                // console.log('Texto ingresado:', valorInput.value);
                value = valorInput.value
            });
            mdcTextField.foundation.setUseNativeValidation(false)
            
        }
    })

    $: if (mdcTextField != undefined && value != null) {
        // mdcTextField.valid = true
        // mdcTextField.foundation.setValid(true)
        mdcTextField.foundation.setValue(value)
    }


</script>

{#if version == 2}
<label 
    bind:this={textfield} 
    class="mdc-text-field mdc-text-field--outlined mdc-text-field--custom"
    class:mdc-text-field--with-trailing-icon={trailing != ''}
    class:mdc-text-field--disabled={disabled}
    class:mdc-text-field--danger={isValid === false}
    >
    <span class="mdc-notched-outline">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
            <span class="mdc-floating-label" id="my-label-id">{label}</span>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
    </span>
    <input 
        {id}
        {type} 
        {required}
        {placeholder}
        {disabled}
        class="mdc-text-field__input" 
        aria-labelledby="my-label-id" 
        on:focus
        >
        {#if trailing != ''}
            <span style="margin: auto; padding: 10px">
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <i class="material-symbols-rounded" on:click>{trailing}</i>
            </span>
        {/if}
        
</label>
{:else}

    <md-outlined-text-field 
        {label} 
        {value}
        {required}
        {type} 
    >
    </md-outlined-text-field>
{/if}

<style>
    .mdc-text-field__input::-webkit-calendar-picker-indicator {
       display: initial;
    }
</style>