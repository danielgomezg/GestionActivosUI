<script>
    import Nav from "../components/nav.svelte";
    import Input from "../components/input.svelte";
    import { user } from "../stores/store";
    import Btn from "../components/btn.svelte";
    
    //Datos de usuario
    let username = $user.username 
    let password = $user.password
    let fullname = $user.fullname
    let id = $user.id

    let oculto = true
    function checkear(){
        oculto = !oculto
    }

    async function editarUser(){
    //console.log("movie: " + pelicula.id)
    let url = 'http://127.0.0.1:5000/app/update/' + id
    const res = await fetch(url,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          username: username,
          password: password,
          fullname: fullname
        })
        //Then no es necesario solo para comprobar si esta bien
    }).then((res) => {
      if (res.ok) {
        guardarStore()
        return res.json();
      } else {
        //idMovie = null, nombreMovie = null, duracionMovie = null, lanzamientoMovie = null
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

//Guarda en el store el user
    function guardarStore(){
        // user.setUser({
        //     username, password, fullname, id
        // })
        localStorage.setItem('user', JSON.stringify({
        username, password, fullname, id
        }))
        console.log($user)
    }
</script>

<Nav></Nav>
<div class="container">
    <div class="logoUser">
        <i class="mi mi-user"></i>
    </div>
    <h1> Perfil </h1>

    <div class="datos">
        <div class="containerInput">    
            <Input identificador="username" nombreEtiqueta="Nombre de usuario" bind:value={username}></Input>
        </div>
        <div class="containerInput">
            {#if oculto}
                 <!-- oculta la contraseña -->
                 <Input identificador="password" nombreEtiqueta="contraseña" bind:value={password} password={oculto}></Input>
            {:else}
                 <!-- sin ocultar -->
                 <Input identificador="password" nombreEtiqueta="contraseña" bind:value={password}></Input>
            {/if}
        </div>
        <div class="containerInput">
            <div class="containerCheck">
                <input class="check" type="checkbox" id="check" on:click={checkear} checked>
                <label for="check">Ocultar contraseña</label>    
            </div>
        </div>
        <div class="containerInput">    
            <Input identificador="fullname" nombreEtiqueta="Nombre completo" bind:value={fullname}></Input>
        </div>
        
        <div class="containerBtn">
            <Btn nombreBtn="Guardar cambios" funcion={editarUser} login={true}></Btn>
        </div>
    </div>
</div>



<style>
    .container{
        background-color: beige;
        padding: 60px 70px;
        border-radius: 10px;
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    i{
        font-size: 120px;
    }
    .logoUser{
        border: 4px solid black;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    h1{
        font-size: 50px;
    }
    .containerInput{
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
    }
    .check{

    }
    input{
    border-radius: 5px;
   }
   .containerCheck{
    display: flex;
    gap: 10px;
   }

   .containerBtn{
    display: flex;
    padding-top: 30px;
    width: 100%;
    align-items: center;
    justify-content: end;
   }

</style>