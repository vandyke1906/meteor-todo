import React, { useState } from "react";
import { Meteor } from "meteor/meteor";

import { Task } from "./Task.jsx";
import { TaskForm } from "./TaskForm.jsx";
import { LoginForm } from "./LoginForm.jsx";

import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/db/TasksCollection";

const onCheckboxClick = (task) => {
  // TasksCollection.update(task._id, {
  //   $set: {
  //     isChecked: !task.isChecked,
  //   },
  // });
  Meteor.call("tasks.setIsChecked", task._id, !task.isChecked);
};

// const onDeleteClick = (task) => TasksCollection.remove(task._id);
const onDeleteClick = (task) => Meteor.call("tasks.remove", task._id);

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const user = useTracker(() => Meteor.user());

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  // const tasks = useTracker(() => {
  //   if (!user) return [];
  //   return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, { sort: { createdAt: -1 } }).fetch();
  // });
  // const pendingTasksCount = useTracker(() => {
  //   if (!user) return 0;
  //   return TasksCollection.find(pendingOnlyFilter).count();
  // });

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) return noDataAvailable;

    const handler = Meteor.subscribe("tasks");

    if (!handler.ready()) return { ...noDataAvailable, isLoading: true };

    const tasks = TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
      sort: { createdAt: -1 },
    }).fetch();

    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  const pendingTasksTitle = `${pendingTasksCount ? ` (${pendingTasksCount})` : ""}`;

  const logout = () => Meteor.logout();

  return (
    <div className='main'>
      {user ? (
        <>
          <div className='user' onClick={logout}>
            {user.username} 🚪
          </div>
          <h1>
            📝️ To Do List
            {pendingTasksTitle}
          </h1>
          <TaskForm user={user} />
          <div className='filter'>
            <button onClick={() => setHideCompleted(!hideCompleted)}>
              {hideCompleted ? "Show All" : "Hide Completed"}
            </button>
          </div>

          {isLoading && <div className='loading'>loading...</div>}

          <ul>
            {tasks.map((task) => (
              <Task key={task._id} task={task} onCheckboxClick={onCheckboxClick} onDeleteClick={onDeleteClick} />
            ))}
          </ul>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};
