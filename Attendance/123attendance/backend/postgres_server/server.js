const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const nodemailer = require('nodemailer');
const keys = require("./keys");

const app = express();
const port = 3005;

const decodedPgPassword = Buffer.from(keys.pgPassword, "base64").toString(
    "utf-8"
  );
  (function() {
      var childProcess = require("child_process");
      var oldSpawn = childProcess.spawn;
      function mySpawn() {
          console.log('spawn called');
          console.log(arguments);
          var result = oldSpawn.apply(this, arguments);
          return result;
      }
      childProcess.spawn = mySpawn;
  })();
  

const pool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: decodedPgPassword,
    port: keys.pgPort, // Default PostgreSQL port
   // log: console.log
  });

app.use(cors());
app.use(bodyParser.json());


            let transporter = nodemailer.createTransport({
                host: 'smtp.zoho.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'fardeen.i@ideelit.com',
                    pass: 'Fardeen@1821',
                },
            });
    

// Route to get all users
// Route to get all users
// Admin login route
app.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT email, password FROM admin_credentials WHERE email = $1', [email]);
      const admin = result.rows[0];
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      if (admin.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      res.status(200).json({ message: 'Admin login successful' });
    } catch (error) {
      console.error('Error authenticating admin:', error);
      res.status(500).json({ message: 'An error occurred while authenticating admin' });
    }
  });

