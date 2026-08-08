require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing from .env");
} else {
  const dbUrl = new URL(process.env.DATABASE_URL);

  console.log("Database host:", dbUrl.hostname);
  console.log("Database name:", dbUrl.pathname);
}

const app = express();
const PORT = 5000;
// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// POSTGRESQL / NEON CONNECTION
// ===============================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL successfully.");
    client.release();
  })
  .catch((error) => {
    console.error(
      "PostgreSQL connection error:",
      error.message
    );
  });

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send(
    "BioTrack Backend with PostgreSQL is running!"
  );
});

// ===============================
// GET ALL SAMPLES
// ===============================

app.get("/api/samples", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        sample_id,
        sample_type,
        analysis_type,
        status,
        researcher,
        notes,
        created_at
      FROM samples
      ORDER BY id ASC
    `);

    const samples = result.rows.map((row) => ({
      dbId: row.id,
      id: row.sample_id,
      type: row.sample_type,
      analysis: row.analysis_type,
      status: row.status,
      researcher: row.researcher,
      notes: row.notes,
      createdAt: row.created_at
    }));

    res.json(samples);

  } catch (error) {
    console.error(
      "GET samples error:",
      error
    );

    res.status(500).json({
      message: "Could not retrieve samples"
    });
  }
});

// ===============================
// POST - ADD SAMPLE
// ===============================

app.post("/api/samples", async (req, res) => {
  const {
    id,
    type,
    analysis,
    status,
    researcher,
    notes
  } = req.body;

  if (!id || !type || !analysis || !status) {
    return res.status(400).json({
      message:
        "Sample ID, sample type, analysis type and status are required."
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO samples
      (
        sample_id,
        sample_type,
        analysis_type,
        status,
        researcher,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        id,
        type,
        analysis,
        status,
        researcher || null,
        notes || null
      ]
    );

    const row = result.rows[0];

    const newSample = {
      dbId: row.id,
      id: row.sample_id,
      type: row.sample_type,
      analysis: row.analysis_type,
      status: row.status,
      researcher: row.researcher,
      notes: row.notes,
      createdAt: row.created_at
    };

    res.status(201).json({
      message: "Sample added successfully",
      sample: newSample
    });

  } catch (error) {
    console.error(
      "POST sample error:",
      error
    );

    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "A sample with this Sample ID already exists."
      });
    }

    res.status(500).json({
      message: "Could not add sample"
    });
  }
});

// ===============================
// PUT - UPDATE SAMPLE
// ===============================

app.put("/api/samples/:id", async (req, res) => {
  const originalSampleId = req.params.id;

  const {
    id,
    type,
    analysis,
    status,
    researcher,
    notes
  } = req.body;

  if (!id || !type || !analysis || !status) {
    return res.status(400).json({
      message:
        "Sample ID, sample type, analysis type and status are required."
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE samples
      SET
        sample_id = $1,
        sample_type = $2,
        analysis_type = $3,
        status = $4,
        researcher = $5,
        notes = $6
      WHERE sample_id = $7
      RETURNING *
      `,
      [
        id,
        type,
        analysis,
        status,
        researcher || null,
        notes || null,
        originalSampleId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Sample not found"
      });
    }

    const row = result.rows[0];

    const updatedSample = {
      dbId: row.id,
      id: row.sample_id,
      type: row.sample_type,
      analysis: row.analysis_type,
      status: row.status,
      researcher: row.researcher,
      notes: row.notes,
      createdAt: row.created_at
    };

    res.json({
      message: "Sample updated successfully",
      sample: updatedSample
    });

  } catch (error) {
    console.error(
      "PUT sample error:",
      error
    );

    if (error.code === "23505") {
      return res.status(409).json({
        message:
          "Another sample already uses this Sample ID."
      });
    }

    res.status(500).json({
      message: "Could not update sample"
    });
  }
});

// ===============================
// DELETE SAMPLE
// ===============================

app.delete("/api/samples/:id", async (req, res) => {
  const sampleId = req.params.id;

  try {
    const result = await pool.query(
      `
      DELETE FROM samples
      WHERE sample_id = $1
      RETURNING *
      `,
      [sampleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Sample not found"
      });
    }

    const row = result.rows[0];

    const deletedSample = {
      dbId: row.id,
      id: row.sample_id,
      type: row.sample_type,
      analysis: row.analysis_type,
      status: row.status,
      researcher: row.researcher,
      notes: row.notes,
      createdAt: row.created_at
    };

    res.json({
      message: "Sample deleted successfully",
      sample: deletedSample
    });

  } catch (error) {
    console.error(
      "DELETE sample error:",
      error
    );

    res.status(500).json({
      message: "Could not delete sample"
    });
  }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(
    `BioTrack backend running on http://localhost:${PORT}`
  );
});