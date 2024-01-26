const connection = require('../sqlconnection/connection');

// Show boards

exports.showBoard = async (req, res) => {
    try {
        const user_id = req.user_id;
        const selectBoardDataQuery = `
            SELECT
                B.board_id,
                B.name AS board_name,
                C.column_id,
                C.name AS column_name,
                T.task_id,
                T.title AS task_title,
                T.description AS task_description,
                T.status AS task_status,
                S.subtask_id,
                S.title AS subtask_title,
                S.isCompleted AS subtask_is_completed
            FROM Boards B
            LEFT JOIN Columns C ON B.board_id = C.board_id
            LEFT JOIN Tasks T ON C.column_id = T.column_id
            LEFT JOIN Subtasks S ON T.task_id = S.task_id
            WHERE B.user_id = $1;`;

        const values = [user_id];

        connection.query(selectBoardDataQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            if (result.rows.length === 0) {
                // No data found for the user
                return res.status(404).json({
                    message: "No data found for the user"
                });
            }

            const boardsData = {};

            result.rows.forEach(row => {
                const board_id = row.board_id;
                if (!boardsData[board_id]) {
                    boardsData[board_id] = {
                        board_id: board_id,
                        board_name: row.name,
                        columns: [],
                    };
                }

                const column_id = row.column_id;
                const columnIndex = boardsData[board_id].columns.findIndex(column => column.column_id === column_id);

                if (columnIndex === -1) {
                    boardsData[board_id].columns.push({
                        column_id: column_id,
                        column_name: row.name,
                        tasks: [],
                    });
                }

                const task_id = row.task_id;
                const taskIndex = boardsData[board_id].columns[columnIndex].tasks.findIndex(task => task.task_id === task_id);

                if (taskIndex === -1) {
                    boardsData[board_id].columns[columnIndex].tasks.push({
                        task_id: task_id,
                        task_title: row.title,
                        task_description: row.description,
                        task_status: row.status,
                        subtasks: [],
                    });
                }

                boardsData[board_id].columns[columnIndex].tasks[taskIndex].subtasks.push({
                    subtask_id: row.subtask_id,
                    subtask_title: row.subtask_title,
                    isCompleted: row.isCompleted,
                });
            });

            const boardsArray = Object.values(boardsData);

            return res.status(200).json({ boards: boardsArray });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



// Create a board
exports.createBoard = async (req, res) => {
    try {
        const insertQuery = 'INSERT INTO Boards (user_id) VALUES ($1) RETURNING *';
        const values = [req.user_id];

        connection.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log('Data inserted successfully:', result.rows[0]);
            return res.status(201).json({ msg: "Created Successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Create a column
exports.createColumn = async (req, res) => {
    try {
        const { board_id, name } = req.body;

        const insertQuery = 'INSERT INTO Columns (board_id, name) VALUES ($1, $2) RETURNING *';
        const values = [board_id, name];

        connection.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log('Data inserted successfully:', result.rows[0]);
            return res.status(201).json({ msg: "Created Successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Create a task
exports.createTask = async (req, res) => {
    try {
        const { column_id, subtask_title, title, description, status } = req.body;
        const insertTaskQuery = 'INSERT INTO Tasks (column_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *';
        const taskValues = [column_id, title, description, status];

        connection.query(insertTaskQuery, taskValues, (err, result) => {
            if (err) {
                console.error('Error executing task query', err);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }
            console.log('Task inserted successfully:', result.rows[0]);
            const insertSubtaskQuery = 'INSERT INTO Subtasks (task_id, subtask_title, isCompleted) VALUES ($1, $2, $3) RETURNING *';
            const subtaskValues = [result.rows[0].task_id, subtask_title, false];
            connection.query(insertSubtaskQuery, subtaskValues, (subtaskErr, subtaskResult) => {
                if (subtaskErr) {
                    console.error('Error executing subtask query', subtaskErr);
                    return res.status(500).json({
                        message: "Database Server Error"
                    });
                }

                console.log('Subtask inserted successfully:', subtaskResult.rows[0]);
                return res.status(201).json({ msg: "Created Successfully" });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Update a board
exports.updateBoard = async (req, res) => {
    try {
        const { name, board_id } = req.body;

        const updateNameQuery = `
            UPDATE Boards
            SET name = '${name}'
            WHERE board_id = ${board_id};`;

        connection.query(updateNameQuery, (queryErr, result) => {
            if (queryErr) {
                console.error('Error executing UPDATE query', queryErr);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log(`Name updated successfully. Rows affected: ${result.affectedRows}`);
            return res.status(200).json({ msg: "Updated Successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Update a column
exports.updateColumn = async (req, res) => {
    try {
        const { name, column_id } = req.body;

        const updateNameQuery = `
            UPDATE Columns
            SET name = '${name}'
            WHERE column_id = ${column_id};`;

        connection.query(updateNameQuery, (queryErr, result) => {
            if (queryErr) {
                console.error('Error executing UPDATE query', queryErr);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log(`Name updated successfully. Rows affected: ${result.affectedRows}`);
            return res.status(200).json({ msg: "Updated Successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { task_id, status, description, isCompleted, subtask_id, title, subtasksTitle } = req.body;

        const updateTaskQuery = `
            UPDATE Tasks
            SET title = '${title}',
            status = '${status}',
            description = '${description}'
            WHERE task_id = ${task_id};`;

        connection.query(updateTaskQuery, (taskQueryErr, taskResult) => {
            if (taskQueryErr) {
                console.error('Error updating task', taskQueryErr);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log(`Task updated successfully. Rows affected: ${taskResult.affectedRows}`);

            const updateSubtaskQuery = `
                UPDATE Subtasks
                SET title = '${subtasksTitle}',
                isCompleted = ${isCompleted}
                WHERE subtask_id = ${subtask_id};`;

            connection.query(updateSubtaskQuery, (subtaskQueryErr, subtaskResult) => {
                if (subtaskQueryErr) {
                    console.error('Error updating subtask', subtaskQueryErr);
                    return res.status(500).json({
                        message: "Database Server Error"
                    });
                }

                console.log(`Subtask updated successfully. Rows affected: ${subtaskResult.affectedRows}`);
                return res.status(200).json({ msg: "Updated Successfully" });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Delete a board
exports.deleteBoard = async (req, res) => {
    try {
        const { board_id } = req.body;
        const deleteBoardQuery = `DELETE FROM Boards WHERE board_id = ${board_id};`;

        connection.query(deleteBoardQuery, (boardQueryErr, boardResult) => {
            if (boardQueryErr) {
                console.error('Error deleting board', boardQueryErr);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log(`Board deleted successfully. Rows affected: ${boardResult.affectedRows}`);
            return res.status(200).json({ msg: "Deleted Successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Delete a column
exports.deleteColumn = async (req, res) => {
    try {
        const { column_id } = req.body;
        const deleteColumnQuery = `DELETE FROM Columns WHERE column_id = ${column_id};`;

        connection.query(deleteColumnQuery, (columnQueryErr, columnResult) => {
            if (columnQueryErr) {
                console.error('Error deleting column', columnQueryErr);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log(`Column deleted successfully. Rows affected: ${columnResult.affectedRows}`);
            return res.status(200).json({ msg: "Deleted Successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { task_id } = req.body;
        const deleteTaskQuery = `DELETE FROM Tasks WHERE task_id = ${task_id};`;

        connection.query(deleteTaskQuery, (taskQueryErr, taskResult) => {
            if (taskQueryErr) {
                console.error('Error deleting task', taskQueryErr);
                return res.status(500).json({
                    message: "Database Server Error"
                });
            }

            console.log(`Task deleted successfully. Rows affected: ${taskResult.affectedRows}`);
            return res.status(200).json({ msg: "Deleted Successfully" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
