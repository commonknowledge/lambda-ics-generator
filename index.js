const Calendar = require("ics");
const moment = require("moment");

exports.handler = (request, context, callback) => {
  var {
    title,
    description,
    start,
    duration,
    organizer,
    location,
    url
  } = request.queryStringParameters;
  var dateArray = `[${moment(start, "h A D MMM").format("YYYY, M, D, H, m")}]`;

  Calendar.createEvent(
    {
      url,
      title,
      description,
      location,
      status: "CONFIRMED",
      organizer: { name: organizer },
      start: JSON.parse(dateArray),
      duration: { minutes: duration || 60 }
    },
    (err, event) => {
      callback(err, {
        isBase64Encoded: false,
        statusCode: err ? "400" : "200",
        headers: {
          "Content-type": "text/calendar",
          "Content-Disposition": `inline; filename="${title}.ics`
        },
        body: err ? err.message : event.toString()
      });
    }
  );
};
