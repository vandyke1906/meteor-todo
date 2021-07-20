import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { insertTodo } from "../api/tasksMethods.js";
// import { TasksCollection } from "../api/TasksCollection";

// import "./test.css";

export const TaskForm = ({ user }) => {
  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) return;
    // TasksCollection.insert({ text: text.trim(), createdAt: new Date(), userId: user._id });
    // Meteor.call("tasks.insert", { text }, (err, res) => {
    //   if (err) alert(err);
    //   else alert(res + " success");
    // });

    insertTodo.call({ text }, (err, res) => {
      if (err) alert(err);
      else console.info({ success: true });
    });

    setText("");
  };

  return (
    <form className='task-form' onSubmit={onSubmit}>
      <input type='text' placeholder='Type to add new tasks' value={text} onChange={(e) => setText(e.target.value)} />
      <button type='submit'>Add Task</button>
    </form>
  );
};
