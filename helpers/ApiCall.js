class Api {

    static getTokenFromLocalStorage() {
        // return localStorage.getItem('accessToken');
        return sessionStorage.getItem('accessToken');
    }

    static call(url = '', method = 'GET', body = {}, type = 'json', cpnId = 0) {
        
        
        let token = Api.getTokenFromLocalStorage();
        

        let params = { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'companyId': cpnId
            },
            ...body
        }
        // Si type es file se quita Content-Type del header
        if (type == 'file' || type == 'fileDoc') {
            delete params.headers['Content-Type']
        }

        // url = `${process.env.REACT_APP_API_URL}${url}`
        console.log(import.meta.env.MODE)
        if (import.meta.env.MODE == 'production') {
            url = `https://45-33-99-148.ip.linodeusercontent.com/api/${url}`
        }
        else {
            // url = `http://127.0.0.1:9000${url}`	
            url = `http://192.168.100.9:9000${url}`	
        }
        
        return fetch(url, {
            method,
            ...params
        })
        .then(response => {
            // console.log(response)

            let statusCode = response.status

            if (type == 'fileDoc') {
                return response.blob().then(data => {
                    return { success: true, statusCode, data }
                })
            }

            return response.json().then(data => {
                
                // console.log(data)
                
                if (statusCode == 401 && data.message == 'token-exp') {
                    // localStorage.removeItem('user');
                    // localStorage.removeItem('accessToken');
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('accessToken');
                    window.location.href = '/login'
                    return;
                }
                else {
                    if (data.code == '401' && data.message == 'token-exp') {
                        // localStorage.removeItem('user');
                        // localStorage.removeItem('accessToken');
                        sessionStorage.removeItem('user');
                        sessionStorage.removeItem('accessToken');
                        window.location.href = '/login'
                        return;
                    }
                    return { success: true, statusCode: data.code, data }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error)
            return { success: false, statusCode: 500 }
        });

    }

    static callImage(path = '') {
        
        let host = '';
            if (import.meta.env.MODE == 'production') host = `https://45-33-99-148.ip.linodeusercontent.com/api`
            else host = `http://192.168.100.9:9000`	
            return fetch(`${host}${path}`)
                .then(response => response.blob())
                .then(images => {
                    console.log('IMAGES -> ', images)
                    let objectURL = URL.createObjectURL(images);
                    console.log('OBJECT URL -> ', objectURL)
                    return objectURL;

                })
                .catch(error => {
                    console.error(error)
                    return null;
                });
    }

    static getReport(path = '', params = {}) {

        let host = '';
        if (import.meta.env.MODE == 'production') host = `https://45-33-99-148.ip.linodeusercontent.com/api`
        else host = `http://192.168.100.9:9000`

        let token = Api.getTokenFromLocalStorage();

        let headers = { 'Authorization': `Bearer ${token}` }
        // Merge headers with params.headers
        if (params.headers) {
            headers = { ...headers, ...params.headers }
        }
        
        return fetch(`${host}/${path}`, { method: 'GET', headers })
            .then(response => response.blob())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.log(error)
                return null;
            });
    }

}

export default Api