import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  bag_tag_id: String,
  scan_time: Date,
  destination_gate: String,
  location: String
},
{timestamps : true});

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;
