import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: String,
  tokenHash: String,
});
const Device = mongoose.model('Device', deviceSchema);

async function run() {
  await mongoose.connect('mongodb://localhost:27017/agrosense');
  const devices = await Device.find({});
  console.log('Registered Devices:');
  console.log(JSON.stringify(devices, null, 2));
  await mongoose.disconnect();
}
run();
