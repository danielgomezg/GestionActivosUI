<script>
    import { onMount, onDestroy } from "svelte";
    import Login from "../login/login.svelte";
    import { navigate } from "svelte-routing";
    import { user } from "../../stores/store";
    import { Router, Route } from "svelte-routing";

    import { TopAppBar, NavigationDrawer, Snackbar } from "$lib";

    import NotFound from "../../components/notFound/notFound.svelte";
    import UserAccount from "../../components/userAccount/userAccount.svelte";
    import ContentActivo from "../../components/activos/contentActivo.svelte";
    import ContentCompany from "../../components/company/contentCompany.svelte";
    import ContentProfile from "../../components/profile/contentProfile.svelte";
    import ContentArticle from "../../components/articles/contentArticle.svelte";
    import ContentUsuarios from "../../components/usuarios/contentUsuarios.svelte";
    import ContentSucursal from "../../components/sucursal/contentSucursal.svelte";
    import ContentCategory from "../../components/categories/contentCategory.svelte";

    import CompanySelect from "../../components/company/companySelect.svelte";


    let open = true;
    let isMobile = false; 
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    function handleResize() {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    }

    onMount(() => {
        console.log('MOUNT HOME')
        isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        open = !isMobile

        window.addEventListener('resize', handleResize);

        let userSession = sessionStorage.getItem("user")
        let token = sessionStorage.getItem("accessToken")

        if (user != null && token != null) {
            user.set(JSON.parse(userSession))
        }
        else {
            navigate("/login", {replace: true})
            return;
        }
    })

    onDestroy(() => {
        window.removeEventListener('resize', handleResize);
    });


    $: isMobile = windowWidth < 500 
    
</script>

{#if Object.keys($user).length != 0 }
<TopAppBar on:openNav={ () => open = !open }  >
    <div slot="company">
        <CompanySelect version="2" />
        <!-- <h1 class="company-name">Master-G</h1> -->
    </div>
    <div slot="account" class="flex-row align-center">
        <UserAccount />
    </div>
</TopAppBar>
{/if}
<main class="main">
        {#if Object.keys($user).length != 0 }
            <NavigationDrawer     
                bind:open={open}
            />
        {/if}
        <div class="main-content" >
            <Snackbar />
            <!-- <svelte:component this={ContentCompany} /> -->
            <Router>  
                <Route path="/login" component={Login} />
                {#if $user?.profile_id == 1}
                     <Route path="/empresas" component={ContentCompany}  />
                {/if}
                
                {#if $user?.profile_id == 1 || $user?.profile_id == 3} 
                <Route path="/usuarios" component={ContentUsuarios} />
                <Route path="/perfiles" component={ContentProfile}  />
                {/if} 
                
                {#if $user?.profile_id == 2} 
                    <Route path="/sucursales" component={ContentSucursal} />
                {/if} 
                                
                <Route path="/articulos" component={ContentArticle} />
                <Route path="/activos" component={ContentActivo} />
                <Route path="/categorias" component={ContentCategory} />
                <Route path="/*" component={NotFound} />
            </Router>
        </div>
</main>

