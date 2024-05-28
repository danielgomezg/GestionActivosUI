<script>
    import { getContext } from "svelte";
    import { TextField, Button } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";

    export let company_id;
    export let category = {};

    let addCategory = getContext('addCategory');
    let editCategory = getContext('editCategory');

    const create = async () => {
        
        let body = JSON.stringify(category)
        let response = (await Api.call('/category', 'POST', { body }, 'json', company_id))
        console.log('RESPONSE SAVE CATEGORY', response);
        if (response.success && response.statusCode == '201') {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'Categoría creada correctamente'
                return snk
            })

            addCategory(response.data.result)
        }
        else {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = response.data.message || 'Error al crear la categoría'
                return snk
            })
        }

    }

    const update = async (data) => {
        console.log('UPDATE CATEGORY -> ', data)
        let body = JSON.stringify(category)
        let response = (await Api.call(`/category/${category.id}` , 'PUT', { body }, 'json', company_id))
        console.log('RESPONSE UPDATE CATEGORY', response);
        if (response.success && response.statusCode == '201') {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'Categoría actualizada correctamente'
                return snk
            })

            editCategory(response.data.result)
        }
        else {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'Error al actualizar la categoría'
                return snk
            })
        }
    }

    const save = () => {
        console.log(category)
        if (category.id) {
            console.log('update')
            update(category)
        } else {
            console.log('create')
            create()
        }
    }

</script>

<div class="form">

    <TextField 
        required 
        type="text"
        label="Descripción" 
        bind:value={ category.description }
    />

    <TextField 
        required 
        type="text"
        label="Código" 
        bind:value={ category.code }
    />

    <div class="grid-col-span-1 mobile-fixed">

        <Button 
            label="Guardar"
            custom
            on:click={ save }
        />
    </div>

</div>