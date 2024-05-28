<script>
    // @ts-ignore
    import { IconButton } from "$lib";
    import Api from "../../helpers/ApiCall";
    // import { user } from "../stores/store";
    import { MDCTopAppBar } from '@material/top-app-bar';
    import { createEventDispatcher, onMount } from 'svelte';

    let topAppBarComponent
    let nameCompany = ''

    let dispatch = createEventDispatcher();

    const getNameCompany = async (companyId) => {
      
      const response = await Api.call(`/company/${companyId}`, 'GET');
      console.log("company name", response);
      if (response.success && response.statusCode == '200') {
        nameCompany = response.data.result.name;
      }
    }

    onMount(() => {  
      if (topAppBarComponent == undefined) return;   
      const topAppBar = new MDCTopAppBar(topAppBarComponent);

      let user = sessionStorage.getItem("user");
      user = JSON.parse(user);
      console.log("top app bar user", user);
      if (user.profile_id == 2) {
        getNameCompany(user.company_id)
      }
    })


</script>

<!-- {#if $user} -->
<header bind:this={topAppBarComponent} class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <div class="mobile-only">
          <IconButton icon="menu" on:click={ () => dispatch("openNav") } />
        </div>
        <div class="img-container">
          <img
            src="/sca_logo_3.png"
            alt="logo"
          />
        </div>

        <!-- {#if nameCompany != ''}
          <h1 class="company-name">{nameCompany}</h1>
        {/if} -->
        <slot name="company" />
      </section>
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
        <slot name="account" />
      </section>
    </div>
</header>
<!-- {/if} -->

<style>
  .mdc-top-app-bar{
    z-index: 6;
  }
  /* .img-container {
    height: 100%;
  } */

  /* img {
    height: 100%;
  }

  .company-name {
    margin: 0;
    margin-left: 20px;
    border-left: solid 1px white;
    padding-left: 20px;
  } */

</style>