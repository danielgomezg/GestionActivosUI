<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { user } from "../../stores/store";
    import { snackbar } from "../../stores/store";
    import Api from "../../../helpers/ApiCall";
    // @ts-ignore
    import { Card, Button, TextField, Snackbar } from "$lib";
    
    let dispatch = createEventDispatcher();
    let usuario = {
        email: "",
        password: ""
    }
    let message = "", error = false, loading = false;

    const validData = () => {

        if (usuario.email == "") {
            message = "Falta ingresar un correo."
            error = true;
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
            message = "Correo invalido."
            error = true
            return false;
        }

        if (usuario.password == "") {
            message = "Falta ingresar constraseña."
            error = true;
            return false;
        }

        error = false;
        return true;
    }

    async function getProfile(id) {
        let response = (await Api.call(`/profile/${id}`))
        console.log('RESPONSE PROFILE --> ', response)
        if (response.success && response.statusCode == "200") {
            return response.data.result[0]
        }
        else {
            return []
        }
    }

    async function iniciarSesion(e){
        e.preventDefault()

        console.log("email: " + usuario.email + " password: " + usuario.password)

        //let valid = validData()

        // Validacion formulario
        let isValid = validData();
        if (!isValid) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = message
                return snk
            })
            return console.log(message)
        }

        let body = JSON.stringify(usuario) 
        let response = (await Api.call('/login', 'POST', { body }))
        console.log('RESPONSE LOGIN --> ', response)
        
        //cuando el usuario o la contraseña son incorrecto responde undefined
        if(response == undefined){
            snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = "Error al iniciar sesión."
                    return snk
            })
        }
        if (response.success) {
            // @ts-ignore
            if (response.data.code == 201) {
                message = "Usuario ingresado correctamente"
                usuario.email = '',
                usuario.password = ''
                let _userLogged = response.data.result.user
                
                // localStorage.setItem('accessToken', response.data.result.access_token);
                sessionStorage.setItem('accessToken', response.data.result.access_token);
                let profile = (await getProfile(_userLogged.profile_id))
                _userLogged.profileActions = profile.profileActions.map(pa => pa.name)
                
                user.set({
                    ..._userLogged
                })

                // localStorage.setItem("user",  JSON.stringify(_userLogged))
                sessionStorage.setItem("user",  JSON.stringify(_userLogged))
               

                // dispatch('login')
                // return;
                console.log($user)

                if ($user.profile_id == 1) {
                    navigate("/empresas", {replace: true})
                }
                else if ($user.profile_id == 3){
                    navigate("/articulos", {replace: true})
                }
                else {
                    navigate("/sucursales", {replace: true})
                }
            }else{
                //aviso
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss'
                    snk.message = "Error al iniciar sesión."
                    return snk
                })
            }
        }else{
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al iniciar sesión."
                return snk
            })
        } 
    }

    onMount(() => {
        
    })

    $: console.log('user store > ', $user)

</script>
<div style="display: flex; justify-content: center;">
    <Card width="320px">
        <div class="logo-container theme-dark">
            <img
                src="/sca_logo_1.jpeg"
                alt="logo"
            />
        </div>
        <div class="login-content">
            <h3>Ingreso usuarios</h3>
            <TextField 
                required 
                type="email"
                label="Correo" 
                bind:value={usuario.email} 
            />
            <TextField 
                required 
                type="password"
                label="Contraseña" 
                bind:value={usuario.password} 
            />
            <br>
            {#if error}
                <Snackbar type="error" message={message} />
            {/if}
            <Button 
                label="Ingresar" 
                { loading } 
                on:click={ iniciarSesion } 
            />
        </div>

    </Card>
</div>

<style>
    h3 {
        text-align: center;
    }
    img {
        border-radius: 12px;
        width: 100%;
    }
    .login-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
    }

    .logo-container {
        /* background-color: var(--mdc-theme-primary); */
        border-radius: 12px 12px 0 0;
        /* padding: 16px; */
        border-bottom: #79747E solid 1px;
    }

</style>