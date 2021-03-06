/* Data Access Object (DAO) module for accessing tasks.db */
'use strict' ;
//TODO: response codes?

const sqlite = require('sqlite3');
const dayjs = require('dayjs') ;

// open the database
const db = new sqlite.Database('tasks.db', (err) => {
    if(err) throw err;
  });

//get all tasks, according to the selected {filter}
exports.getTasks = (filter) => {
  return new Promise(( resolve, reject ) => {
    let query ="" ;
    switch (filter) {
      case "All":
        query = "SELECT * FROM tasks" ;
        break ;
      case "Important":
        query = "SELECT * FROM tasks  WHERE important = true" ;
        break ;
      case "Today":
        const today = `${dayjs().format("YYYY-MM-DD")}%` ;
        query = `SELECT * FROM tasks  WHERE deadline LIKE "${today}"` ;
        break ;
      case "Next7Days":
        const tomorrow = dayjs().add(1, 'day').format("YYYY-MM-DD") ;
        const plusEight = dayjs().add(8, 'day').format("YYYY-MM-DD") ;
        query = `SELECT * FROM tasks  WHERE deadline <= "${plusEight}" AND deadline >= "${tomorrow.toString()}"` ;
        break ;
      case "Private":
      query = "SELECT * FROM tasks  WHERE private = true" ;
      break ;
    } ;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject (err) ;
          return ;
        };

        const tasks = rows.map((t) => ({
          id : t.id, 
          description : t.description, 
          important : t.important, 
          private : t.private,
          deadline : t.deadline,
          completed : t.completed
        /*TODO: user not needed now*/ }) ) ;

        resolve(tasks) ;

      }) ;
  }) ;
} ;


// get the Task identified by {id}
exports.getTask = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err) ;
        return ; 
      }
      if (row == undefined) {
        resolve({error: 'Task not found.'});
      } else {
        const task = {
          id : row.id, 
          description : row.description, 
          important : row.important, 
          private : row.private,
          deadline : row.deadline,
          completed : row.completed
        /*TODO: user not needed now*/ } ;
        resolve(task);
      }
    });
  });
};

//add a new Task
exports.createTask = (task) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT into tasks (description, important, private, deadline, completed, user) VALUES (?, ?, ?, ?, 0, 1)` 
    db.run(query, [task.description, task.important, task.privacy, task.deadline], function(err) {
      if (err) {
        reject(err) ;
        return ;
      } 
      resolve(this.lastID) ;
    }) ;
  }) ;
} ;

//update a task
exports.updateTask = (task) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE tasks SET description = ?, important = ?, private = ?, deadline = ? WHERE id = ? ";
    db.run(query, [task.description, task.important, task.privacy, task.deadline, task.id], function(err) {
      if(err) {
        reject(err) ;
      }
      else if (this.changes != 0){
        resolve(task.id) ;
      }
      else {
        resolve([{"Error":"element not existing!"}]) ;
      }
    }) ;
  }) ;
} ;

//set a task as completed/uncompleted
exports.toggleCompleted = (id) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE tasks SET completed = NOT completed WHERE id = ? ";
    db.run(query, [id], function(err) {
      if(err) {
        reject(err) ;
      }
      else if (this.changes != 0){
        resolve(id) ;
      }
      else {
        resolve([{"Error":"element not existing!"}]) ;
      }
    }) ;
  }) ;
} ;

//delete a task
exports.deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM tasks WHERE id = ?" ;

    db.run(query, [id], function(err){
      if (err) {
        reject(err) ;
      }
      else if (this.changes!=0){
        resolve(id) ;
      }
      else {
        resolve([{"Error":"element not existing!"}]) ;
      }
    }) ;
  }) ;
} ;

// get max Task id
exports.getMaxId = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT MAX(id) as maxid FROM tasks';
    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err) ;
        return ; 
      }
      if (row == undefined) {
        resolve({error: 'Error retrieving max id.'});
      } else {
        const result = {
          maxid : row.maxid } ;
        resolve(result);
      }
    });
  });
};