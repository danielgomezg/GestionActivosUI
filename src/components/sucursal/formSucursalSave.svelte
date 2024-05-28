<script>
    import { getContext } from "svelte";
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";
    import { TextField, Button, Divider } from "$lib";
    import SelectCountryLocations from "../selectCountry/selectCountryLocations.svelte";

    // export let openModal
    export let sucursal = { }, company = {}

    let addSucursalCount = getContext('addSucursalCount')
    let message = ""
    let offices = [
        {
            floor: '', 
            description: '',
            name_in_charge: ''
        }
    ]

    function validForm() {
        if (sucursal.description == ''){
            message = "Falta agregar una descripción a la sucursal."
            return false;
        }
        if (sucursal.number == ''){
            message = "Falta agregar un número a la sucursal."
            return false;
        } 
        if (sucursal.address == ''){
            message = "Falta agregar una dirección a la sucursal."
            return false; 
        }
        if (sucursal.region == ''){
            message = "Falta agregar una región a la sucursal."
            return false; 
        } 
        if (sucursal.commune == ''){
            message = "Falta agregar una comuna a la sucursal."
            return false; 
        }   
        if (offices[0].floor == ''){
            message = "Falta agregar al menos un piso a la sucursal."
            return false; 
        } 

        return true
    }

    const saveSucursal = async () => {
        // Validacion formulario
        let isValid = validForm();
        if (!isValid) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = message
                return snk
            })
            return;
        } 
        //loading = true;
        // Peticion
        let clean = true
        console.log(sucursal)   
        let body = JSON.stringify(sucursal)  
        let response = (await Api.call('/sucursal', 'POST', { body }, 'json', company.id))
        console.log('RESPONSE SAVE SUCURSAL --> ', response)
        if (response.success) {
            if (response.data.code == 201) {
                //GUARDAR OFICINAS
                let responseOffices = []; 
                responseOffices = await saveOffice(response.data.result.id);
                if (responseOffices.length > 0) {
                    if (offices.length != responseOffices.length) {
                        // Error al crear algunas oficinas
                        snackbar.update(snk => {
                            snk.open = true;
                            snk.type = 'dismiss'
                            snk.message = "Error al crear algunas oficinas, pueden volver a intentar en edicion sucursal. 1"
                            return snk
                        })
                    }
                    else {
                        // Error al crear las oficinas
                        snackbar.update(snk => {
                            snk.open = true;
                            snk.type = 'dismiss'
                            snk.message = "Error al crear las oficinas, pueden volver a intentar en edicion sucursal. 2"
                            return snk
                        })
                    }
                }
                else {
                    // TODO GUARDADO CORRECTAMENTE.
                    snackbar.update(snk => {
                        snk.open = true;
                        snk.type = 'dismiss'
                        snk.message = "Sucursal creada con éxito."
                        return snk
                    })
                    addSucursalCount(company.id, + 1)
                }
            }
            else {
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = response.data.message//"Error al crear sucursal."
                    return snk
                })
                clean = false
            }
        }
        else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al crear sucursal."
                return snk
            })
            clean = false;
        }

        if (clean) {
            sucursal.number = ''
            sucursal.description = '',
            sucursal.address = ''
            sucursal.region = ''
            sucursal.commune = ''
            sucursal.city = ''
            offices = [ 
                {
                    floor: '', 
                    description: '',
                    name_in_charge: ''
                }
            ]
        }

    }

    const saveOffice = async (idSucursal) => {
        
        offices = offices.map(of => {
            return {
                ...of,
                sucursal_id: idSucursal
            }
        });
        
        let response = (await Promise.all(offices.map(of => {
            let body = JSON.stringify(of)
            return Api.call(`/office`, 'POST', { body }, 'json', company.id)
        })));
        console.log('RESPONSE SAVE OFFICES --> ', response)

        // let created = response.every(r => r.data.code == "201")
        let failed = response.filter(r => r.data.code != "201");
        return failed

    }

</script>

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
        label="Descripción" 
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
        selectedRegion={ sucursal.region }
        selectedComuna={ sucursal.commune }
        on:setRegion={ (event) => sucursal.region = event.detail }
        on:setComuna={ (event) => sucursal.commune = event.detail }
        on:setCity={ (event) => sucursal.city = event.detail }
    />

    <div class="grid-col-span-2">
        <Divider />
    </div>
    <h4>OFICINAS</h4>
    <div></div>

    {#each offices as office }
        <div class="grid-col-span-2 container-office" >
            <TextField 
                version=2
                required 
                type="text"
                label="Número piso" 
                bind:value={office.floor}
            />

            <TextField 
                version=2
                type="text"
                label="Descripción" 
                bind:value={office.description}
            />

            <TextField 
                version=2
                type="text"
                required
                label="Responsable" 
                bind:value={office.name_in_charge}
            />
        </div>  
    {/each}

    <div class="grid-col-2 new-office-actions">
      
        <Button 
            label="Nueva oficina"
            custom
            on:click={ () => {
                offices = [ ...offices, { floor: '', description: '', name_in_charge: '' } ]
            }}
        />
        {#if offices.length != 1}

            <Button 
                custom
                type="outlined"
                label="Cancelar"
                color=""
                on:click={ () => {
                    offices = [...offices.slice(0, -1)]
                }}
            />

        {/if}
    </div>

    <div class="mobile-fixed">
        <Button 
            custom
            label="Guardar"
            on:click={ saveSucursal }
        />
    </div>  

</div>

<style>

    .new-office-actions {
        display: flex;
        flex-direction: row-reverse;
        gap: 8px;
    }

    .container-office {
        display: grid;
        grid-template-columns: .5fr 1fr 1fr;
        grid-gap: 8px;
    }

</style>