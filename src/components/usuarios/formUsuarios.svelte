<script>
    import { user} from "../../stores/store";
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";
    import { TextField, Button, Select } from "$lib";
    import { getContext, onDestroy, onMount } from "svelte";
    import CompanySelect from "../company/companySelect.svelte";
    
    export let usuario = {};
    export let accion = '';
    export let showPassword = false;
    export let editself = false;

    let message= ''
    let disabledSave = false
    let accionBtn = ''
    let perfilUser = ''
    let password = ''

    //Contexto para actualizar users
    let addUsuario = getContext('addUsuario')
    let editUsuario = getContext('editUsuario')

    let profiles = []

    const getProfiles = async () => {
        
        let response = (await Api.call('/profiles', 'GET'))
        console.log('RESPONSE GET PROFILES --> ', response)
        if (response.success && response.statusCode == "200") {
            profiles = response.data.result //empresas.set(response.data)
        }

    }

    function formatRut(code) {
        if (code == undefined) return ''
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
        
        // return code
    }

    function obtenerRut(cadena) {
    // Elimina guiones y puntos usando expresiones regulares
        const soloDigitos = cadena.replace(/[-.]/g, '');
        const sinUltimoDigito = soloDigitos.slice(0, -1);
        //console.log(sinUltimoDigito)
        return sinUltimoDigito;
    }

    function validForm() {
        if (usuario.firstName == ''){
            message = "Falta agregar el nombre al usuario."
            return false;
        }
        if (usuario.lastName == ''){
            message = "Falta agregar el apellido al usuario."
            return false;
        } 
        if (usuario.email == ''){
            message = "Falta agregar el correo al usuario."
            return false; 
        }
        if (usuario.rut == ''){
            message = "Falta agregar el rut al usuario."
            return false; 
        } 
        if (usuario.profile_id == ''){
            message = "Falta agregarle un perfil al usuario."
            return false; 
        }
        if (usuario.profile_id == 2 && usuario.company_id == ''){
            console.log(usuario.company_id)
            message = "Falta agregarle una compañia al usuario cliente."
            return false; 
        }   
        return true
    }

    const saveUser = async () => {
        //console.log("-----")
        //console.log(usuario.profile_id)
        //console.log(usuario.company_id)
        usuario.password = obtenerRut(usuario.rut)
        //usuario.profile_id = parseInt(usuarioProfileId, 10)
        
        //if(usuario.profile_id != 1) {
          //  console.log(usuarioCompanyId)
            //usuario.company_id = parseInt(usuarioCompanyId, 10)
        //}

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
        
        //loading = true;

        usuario.password = obtenerRut(usuario.rut)
        usuario.company_id = parseInt(usuario.company_id, 10)
        usuario.profile_id = parseInt(usuario.profile_id, 10)

        // Si el perfil es administrador u operador el id de la empresa es null;
        if(usuario.profile_id == 1 || usuario.profile_id == 3){
            usuario.company_id = null
        }

        // Peticion
        console.log(usuario)   
        let body = JSON.stringify(usuario)  
        let response = (await Api.call('/user', 'POST', { body }))
        console.log('RESPONSE SAVE USER --> ', response)
        if (response.success) {
            if (response.data.code == 201) {
                message = "Usuario agregado"
                usuario.firstName = ''
                usuario.secondName = ''
                usuario.lastName = ''
                usuario.secondLastName = ''
                usuario.email = ''
                usuario.password = ''
                usuario.rut = ''
                usuario.company_id = ''
                usuario.profile_id = ''

                //Actualizar lista de users
                addUsuario(response.data.result)

                //aviso
                snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Usuario creado con éxito."
                return snk
                })

            }else{
                //aviso
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = response.data.message //"Error al crear usuario."
                    return snk
                })
            }
        }else{
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al crear usuario."
                return snk
            })
        }
        //loading = false
    }

    const editUser = async () => {
        
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

        // Si el perfil es administrador u operador el id de la empresa es null;
        if(usuario.profile_id == 1 || usuario.profile_id == 3){
            usuario.company_id = null
        }
        
        // Peticion
        let body;
        if(password == ""){
            body = JSON.stringify({
                firstName: usuario.firstName,
                secondName: usuario.secondName,
                lastName: usuario.lastName,
                secondLastName: usuario.secondLastName,
                email: usuario.email,
                company_id : parseInt(usuario.company_id),
                profile_id : parseInt(usuario.profile_id)
            }) 
        }else{
            body = JSON.stringify({
                firstName: usuario.firstName,
                secondName: usuario.secondName,
                lastName: usuario.lastName,
                secondLastName: usuario.secondLastName,
                email: usuario.email,
                password: password,
                company_id : parseInt(usuario.company_id),
                profile_id : parseInt(usuario.profile_id)
            }) 
        }   
         
        let response = (await Api.call(`/user/${usuario.id}`, 'PUT', { body }))
        console.log('RESPONSE EDIT USER --> ', response)
        if (response.success) {
            if (response.data.code == 201) {

                //actualizar $user 
                if(editself){
                    console.log("id")
                    console.log($user)
                    console.log(response.data.result)
                    let userEdited = {...response.data.result, ...$user}
                    console.log(userEdited)
                    user.set(userEdited)
                    // localStorage.setItem("user",  JSON.stringify(userEdited))
                    sessionStorage.setItem("user",  JSON.stringify(userEdited))


                }else{
                   //Actualizar lista de users
                    editUsuario(response.data.result) 
                }

                

                //aviso
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = "Usuario actualizado con éxito."
                    return snk
                })
            }else{
                //aviso
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = response.data.message //"Error al editar usuario."
                    return snk
                })
            }
        }else{
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al editar usuario."
                return snk
            })
        }
    }
    
    onMount(async () => {

        await getProfiles();

        //funcion que determina que accion se hara, crear o editar;
        if(accion == 'create'){
            accionBtn = saveUser
        }else{
            accionBtn = editUser
            perfilUser = usuario.profile_id 
        }

    })

    $: usuario.rut = formatRut(usuario.rut)

