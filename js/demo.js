 /*

    TABLE

*/
 const template = `
    <tr>
        <td>{{ index }}</td>
        <td>{{ name }}</td>
        <td>{{ capital }}</td>
        <td >
            <a href="{{ flag }}" target="_blank">
                <img src="{{ flag }}" width="50" />
            </a>
        </td>
        
    </tr>
`

const dataTableLight = new DataTableLight({
    tableId: '#test_table',
    tHead: ['#','name','capital','country flag'],
    rowsPerPage: 10,
    trTemplate: template,
    responsive: true
})


const langES = 'https://restcountries.eu/rest/v2/lang/es'
const langEN = 'https://restcountries.eu/rest/v2/lang/en'

const getData = (query) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.addEventListener('readystatechange', (e) => {
    if (e.target.readyState === 4 && e.target.status === 200) {
        const data = JSON.parse(e.target.responseText)
            resolve(data)
        } else if (e.target.readyState === 4) {
            reject('An error has taken place')
        }
    })
    request.open('GET', query)
    request.send()
})                              
                                                                
getData(langES).then((data) => {
    dataTableLight.new(data)
}, (err) => {
    console.log(`Error: ${err}`)
})
  


/*

    DEMO BUTTONS

*/
const btn1 = document.getElementsByTagName('button')[0]
const btn2 = document.getElementsByTagName('button')[1]

btn1.addEventListener('click',(e)=>{
    e.preventDefault()   
    getData(langEN).then((data) => {

        // REDRAW TABLE WITH NEW DATA
        dataTableLight.new(data)

        btn2.removeAttribute('disabled')
        btn1.setAttribute('disabled','disabled')

    }, (err) => {
        console.log(`Error: ${err}`)
    })

},false)
   
btn2.addEventListener('click',(e)=>{

    getData(langES).then((data) => {

        // REDRAW TABLE WITH NEW DATA
        dataTableLight.new(data)

        btn1.removeAttribute('disabled')
        btn2.setAttribute('disabled','disabled')

    }, (err) => {
        console.log(`Error: ${err}`)
    })

},false)