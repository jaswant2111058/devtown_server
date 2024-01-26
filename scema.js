const board_details = {
    user_id:String,
    boards: [
        {
            "board_id": 0,
            "name": "Platform Launch",
            "columns": [
                {
                    "id": 0,
                    "name": "Todo",
                    "tasks": [
                        {
                            "id": 0,
                            "title": "Build UI for onboarding flow",
                            "description": "",
                            "subtasks": [
                                {
                                    "title": "Sign up page",
                                    "isCompleted": true
                                },
                            ],
                            "status": "Todo"
                        },

                    ]
                },
            ]
        },
    ]
}

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6679802',
  database: 'sql6679802',
  password: 'bNcBXkMabT'
});
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the SQL db');
})

module.exports = connection;