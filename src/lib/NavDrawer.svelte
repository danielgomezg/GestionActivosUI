<script>
    import { onMount } from "svelte";
    import { user, menu } from "../stores/store";
    import { Link, Router } from "svelte-routing";
    import { MDCDrawer } from "@material/drawer";
    import { MDCList } from "@material/list";

    export let open = false;

    let drawerList;
    let selected = '';
    let drawerComponent;
    let menuProfile = [];


    const displayMenu = (menu) => {
        // console.log(menu)
        // console.log($user)
        if (user == null) return

        let mnu_filter = menu.filter(mnu => mnu.profiles.includes(parseInt($user.profile_id)))
        menuProfile = [...mnu_filter]
        
    }

    onMount(() => {
        // const drawer = MDCDrawer.attachTo(drawerComponent);
        // const list = MDCList.attachTo(drawerList);
        // list.wrapFocus = true;

        // const listEl = document.querySelector('.mdc-drawer .mdc-list');
        // const mainContentEl = document.querySelector('.main-content');

        // listEl.addEventListener('click', (event) => {
        //     mainContentEl.querySelector('input, button').focus();
        // });

        // document.body.addEventListener('MDCDrawer:closed', () => {
        //     mainContentEl.querySelector('input, button').focus();
        // });

        selected = window.location.pathname
    })

    $: if($user != {}) displayMenu($menu) 

</script>
<aside 
    bind:this={drawerComponent}
    class="mdc-drawer mdc-drawer--modal mdc-drawer--size" 
    class:open={ open }
    >
    <div class="mdc-drawer__content">
        <nav bind:this={drawerList} class="mdc-list">
            <Router>
                {#each menuProfile as navigation }
                    
                    <Link 
                        to="{navigation.path}" 
                        style="color: inherit; text-decoration: none;" 
                        on:click={() => {
                            selected = navigation.path
                            if (window.innerWidth <= 600) { // Asume que los dispositivos con un ancho de ventana de 768px o menos son móviles
                                open = false;
                            }
                        } }>
                        <div class="mdc-list-item--drawer" class:mdc-list-item--activated={ selected == navigation.path } >
                            <span class="mdc-list-item__ripple"></span>
                            <span class="material-symbols-rounded">{navigation.icon}</span>
                            <span class="mdc-list-item__text">{navigation.name}</span>
                        </div>
                    </Link>
                    
                {/each}

            </Router>   
        </nav>
    </div>
</aside>

<style>
    .open {
        display: block;
    }

    /* .mdc-drawer { 
        top: 64px;
    } */

    .mdc-drawer--modal{
        box-shadow: none;
        /* z-index: 11; */
        z-index: 4;
    }

    .mdc-list-item__text {
        text-transform: capitalize;
    }

</style>
  