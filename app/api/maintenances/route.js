// Calculate water bill for each flat
maintenanceData.forEach(flat => {
  flat.waterBill = (totalWaterAmount / maintenanceData.length) || 0;
});

const newMaintenance = new Maintenance({

updatedData = await Maintenance.findById(id);
if (updatedData) {
  Object.assign(updatedData, updateData);
  if (updateData.totalWaterAmount !== undefined) {
    const totalWaterAmount = updateData.totalWaterAmount;
    updatedData.maintenanceData.forEach(flat => {
      flat.waterBill = (totalWaterAmount / updatedData.maintenanceData.length) || 0;
    });
  }
  await updatedData.save();
}