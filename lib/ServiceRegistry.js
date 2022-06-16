const semver = require("semver");

class ServiceRegistry {
	constructor(log) {
		this.log = log;
		this.services = {};
		this.timeout = 300;
	}

	get(name, version) {
		this.cleanup();
		const candidates = Object.values(this.services).filter(
			(service) =>
				service.name === name && semver.satisfies(service.version, version)
		);

		this.log.debug(
			`Returning service ${
				candidates[Math.floor(Math.random() * candidates.length)]
			}`
		);
		return candidates[Math.floor(Math.random() * candidates.length)];
	}

	register(name, version, ip, port, url) {
		this.cleanup();
		const key = name + version + ip + port;

		if (!this.services[key]) {
			this.services[key] = {};
			this.services[key].timestamp = Math.floor(new Date() / 1000);
			this.services[key].ip = ip;
			this.services[key].port = port;
			this.services[key].name = name;
			this.services[key].version = version;
			this.services[key].url = url;
			this.log.debug(`Added services ${url}`);
			return key;
		}
		this.services[key].timestamp = Math.floor(new Date() / 1000);
		this.log.debug(`Updated services ${url}`);
		return key;
	}

	unregister(name, version, ip, port) {
		const key = name + version + ip + port;
		delete this.services[key];
		this.log.debug(
			`Unregistered services ${name}, version ${version} at ${ip}:${port}`
		);
		return key;
	}

	cleanup() {
		const now = Math.floor(new Date() / 1000);
		Object.keys(this.services).forEach((key) => {
			if (this.services[key].timestamp + this.timeout < now) {
				delete this.services[key];
				this.log.debug(`Removed service ${key}`);
			}
		});
	}
}

module.exports = ServiceRegistry;
