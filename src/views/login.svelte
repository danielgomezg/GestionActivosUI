<script>
  import Logo from '../components/logo.svelte'
  import Entrada from '../components/input.svelte'
  import Btn from '../components/btn.svelte'
  import { navigate } from "svelte-routing";
  import { user } from '../stores/store';
  import RegisterCard from '../components/registerCard.svelte';
  
  let username = "", password = "", id = "", fullname = "" 
  let errorLogin = false, mensajeError = "", inicioSesion = false
  //num = null

  //para abrir ventana registrarse
  let registrarse = false

  //$: console.log(username)

  async function ingresar(e){
    e.preventDefault()

    console.log("usuario: " + username + " password: " + password)

    if(username != "" && password != ""){
      let host = '';
      if (import.meta.env.MODE == 'production') host = `http://45.33.99.148:8000`
      else host = `http://127.0.0.1:9000`	
      const res = await fetch('http://127.0.0.1:5000/app/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
      //Then no es necesario solo para comprobar si esta bien
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    })
    .then((res) => {
      id = res.id;
      //objeto res
      console.log(res)
      fullname = res.fullname
      inicioSesion = true

      //test store
      /*
      user.set(res)
      localStorage.setItem('user', JSON.stringify(res))
      navigate("/movies", {replace: true})*/
      
    })
    .catch((err) => {
      errorLogin = true
      mensajeError = "Usuario o contraseña incorrecto"
      console.error(`Error: ${err.message}`);
    });

  }else{
    errorLogin = true
    if(username == "" && password == ""){
      mensajeError = "Debes ingresar el usuario y contraseña"
    }else{
      if(username == ""){
        mensajeError = "Debes ingresar el usuario"
      }else{
        mensajeError = "Debes ingresar la contraseña" 
      }
    }
  }
}

  //Guarda en el store el user
  $:if(inicioSesion){
    user.set({
        username, password, id, fullname
    })
    localStorage.setItem('user', JSON.stringify({
      username, password, id, fullname
    }))
    console.log($user)
    if($user){
      navigate('/movies', {replace: true})
    }
  }

  //Registro
  async function handleOnSubmit(e){
    e.preventDefault()
    const res = await fetch('http://127.0.0.1:5000/app/add',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          fullname: fullname
        })
        //Then no es necesario solo para comprobar si esta bien
    }).then((res) => {
      if (res.ok) {
        abrirCardRegistrarse()
        return res.json();
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.error(`Error: ${err.message}`);
    });
  
  }

  function abrirCardRegistrarse(){
    registrarse = !registrarse
    username = "", password = "", fullname = ""
  }

</script>
  
  <div class={registrarse? "opacity: 100%;":"container"}>
    <div class="containerImg">
      <Logo></Logo>
    </div>
  
    <div class="containerInput">
      <Entrada identificador='usuario' nombreEtiqueta='Usuario' bind:value={username}></Entrada>
      <Entrada identificador='password' nombreEtiqueta='Contraseña' password={true} bind:value={password}></Entrada>
    </div>

    {#if errorLogin}
    <div class="errorLogin">
      <p> {mensajeError} </p>
    </div>
    {/if}
    
  
    <div class="containerBtn">
      <Btn nombreBtn='Ingresar' login={true} funcion={ingresar}></Btn>
    </div>

    <div class="containerRegistrar">
      <p class="registrarParrafo" > ¿No tienes cuenta? <button class="registrate" on:click={abrirCardRegistrarse}> Registrate </button> </p>
    </div>

    {#if registrarse}
       <!-- Card registrarse -->
      <div class="fondo">
        <RegisterCard funcionHandle={handleOnSubmit} nombreCard="Registro" bind:username={username} bind:password={password} bind:fullname={fullname} funcionBtnClose={abrirCardRegistrarse}></RegisterCard>
      </div>
       
    {/if}

</div>
  
  
  <style>
    .container{
      background-color: beige;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 6px 10px 0 rgba(216, 212, 212, 0.808), 0 6px 20px 0 rgba(247, 243, 243, 0.747);
    }
    .containerImg{
      
    }
    .containerInput{
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
    }
    .containerBtn{
      margin-top: 20px;
    }
    .registrate{
      color: blue;
      font-size: 1.2rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    .fondo{
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
  