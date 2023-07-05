import {getAccessToken} from '../lib/CheckAuth';
async function request(method,url,payload_data,success){
    let res
    try {
      await getAccessToken()
      const access_token = localStorage.getItem("access_token")
      const attrs = {
        method: method,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        
      }
      if (method !== 'GET'){
        attrs.body = JSON.stringify(payload_data)
        }
      res = await fetch(url,attrs);
      let data = await res.json();
      if (res.status === 200) {
        success(data)
      } else {
        setErrors(data)
        console.log(res, data)
      }
    } catch (err) {
      if (err instanceof Response) {
        console.log('HTTP error detected:', err.status);
        setErrors([`generic_${err.status}`])
      } else {
          setErrors([`generic_500`])
    }
  }
}
export function post(url,payload_data,success){
    request('POST',url,payload_data,success)
    
}
export function put(url,payload_data,success){
    request('PUT',url,payload_data,success)
    
}

export function get(url,success){
    request('GET',url,null,success)
    
}

export function destroy(url,payload_data,success){
    request('DELETE',url,payload_data,success)
    
}