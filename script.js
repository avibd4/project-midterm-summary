const homeBoard = document.querySelector('#homeBoard')
const board = document.querySelector('#board')
const homeBtn = document.querySelector('#homeBtn')
const allJobsBtn = document.querySelector('#allJobsBtn')
const categoriesUl = document.querySelector('#categoriesUl')
const savedJobsBtn = document.querySelector('#savedJobsBtn')
const searchInput = document.querySelector('#searchInput')
const searchBtn = document.querySelector('#searchBtn')
const loadingDiv = document.querySelector('#loadingDiv')

const getLocalStoarge = (key) => {
    return JSON.parse(localStorage.getItem(key))
}


let localStoargeJobs = getLocalStoarge('jobs')? getLocalStoarge('jobs'): []


const allJobsUrl = 'https://remotive.com/api/remote-jobs?limit=100'


homeBtn.addEventListener('click', () => {
    homeBoard.style.display = 'block'
    board.innerHTML = ''
    loadingDiv.style.display = 'none'
})

allJobsBtn.addEventListener('click', async () => {
    try {
        homeBoard.style.display = 'none'
        loadingDiv.style.display = 'block'

        const restApi = await fetch(allJobsUrl)
        const result = await restApi.json()                
       
        renderJobs(result.jobs)
        
    } catch (error) {
        console.error(error)
    }
    
})

const renderCategories = async () => {
    try {
        const url = 'https://remotive.com/api/remote-jobs/categories'
        const response = await fetch(url)
        const result = await response.json()
        
        result.jobs.forEach(async obj => {
            const newDropdownItem = document.createElement('li')
            const newA = document.createElement('a')
            newA.classList.add('dropdown-item')
            newA.href = '#'
            newA.textContent = obj.slug

            newA.addEventListener('click', async() => {
                try {
                    loadingDiv.style.display = 'block'
                    board.innerHTML = ''
                    homeBoard.style.display = 'none'

                    const restApi = await fetch(`https://remotive.com/api/remote-jobs?category=${obj.name}`)
                    const result = await restApi.json()
    
                    renderJobs(result.jobs)                    
                    
                } catch (error) {
                    console.error(error)
                }
            })

            newDropdownItem.appendChild(newA)
            categoriesUl.appendChild(newDropdownItem)

        })
        
    } catch (error) {
       console.error(error) 
    }
}
renderCategories()

const renderJobs = (jobsArr, savedIndication = false) => {
    loadingDiv.style.display = 'none'
    board.innerHTML = ''
    jobsArr.forEach(job => {
        const newColDiv = document.createElement('div')
        newColDiv.classList.add('col-sm-4')
        newColDiv.classList.add('my-2')
        
        const newCard = document.createElement('div')
        newCard.classList.add('card')
        newCard.classList.add('text-center')

        const cardHeader = document.createElement('div')
        cardHeader.classList.add('card-header')
        cardHeader.textContent = `Company Name: ${job.company_name}`

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        const bodyImg = document.createElement('img')
        bodyImg.style.height = '85px'
        bodyImg.classList.add('my-2')
        bodyImg.src = job.company_logo

        const bodyTitle = document.createElement('h5')
        bodyTitle.textContent = job.title
        bodyTitle.classList.add('text-decoration-underline')

        const bodySalary = document.createElement('p')
        bodySalary.textContent = `Salary: ${job.salary}`
        bodySalary.classList.add('text-start')

        const bodyDescription = document.createElement('div')
        bodyDescription.classList.add('overflow-scroll')        
        bodyDescription.style.height = '180px'
        bodyDescription.innerHTML = job.description

        const bodyDivBtns = document.createElement('div')
        bodyDivBtns.classList.add('row')
        bodyDivBtns.classList.add('pt-3')


        const saveDiv = document.createElement('div')
        saveDiv.classList.add('col-6')

        const newSaveBtn = document.createElement('button')
        newSaveBtn.classList.add('btn')
        newSaveBtn.style = 'background-color: pink'       

        const isInLocalStoarge = getLocalStoarge('jobs').filter(item => {
            return item.id === job.id
        })
        if(!isInLocalStoarge.length){
            newSaveBtn.textContent =  'Save this JOB'            
        }else{
            newSaveBtn.textContent =  'Remove❤️'
            newSaveBtn.style = 'background-color: rgb(246, 3, 173)'
        }

        newSaveBtn.addEventListener('click', (event) => {
            if(newSaveBtn.textContent === 'Save this JOB'){                
                localStoargeJobs.push(job)
                localStorage.setItem('jobs', JSON.stringify(localStoargeJobs))
                event.target.textContent = 'Remove❤️'
                event.target.style = 'background-color: rgb(246, 3, 173)'
            }else{
                const filterLocalStoarge = getLocalStoarge('jobs').filter(item => {
                    return item.id !== job.id
                }) 
                localStorage.setItem('jobs', JSON.stringify(filterLocalStoarge))
                localStoargeJobs = getLocalStoarge('jobs')
                event.target.textContent = 'Save this JOB'
                event.target.style = 'background-color: pink'
                if(savedIndication){
                    renderJobs(getLocalStoarge('jobs'), true)
                    if(!getLocalStoarge('jobs').length){
                        homeBoard.style.display = 'none'
                        board.innerHTML = '<h4>There is no saved JOBS</h4>' 
                    }   
                }                
            }            
        })

        const seeDiv = document.createElement('div')
        seeDiv.classList.add('col-6')

        const newSeeBtn = document.createElement('a')
        newSeeBtn.classList.add('btn')
        newSeeBtn.classList.add('btn-success')
        newSeeBtn.classList.add('text-white')
        newSeeBtn.textContent = 'See this JOB'
        newSeeBtn.href = job.url
        newSeeBtn.target = 'blank'        

        const cardFooter = document.createElement('div')
        cardFooter.classList.add('card-footer')
        cardFooter.classList.add('text-start')
        cardFooter.textContent = `Type: ${job.job_type}`

        saveDiv.appendChild(newSaveBtn)
        seeDiv.appendChild(newSeeBtn)
        bodyDivBtns.append(saveDiv, seeDiv)
        cardBody.append(bodyImg, bodyTitle, bodySalary, bodyDescription, bodyDivBtns)
        newCard.append(cardHeader, cardBody, cardFooter)
        newColDiv.appendChild(newCard)
        board.appendChild(newColDiv)
    })
}

searchBtn.addEventListener('click', async() => {

    try {
        loadingDiv.style.display = 'block'
        board.innerHTML = ''
        homeBoard.style.display = 'none'

        const restApi = await fetch(`https://remotive.com/api/remote-jobs?search=${searchInput.value}`)
        const result = await restApi.json()
        
        renderJobs(result.jobs)
        
    } catch (error) {
        console.error(error)
    }
    
})

savedJobsBtn.addEventListener('click', () => {
    homeBoard.style.display = 'none'
    if(!getLocalStoarge('jobs').length){
        board.innerHTML = '<h4>There is no saved JOBS</h4>'
    }else{
        renderJobs(getLocalStoarge('jobs'), true)
    }
})