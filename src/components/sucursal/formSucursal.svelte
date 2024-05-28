<script>
    import { onMount } from "svelte";
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";
    import { TextField, Button, Divider, IconButton, Snackbar } from "$lib";
    import SelectCountryLocations from "../selectCountry/selectCountryLocations.svelte";

    export let sucursal = { }, company = { }, readinfo = false;

    let message = ""
    let offices = [];
    let editing = -1
    let officeEdit = {}
    let addOffice = false
    let officeToDelete = {};
    let openSnackbar = false;
    let messageSnackbar = '';

    function toggleEdit(office, index) {
        if (editing == index) {
            editing = -1;
            return;
        }

        officeEdit = { ...office }
        addOffice = false
        editing = index
    }

    function validForm() {
        if (sucursal.description == ''){
            message = "Falta agregar una descripción a la sucursal"
            return false;
        }
        if (sucursal.number == ''){
            message = "Falta agregar un numero a la sucursal"
            return false;
        } 
        if (sucursal.address == ''){
            message = "Falta agregar una dirección a la sucursal"
            return false; 
        }
        if (sucursal.region == ''){
            message = "Falta agregar una región a la sucursal"
            return false; 
        } 
        if (sucursal.commune == ''){
            message = "Falta agregar una comuna a la sucursal"
            return false; 
        }   
        return true
    }

    const editSucursal = async () => {
        // Validacion formulario
        let isValid = validForm();
        if (!isValid) return console.log(message)
       
        console.log(sucursal)   
        let body = JSON.stringify(sucursal)  
        let response = (await Api.call(`/sucursal/${sucursal.id}`, 'PUT', { body }, 'json', company.id))
        console.log('RESPONSE EDIT SUCURSAL --> ', response)
        if (response.success && response.statusCode == '201') {
            
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Sucursal editada con exito"
                return snk
            })      
        
        } else {
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al editar sucursal"
                return snk
            })
        }
    }
    
    function validFormOficce() {
        if (officeEdit.floor == ''){
            message = "Falta agregar un piso a la oficina."
            return false; 
        }
        if (officeEdit.name_in_charge == ''){
            message = "Falta agregar el nombre del responsable de la oficina."
            return false; 
        }
        return true
    }

    const saveOffice = async () => {

        let  isValid = validFormOficce()
        if (!isValid){
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = message
                return snk
            })
            return
        }
        console.log(isValid)

        let body = JSON.stringify({ ...officeEdit, sucursal_id: sucursal.id })  
        let response = (await Api.call(`/office`, 'POST', { body }, 'json', company.id))
        console.log('RESPONSE POST OFFICE --> ', response)
        if (response.success, response.statusCode == "201") {
            console.log(offices)
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Oficina creada con éxito."
                return snk
            }) 

            offices = [response.data.result, ...offices]
            officeEdit = { floor: '', description: '' }
            addOffice = false
        } else {
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al crear oficina."
                return snk
            })
        } 
    }

    const getOffices = async (id_sucursal) => {
    
        let response = (await Api.call(`/officePorSucursal/${id_sucursal}`, 'GET', { }, 'json', company.id))
        console.log('RESPONSE GET Offices --> ', response)
        if (response.success) {
            offices = response.data.result
        } 
    }

    const formatOfficeInfo = (office) => {
        let name = office.name_in_charge == undefined ? '' : " - " + office.name_in_charge
        return office.floor  + ' - ' + office.description + name
    }

    const deleteOffice = async (office) => {
        console.log(office)
        // let confirmacion = confirm(`Esta seguro que desea eliminar la Oficina ${office.floor} ${office.description}`)
        // if (!confirmacion) return;

        let response = (await Api.call(`/office/${office.id}`, 'DELETE', {}, 'json', company.id));
        console.log('RESPONSE DELETE OFFICE -> ', response)
        if (response.success && response.statusCode == '201') {

            offices = offices.filter(of => of.id !== office.id);

            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Oficina eliminada con éxito."
                return snk
            })

        } else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al eliminar Oficina."
                return snk
            })
        }
    }

    const editOffice = async () => {

        let  isValid = validFormOficce()
        if (!isValid){
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = message
                return snk
            })
            return
        }

        let body = JSON.stringify(officeEdit)  
        let response = (await Api.call(`/office/${officeEdit.id}`, 'PUT', { body }, 'json', company.id))
        console.log('RESPONSE EDIT OFFICE --> ', response)
        if (response.success && response.statusCode == '201') {
            
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Oficina editada con exito"
                return snk
            })      

            offices = offices.map(of => {
                if (of.id == officeEdit.id) {
                    return { ...officeEdit }
                }
                return of
            })  

            editing = -1
        
        } else {
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al editar oficina"
                return snk
            })
        }

    }

    onMount(async () => {
        
        if(sucursal.id > 0 ){
            await getOffices(sucursal.id)
        }
    })

