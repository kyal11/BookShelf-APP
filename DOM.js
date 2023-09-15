const books=[]
const RENDER_EVENT='render-book'
const SAVED_EVENT='saved-book'
const STORAGE_KEY='BOOKSHELF-APP'

const isStorageExist=()=>{
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
      }
      return true; 
}

const generateBookObject =(id,title,author,year,isCompleted)=>{
    return {
        id,title,author,year,isCompleted
    }
}

const addBook =()=>{
    const id= new Date()
    const title=document.getElementById('input-title').value
    const author=document.getElementById('input-author').value
    const year=document.getElementById('input-year').value
    const isCompleted=document.getElementById('input-complete').checked

    const bookObject=generateBookObject(id,title,author,year,isCompleted)

    books.push(bookObject)
    alert('Buku Behasil Ditambahkan')
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveDataBook()
}

const makeBook=(bookObject)=>{
    const textTitle = document.createElement('h3')
    textTitle.classList.add('bookTitle')
    textTitle.innerText=bookObject.title
    

    const textAuthor = document.createElement('p')
    textAuthor.classList.add('bookAuthor')
    textAuthor.innerText=bookObject.author
    

    const textYear = document.createElement('p')
    textYear.classList.add('bookYear')
    textYear.innerText=`(${bookObject.year})`
    

    const bookContainer = document.createElement('div')
    bookContainer.classList.add('bookContainer')
    bookContainer.append(textTitle,textYear)
    
    const container = document.createElement("div")
    container.classList.add("bookItem")
    container.append(bookContainer)
    container.setAttribute('id',`book-${bookObject}`)

    if(bookObject.isCompleted){
        const undoBtn=document.createElement('button')
        undoBtn.classList.add('undoIcon')

        undoBtn.addEventListener('click',function(){
            undoBookfromComplete(bookObject.id)
        })

        const thrashBtn = document.createElement('button')
        thrashBtn.classList.add('thrashIcon')

        thrashBtn.addEventListener('click',function(){
            removeBookfromComplete(bookObject.id)
        })
        const containerIcon = document.createElement('div')
        containerIcon.classList.add('containerIcon')
        containerIcon.append(undoBtn,thrashBtn)
        const wrapperAuthorandIcon = document.createElement('div')
        wrapperAuthorandIcon.classList.add('wrapperAuthorandIcon')
        wrapperAuthorandIcon.append(textAuthor,containerIcon)
        container.append(wrapperAuthorandIcon)
    }
    else{
        const checkBtn =document.createElement('button')
        checkBtn.classList.add('checkIcon')

        checkBtn.addEventListener('click',function(){
            addBookComplete(bookObject.id)
        })

        const thrashBtn = document.createElement('button')
        thrashBtn.classList.add('thrashIcon')

        thrashBtn.addEventListener('click',function(){
            removeBookfromComplete(bookObject.id)
        })

        const containerIcon = document.createElement('div')
        containerIcon.classList.add('containerIcon')
        containerIcon.append(checkBtn,thrashBtn)
        const wrapperAuthorandIcon = document.createElement('div')
        wrapperAuthorandIcon.classList.add('wrapperAuthorandIcon')
        wrapperAuthorandIcon.append(textAuthor,containerIcon)
        container.append(wrapperAuthorandIcon)
    }
    return container
}
const findBook=(idBook)=>{
    for(const bookItem of books){
        if(bookItem.id === idBook){
            return bookItem
        }
    }
    return null
}

const findBookIndex =(idBook)=>{
    for(const i in books){
        if(books[i].id === idBook){
            return i;
        }
    }
    return -1;
}
const addBookComplete=(idBook)=>{
    const bookTarget = findBook(idBook)

    if(bookTarget == null){
        return
    }
    bookTarget.isCompleted=true
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveDataBook()
}

