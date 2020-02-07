/* * * * * * * * * * * * * * * * * * * * * * *
 * data-table-light.js v1.0.0
 * https://github.com/just-den/data-table-light
 * Albine ( Denis Zatishnyi ) (c) 2019
 * * * * * * * * * * * * * * * * * * * * * * */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.DataTableLight = factory());
}(this, function () { 'use strict';

 	function $DataTableLight() {

        // весь массив данных
        this.filteredData = []

        // массив данных выводимый на страницу ( не больше rowsPerPage )
        this.filteredDataPerPage = []

        // пагинация
        this.offset = 0

        this.selectValues = [10, 25, 50, 100]

        this.messagesLocal = {
            en: {
                next: 'next',
                prev: 'prev',
                show: 'show',
                search: 'search',
                errorInitTable: 'There is no table found'
            },
            ru: {
                next: 'далее',
                prev: 'назад',
                show: 'показать',
                search: 'поиск',
                errorInitTable: 'Таблица не найдена'
            }
        }

        this.messages = this.messagesLocal['en']

        let defaults = {
            tableId: null, // id таблицы
            tHead: [],
            data: [],
            rowsPerPage: 10,
            trTemplate: null,
            index: null, // для шаблонов не указывается
            lang: 'en', // en, ru
            responsive: false,
			fieldsHandler: {},
			onLayoutChange: null
        }


        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        this.table = document.querySelector(this.options.tableId)
		
		tableInit.call(this)

        setLang.call(this)
        setRowsPerPage.call(this)

        
        // layout
        tableResponsive.call(this)
        theadLayout.call(this)
        tbodyLayout.call(this)

        // data
        dataValidation.call(this)

        // build and rebuild table body with data 
        buildOut.call(this)

    }

    // перезаписываем переданные настройки ( если они есть )
    function extendDefaults(source, properties) {
        let property
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property]
            }
        }
        return source;
    }
	
	
	// инициализация таблицы
	function tableInit(){
		
		this.table = document.querySelector(this.options.tableId)
		if( !this.table ){
			try{
				throw new Error(this.messages.errorInitTable)
			}catch(e){
				console.log('Data Table Light ERROR: ',e.message)
			}
		}		
	}


    // проверяем заданное пользователем значений строк на странице по умолчанию
    // если оно не соотв заданным пар-рам, определяем по умолчанию
    function setRowsPerPage() {

        const rowsPerPage = Number(this.options.rowsPerPage)

        this.options.rowsPerPage = this.selectValues.find(value => value === rowsPerPage) ? rowsPerPage : 10

    }


    function setLang() {
        for (let i in this.messagesLocal) {
            if (i === this.options.lang) {
                this.messages = this.messagesLocal[i]
                break
            }
        }
    }


    // адаптивность: установка класса и перерисовка шаблона
    function tableResponsive(){

        if( this.options.responsive ){

            addClass(this.table,'dtl-responsive')           

            let template = this.options.trTemplate

            if( this.options.trTemplate ){

                const theads = this.options.tHead

                for( const i in theads  ){

                    const rs = '(<\s*?td(?!.*dtl-td-title).*?>)(.*?)'
                    const r = new RegExp(rs, 'i')
                    const s = theads[i] ? `<span class="dtl-td-title">${theads[i]}</span>` : '<span class="dtl-td-title-skip"></span>'
                    this.options.trTemplate = this.options.trTemplate.replace(r, `$1${s}$2`) 

                }
            

            }

        }
    }

    // отрисовка заголовков
    function theadLayout() {

    	// если селектора таблицы нет в DOM
    	if(!this.table){ return }

        const tHeadTitles = this.options.tHead
        let tHeadTemplate = `<thead><tr>`
        if (typeof tHeadTitles === 'object' && tHeadTitles.length > 0) {
            tHeadTitles.forEach((title) => {
                const t = title ? title : ''
                tHeadTemplate += `<th>${t}</th>`
            })
        }
        tHeadTemplate += `</tr></thead>`
        try{
            this.table.insertAdjacentHTML('beforeend', tHeadTemplate)
        }catch(e){
            console.log('Data table Light ERROR: ',e.message)
        }
        

    }

    // отрисовка тела
    function tbodyLayout() {

    	// если селектора таблицы нет в DOM
    	if(!this.table){ return }

        try{
             this.table.insertAdjacentHTML('beforeend', `<tbody></tbody>`)
             this.tableBody = this.table.tBodies[0]           
        }catch(e){
            console.log('Data table Light ERROR: ',e.message)
        }
    }

    // переприсваиваем массив данных, если он передан сам по себе или с выводимыми полями
    function dataValidation() {

        if (typeof this.options.data === 'object') {

            this.filteredData = typeof this.options.data.output !== 'undefined' ? this.options.data.output : this.options.data

        }

    }


    function addClass(el, className) {

    	// если селектора нет в DOM
    	if(!el){ return }

        if (className) {
            className = className.split(' ')
            let classes = []
            for (let i = 0; i < className.length; i++) {
                const temp = className[i].trim()
                classes.push(temp)
            }
            if (typeof classes === 'object' && classes.length !== 0) {
                try {
                    if (el.classList)
                        for (let i = 0; i < classes.length; i++) {
                            el.classList.add(classes[i])
                        }
                    else
                        for (let i = 0; i < classes.length; i++) {
                            el.classes += ' ' + classes
                        }
                } catch (e) {
                    console.log('Data table Light ERROR: ', e.message)
                }
            }
        }
    }



    // пулл ф-ций для перерисовки 
    function buildOut() {
    	// если селектора таблицы нет в DOM
    	if(!this.table){ return }
        dataSlice.call(this)
        redrawTable.call(this)
        addPagination.call(this)
        addForm.call(this)
    }


    // отрисовка таблицы 
    function redrawTable() {

        const tableBody = this.tableBody
        const data = this.filteredDataPerPage
		const fieldsHandler = this.options.fieldsHandler

        // если шаблон не задан
        if (!this.options.trTemplate) {

                const tHead = this.options.tHead 
                const responsive = this.options.responsive
                const offset = this.offset                
                const index = this.options.index
                const optionsFields = this.options.data.fields
				

                // если переданы об-том с указанием полей вывода
                if (typeof optionsFields !== 'undefined') {
                    
                    const fields = index ? ['index'].concat(optionsFields) : optionsFields
                                      
                    let template = ``
                    for (let i = 0; i < data.length; i++) {
                        template += `<tr>`
                        if (fields[0] && fields[0] === 'index') {
                            template += `<td>`
                            if(responsive){
                                template += tHead[0] ? `<span class="dtl-td-title">${tHead[0]}</span>` : `<span class="dtl-td-title-skip">${tHead[0]}</span>`
                            }
                            template += `${i + offset + 1}</td>`   
                        }
                        for (let q in fields) {
                            for (let j in data[i]) {
                                if (fields[q] === j) {
                                    template += `<td>`
                                    if(responsive){
                                        template += tHead[q] ? `<span class="dtl-td-title">${tHead[q]}</span>` : `<span class="dtl-td-title-skip">${tHead[q]}</span>`
                                    } 
                                    template += `${data[i][j]}</td>`
                                }
                            }
                        }
                        template += `</tr>`
                    }
                    tableBody.innerHTML = template

                    // если данные переданы массивом без указания полей
                } else {

                    let template = ``
                    for (let i = 0; i < data.length; i++) {
                        template += `<tr>`
                        if (index) {
                            template += `<td>`
                            if(responsive){
                                template += tHead[0] ? `<span class="dtl-td-title">${tHead[0]}</span>` : `<span class="dtl-td-title-skip">${tHead[0]}</span>`
                            }
                            template += `${i + offset + 1}</td>`   
                        }
                        // начинаем с одного, чтобы проставлялся индекс, если указан
                        let q = index ? 1 : 0
                        for (var j in data[i]) {
                            template += `<td>`
                            if(responsive){
                                    template += tHead[q] ? `<span class="dtl-td-title">${tHead[q]}</span>` : `<span class="dtl-td-title-skip">${tHead[q]}</span>`                           
                            }  
                            template += `${data[i][j]}</td>`
                            q++
                        }
                        template += `</tr>`
                    }
                    tableBody.innerHTML = template
                }

        } else {

            let output = ''

            this.filteredDataPerPage.forEach((item, i) => {
                let t = this.options.trTemplate
                item['index'] = i + this.offset + 1
                for (let j in item) {
                    let h = j.trim()
					// если передана ф-ция доп обработчик полей
					if(typeof fieldsHandler === 'object' && fieldsHandler.hasOwnProperty(j)){
						item[h] = fieldsHandler[j](item[h])
					}
                    const rs = '{{\\s*?' + h + '\\s*?}}'
                    const r = new RegExp(rs, 'ig')
                    t = t.replace(r, item[h])

                }
                output += t
            })
            tableBody.innerHTML = output


        }
		
		if(typeof this.options.onLayoutChange === 'function'){
			this.options.onLayoutChange()
		}

    }



	// обрезаем данные для вывода на страницу
    function dataSlice() {
        // https://arjunphp.com/can-paginate-array-objects-javascript/
        this.filteredDataPerPage = this.filteredData.slice(this.offset).slice(0, this.options.rowsPerPage)
    }



    function addPagination() {

        // удаляем предыдущую пагинацию
        const oldNav = this.table.nextElementSibling
        if (oldNav) {
            oldNav.parentNode.removeChild(oldNav)
        }

        const size = this.options.rowsPerPage
        const filteredDataLength = this.filteredData.length


        // если нету данных или данных меньше заявленного количества показа на странице ф-ция не вызывается
        if (!this.filteredData || (typeof this.filteredData === 'object' && filteredDataLength === 0) || (filteredDataLength <= size && this.offset === 0)) return

        
        const paginationLength = Math.ceil(filteredDataLength / size)
        const activeLiIndex = this.offset / size
        const showPrev = this.offset === 0 ? false : true
        const showNext = (size > this.filteredDataPerPage.length || filteredDataLength - this.offset === size) ? false : true

        const ul = document.createElement('ul')
        addClass(ul, 'pagination')

        if (showPrev) {
            const li = document.createElement('li')
            addClass(li, 'page-item')
            li.addEventListener('click', (e) => {
                this.offset = ((this.offset / size) - 1) * size
                buildOut.call(this)
            }, false)

            const a = document.createElement('a')
            addClass(a, 'page-link')
            a.href = 'javascript:void(0)'
            a.innerHTML = this.messages.prev

            li.appendChild(a)
            ul.appendChild(li)
        }


        for (let i = 0; i < paginationLength; i++) {

            const li = document.createElement('li')


            // то, что выводится цифрами
            if (i === 0 || i === activeLiIndex + 1 || i === activeLiIndex || i === activeLiIndex - 1 || i === paginationLength - 1) {

                addClass(li, 'page-item page-num')
                if (activeLiIndex === i) {
                    addClass(li, 'active')
                }

                const a = document.createElement('a')
                addClass(a, 'page-link')
                a.href = 'javascript:void(0)'
                a.innerHTML = i + 1

                li.addEventListener('click', (e) => {
                    this.offset = i * size
                    buildOut.call(this)
                }, false)

                li.appendChild(a)

            }

            //  то, что выводится точками
            if (i === activeLiIndex + 2 && activeLiIndex !== paginationLength - 3 ||
                i === activeLiIndex - 2 && i !== 0) {

                addClass(li, 'page-item page-num')
                const a = document.createElement('a')
                addClass(a, 'page-link')
                a.href = 'javascript:void(0)'
                a.innerHTML = '...'
                li.appendChild(a)
            }

            ul.appendChild(li)
        }


        if (showNext) {
            const li = document.createElement('li')
            addClass(li, 'page-item')
            li.addEventListener('click', (e) => {
                this.offset = ((this.offset / size) + 1) * size
                buildOut.call(this)
            }, false)

            const a = document.createElement('a')
            addClass(a, 'page-link')
            a.href = 'javascript:void(0)'
            a.innerHTML = this.messages.next

            li.appendChild(a)
            ul.appendChild(li)
        }

        const nav = document.createElement('nav')
        nav.appendChild(ul)

        // добавляем следующим элементом после таблицы
        if (this.table.parentNode) {
            this.table.parentNode.insertBefore(nav, this.table.nextSibling);
        }


    }


    // селект и поиск
    function addForm() {
        const size = this.options.rowsPerPage

        // если нету данных или данных меньше заявленного количества показа на странице ф-ция не вызывается
        if (!this.filteredData || (typeof this.filteredData === 'object' && this.filteredData.length === 0) || this.filteredData.length <= size) return

        // удаляем предыдущий select
        const oldSelect = this.table.previousElementSibling
        if (oldSelect) {
            oldSelect.parentNode.removeChild(oldSelect)
        }



        const form = document.createElement('form')
        addClass(form, 'd-flex justify-content-center align-items-end')

        // ДОБ SELECT
        const div = document.createElement('div')
        addClass(div, 'form-group w-100 my-3 mr-3')

        const select = document.createElement('select')
        addClass(select, 'form-control')

        this.selectValues.forEach((value, i) => {
            const option = document.createElement('option')
            option.innerHTML = value
            option.value = value
            if (value === this.options.rowsPerPage) {
                option.selected = 'selected'
            }
            select.appendChild(option)

        })

        select.addEventListener('change', (e) => {
            this.options.rowsPerPage = Number(e.currentTarget.value)
            this.offset = 0
            buildOut.call(this)
        }, false)


        const span1 = document.createElement('span')
        addClass(span1, 'text-capitilize mr-3')
        span1.innerHTML = this.messages.show
        div.appendChild(span1)

        div.appendChild(select)

        form.appendChild(div)




        // ДОБ SEARCH
        const div2 = document.createElement('div')
        addClass(div2, 'form-group w-100 my-3 ml-3')

        const input = document.createElement('input')
        addClass(input, 'form-control')
        input.placeholder = this.messages.search
        input.addEventListener('keyup', (e) => {
            const filter = input.value.toUpperCase();
            const tr = this.table.getElementsByTagName("tr");
            for (let i = 0; i < tr.length; i++) {
                const td = Array.from(tr[i].getElementsByTagName("td"));
                for (let j = 0; j < td.length; j++) {
                    const _td = td[j]
                    if (_td) {
                        const txtValue = _td.textContent || _td.innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                            break
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }

            }
        }, false)

        div2.appendChild(input)

        form.appendChild(div2)

        this.table.parentNode.insertBefore(form, this.table.parentNode.firstChild);

    }

    // PUBLIC
    $DataTableLight.prototype.new = function(data) {
        this.options.data = data
        dataValidation.call(this)
        buildOut.call(this)
    }

    if (typeof window !== "undefined") {
        window.DataTableLight = $DataTableLight
    }

    return $DataTableLight;
}));