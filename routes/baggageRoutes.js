import express from 'express';
import Scan from '../models/Scan.js';

const router = express.Router();


// To POST 
router.post('/scans', async (req, res) => {
  try {
    const { bag_tag_id, scan_time, destination_gate, location } = req.body;

    if (!bag_tag_id || !scan_time || !destination_gate || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newScan = new Scan({
      bag_tag_id,
      scan_time: new Date(scan_time),
      destination_gate,
      location
    });

    await newScan.save();
    res.status(201).json({ message: "Scan inserted successfully", scan: newScan });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Task 1


router.get('/scans/bag/:bag_tag_id', async (req, res) => {
  const { bag_tag_id } = req.params;
  const { latest } = req.query;

  try {
    let query = Scan.find({ bag_tag_id });
    if (latest === 'true') {
      query = query.sort({ scan_time: -1 }).limit(1);
    }
    const result = await query.exec();
    if (!result.length) return res.status(404).json({ message: 'No scan record found' });
    res.json(latest === 'true' ? result[0] : result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 2
router.get('/active/gate/:destination_gate', async (req, res) => {
  const { destination_gate } = req.params;
  const since_minutes = parseInt(req.query.since_minutes) || 10;
  const sinceTime = new Date(Date.now() - since_minutes * 60000);

  try {
    const scans = await Scan.aggregate([
      { $match: { destination_gate, scan_time: { $gte: sinceTime } } },
      { $sort: { scan_time: -1 } },
      {
        $group: {
          _id: "$bag_tag_id",
          last_scan_at: { $first: "$scan_time" },
          last_location: { $first: "$location" }
        }
      },
      {
        $project: {
          bag_tag_id: "$_id",
          last_scan_at: 1,
          last_location: 1,
          _id: 0
        }
      }
    ]);
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 3
router.get('/stats/gate-counts', async (req, res) => {
  const since_minutes = parseInt(req.query.since_minutes) || 10;
  const sinceTime = new Date(Date.now() - since_minutes * 60000);

  try {
    const counts = await Scan.aggregate([
      { $match: { scan_time: { $gte: sinceTime } } },
      {
        $group: {
          _id: { destination_gate: "$destination_gate", bag_tag_id: "$bag_tag_id" }
        }
      },
      {
        $group: {
          _id: "$_id.destination_gate",
          unique_bag_count: { $sum: 1 }
        }
      },
      {
        $project: {
          destination_gate: "$_id",
          unique_bag_count: 1,
          _id: 0
        }
      }
    ]);
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
