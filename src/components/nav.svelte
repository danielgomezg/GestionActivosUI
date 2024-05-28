<script>
import { navigate } from "svelte-routing";
import { user } from "../stores/store"

function goToPerfil(){
    navigate("/perfil", {replace: true})
}

function goToMovies(){
    navigate("/movies", {replace: true})
}

function logOut(){
    // user.setUser(null)s
    localStorage.clear()
    navigate("/", {replace: true})
  }
</script>
<div class="container">
    <nav>
        <div class="inicioNav">
            <button class="movies" on:click={goToMovies}>
                Peliculas
                <i class="mi mi-image"></i>
            </button>
            <button class="perfil" on:click={goToPerfil}>
                <i class="mi mi-user"></i>
            </button>
        </div>
        <div class="containerSalir">
            <button class="logOut" on:click={logOut}>
                <i class="mi mi-log-out"></i>
            </button>
        </div>
    </nav>
</div>

<style>
    .container{
        position: absolute;
        background-color: black;
        top: 0%;
        left: 0%;
        width: 100vw;
    }
    nav{
        background-color: beige;
        display: flex;
        justify-content: space-between;
        padding: 10px 25px;
    }
    .movies{
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        background-color: rgb(140, 238, 101);
        font-size: 15px;
    }
    .movies:hover{
        background-color: green;
    }
    .inicioNav{
        display: flex;
        gap: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .perfil{
        border: none;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        background-color: yellow;
    }
    .perfil:hover{
        opacity: 40%;
    }
    .containerSalir{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 10px;
    }
    .logOut{
        border: none;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
        background-color: rgb(96, 208, 241);
    }
    .logOut:hover{
        background-color: red;
    }
    i{
        font-size: 30px;
    }
</style>