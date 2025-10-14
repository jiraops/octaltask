# OctalTask - Web to manage your work
![Repo Size](https://img.shields.io/github/repo-size/jiraops/octaltask)
![Last Commit](https://img.shields.io/github/last-commit/jiraops/octaltask)
![Open Issues](https://img.shields.io/github/issues/jiraops/octaltask)

![React](https://img.shields.io/badge/React-19.0.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.6-blueviolet)
![ESLint](https://img.shields.io/badge/ESLint-9.21.0-yellowgreen)
![TypeScript](https://img.shields.io/badge/TailwindCSS-5.7.2-red)

A web-based task management platform that enables users to efficiently organize, prioritize, and track their work through an intuitive interface

# Features

## 1. User Authentication

- **Login, Sign Up, Password Recovery**: User can create an account, login and reset password.
- **Email Verification**: Verify email using a One-Time Password (OTP) for enhanced security.

## 2. Main Page 

### Sidebar: Display user information and quick access to different categorized tasks

- **User information**: Display username, email and settings icon.

- **Your task**: Your personal tasks
  - *Task today*: Lists tasks scheduled for today.
  - *Important task*: Shows tasks marked as important.
  - *Planned task*: Shows tasks that have a due date and are scheduled for the future.
  - *Assigned task*: Team tasks delegated to or assigned by others.
  - *All task*: All task lists you have.

- **Team task**: Show all your teams and tasks in the team.

### Main Content: Display the tasks
- Display the tasks you have in each category, including incomplete and completed.
- Each task shows its name, due date, task list, and whether it's marked as important.

### Task's Content: Display the details of the selected task
- Includes task list category, checkbox to add to "Task today", and fields for reminder, due date, and note.

## 3. About Task
- Ticking and unticking the task to change its completion state.

### Personal Task:
- Create, delete, and edit your task list.
  - Add, delete, and edit tasks within a task list.
  - Change the task list a task belongs to.

### Team Task:
- Add, delete, and edit roles of members in your team.
- Create, delete, and edit your team task list.
  - Create, delete, and edit tasks.
  - Assign tasks to team members.

# Installation

```bash
# Clone the repository
git clone https://github.com/jiraops/octaltask
cd octaltask

# Install dependencies
npm install

# Start the development server
npm run dev
```

> Make sure you also have the backend API running. You can configure the API base URL via `.env`.  
> The `.env` file only needs one variable `VITE_API_BASE`, it's the base url to the Backend server.  

# Related Projects

OctalTask consists of multiple services. Here are the related repositories:

* [OctalTask Front-End (this repo)](https://github.com/jiraops/octaltask.git): The web-based user interface, built with React, TypeScript and Vite.
* [OctalTask Backend API](https://github.com/jiraops/octaltask-api.git): A NestJS microservices architecture project using gRPC for communication between services.

These services work together to provide a seamless experience for users.

# License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

# Credits
Contributors:
- Tran Dong Truc Lam  (Student ID: 22520746)  
Github link: [limelight-hub](https://github.com/limelight-hub)
- Le Ngoc Duy Linh (Student ID: 22520762)  
Github link: [YuilRin](https://github.com/YuilRin)
- Vo Tran Phi  (Student ID: 22521081)  
Github link: [votranphi](https://github.com/votranphi)
- Thai Kieu Phuong  (Student ID: 22521170)  
Github link: [kPhuong08](https://github.com/kPhuong08)
