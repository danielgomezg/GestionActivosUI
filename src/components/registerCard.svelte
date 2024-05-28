<script>
    import Btn from '../components/btn.svelte' 
    import Entrada from '../components/input.svelte'
    export let nombreCard
    export let funcionHandle = null
    export let username, password, fullname
    export let funcionBtnClose
    

</script>

<div class="card">
    <div class="containerBtnClose">
        <button class="btnClose" on:click={funcionBtnClose}> <i class="mi mi-close"> </i></button>
    </div>
    
    <div class="titulo">
        <h1> {nombreCard} </h1>
    </div>

    <div class="containerForm">
             <form on:submit={funcionHandle}>
                <div class="containerInput">
                    <Entrada identificador="username" nombreEtiqueta="Nombre de usuario" bind:value={username}/> 
                </div>

                <div class="containerInput">    
                    <Entrada identificador="password" nombreEtiqueta="Contraseña" bind:value={password}></Entrada> 
                </div>

                <div class="containerInput">
                    <Entrada identificador="fullname" nombreEtiqueta="Nombre completo" bind:value={fullname}></Entrada>
                </div>
                
                <div class="containerBtn">
                    <Btn nombreBtn="Crear usuario" ></Btn>
                </div>
            </form>
    </div>
    
</div>

<style>
    .card{
        background-color: beige;
        width: 500px;
        height: 450px;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
    }
    .titulo{
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        bottom: 5%;

    }
    .containerBtnClose{
        display: flex;
        position: relative;
        align-items: end;
        justify-content: end;
        bottom: 8%;
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