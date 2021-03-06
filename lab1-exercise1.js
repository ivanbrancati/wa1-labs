"use strict" ;

const dayjs = require('dayjs') ;

//Task object constructor
function Task(id, description, urgent = false, privacy = true, deadline = undefined){
    if (!id) throw new Error('ID is required!') ;
    else if (!description) throw new Error('Description is required!') ;
    this.id = id ; 
    this.description = description ;
    this.urgent = urgent ;
    this.privacy = privacy ;
    this.deadline = deadline? dayjs(deadline) : undefined ;

    this.toString = () => `Id: ${this.id}, Description: ${this.description}, Urgent: ${this.urgent}, Private: ${this.privacy}, Deadline: ${this.deadline?this.deadline.format("MMMM DD, YYYY hh:mmA"):"<not defined>"}`
} ;

//TaskList object constructor
function TaskList(){
    this.tasks = [] ;

    //method to add a task to the tasks list
    this.addTask = (task) => this.tasks.push(task) ;

    //method to sort tasks by deadline (the ones without deadline will be the last ones)
    this.sortByDeadline = () => this.tasks.sort((a,b) => {
        if(a.deadline&&b.deadline) return a.deadline.subtract(b.deadline) ;
        else if (a.deadline == undefined) return 1 ;
        else if (b.deadline == undefined) return -1 ;
        }) ;
        

    //method to filter only urgent tasks
    this.filterUrgent = () => this.tasks.filter( (task) => task.urgent )

    //method to print sorted tasks
    this.sortAndPrint = () => {
    const printList = this.sortByDeadline().map( (task) => task.toString()) ;
    printList.unshift("****** Tasks sorted by deadline (most recent first): ******") ;
    console.log(printList.join("\n")) ;
    } ;

    //method to print urgent tasks
    this.filterAndPrint = () => {
        const printList = this.filterUrgent().map( (task) => task.toString()) ;
        printList.unshift("****** Tasks filtered, only (urgent == true): ******") ;
        console.log(printList.join("\n")) ;
        } ;
    } ;

const t1 = new Task(1, "Play tennis",true , true, "2021-01-12") ;
const t2 = new Task(2, "Study",false, true ,  "2020-04-04") ;
const t3 = new Task(3, "Gym",true , true) ;
//const t4 = new Task(undefined, "prova",true , true) ;
//const t5 = new Task(5, undefined,true , true) ;


const tl = new TaskList() ;
tl.addTask(t1) ;
tl.addTask(t2) ;
tl.addTask(t3) ;

tl.sortAndPrint() ;
tl.filterAndPrint() ;
