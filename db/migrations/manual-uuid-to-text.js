require("dotenv/config");
const { Client } = require("pg");

const dropConstraints = [
  ["dentist_profiles", "dentist_profiles_user_id_users_id_fk"],
  ["session", "session_user_id_users_id_fk"],
  ["account", "account_user_id_users_id_fk"],
  ["patients", "patients_registered_by_users_id_fk"],
  ["next_of_kin", "next_of_kin_patient_id_patients_id_fk"],
  ["appointments", "appointments_patient_id_patients_id_fk"],
  ["appointments", "appointments_dentist_id_dentist_profiles_id_fk"],
  ["appointments", "appointments_booked_by_users_id_fk"],
  [
    "appointment_procedure",
    "appointment_procedure_appointment_id_appointments_id_fk",
  ],
  ["inventory_transactions", "inventory_transactions_item_id_inventory_items_id_fk"],
  ["inventory_transactions", "inventory_transactions_reference_id_appointments_id_fk"],
  ["inventory_transactions", "inventory_transactions_performed_by_users_id_fk"],
  ["notifications", "notifications_appointment_id_appointments_id_fk"],
];

const columnsToCast = [
  ["users", "id"],
  ["dentist_profiles", "id"],
  ["dentist_profiles", "user_id"],
  ["session", "id"],
  ["session", "user_id"],
  ["account", "id"],
  ["account", "user_id"],
  ["verification", "id"],
  ["patients", "id"],
  ["patients", "registered_by"],
  ["next_of_kin", "id"],
  ["next_of_kin", "patient_id"],
  ["appointments", "id"],
  ["appointments", "patient_id"],
  ["appointments", "dentist_id"],
  ["appointments", "booked_by"],
  ["appointment_procedure", "id"],
  ["appointment_procedure", "appointment_id"],
  ["inventory_items", "id"],
  ["inventory_transactions", "id"],
  ["inventory_transactions", "item_id"],
  ["inventory_transactions", "reference_id"],
  ["inventory_transactions", "performed_by"],
  ["notifications", "id"],
  ["notifications", "appointment_id"],
];

const createConstraints = [
  `ALTER TABLE "dentist_profiles" ADD CONSTRAINT "dentist_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`,
  `ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`,
  `ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE`,
  `ALTER TABLE "patients" ADD CONSTRAINT "patients_registered_by_users_id_fk" FOREIGN KEY ("registered_by") REFERENCES "users"("id")`,
  `ALTER TABLE "next_of_kin" ADD CONSTRAINT "next_of_kin_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE`,
  `ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "patients"("id")`,
  `ALTER TABLE "appointments" ADD CONSTRAINT "appointments_dentist_id_dentist_profiles_id_fk" FOREIGN KEY ("dentist_id") REFERENCES "dentist_profiles"("id")`,
  `ALTER TABLE "appointments" ADD CONSTRAINT "appointments_booked_by_users_id_fk" FOREIGN KEY ("booked_by") REFERENCES "users"("id")`,
  `ALTER TABLE "appointment_procedure" ADD CONSTRAINT "appointment_procedure_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id")`,
  `ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id")`,
  `ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_reference_id_appointments_id_fk" FOREIGN KEY ("reference_id") REFERENCES "appointments"("id")`,
  `ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "users"("id")`,
  `ALTER TABLE "notifications" ADD CONSTRAINT "notifications_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id")`,
];

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query("BEGIN");

    for (const [table, constraintName] of dropConstraints) {
      await client.query(
        `ALTER TABLE IF EXISTS "public"."${table}" DROP CONSTRAINT IF EXISTS "${constraintName}"`,
      );
    }

    for (const [table, column] of columnsToCast) {
      await client.query(
        `ALTER TABLE "public"."${table}" ALTER COLUMN "${column}" TYPE text USING "${column}"::text`,
      );
    }

    for (const sql of createConstraints) {
      await client.query(sql);
    }

    await client.query("COMMIT");
    console.log("Manual UUID -> text migration completed.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
