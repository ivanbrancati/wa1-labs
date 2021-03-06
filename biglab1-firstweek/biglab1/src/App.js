//TODO: sistemare 'reset' sidebar (quando si passa da mobile a desktop)
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css' ;
import dayjs from 'dayjs' ;
import ToDoNavbar from './NavbarComponents.js' ;
import { ToDoSidebar, ToDoMain } from './MainComponents.js' ;
import {Container, Row} from 'react-bootstrap' ;
import {useState} from 'react' ;

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

//TaskList object constructor
function TaskList(){
  this.tasks = [] ;

  //method to add a task to the tasks list
  this.addTask = (task) => this.tasks.push(task) ;
} ;

const t1 = new Task(1, "Complete Lab 2", false, false, "2021-03-22 14:30") ;
const t2 = new Task(2, "Buy some groceries", false, true,  "2021-04-10 11:00") ;
const t3 = new Task(3, "Read a good book!", true, false) ;

const tl = new TaskList() ;
tl.addTask(t1) ;
tl.addTask(t2) ;
tl.addTask(t3) ;

const filters = ['Important', 'Today', 'Next 7 Days', 'Private'] ;

function App() {
  //state to manage toggle sidebar
  const [collapsed, setCollapsed] = useState(true) ;

  //warning: it should be 'togglesidebar' and not 'toggleSidebar'
  const toggleSidebar = () => {
    setCollapsed( oldCollapsed => !oldCollapsed ) ;
  } ;

  return (
    <div className="App">
      <ToDoNavbar toggleSidebar={toggleSidebar}></ToDoNavbar>
      <Container fluid>
            <Row className="vheight-100">
              <ToDoSidebar elements={filters} collapsed={collapsed}></ToDoSidebar>
              <ToDoMain tasks={tl.tasks}></ToDoMain>
            </Row>
      </Container>
    </div>
  );
}

export default App;
