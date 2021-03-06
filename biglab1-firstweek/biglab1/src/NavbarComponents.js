import {Navbar, Form, Nav, FormControl} from 'react-bootstrap'

const Logo = (props) => {
    return (
            <Navbar.Brand className="text-light" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-check2-all" viewBox="0 0 16 16">
                <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7l-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"/>
                <path d="M5.354 7.146l.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"/>
            </svg>
            ToDo Manager
            </Navbar.Brand>
            ) ;
} ;

const SearchForm = (props) => {
    return (
            <Form inline className="d-none d-sm-block mx-auto">
                <FormControl type="search" placeholder="Search" aria-label="Search"/>  
            </Form >
           ) ;
} ;

const UserIcon = (props) => {
    return (
            <Nav className="ml-sm-auto">
                <svg className="text-light bi bi-person-circle" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
            </Nav>
           ) ;
} ;

const ToDoNavbar = (props) => {
    return (
            <Navbar bg="success" variant="dark" expand="sm" sticky="top">
                {/*Toggle attributes not needed anymore:
                data-toggle="collapse" 
                data-target="#CollapsableSidebar" 
                aria-controls="CollapsableSidebar" 
                aria-expanded="false" 
                aria-label="Toggle navigation"*/}
                <Navbar.Toggle  toggleSidebar={props.toggleSidebar} onClick={()=>{props.toggleSidebar()}}/>
                <Logo></Logo>    
                <SearchForm></SearchForm>
                <UserIcon></UserIcon>
            </Navbar>  
            ) ;
} ;

export default ToDoNavbar ;
