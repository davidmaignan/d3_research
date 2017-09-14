const handlerError = (response) => {
    console.log("error")
}
const getHandler = (response) => {
    console.log(response)
}
const fetchApi = (url, opts, handlerSuccess) =>
    fetch(url, opts)
    .then((res)  => {
        let handler = (res.status >= 200 && res.status < 300) ? handlerSuccess : handlerError
        res.json().then(handler).catch(handlerError)
    })
    .catch(handlerError({'title': "Une erreur est survenue", "message": "Un problème de connection avec le serveur. Vérifier votre connection !"}))
const fetchTSIO = (url) => fetchApi(url,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
      }
  }, getHandler)

fetchTSIO('http://localhost-wcm.airtransat.com/en-CA/Services/TSIO/GetData')
