const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const config = require("./config")[process.env.NODE_ENV || "development"];

const log = config.log();
const service = require('./service')(config);

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(service);
const server = app.listen(process.env.PORT || 3000);

server.on("listening", () => {
	log.info(
		`Hi there! I'm listening on port ${server.address().port} in ${service.get(
			"env"
		)} mode.`
	);
});