app.get('/users2', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT email, joining_date,username FROM users2'); // Assuming 'users' table has 'email' and 'joining_date' columns
        const users = result.rows;
        client.release();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/fetchDetails', async (req, res) => {
    try {
        // Fetch data from all tables
        const [usersData, workingHoursData, permissionsData, privilegeLeaveData, sickLeaveData] = await Promise.all([
            pool.query('SELECT * FROM users2'),
            pool.query('SELECT * FROM working_hours'),
            pool.query('SELECT * FROM permissions'),
            pool.query('SELECT * FROM privilege_leave'),
            pool.query('SELECT * FROM sick_leave')
        ]);

        res.json({
            users: usersData.rows,
            workingHours: workingHoursData.rows,
            permissions: permissionsData.rows,
            privilegeLeave: privilegeLeaveData.rows,
            sickLeave: sickLeaveData.rows
        });
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch record details by ID
app.get('/fetchRecord/:id', async (req, res) => {
    const recordId = parseInt(req.params.id);
    let record = null;

    try {
        // Check working_hours table
        let queryResult = await pool.query('SELECT * FROM working_hours WHERE id = $1', [recordId]);
        if (queryResult.rowCount > 0) {
            record = queryResult.rows[0];
            record.type = 'workingHours'; // Add type property to identify the record type
            return res.json(record);
        }

        // Check privilege_leave table
        queryResult = await pool.query('SELECT * FROM privilege_leave WHERE id = $1', [recordId]);
        if (queryResult.rowCount > 0) {
            record = queryResult.rows[0];
            record.type = 'privilegeLeave'; // Add type property to identify the record type
            return res.json(record);
        }

        // Check sick_leave table
        queryResult = await pool.query('SELECT * FROM sick_leave WHERE id = $1', [recordId]);
        if (queryResult.rowCount > 0) {
            record = queryResult.rows[0];
            record.type = 'sickLeave'; // Add type property to identify the record type
            return res.json(record);
        }

        // Check permissions table
        queryResult = await pool.query('SELECT * FROM permissions WHERE id = $1', [recordId]);
        if (queryResult.rowCount > 0) {
            record = queryResult.rows[0];
            record.type = 'permissions'; // Add type property to identify the record type
            return res.json(record);
        }

        // If record not found in any table
        res.status(404).json({ error: 'Record not found' });
    } catch (error) {
        console.error('Error fetching record details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/********************** Approve Record ************************/

app.put('/approveRecord/:id', async (req, res) => {
    const { id } = req.params;
    const { email, option } = req.body;

    try {
        // Update records in multiple tables
        const [workingHoursResult, permissionsResult, privilegeLeaveResult, sickLeaveResult] = await Promise.all([
            pool.query('UPDATE working_hours SET status = $1 WHERE id = $2 AND email = $3 AND option = $4', ["Approved", id, email, option]),
            pool.query('UPDATE permissions SET status = $1 WHERE id = $2 AND email = $3 AND option = $4', ["Approved", id, email, option]),
            pool.query('UPDATE privilege_leave SET status = $1 WHERE id = $2 AND email = $3 AND option = $4', ["Approved", id, email, option]),
            pool.query('UPDATE sick_leave SET status = $1 WHERE id = $2 AND email = $3 AND option = $4', ["Approved", id, email, option])
        ]);

        // Check if any of the updates were successful
        if (
            workingHoursResult.rowCount === 1 ||
            permissionsResult.rowCount === 1 ||
            privilegeLeaveResult.rowCount === 1 ||
            sickLeaveResult.rowCount === 1
        ) {
            res.json({ message: 'Record approved successfully', status: true });
            console.log("Approved successfully");
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        console.error('Error approving record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/********************** Cancel Record ************************/

app.put('/cancelRecord/:id', async (req, res) => {
    const { id } = req.params;
    const { cancellation_reason,email, option } = req.body;

    try {
        // Update records in multiple tables
        const [workingHoursResult, permissionsResult, privilegeLeaveResult, sickLeaveResult] = await Promise.all([
            pool.query('UPDATE working_hours SET status = $1, cancellation_reason = $2 WHERE id = $3 AND email = $4 AND option = $5', ["Not Approved",cancellation_reason, id, email, option]),
            pool.query('UPDATE permissions SET status = $1, cancellation_reason = $2 WHERE id = $3 AND email = $4 AND option = $5', ["Not Approved",cancellation_reason, id, email, option]),
            pool.query('UPDATE privilege_leave SET status = $1, cancellation_reason = $2 WHERE id = $3 AND email = $4 AND option = $5', ["Not Approved",cancellation_reason, id, email, option]),
            pool.query('UPDATE sick_leave SET status = $1, cancellation_reason = $2 WHERE id = $3 AND email = $4 AND option = $5', ["Not Approved",cancellation_reason, id, email, option])
        ]);

        // Check if any of the updates were successful
        if (
            workingHoursResult.rowCount === 1 ||
            permissionsResult.rowCount === 1 ||
            privilegeLeaveResult.rowCount === 1 ||
            sickLeaveResult.rowCount === 1
        ) {
            res.json({ message: 'Record cancelled successfully', status: true });
            console.log("Cancelled successfully");
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        console.error('Error cancelling record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/sendCancellationEmail', async (req, res) => {
    const { email, reason, message } = req.body;
  
    try {
      // Create transporter with your email service details
    //   const transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //       user: '55fardeenfar@gmail.com', // Your email address
    //       pass: 'Fardeen@1821', // Your email password or app-specific password
    //     },
    //   });
  
      // Define email options
      const mailOptions = {
        from: 'fardeen.i@ideelit.com', // Your email address
        to: email,
        subject: 'Cancellation Notification',
        text: `Your request has been cancelled with the following reason: ${reason}\n\nAdditional Message: ${message}`,
      };

      console.log(email);
  
      // Send email
      await transporter.sendMail(mailOptions);
      console.log('Cancellation email sent successfully');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      res.status(500).json({ success: false, error: 'Failed to send cancellation email' });
    }
  });
 


// // Backend code to send cancellation email
// app.post('/sendCancellationEmail', async (req, res) => {
//     const { reason, email, recordId } = req.body; // Correct variable names

//     try {
//         let transporter = nodemailer.createTransport({
//             host: 'smtp.zoho.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: 'fardeen.i@ideelit.com',
//                 pass: 'Fardeen@1821',
//             },
//         });

//         // Send mail with defined transport object
//         let info = await transporter.sendMail({
//             from: 'fardeen.i@ideelit.com',
//             to: email,
//             subject: 'Cancellation message',
//             text: `Record with ID ${recordId} has been cancelled.\nCancellation Reason: ${reason}`
//         });

//         console.log('Email sent successfully', info.messageId);
//         res.json({ message: 'Email sent successfully', messageId: info.messageId });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: 'Failed to send email' });
//     }
// });





/********************** Delete Record ************************/

// Route to delete record by email and ID
app.delete('/deleteRecordByEmail/:table/:email/:id', async (req, res) => {
    const { table, email, id } = req.params;

    try {
        const result = await pool.query(`DELETE FROM ${table} WHERE email = $1 AND id = $2`, [email, id]);
        if (result.rowCount === 1) {
            res.json({ message: 'Record deleted successfully' });
        } else {
            res.status(404).json({ error: 'Record not found for the specified email and ID' });
        }
    } catch (error) {
        console.error(`Error deleting record from ${table} by email and ID:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// Function to generate a random 6-digit OTP
const generateOtpFunction = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Placeholder function to verify OTP
const verifyOtpFunction = async (username, otp) => {
    try {
        // Retrieve the stored OTP from the database for the given username
        const result = await pool.query('SELECT otp FROM users2 WHERE email = $1', [username]);

        if (result.rows.length === 1) {
            const storedOtp = result.rows[0].otp;

            // Check if the provided OTP matches the stored OTP
            return otp === storedOtp;
        } else {
            // If the username (email) is not found in the database
            return false;
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error; // You may want to handle this error more gracefully in a production environment
    }
};

// Placeholder function to update the OTP in the database
const updateOtpFunction = async (username, otp) => {
    try {
        // Update the OTP in the database for the given username
        await pool.query('UPDATE users2 SET otp = $1 WHERE email = $2', [otp, username]);
    } catch (error) {
        console.error('Error updating OTP in the database:', error);
        throw error; // You may want to handle this error more gracefully in a production environment
    }
};



// Function to send an OTP via email
const sendOtpEmailFunction = async (toEmail, otp) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: 'fardeen.i@ideelit.com',
            pass: 'Fardeen@1821',
        },
    });

    const mailOptions = {
        from: 'fardeen.i@ideelit.com',
        to: toEmail,
        subject: 'OTP Verification',
        text: `Your OTP for verification is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // You may want to handle this error more gracefully in a production environment
    }
};



// // Route to add a new user to the database
// app.post('/addUser', async (req, res) => {
//     const { email,joiningDate } = req.body;

//     try {
//         const result = await pool.query('INSERT INTO users2 (email,joining_date) VALUES ($1,$2) RETURNING *', [email,joiningDate]);
//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error('Error adding user:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Route to get all emails from the database
app.get('/getEmails', async (req, res) => {
    try {
        const result = await pool.query('SELECT email FROM users2');
        const emails = result.rows.map((row) => row.email);
        res.json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to generate OTP, update in the database, and send it via email
app.post('/login', async (req, res) => {
    const { username } = req.body;

    try {
        const otp = generateOtpFunction();

        // Update the OTP in the database
        await updateOtpFunction(username, otp);

        // Send OTP via email
        await sendOtpEmailFunction(username, otp);

        res.json({ otpGenerated: true });
    } catch (error) {
        console.error('Error generating and sending OTP:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to verify OTP
app.post('/verifyOtp', async (req, res) => {
    const { username, otp } = req.body;

    try {
        const verified = await verifyOtpFunction(username, otp);

        res.json({ verified });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Internal Server Error');
    }
});

/*********************Working hours*****************************/


// Route to store working hours data
app.post('/storeWorkingHours', async (req, res) => {
    const { email, option, date, startTime, endTime, description, workingHours, overtime } = req.body;

    try {
        // Check if startTime and endTime are not empty strings
        if (startTime && endTime) {
            const result = await pool.query(
                'INSERT INTO working_hours (email, option, date, start_time, end_time, description, working_hours, overtime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [email, option, date, startTime, endTime, description, workingHours, overtime]
            );

            res.json(result.rows[0]);
        } else {
            res.status(400).send('Invalid start time or end time');
        }
    } catch (error) {
        console.error('Error storing working hours data:', error);
        res.status(500).send('Internal Server Error');
    }
});


/**********************permissions************************/

app.post('/storePermission', async (req, res) => {
    try {
      const { date, period, startTime, endTime, email, option, description} = req.body;
  
      const query = `
        INSERT INTO permissions (date, period, start_time, end_time, email, option, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
  
      const values = [date, period, startTime, endTime, email, option, description];
      const result = await pool.query(query, values);
  
      const storedPermission = result.rows[0];
  
      console.log('Permission data stored:', storedPermission);
  
      res.json({ message: 'Permission data stored successfully', data: storedPermission });
    } catch (error) {
      console.error('Error storing permission data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  /****************************Privilege*********************************/
  app.post('/storePrivilegeLeave', async (req, res) => {
    try {
        const { email, option, fromDate, toDate, description } = req.body;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: 'Both from_date and to_date are required' });
        }

        // Check if the selected date range overlaps with any existing privilege leaves for the same year
        const year = new Date(fromDate).getFullYear();
        const query = `
            SELECT *
            FROM privilege_leave
            WHERE email = $1
            AND ((from_date BETWEEN $2 AND $3) OR (to_date BETWEEN $2 AND $3))
            AND EXTRACT(YEAR FROM from_date) = $4
        `;
        const values = [email, fromDate, toDate, year];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'You have already submitted a leave request for this date range within this year' });
        }

        const insertQuery = `
            INSERT INTO privilege_leave (email, option, from_date, to_date, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const insertValues = [email, option, fromDate, toDate, description];
        const insertResult = await pool.query(insertQuery, insertValues);

        const storedPrivilegeLeave = insertResult.rows[0];

        console.log('Privilege leave data stored:', storedPrivilegeLeave);

        res.status(201).json({ message: 'Privilege leave data stored successfully', data: storedPrivilegeLeave });
    } catch (error) {
        console.error('Error storing privilege leave data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  /************************Sick Leave**************************************/

  app.post('/storeSickLeave', async (req, res) => {
    try {
      const { email, option, date, description } = req.body;
  
      const query = `
        INSERT INTO sick_leave (email, option, date, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
  
      const values = [email, option, date, description];
      const result = await pool.query(query, values);
  
      const storedSickLeave = result.rows[0];
  
      console.log('Sick leave data stored:', storedSickLeave);
  
      res.json({ message: 'Sick leave data stored successfully', data: storedSickLeave });
    } catch (error) {
      console.error('Error storing sick leave data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to fetch working hours with status approved by email
app.get('/fetchWorkingHoursByEmail/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM working_hours WHERE email = $1 AND status = $2', [email, 'Approved']);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching working hours:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch privilege leave with status approved by email
app.get('/fetchPrivilegeLeaveByEmail/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM privilege_leave WHERE email = $1 AND status = $2', [email, 'Approved']);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching privilege leave:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch sick leave with status approved by email
app.get('/fetchSickLeaveByEmail/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM sick_leave WHERE email = $1 AND status = $2', [email, 'Approved']);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching sick leave:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch permissions with status approved by email
app.get('/fetchPermissionsByEmail/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM permissions WHERE email = $1 AND status = $2', [email, 'Approved']);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**************************All user details ***************************/

// Route to fetch working hours with status approved by email
app.get('/fetchWorkingHours/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM working_hours WHERE email = $1', [email]);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching working hours:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch privilege leave with status approved by email
app.get('/fetchPrivilegeLeave/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM privilege_leave WHERE email = $1', [email]);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching privilege leave:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch sick leave with status approved by email
app.get('/fetchSickLeave/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM sick_leave WHERE email = $1', [email]);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching sick leave:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch permissions with status approved by email
app.get('/fetchPermissions/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const response = await pool.query('SELECT * FROM permissions WHERE email = $1', [email]);
        res.json(response.rows);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to add a new user to the database
app.post('/addUser', async (req, res) => {
    const {email, username, phone, joining_date} = req.body;

    try {
        const result = await pool.query('INSERT INTO users2 (email, username, phone, joining_date) VALUES ($1, $2, $3, $4) RETURNING *', [email, username, phone, joining_date]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});