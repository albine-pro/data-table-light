## data-table-light.js

light weight bootstrap styling js plugin for tables


## Initialization

Plugin needs bootstrap style by default or you may use your own. No need jQuery or other libraries. CSS file just need for responsive option


</br>

```html
npm install data-table-light
```

OR

```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
<link rel="stylesheet" href="dist/data-table-light.min.css">

<script type="text/javascript" src="dist/data-table-light.min.js"></script>
```
</br>


## Basic usage

```html
<div class="wrap">
   <table id="test_table"></table>
</div>
```

```js

const mockData = [
	{
		text: 'Lorem ipsum dolor sit amet, consectetur',
		price: 15
	},
	{
		text: 'Consequuntur soluta nihil tenetur nulla',
		price: 25
	},
	{
		text: 'Laborum a neque',
		price: 35
	}
]

new DataTableLight({
	tableId: '#test_table',
	tHead: ['#','text', 'price'],
	index: true,
    data: mockData
})

```
<h3>
	<a href="https://demo.webexp.site/data-table-light">Other examples</a>
</h3>
</br>


## Options


| Name              | Description                                                                                                                                 | Default             | Other
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -----------------
| <b>properties</b> |                                                                                                                                             |  -                  |  -
| tableId           | Table ID                                                                                                                                    | null                | selector 
| tHead             | List of table header fields                                                                                                                 | empty array         | headings array
| data              | Raw data in json or data with fields ( see <a href="https://demo.webexp.site/data-table-light#example-2" target="_blank">Example 2</a> )    | empty array         | data array, data object
| rowsPerPage       | Table rows on the page                                                                                                                      | 10                  | 25, 50, 100
| trTemplate        | Template of table row                                                                                                                       | null                | template string
| index             | If table lines must be numbered (doesn't need with trTemplate)                                                                              | false               | true
| lang              | Interface language                                                                                                                          | 'en'                | 'ru', 'de'            
| responsive        | Make table responsive for mobile ( see <a href="https://demo.webexp.site/data-table-light#example-5" target="_blank">Example 5</a> )        | false               | true             
| fieldsHandler     | Object. Takes as parameter name of field as a function and return and set new data in this field ( see demo file )                          | empty object        |  -   
| <b>methods</b>    |                                                                                                                                             |  -                  |  -
| new(data)         | Redraw table with new async data                                                                                                            |  -                  |  -  
| onLayoutChange()  | Do smth when table lauout is changed (after table is initially loaded, clicking on prev-next-num button or load new data)                   |  -                  |  -  
</br>


## IE Support
10 (no responsive)
</br>


## License

MIT         					
