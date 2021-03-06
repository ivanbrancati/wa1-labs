
import 'bootstrap/dist/css/bootstrap.min.css' ;
import './App.css';
import dayjs from 'dayjs' ;
import ToDoNavbar from './NavbarComponents.js' ;
import { ToDoSidebar, ToDoMain } from './MainComponents.js' ;
import { Container, Row } from 'react-bootstrap' ;
import { useState, useEffect } from 'react' ;
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom' ;
import confused from './confused.gif'

//Task object constructor
function Task(id, description, urgent = false, privacy = true, deadline = undefined){
  if (!id) throw new Error('ID is required!') ;
  else if (!description) throw new Error('Description is required!') ;
  this.id = id ; 
  this.description = description ;
  this.urgent = urgent ;
  this.privacy = privacy ;
  this.deadline = deadline? dayjs(deadline) : undefined ;
} ;

/*//TaskList object constructor
function TaskList(){
  this.tasks = [] ;

  //method to add a task to the tasks list
  this.addTask = (task) => this.tasks.push(task) ;
} ;

const t1 = new Task(1, "Complete Lab 2", false, false, "2021-03-22 14:30") ;
const t2 = new Task(2, "Buy some groceries", false, true,  "2021-04-10 11:00") ;
const t3 = new Task(3, "Read a good book!", true, true) ;

const tl = new TaskList() ;
tl.addTask(t1) ;
tl.addTask(t2) ;
tl.addTask(t3) ;*/

const filters = ['All', 'Important', 'Today', 'Next 7 Days', 'Private'] ;

function App() {

  //state to manage tasks addition
  //const [tasks, setTasks] = useState(tl.tasks) ;
  //TODO: continua da qui
  const [tasks, setTasks] = useState([]) ;
  
  useEffect(() => {
    async function loadTasks(){
      const response = await fetch('/api/tasks') ;
      const fetchedTasks = await response.json() ;
      const taskList = fetchedTasks.map( t => new Task(t.id, t.description, t.important, t.private, t.deadline)) ;
      setTasks(taskList) ;
    } ;
    loadTasks() ;
  }, []) ;

  //state representing max task id
  //TODO: maxId from db
  const [maxId, setMaxId] = useState(Math.max(...tasks.map((task)=> task.id)))

  //api to add a task to the db (TODO: sposta nel file con le api)
  async function addFetchTask(task) {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
        "description": task.description, 
        "important": task.urgent, 
        "privacy": task.privacy, 
        "deadline": task.deadline || ''
      } )
    });
    if (response.ok) {
        return null;
    } else return { 'err': 'POST error' };
}

  //function to add a task
  const addTask = (newTask) => {
    const t = new Task(maxId+1, newTask.description, newTask.urgent, newTask.privacy, newTask.deadline)
    setMaxId( oldMaxId => oldMaxId + 1) ;
    setTasks( oldTasks => [...oldTasks, t]) ;

    //TODO: sistema con file api
    addFetchTask(t) ;
} ;

//function to edit a task
const editTask = (taskId, newDescription, newUrgent , newPrivacy, newDeadline) => {
  setTasks( oldTasks => oldTasks.map( (task) => 
    task.id === taskId ?
      new Task(taskId, newDescription, newUrgent, newPrivacy, newDeadline) :
      task 
  )) ;
} ;


//function to remove a task
const removeTask = (taskId) => {
  setTasks( oldTasks => oldTasks.filter( (task) => task.id !== taskId )) ;
} ;
  

  //function to show tasks according to filter
  const filterTasks = (oldTasks, filter) => {
    
    switch (filter) {
      case "All":
        return oldTasks ;

      case "Important":
        return oldTasks.filter( task => task.urgent ) ;

      case "Today":
        return oldTasks.filter( (task) => 
        { if (task.deadline === undefined) return false ;
          else return dayjs().isSame(task.deadline, 'day') ;
          }) ; 

      case "Next7Days":
        return oldTasks.filter( (task) => 
        { if (task.deadline === undefined) return false ;
          else return task.deadline.isAfter(dayjs(), 'day') && task.deadline.isBefore(dayjs().add(8, 'day'), 'day');
           }) ;

      case "Private":
        return oldTasks.filter( task => task.privacy ) ;
    }
  }

  //state to manage toggle sidebar
  const [collapsed, setCollapsed] = useState(true) ;

  const toggleSidebar = () => {
    setCollapsed( oldCollapsed => !oldCollapsed ) ;
  } ;

  //callback to reset sidebar (passing from mobile to desktop version)
  useEffect(() => 
  {window.addEventListener('resize', ()=>{if (window.innerWidth > 575) setCollapsed(true)})}
  ) ;

  return (
    <Router>
      <div className="App">
      <ToDoNavbar toggleSidebar={toggleSidebar}></ToDoNavbar>
      <Switch>
      <Route exact path='/'>
          <Redirect to='/All'></Redirect>
        </Route>

        <Route path='/:filter'
          children={({match}) => filters.includes(match.params.filter.split(/(?=[A-Z|0-9])/).join(" ")) ? 
                                  (
                                    <Container fluid>
                                          <Row className="vheight-100">
                                            <ToDoSidebar elements={filters} collapsed={collapsed} toggleSidebar={toggleSidebar} title={match.params.filter} ></ToDoSidebar>
                                            <ToDoMain title={match.params.filter} tasks={filterTasks(tasks, match.params.filter)} addTask={addTask} removeTask={removeTask} editTask={editTask}></ToDoMain>
                                          </Row>
                                    </Container>
                                  ) :
                                  (
                                    <>
                                      <img src={confused}  className="d-block mx-auto img-fluid w-50"/>
                                      <h1 className='validity-error text-center'>Error!</h1>
                                      <h3 className='text-center'>The page you requested doesn't exist. You will be redirected to the home page in few seconds...</h3>
                                      <p hidden='true'>{setTimeout(() => window.location.replace('/All'), 5000)}</p>
                                    </>
                                  )
                                }
        />
        
      </Switch>
  </div>
      
    </Router>
  );
} ;

export default App;
