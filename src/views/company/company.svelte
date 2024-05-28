<script>
    import { navigate } from "svelte-routing";
    import { Select, Card, Button } from "$lib";
    
    import { session } from "../../stores/store";

    let loading = false, selectCompany;

    const goHome = () => {
        navigate("/home", {replace: true})
    }

    const selectedCompany = (company) => {
        console.log(company)
        session.update(s => {
            s.company = {
                name: company.value
            }
            return
        })
    }

</script>

<Card>
   
    <div class="logo-container theme-dark">
        <img
            src="/sca-logo-1.png"
            alt="logo"
        />
    </div>
    <div class="card-company__container">
        <h3>Seleccione empresa</h3>
        <Select
            label="Empresas"
            options={[]}
            on:change={ (event) => selectedCompany(event.detail) }
        />

        <br>
        <Button label="Continuar" { loading } on:click={ goHome } />

    </div>
</Card>

<style>
    .card-company__container {
        padding: 16px;
        display: flex;
        gap: 8px;
        flex-direction: column;
    }

    .logo-container {
        background-color: var(--mdc-theme-primary);
        border-radius: 12px 12px 0 0;
        padding: 16px;
    }
</style>
