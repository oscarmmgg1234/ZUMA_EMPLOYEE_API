const date = require("date-and-time");
const { db_init } = require("./db_init");

const db = db_init();
db.connect();

const check_weekend = (day) => {
  const dayOfWeek = date.format(day, "ddd");
  return dayOfWeek === "Sat" || dayOfWeek === "Sun";
};

const insertShift = async (args, shift_start, shift_end, date_entry) => {
  const query =
    "INSERT INTO shift_log(EMPLOYEE_ID,SHIFT_START,SHIFT_END,SHIFT_DATE) VALUES (?,?,?,?)";
  const date_pattern = date.compile("YYYY-MM-DD");
  db.query(query, [
    args.employee_id,
    shift_start,
    shift_end,
    date.format(date_entry, date_pattern),
  ]);
};

const populate_db = async (args) => {
  const startDate = date.addDays(new Date(), -30);
  const endDate = date.addDays(new Date(), 200);
  let date_entry = new Date(startDate);

  while (date_entry <= endDate) {
    if (check_weekend(date_entry)) {
      const date_pattern = date.compile("YYYY-MM-DD");
      // Handle weekend logic
      const shift_start = date.format(date_entry, "YYYY-MM-DD") + `T8:00:00`;
      db.query(
        "INSERT INTO shift_log(EMPLOYEE_ID,SHIFT_START,SHIFT_END,SHIFT_DATE) VALUES (?,?,?,?)",
        [
          args.employee_id,
          shift_start,
          shift_start,
          date.format(date_entry, date_pattern),
        ]
      );
    } else {
      const dayOfWeek = date.format(date_entry, "ddd");
      if (args.schedule[dayOfWeek.toLowerCase()]) {
        const shiftTimes = args.schedule[dayOfWeek.toLowerCase()];
        const shift_start =
          date.format(date_entry, "YYYY-MM-DD") +
          `T${shiftTimes[0].toString().padStart(2, "0")}:00:00`;
        const shift_end = date.addHours(
          new Date(shift_start),
          shiftTimes[1] - shiftTimes[0]
        );

        insertShift(args, new Date(shift_start), shift_end, date_entry);
      }
    }
    date_entry = date.addDays(date_entry, 1);
  }
};

const main = async (args) => {
  const check_query =
    "SELECT COUNT(*) as entryCount FROM shift_log WHERE EMPLOYEE_ID = ?";
  const delete_query = "DELETE FROM shift_log WHERE EMPLOYEE_ID = ?";

  try {
    db.query(check_query, [args.employee_id], (err, result) => {
      if (err) {
        console.error("Error executing query: ", err);
        return;
      }

      const res = result[0]; // Access the first row
      if (res.entryCount > 0) {
        db.query(delete_query, [args.employee_id], (err) => {
          if (err) {
            console.error("Error deleting records: ", err);
            return;
          }

          setTimeout(() => {
            populate_db(args);
          }, 400);
        });
      } else {
        populate_db(args);
      }
    });
  } catch (err) {
    console.error("Error in main function: ", err);
  }
};

exports.mainPopulate = main;
