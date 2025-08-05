import dbConnect from '../lib/dbConnect.js';
import Resident from '../models/Resident.js';
import Devotee from '../models/Devotee.js';

async function migrateResidentsToDevotees() {
  try {
    console.log('🔄 Starting migration: Residents → Devotees (2025)...');

    // Connect to database
    await dbConnect();
    console.log('✅ Database connected');

    // Get all residents
    const residents = await Resident.find({});
    console.log(`📊 Found ${residents.length} residents to migrate`);

    if (residents.length === 0) {
      console.log('⚠️ No residents found to migrate');
      return;
    }

    // Convert residents to devotees with year 2025
    const devoteesToCreate = residents.map((resident) => ({
      flatNo: resident.flatNo,
      gothram: resident.gothram,
      familyMembers: resident.familyMembers,
      kids: resident.kids,
      adults: resident.adults,
      year: 2025, // Set year to 2025
      isApproved: resident.isApproved,
      contribution: resident.contribution,
      pooja: resident.pooja,
      comments: resident.comments,
      addedBy: 'Migration Script'
    }));

    // Check if devotees already exist for 2025
    const existingDevotees = await Devotee.find({ year: 2025 });
    if (existingDevotees.length > 0) {
      console.log(
        `⚠️ Found ${existingDevotees.length} existing devotees for 2025`
      );
      console.log('❌ Migration aborted to prevent duplicate data');
      return;
    }

    // Create devotees
    const createdDevotees = await Devotee.insertMany(devoteesToCreate);
    console.log(
      `✅ Successfully created ${createdDevotees.length} devotees for 2025`
    );

    // Summary
    console.log('\n📋 Migration Summary:');
    console.log(`   • Residents processed: ${residents.length}`);
    console.log(`   • Devotees created: ${createdDevotees.length}`);
    console.log(`   • Year: 2025`);
    console.log(`   • Status: ✅ Complete`);

    console.log('\n🎉 Migration completed successfully!');
    console.log('📝 You can now access the data at: /2025/vinayaka-chavithi');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateResidentsToDevotees()
    .then(() => {
      console.log('🏁 Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

export default migrateResidentsToDevotees;