const removeBookfromComplete=(idBook)=>{
    const bookTarget = findBookIndex(idBook)
    if(bookTarget === -1){
        return
    }
    books.splice(bookTarget,1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveDataBook()
}
const undoBookfromComplete=(idBook)=>{
    const bookTarget = findBook(idBook)

    if(bookTarget == null){
        return
    }
    bookTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveDataBook()
}

const saveDataBook=()=>{
    if(isStorageExist()){
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY,parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

const loadDataFromStorage=()=>{
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        t=books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));  
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    console.log('Data Buku Berhasil Disimpan')
  });
  
document.addEventListener('DOMContentLoaded',function(){
    const bookSubmit = document.getElementById('form')
    bookSubmit.addEventListener('submit',function(event){
        event.preventDefault() 
        addBook()
    })
    document.addEventListener(RENDER_EVENT,function(){
        const uncompletedBookList=document.getElementById('uncomplete')
        uncompletedBookList.innerHTML=''

        const completeBookList=document.getElementById('complete')
        completeBookList.innerHTML=''

        for (const bookList of books){
            const bookElement = makeBook(bookList)
            if(bookList.isCompleted === true){
                completeBookList.append(bookElement)
            }
            else{
                uncompletedBookList.append(bookElement)
            }
        }
    })
    const searhSubmit=document.getElementById('searhSubmit')
    searhSubmit.addEventListener('click',function(event){
        event.preventDefault()
        const titleBook= document.getElementById('searchBook').value
        const listBook = document.getElementById('listBook')
        listBook.innerHTML=''

        for(const bookItem of books){
            if(bookItem.title.toLowerCase().includes(titleBook.toLowerCase())){
                if(bookItem.isCompleted === true){
                    const textTitle = document.createElement('h3')
                    textTitle.classList.add('bookTitle')
                    textTitle.innerText=bookItem.title
                    
                    const textYear = document.createElement('p')
                    textYear.classList.add(`bookYear`)
                    textYear.innerText=`(${bookItem.year})`

                    const textAuthor = document.createElement('p')
                    textAuthor.classList.add('bookAuthor')
                    textAuthor.innerText=bookItem.author
                    
                    
                    const status = document.createElement('p')
                    status.innerText='Selesai Dibaca'

                    const bookContainer = document.createElement('div')
                    bookContainer.classList.add('bookContainer')
                    bookContainer.append(textTitle,textYear)
                    
                    const wrapperAuthorandStatus = document.createElement('div')
                    wrapperAuthorandStatus.classList.add('wrapperAuthorandIcon')
                    wrapperAuthorandStatus.append(textAuthor,status)

                    const container = document.createElement("div")
                    container.classList.add("bookItem")
                    container.append(bookContainer,wrapperAuthorandStatus)
                    container.setAttribute('id',`book-${bookItem}`)

                    listBook.append(container)
                }else{
                    const textTitle = document.createElement('h3')
                    textTitle.classList.add('bookTitle')
                    textTitle.innerText=bookItem.title
                    
                    const textYear = document.createElement('p')
                    textYear.classList.add(`bookYear`)
                    textYear.innerText=`(${bookItem.year})`

                    const textAuthor = document.createElement('p')
                    textAuthor.classList.add('bookAuthor')
                    textAuthor.innerText=bookItem.author
                    
                    
                    const status = document.createElement('p')
                    status.innerText='Belum Selesai'

                    const bookContainer = document.createElement('div')
                    bookContainer.classList.add('bookContainer')
                    bookContainer.append(textTitle,textYears)
                    
                    const wrapperAuthorandStatus = document.createElement('div')
                    wrapperAuthorandStatus.classList.add('wrapperAuthorandIcon')
                    wrapperAuthorandStatus.append(textAuthor,status)

                    const container = document.createElement("div")
                    container.classList.add("bookItem")
                    container.append(bookContainer,wrapperAuthorandStatus)
                    container.setAttribute('id',`book-${bookItem}`)

                    listBook.append(container)
                }
            }else{
                const status = document.createElement('p')
                status.innerText='Buku Tidak Ada'
                const container = document.createElement("div")
                container.classList.add("bookItem")
                container.append(status)

                listBook.append(container)
            }
        }
    })
    if (isStorageExist()){
        loadDataFromStorage()
    }
})