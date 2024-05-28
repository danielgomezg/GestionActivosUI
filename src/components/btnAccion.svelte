<script>
    export let fondoBtn
    export let icono
    export let funcionAccion
    export let idMovie, tituloMovie = null, duracionMovie = null, lanzamientoMovie = null
    export let accion = null

    let movie = {}

    if(accion == "eliminar"){
        movie = {
            id: idMovie
        }
    }else{
        movie = {
            id: idMovie,
            titulo: tituloMovie,
            duracion: duracionMovie,
            lanzamiento: lanzamientoMovie
        }
    }

    
</script>

<button style={`background-color: ${fondoBtn}`} on:click={funcionAccion(movie)}>
    <i class={icono}></i>
</button>

<style>
    button{
        border: none;
        border-radius: 5px;
        padding: 5px;
        cursor: pointer;
        box-shadow: 0 6px 10px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    button:hover{
        opacity: 40%;
    }
    i{
        font-size: 25px;
    }

</style>