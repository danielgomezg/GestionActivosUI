<script>
    import { Button, FileInput } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import { snackbar, user } from "../../stores/store";

    export let companyId = 0;

    let fileActive;
    let fileComponent;
    let selectedOffice = 0;
    let selectedSucursal = 0;

    let downloadPath = {
        sobrantes: {
            pdf: 'pdf/conciliacion/sobrantes',
            excel: 'excel/conciliacion/sobrantes'
        },
        iguales: {
            pdf: 'pdf/conciliacion/iguales',
            excel: 'excel/conciliacion/iguales'
        },
        faltantes: {
            pdf: 'pdf/conciliacion/faltantes',
            excel: 'excel/conciliacion/faltantes'
        }
    }

    const dowloadFile = async (type = '', format = '') => {
        try {
            console.log('DOWNLOAD FILE --> ', companyId)
            let response = (await Api.getReport(`active/report/${downloadPath[type][format]}`, { headers: { companyId }}));
            console.log('RESPONSE DOWNLOAD FILE --> ', response)
            if (response != null) {
                const downloadUrl = URL.createObjectURL(response);
                console.log(downloadUrl);

                const link = document.createElement('a');
                link.href = downloadUrl;
                let fileext = format == 'pdf' ? 'pdf' : 'xlsx';
                link.download = `Reporte de coinciliacion ${type}.${fileext}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            else {
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss';
                    snk.message = 'Error al descargar reporte.';
                    return snk;
                });
            }

            } catch (error) {
                snackbar.update(snk => {
                    snk.open = true;
                    snk.type = 'dismiss';
                    snk.message = 'Error al descargar reporte.';
                    return snk;
                });
                console.error(error);
            }
    }

    // FUNCION QUE SUBE EL ARCHIVO DE ACTIVOS TEORICOS.
    const upload = async () => {
        let msg = '';
        if (fileActive == null) {
            msg = 'Debe agregar un archivo';
        }
        
        if (msg != '') {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = msg
                return snk
            });
            return;
        }

        let formData = new FormData();
        formData.append('file', fileActive);
        let response = await Api.call(`/active/teorico/upload`, 'POST', { body: formData }, 'fileDoc', companyId);
        console.log('RESPONSE UPLOAD DOCUMENT --> ', response)
        if (response.statusCode == 200) {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'Archivo subido correctamente'
                return snk
            });
            fileActive = null;
            fileComponent.cleanValue();
        }
        else {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'Error al subir el archivo'
                return snk
            });
        }

    }

</script>

<div class="form">

    <FileInput 
        bind:this={ fileComponent }
        label="Archivo de activos" 
        required 
        accept={ ['csv'] }
        trailing="upload_file"
        helperText="Documento con formato csv."
        disabled={ $user.profile_id == 2 }
        on:change={ (e) => {
            console.log('file selected')
            console.log(e.detail)
            fileActive = e.detail 
        }}
    />

    <div></div>

    <div class="mobile-fixed">
        <Button 
            custom
            disabled={ $user.profile_id == 2 }
            label="Guardar"
            on:click={ upload }
        />
    </div>

    <h3 class="grid-col-span-1">Reportes de conciliación</h3>

    <table class="grid-col-span-2">
        <tr>
            <td>Activos sobrantes</td>
            <td>
                <Button 
                    customClass="pdf"
                    label="PDF"
                    type="outlined"
                    trailing="download"
                    on:click={ () => dowloadFile('sobrantes', 'pdf') }
                />
            </td>
            <td>
                <Button 
                    customClass="excel"
                    label="EXCEL"
                    type="outlined"
                    trailing="download"
                    on:click={ () => dowloadFile('sobrantes', 'excel') }
                />
            </td>
        </tr>
        <tr>
            <td>Activos iguales</td>
            <td>
                <Button 
                    customClass="pdf"
                    label="PDF"
                    type="outlined"
                    trailing="download"
                    on:click={ () => dowloadFile('iguales', 'pdf') }
                />
            </td>
            <td>
                <Button 
                    customClass="excel"
                    label="EXCEL"
                    type="outlined"
                    trailing="download"
                    on:click={ () => dowloadFile('iguales', 'excel') }
                />
            </td>
        </tr>
        <tr>
            <td>Activos faltantes</td>
            <td>
                <Button 
                    customClass="pdf"
                    label="PDF"
                    type="outlined"
                    trailing="download"
                    on:click={ () => dowloadFile('faltantes', 'pdf') }
                />
            </td>
            <td>
                <Button 
                    customClass="excel"
                    label="EXCEL"
                    type="outlined"
                    trailing="download"
                    on:click={ () => dowloadFile('faltantes', 'excel') }
                />
            </td>
        </tr>
    </table>

</div>