</script>

<Snackbar 
    bind:open={ openSnackbar }
    type="confirm"
    message={messageSnackbar}
    on:confirm={ deleteOffice(officeToDelete) }
/>

<div class="form">
    <TextField 
        version=2
        required 
        type="text"
        label="Número" 
        bind:value={sucursal.number}
    />
    
    <TextField 
        version=2
        required 
        type="text"
        label="Descripcion" 
        bind:value={sucursal.description}
    />

    <TextField 
        version=2
        required 
        type="text"
        label="Dirección" 
        bind:value={sucursal.address}
    />

    <SelectCountryLocations 
        country={ company.country.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() }
        disabledComuna
        disabledRegion
        disabledCity
        selectedRegion={ sucursal.region }
        selectedComuna={ sucursal.commune }
        selectedCity={ sucursal.city }
        on:setRegion={ (event) => sucursal.region = event.detail }
        on:setComuna={ (event) => sucursal.commune = event.detail }
        on:setCity={ (event) => sucursal.city = event.detail }
    />

    <div class="grid-col-span-1">
        <Button 
            label="Guardar"
            disabled={ readinfo }
            custom 
            on:click={ editSucursal }
        />
    </div>

    <div class="grid-col-span-2">
        <Divider />
    </div>

    <h4>OFICINAS</h4>
    <!-- <br> -->

    <table class="grid-col-span-2">
        <ul>
            {#each offices as office, index} 
            <tr>
                <td style="width: 65%;"><li>{ formatOfficeInfo(office) }</li></td>
                <td style="width: 65%; display: flex;">
                    <IconButton icon="edit" tooltipId="btn-edit__{index}" tooltipText="Editar" on:click={ () => toggleEdit(office, index) } />
                    <IconButton 
                        icon="delete" 
                        tooltipId="btn-delete__{index}" 
                        tooltipText="Eliminar" 
                        on:click={ () => {
                            officeToDelete = office;
                            messageSnackbar = '¿Eliminar la oficina ' + office.floor + ' ' + office.description + '?'
                            openSnackbar = true;
                        } } />
                </td>    
            </tr>
            {#if editing == index}
                <tr class="form-office-edit">
                    <TextField 
                        version=2
                        required 
                        type="text"
                        label="Número piso" 
                        bind:value={officeEdit.floor}
                    />
                    <TextField 
                        version=2
                        required 
                        type="text"
                        label="Descripción" 
                        bind:value={officeEdit.description}
                    />
                    <TextField 
                        version=2
                        type="text"
                        label="Responsable" 
                        bind:value={officeEdit.name_in_charge}
                    />
                    <IconButton icon="save" on:click={ editOffice } />
                </tr>
            {/if}
            {:else}
                <p> No se encontraron oficinas. </p>
            {/each}
        </ul>
    </table>

    {#if addOffice}
            <TextField 
                version=2
                required 
                type="text"
                label="Número piso" 
                bind:value={officeEdit.floor}
            />
            <TextField 
                version=2
                required 
                type="text"
                label="Descripción" 
                bind:value={officeEdit.description}
            />

            <TextField 
                version=2
                type="text"
                label="Responsable" 
                bind:value={officeEdit.name_in_charge}
            />
    {/if}
    
    {#if addOffice}
        <div class="company-actions grid-col-span-1">
            <Button 
                label="Guardar"
                custom
                disabled={ readinfo }
                on:click={ saveOffice }
            />
        
            <Button 
                label="Cancelar"
                type="outlined"
                custom
                color=""
                on:click={ () => addOffice = false}
            />
        </div>

    {:else}
        <Button 
            label="Agregar"
            custom
            disabled={ readinfo }
            on:click={ () => {
                officeEdit = { floor: '', description: '', name_in_charge: '' }
                addOffice = true
                editing = -1
            }}
        />
    {/if}
        
    
    
    

</div>

<style>

    .company-actions {
        display: flex;
        gap: 8px;
        grid-column: 1;
    }

    .form-office-edit {
        width: 100%;
        display: flex;
        gap: 8px;
    }

</style>