const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const db = require("./db/db-connection.js");
const router = express.Router();

const app = express();

app.use(cors());
app.use(express.json());

// creates an endpoint for the route "/""
app.get("/", (req, res) => {
  res.json({ message: "Hola, from My template ExpressJS with React-Vite" });
});

// create the get request for species
app.get("/api/species", async (req, res) => {
  try {
    const { rows: species } = await db.query("SELECT * FROM species");
    res.send(species);
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// create the get request for list of individuals
app.get("/api/individuals", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        i.id,
        i.nickname,
        i.scientist_name,
        sp.common_name AS species,
        COUNT(s.id) AS sighting_count,
        MIN(s.sighting_time) AS first_sighting,
        MAX(s.sighting_time) AS latest_sighting
      FROM individuals i
      JOIN species sp ON i.species_id = sp.id
      LEFT JOIN sightings s ON s.individual_id = i.id
      GROUP BY i.id, sp.common_name
      ORDER BY i.id;
    `);
    res.json(result.rows);
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// create the get request for list of all sightings
// app.get("/api/sightings", async (req, res) => {
//   try {
//     console.log("hit /api/sightings");
//     console.log("req.query =", req.query);
//     const result = await db.query(`
//       SELECT 
//         s.id, 
//         s.sighting_time, 
//         s.location, 
//         s.is_healthy, 
//         s.sighter_email, 
//         i.nickname 
//       FROM sightings s 
//       JOIN individuals i ON s.individual_id = i.id
//       ORDER BY i.nickname ASC, s.sighting_time DESC
//     `);
//     res.json(result.rows);
//   } catch (e) {
//     return res.status(400).json({ e });
//   }
// });

// create the POST request for individuals
app.post("/api/individuals", async (req, res) => {
  try {
    const { nickname, scientist_name, species_id } = req.body;

    const insertResult = await db.query(
      `INSERT INTO individuals(
                            nickname,
                            species_id,
                            scientist_name
                            ) VALUES($1, $2, $3) RETURNING id`,
      [nickname, species_id, scientist_name]
    );

    res.json(insertResult.rows);
    
  } catch (e) {
    console.log(e);
    return res.status(400).json({e});
  }
});

// create the POST request for sightings
app.post("/api/sightings", async (req, res) => {
  try {
    const { sighting_time, individual_id, location, is_healthy, sighter_email } = req.body;

    const result = await db.query(
      `
      INSERT INTO sightings (sighting_time, individual_id, location, is_healthy, sighter_email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [sighting_time, individual_id, location, Boolean(is_healthy), sighter_email]
    );

    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Failed to create sighting", detail: e.message });
  }
});

// Sightings Search wihtin date range
app.get('/api/sightings', async (req, res) => {
    try{
        const { start, end } = req.query;
        
        const params = [];
        const where = [];

        // start inclusive: >= start::date
        if (start) {
            params.push(start);
            where.push(`s.sighting_time >= $${params.length}::date`);
        }

        // end inclusive: < (end::date + 1 day)
        if (end) {
            params.push(end);
            where.push(`s.sighting_time < ($${params.length}::date + interval '1 day')`);
        }

        const result = await db.query(
        `
            SELECT 
                s.id,
                s.sighting_time,
                s.location,
                s.is_healthy,
                s.sighter_email,
                i.nickname
            FROM sightings s
            JOIN individuals i ON s.individual_id = i.id
            ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
            ORDER BY i.nickname ASC, s.sighting_time DESC
        `,
        params
        );

        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: "Failed to fetch sightings", detail: e.message });
    }

})

// delete request for Sightings
app.delete("/api/sightings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM sightings WHERE id=$1", [id]);
    console.log("From the delete request-url", id);
    res.status(200).end();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

// delete request for Individuals
app.delete("/api/individuals/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM individuals WHERE id=$1", [id]);
    console.log("From the delete request-url", id);
    res.status(200).end();
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
});

// //A put request - Update a student
// app.put("/api/students/:studentId", async (req, res) => {
//   //console.log(req.params);
//   //This will be the id that I want to find in the DB - the student to be updated
//   const studentId = req.params.studentId;
//   const updatedStudent = {
//     id: req.body.id,
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     iscurrent: req.body.is_current
//   };
//   console.log("In the server from the url - the student id", studentId);
//   console.log(
//     "In the server, from the react - the student to be edited",
//     updatedStudent
//   );
//   // UPDATE students SET lastname = "something" WHERE id="16";
//   const query = `UPDATE students SET firstname=$1, lastname=$2, is_current=$3 WHERE id=${studentId} RETURNING *`;
//   const values = [
//     updatedStudent.firstname,
//     updatedStudent.lastname,
//     updatedStudent.iscurrent
//   ];
//   try {
//     const updated = await db.query(query, values);
//     console.log(updated.rows[0]);
//     res.send(updated.rows[0]);
//   } catch (e) {
//     console.log(e);
//     return res.status(400).json({ e });
//   }
// });

module.exports = app;