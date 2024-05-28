<script>    
    import { createEventDispatcher } from 'svelte';
    import IconButton from './IconButton.svelte';

    export let btnIcon = false;
    export let accept = [];
    export let placeholder = ''
    export let multiple = false
    export let required = false
    export let type = 'file'
    export let label = ""
    export let id = ''
    export let trailing = ''
    export let helperText = ''
    export let disabled = false
    export { cleanValue }

    let textfield;
    let fileInput;
    let value = '';
    let invalid = false;
    let dispatch = createEventDispatcher();

    function cleanValue() {
        console.log('cleanValue')
        console.log('value', value)
        value = null;
        label = '';
    }
    
    function handleMultiple(event) {
        console.log('handleMultiple')
        let files = event.target.files;
        console.log(files)
        let filesArray = Array.from(files);
        let filesFiltered = filesArray.filter(file => {
            let type = file.type.split('/')[1]
            if (!accept.includes(type)) {
                return false;
            }
            return true;
        })
        if (filesFiltered.length != filesArray.length) {
            label = ''
            invalid = true;
            return;
        }
        invalid = false;
        label += ', ' + filesFiltered.map(file => file.name).join(', ');
        dispatch('change', filesFiltered);
    }

    function handleChange(event) {
        console.log('handleChange')
        if (multiple) {
            handleMultiple(event)
            return;
        }

        let file = event.target.files[0];
        console.log(file)
        let type = file.type.split('/')[1]
        if (!accept.includes(type)) {
            label = ''
            invalid = true;
            return;
        }

        invalid = false;
        label = file.name
        console.log('label', label)
        console.log('file', file)
        dispatch('change',file);
    }

</script>
<div>
    {#if btnIcon}
        <IconButton icon="add_a_photo" on:click={ () => fileInput.click() } />
    {/if}

    <label 
        bind:this={textfield} 
        class="mdc-text-field mdc-text-field--outlined mdc-text-field--custom "
        class:mdc-text-field--with-trailing-icon={trailing != ''}
        class:mdc-text-field--invalid={invalid}
        class:mdc-text-field--hidden={btnIcon}
        >
        <span class="mdc-notched-outline">
            <span class="mdc-notched-outline__leading"></span>
            <span class="mdc-notched-outline__notch">
                <span class="mdc-floating-label" id="my-label-id">{label}</span>
            </span>
            <span class="mdc-notched-outline__trailing"></span>
        </span>
        <input 
            bind:this={fileInput}
                {disabled}
                {id}
                {type} 
                {required}
                {value}
                {placeholder}
                {multiple}
                class="mdc-text-field__input" 
                aria-labelledby="my-label-id"
                aria-controls="my-helper-id"
                aria-describedby="my-helper-id" 
                on:change={ handleChange }
            >
            {#if trailing != ''}
                <span style="margin: auto; padding: 10px">
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <i class="material-symbols-rounded" on:click>{trailing}</i>
                </span>
            {/if}
    </label>   
    {#if !btnIcon} 
        <div class="mdc-text-field-helper-line">
            <div class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent" id="my-helper-id" >{helperText}</div>
        </div>
    {/if}
</div>
<style>
    input{
        /* display: none; */
        visibility: hidden;
    }

    .mdc-text-field--hidden {
        display: none;
    }
</style>