</script>

<div class="form">

    <TextField 
        version=2
        id="name-company"
        required 
        type="text"
        label="Nombre" 
        bind:value={usuario.firstName}
    />

    <TextField 
        version=2
        id="name-company" 
        type="text"
        label="Segundo nombre" 
        bind:value={usuario.secondName}
    />
    
    <TextField 
        version=2
        required 
        type="text"
        label="Apellido" 
        bind:value={usuario.lastName}
    />

    <TextField 
        version=2 
        type="text"
        label="Segundo apellido" 
        bind:value={usuario.secondLastName}
    />

    <TextField 
        version=2
        required 
        type="text"
        label="Correo" 
        bind:value={usuario.email}
    />

    {#if showPassword}
        <TextField 
            version=2
            required 
            type="password"
            label="contraseña" 
            bind:value={ password }
        />
    {/if}

    {#if accion == 'create'}
        <TextField 
            version=2
            required 
            type="text"
            label="Rut" 
            bind:value={usuario.rut}
        />
    {/if}

    {#if $user.profileActions.includes('create-perfil')}

    {#key profiles}
    <Select 
        label="Perfil"
        selected={ usuario.profile_id }
        options={ profiles.map(p => { return { label: p.name, value: p.id } }) }
        on:change={ (event) => usuario.profile_id = event.detail }
    />
    {/key}

    {/if}

    {#if $user.profileActions.includes('create-empresa')}

    <!-- <Select 
        label="Compañias"
        selected={ usuario.company_id }
        options={companies}
        on:change={ (event) => usuario.company_id = event.detail }
    /> -->
    <CompanySelect 
        selected={ usuario.company_id }
        on:change={ (event) => usuario.company_id = event.detail }
    />


    {/if}

    <br>
    <div class="grid-col-span-1 mobile-fixed">
        <Button 
            custom
            disabled={disabledSave}
            label="Guardar"
            on:click={ accionBtn }
        />
    </div>


</div>