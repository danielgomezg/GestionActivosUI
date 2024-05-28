<script>
    import Btn from '../components/btn.svelte' 
    import Entrada from '../components/input.svelte'
    export let funcionHandle
    export let nombreCard

    export let nombreMovie, duracionMovie, lanzamientoMovie, movieObj = {}
    export let accion = null
    export let funcionBtnClose
    let movie = {
       
    }

    $: movie.titulo = movieObj.titulo
    $: movie.duracion = movieObj.duracion
    $: movie.lanzamiento = movieObj.lanzamiento
    //$: console.log("$: " + movie.duracion)

    if(accion == "editar"){
        //console.log("addEdit " + movieObj.titulo)
        //console.log("addEdit id " + movieObj.id)
        movie = movieObj
        //movie = { titulo: movieObj.titulo, duracion: movieObj.duracion, lanzamiento: movieObj.lanzamiento}
    }
    

</script>

<div class="card">
    <div class="containerBtnClose">
        <button class="btnClose" on:click={funcionBtnClose}> <i class="mi mi-close"> </i></button>
    </div>
    
    <div class="titulo">
        <h1> {nombreCard} </h1>
    </div>

    <div class="containerForm">
        {#if accion != "editar"}
             <form on:submit={funcionHandle}>
                <div class="containerInput">
                    <Entrada identificador="nombreMovie" nombreEtiqueta="Nombre" bind:value={nombreMovie}/> 
                </div>

                <div class="containerInput">    
                    <Entrada identificador="tituloDuracion" nombreEtiqueta="Duracion" bind:value={duracionMovie}></Entrada> 
                </div>

                <div class="containerInput">
                    <Entrada identificador="tituloFecha" nombreEtiqueta="Fecha de lanzamiento" placeholder="AAAA-MM-DD" bind:value={lanzamientoMovie}></Entrada>
                </div>
                
                <div class="containerBtn">
                    <Btn nombreBtn="Añadir" ></Btn>
                </div>
            </form>
        {:else}
            <div class="containerInput">
                <Entrada identificador="nombreMovie" nombreEtiqueta="Nombre" bind:value={movieObj.titulo}/> 
            </div>

            <div class="containerInput">
                <Entrada identificador="tituloDuracion" nombreEtiqueta="Duracion" bind:value = {movieObj.duracion}></Entrada>  
             </div>

             <div class="containerInput">
                <Entrada identificador="tituloFecha" nombreEtiqueta="Fecha de lanzamiento" placeholder="AAAA-MM-DD" bind:value = {movieObj.lanzamiento}></Entrada> 
             </div>
             
             <div class="containerBtn">
                <Btn nombreBtn="Guardar" funcion={funcionHandle} objMovie={movie}></Btn>
            </div>
        {/if}
        
    </div>
    
    
</div>

<style>
    .card{
        background-color: beige;
        width: 500px;
        height: 350px;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
    }
    .containerBtnClose{
        display: flex;
        position: relative;
        align-items: end;
        justify-content: end;
        top: 1%;
        left: 45%;
    }
    .btnClose{
        border: none;
        border-radius: 30%;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 5px;
    }
    i{
        font-size: 20px;
    }
   
    .containerInput{
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
    }
    .containerBtn{
        margin-top: 15px;
        margin-bottom: 15px;
    }
</style>