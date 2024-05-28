<script>
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";
    import { getContext, onDestroy, onMount } from "svelte";
    import { TextField, Button, Select } from "$lib";
    
    export let company = {}, isEdit = false;
    let showSucursalesBtn = false, loading = false, message = 'Empresa agregada';
    let paises = [
        {
            label: 'Chile',
            value: 'Chile'
        },
        {
            label: 'Perú',
            value: 'Perú'
        }
    ]
    let addCompany = getContext('addCompany');
    let replaceCompany = getContext('replaceCompany');

    function formatRut(code) {
        if (code == undefined) return ''
        // if (company.country != 'Chile') return code.replace(/[.-]/g, '');
        if (company.country != 'Chile') return code.replace(/\D/g, '');
        if (code.length >= 13) return code.slice(0, -1);
        
        let rut = code.replace(/[^\dkK]/g, '')

        if (rut.length > 1) {
            rut = rut.slice(0, -1) + '-' + rut.charAt(rut.length - 1);
        }

        if (rut.length > 5) {
            rut = rut.slice(0, -5) + '.' + rut.slice(-5);
        }

        if (rut.length > 9) {
            rut = rut.slice(0, -9) + '.' + rut.slice(-9);
        }

        return rut
        
    }

    function validForm() {
        if (company.name == ''){
            message = "Falta agregar el nombre a la empresa."
            return false;
        } 
        if (company.rut == ''){
            message = "Falta agregar un rut a la empresa."
            return false
        }
        if (company.country == ''){
            message = "Falta agregar el país a la empresa."
            return false
        }
        if (company.contact_name == ''){
            message = "Falta agregar el nombre del responsable de la empresa."
            return false
        }
        if (company.contact_phone == ''){
            message = "Falta agregar el teléfono del responsable de la empresa."
            return false
        }
        if (company.contact_email == ''){
            message = "Falta agregar el correo del responsable de la empresa."
            return false
        }
        
        return true
    }

    const editCompany = async () => {
        console.log('edit company')
        console.log(company)

        let isValid = validForm();
        if (!isValid) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = message
                return snk
            })
            return console.log(message)
        }

        // Peticion
        let body = JSON.stringify(company)  
        let response = (await Api.call(`/company/${company.id}`, 'PUT', { body }))
        console.log('RESPONSE EDIT COMPANY --> ', response)
        if (response.success && response.statusCode == "201") {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Empresa editada con éxito."
                return snk
            })

            replaceCompany(response.data.result)

        }
        else {
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = response.data.message //"Error al editar empresa."
                return snk
            })
        }
    }

    const saveCompany = async () => {
        // Validacion formulario
        let isValid = validForm();
        if (!isValid) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = message
                return snk
            })
            return console.log(message)
        }
        loading = true;

        // Peticion
        let body = JSON.stringify(company)  
        let response = (await Api.call('/company', 'POST', { body }))
        console.log('RESPONSE SAVE COMPANY --> ', response)
        if (response.success) {
            if (response.data.code == 201) {
                company.name = '',
                company.rut = ''
                company.country = ''
                company.contact_name = ''
                company.contact_phone = ''
                company.contact_email = ''

                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = "Empresa creada con éxito."
                    return snk
                })

                addCompany(response.data.result)

            } else {
                console.log("msj")
                console.log(response.data.message)
                //aviso
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = response.data.message
                    return snk
                })
            }
        } else {
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al crear empresa."
                return snk
            })
        }
        
        loading = false
    }

    $: company.rut = formatRut(company.rut)
    
</script>

<div class="form">
    <TextField 
        version=2
        id="name-company"
        required 
        type="text"
        label="Nombre" 
        bind:value={company.name}
    />

    <Select 
        label="País"
        options={paises}
        disabled={isEdit}
        selected={company.country}
        on:change={ (event) => company.country = event.detail }
    />

    <TextField 
        version=2
        disabled={isEdit}
        required 
        type="text"
        label={ company.country == 'Chile'? 'RUT': 'DNI' } 
        bind:value={company.rut}
    />

    <TextField 
        version=2
        required 
        type="text"
        label="Nombre responsable"
        bind:value={company.contact_name}
    />

    <TextField 
        version=2
        required 
        type="text"
        label="Teléfono responsable"
        bind:value={company.contact_phone}
    />

    <TextField 
        version=2
        required 
        type="text"
        label="Correo responsable"
        bind:value={company.contact_email}
    />

    <div>
        {#if !isEdit}
            <Button 
                label="Guardar"
                custom 
                on:click={ saveCompany }
            />
        {:else}

            <Button 
                label="Guardar"
                custom
                on:click={ editCompany }
            />

        {/if}
    </div>

    {#if showSucursalesBtn}
        <!-- <div class="grid-col-1"> -->
            <Button 
                label="Agregar Sucursales"
                color="#4F5DDB"
            />
        <!-- </div> -->

    {/if}
</div>