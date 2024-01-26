# Task Management API

This API provides functionality for managing tasks, boards, columns, and subtasks.

## Table of Contents

- [Signup](#signup)
- [Login](#login)
- [Show Board](#show-board)
- [Create Board](#create-board)
- [Create Column](#create-column)
- [Create Task](#create-task)
- [Update Board](#update-board)
- [Update Column](#update-column)
- [Update Task](#update-task)
- [Delete Board](#delete-board)
- [Delete Column](#delete-column)
- [Delete Task](#delete-task)

## Signup

- **URL:** `/signup`
- **Method:** `POST`
- **Request Body:**
  - `username` (required): User's username.
  - `password` (required): User's password.
  - `email` (required): User's email.

## Login

- **URL:** `/login`
- **Method:** `POST`
- **Request Body:**
  - `email` (required): User's email.
  - `password` (required): User's password.

## Show Board

- **URL:** `/show/board`
- **Method:** `GET`
- **Middleware:** `authMiddleware` (Authentication required)
- **Description:** Retrieve all board data related to the authenticated user.

## Create Board

- **URL:** `/create/board`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `name` (required): Board name.

## Create Column

- **URL:** `/create/column`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `name` (required): Column name.

## Create Task

- **URL:** `/create/task`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `column_id` (required): ID of the column where the task belongs.
  - `subtask_title` (required): Title of the subtask.
  - `title` (required): Title of the task.
  - `description` (required): Description of the task.
  - `status` (required): Status of the task.

## Update Board

- **URL:** `/update/board`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `name` (required): New board name.
  - `board_id` (required): ID of the board to be updated.

## Update Column

- **URL:** `/update/column`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `name` (required): New column name.
  - `column_id` (required): ID of the column to be updated.

## Update Task

- **URL:** `/update/task`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `column_id` (required): ID of the column where the task belongs.
  - `subtask_title` (required): New title of the subtask.
  - `title` (required): New title of the task.
  - `description` (required): New description of the task.
  - `status` (required): New status of the task.
  - `task_id` (required): ID of the task to be updated.
  - `subtask_id` (required): ID of the subtask to be updated.

## Delete Board

- **URL:** `/delete/board`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `board_id` (required): ID of the board to be deleted.

## Delete Column

- **URL:** `/delete/column`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `column_id` (required): ID of the column to be deleted.

## Delete Task

- **URL:** `/delete/task`
- **Method:** `POST`
- **Middleware:** `authMiddleware` (Authentication required)
- **Request Body:**
  - `task_id` (required): ID of the task to be deleted.
