import { Meteor } from "meteor/meteor";
// import { LinksCollection } from "/imports/api/links";
import { TasksCollection } from "/imports/api/db/TasksCollection";
import { Accounts } from "meteor/accounts-base";
import "/imports/api/tasksMethods";
import "/imports/api/tasksPublications";

const SEED_USERNAME = "user";
const SEED_PASSWORD = "user";

// function insertLink({ title, url }) {
//   LinksCollection.insert({ title, url, createdAt: new Date() });
// }

const insertTask = (text, user) => {
  TasksCollection.insert({ text, userId: user._id });
};

const user = Accounts.findUserByUsername(SEED_USERNAME);

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  if (TasksCollection.find({}).count() === 0) {
    const tasks = ["First Task", "Second Task", "Third Task", "Fourth Task", "Fifth Task"];
    tasks.forEach((task) => insertTask(task, user));
  }
});
