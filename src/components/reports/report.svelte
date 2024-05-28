<script>
    import { Button, IconButton } from '$lib';
    import Api from '../../../helpers/ApiCall';
    import { snackbar } from '../../stores/store';

    export let id = 0;
    export let label = '';
    export let disabled = true;
    export let type = 'button';
    
    let downloadUrl = '';

    const reportArticle = async () => {
        
        let response = await Api.getReport(`report/article/${id}`);
        console.log('GET REPORT RESPONSE', response);
        if (response != null) {
            downloadUrl =  URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Reporte de artículos.pdf`//'report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); 
        }
        else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al descargar reporte."
                return snk
            })
        }
    }

</script>

{#if type == 'button'}
    <Button 
        secondary 
        leading="download" 
        {label}
        {disabled} 
        on:click={ reportArticle } 
    />
{:else}
    <IconButton  
        icon="download" 
        tooltipId="btn-report__{label.split(' ').join('_')}__{Math.random()}"
        tooltipText={label}
        on:click={ reportArticle } 
    />
{/if}

