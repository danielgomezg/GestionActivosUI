<script>
    import { Select, IconButton } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import { companySelect, companySelectName, lockOffice, lockStore, lockArticle } from "../../stores/store";
    import { onMount, createEventDispatcher, onDestroy } from "svelte";

    export let selected = ''
    export let customHeight = false
    export let version = 1

    let count = 0;
    let offset = 0;
    let limit = 50;
    let companies = []
    let showList = false;
    let nameCompany = '';
    let showChange = false;
    let dispatch = createEventDispatcher();

    const handleAccountOptions = (event) => {
        if (showList && !event.target.closest('.change-company__container')){
            showList = false
        }
    }

    const getNameCompany = async (companyId) => {
      
      const response = await Api.call(`/company/${companyId}`, 'GET');
      console.log("company name", response);
      if (response.success && response.statusCode == '200') {
        nameCompany = response.data.result.name;
      }
    }

    //Se obtiene las companias con el id y nombre solamente
    const getCompanyNameId = async () => {
        let response = (await Api.call(`/companiesIdName?limit=${limit}&offset=${offset}`, 'GET'))
        console.log('RESPONSE GET COMPANIES --> ', response)
        if (response.success && response.statusCode == '200') {
            companies = response.data.result.map(r => { return { label: r.name, value: r.id } })
            count = response.data.count
        } 
    }

    onMount(() => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (user.profile_id == 2) {
            // companyId = user.company_id;
            getNameCompany(user.company_id)
            companySelect.set(user.company_id)
        }
        else {
            showChange = true;
        }
        getCompanyNameId();
        window.addEventListener('click', handleAccountOptions)
    })

    onDestroy(() => {
        window.removeEventListener('click', handleAccountOptions);
    });

    $: nameCompany = $companySelectName
    $: if ($companySelect != 0) {
        lockStore.set(0)
        lockOffice.set(0)
        lockArticle.set(0)
    }

</script>

{#if version == 1}

    {#key companies}

        <Select     
            on:change={e => {
                console.log('select cpm e.detail --> ', e.detail)
                if (e.detail == '') return;
                dispatch('name', companies.find(c => c.value == e.detail).label)
                dispatch('change', e.detail)
            }}
            {selected}
            {customHeight}
            label="Empresa"
            options={ companies }
        />

    {/key}

{:else}

    <div class="change-company__container">
        {#if showChange}
            <IconButton 
                icon="change_circle" 
                tooltipId="btn-change__company" 
                tooltipText="Cambiar compañia" 
                on:click={ () => showList = !showList } 
            />
        {/if}
        <h1 class="company-name">{ nameCompany }</h1>
        {#if showList}
            <ul class="list-companies">
                {#each companies as company}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <li
                        on:click={ () => {
                            companySelect.set(company.value)
                            nameCompany = company.label
                            showList = false
                        }}
                    >
                        {company.label}
                    </li>
                {/each}        
            </ul>
        {/if}
    </div>

{/if}

<style>
    .company-name {
        margin: 0;
        /* margin-left: 20px; */
        /* border-left: solid 1px white; */
        padding-left: 5px;
        font-size: 20px;
        line-height: 20px;
    }

    .change-company__container {
        display: flex;
        align-items: center;
        position: relative;
        border-left: solid 1px white;
    }

    .list-companies {
        position: absolute;
        right: 0;
        top: 100%;
        left: 0;
        background-color: #FFF;
        color: black;
        z-index: 5;
        width: 170px;
        list-style: none;
        padding: 0;
        /* bottom: 0; */
        margin: 0;
        border-radius: 5px;
        overflow-y: auto;
        max-height: 270px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    }

    li {
        padding: 10px;
        cursor: pointer;
        /* border-bottom: 1px solid #e5e5e5; */
    }

</style>

