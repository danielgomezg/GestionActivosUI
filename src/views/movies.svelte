<script>
  import { onMount, afterUpdate } from "svelte";
  import Btn from '../components/btn.svelte'
  import AddCard from "../components/addCard.svelte";
  import BtnAccion from "../components/btnAccion.svelte";
  import {user} from "../stores/store"
  import { navigate } from "svelte-routing";
  import Nav from "../components/nav.svelte";
  
  //console.log($user.id)
  //console.log($user.username)
  //test store
  /*
  let userStore = false
  $: if(userStore && $user){
  console.log("aca")
  window.sessionStorage.setItem("user", JSON.stringify($user))
  }*/


  let nombreMovie = null, duracionMovie = null, lanzamientoMovie = null
  //para eliminar y editar
  let idMovie
  let movieObj = {}

  let movies = []
  onMount(async ()=> {
    if(!$user){
      navigate('/', {replace: true})
    }else{
      const res = await fetch(`http://127.0.0.1:5000/api/movies/`)
      movies = await res.json()

    }
  })
  
  //actualiza los datos cuando se hace post
  afterUpdate(async ()=> {
    if(nombreMovie != null && duracionMovie != null && lanzamientoMovie != null){
      const resAfter = await fetch(`http://127.0.0.1:5000/api/movies/`)
      movies = await resAfter.json()
    }
    else if(idMovie != null){
      const resAfter = await fetch(`http://127.0.0.1:5000/api/movies/`)
      movies = await resAfter.json()
    }

    if(!$user){
      navigate("/", {replace: true})
    }
    //test store
    /*
    let ses = window.sessionStorage.getItem("user")
    if(ses){
      console.log("loading " + ses)

      $user = JSON.parse(ses)
    }
    userStore = true*/
    
  })
  
  //abrir ventanas
  let addMovie = false;
  let editMovie = false
  
  function abrirVentanaAdd(){
    addMovie = !addMovie
  }
  
  function abrirVentanaEdit(movie){
    idMovie = movie.id
    editMovie = !editMovie
    movieObj = movie
  }
  
  async function handleOnSubmit(e){
    e.preventDefault()
    const res = await fetch('http://127.0.0.1:5000/api/movies/add',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: nombreMovie,
          duracion: duracionMovie,
          lanzamiento: lanzamientoMovie
        })
        //Then no es necesario solo para comprobar si esta bien
    }).then((res) => {
      if (res.ok) {
        nombreMovie = null, duracionMovie = null, lanzamientoMovie = null
        abrirVentanaAdd()
        return res.json();
      } else {
        nombreMovie = null, duracionMovie = null, lanzamientoMovie = null
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
  
  async function eliminarMovie(movie){
    idMovie = movie.id 
    let url = 'http://127.0.0.1:5000/api/movies/delete/' + movie.id
    const res = await fetch(url,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: movie
        //Then no es necesario solo para comprobar si esta bien
    }).then((res) => {
      idMovie = null
      if (res.ok) {
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
  
  async function editarMovie(pelicula){
    //console.log("movie: " + pelicula.id)
    let url = 'http://127.0.0.1:5000/api/movies/update/' + pelicula.id
    const res = await fetch(url,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pelicula.id,
          titulo: pelicula.titulo,
          duracion: pelicula.duracion,
          lanzamiento: pelicula.lanzamiento
        })
        //Then no es necesario solo para comprobar si esta bien
    }).then((res) => {
      if (res.ok) {
        idMovie = null, nombreMovie = null, duracionMovie = null, lanzamientoMovie = null
        editMovie = !editMovie
        return res.json();
      } else {
        idMovie = null, nombreMovie = null, duracionMovie = null, lanzamientoMovie = null
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
  
  </script>
  
  {#if $user}
     <!-- si existe usuario (realizando pruebas) -->
    <Nav></Nav>
  <div class={addMovie ? "containerOpaco" : "container"}>
    <h1> Bienvenido <span>{$user.fullname}!</span> </h1>
    <h3> Lista de peliculas </h3>
    <div class="containerBtn">
      <Btn nombreBtn="Agregar pelicula" funcion={abrirVentanaAdd}></Btn>
    </div>
    <div class="containerTabla">
      <table>
        <thead>
          <tr class="headTable">
            <th class="tituloTable">
              N°
            </th>
  
            <th class="tituloTable">
              Nombre
            </th>
            <th class="tituloTable">
              Duracion (min)
            </th>
            <th class="tituloTable">
              Fecha de lanzamiento
            </th>
            <th class="tituloTable">
              Editar
            </th>
            <th class="tituloTable">
              Eliminar
            </th>
          </tr>
        </thead>
        <tbody>
          {#each movies as item, index}
          <tr>
            <td class="datoTable">
              {index + 1}
            </td>
            <td class="datoTable">
              {item.titulo}
            </td>
            <td class="datoTable">
              {item.duracion}
            </td>
            <td class="datoTable">
              {item.lanzamiento}
            </td>
            <td class="datoTable">
              <BtnAccion fondoBtn="yellow" icono="mi-edit" funcionAccion={abrirVentanaEdit} idMovie = {item.id} tituloMovie={item.titulo} duracionMovie={item.duracion} lanzamientoMovie={item.lanzamiento} accion = "editar"></BtnAccion>
            </td>
            <td class="datoTable">
              <BtnAccion fondoBtn="red" icono="mi-delete" funcionAccion={eliminarMovie} idMovie = {item.id} accion = "eliminar"></BtnAccion>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  
  {#if addMovie == true}
    <div class="fondo">
      <AddCard funcionHandle={handleOnSubmit} bind:nombreMovie={nombreMovie} bind:duracionMovie={duracionMovie} bind:lanzamientoMovie={lanzamientoMovie} nombreCard="Nueva pelicula" funcionBtnClose={abrirVentanaAdd}></AddCard>
    </div>
  {/if}
  
  {#if editMovie == true}
    <div class="fondo">
      <AddCard funcionHandle={editarMovie} bind:nombreMovie={nombreMovie} bind:duracionMovie={duracionMovie} bind:lanzamientoMovie={lanzamientoMovie} {movieObj} accion="editar" nombreCard="Editar pelicula" funcionBtnClose={()=> editMovie = !editMovie}></AddCard>
    </div>
  {/if}

  {/if}
  <style>
    h1{
      text-transform: capitalize;
      font-size: 4rem;
    }
    span{
      color: blue;
    }
    h3{
      font-size: 2rem;
    }
    .containerOpaco{
      opacity: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .container{
      opacity: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      }
    table{
      border: #b2b2b2 1px solid;
    }
    td, th {
      border: black 1px solid;
    }
    .containerTabla{
      margin: 20px;
    }
  
    .tituloTable{
      padding: 10px 25px;
    }
  
    .datoTable{
      padding: 15px;
    }
    .containerBtn{
      margin: 30px 20px 10px 0px;
      display: flex;
      justify-content: end;
      width: 100%;
      
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