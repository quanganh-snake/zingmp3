import config from "../../Configs/Configs.json";
import endpoint from "../../Configs/Endpoints.json";

const { SERVER_API } = config;

export default function useClient(serverApi = null) {
	// Nếu serverApi không được truyền đối số => mặc định lấy SERVER_API trong Configs
	serverApi = serverApi ?? SERVER_API;

	const client = {
		...endpoint,

		callApi: async function (url, method, params = {}, body = {}, token = null) {
			if (Object.keys(params).length) {
				const queryString = new URLSearchParams(params).toString();
				url = url + "?" + queryString;
			}

			url = serverApi + url;

			const headers = {
				"Content-Type": "application/json",
			};

			if (token !== null) {
				headers["Authorization"] = `Bearer ${token}`;
			}

			const options = {
				method: method,
				headers: headers,
			};

			if (Object.keys(body).length) {
				options.body = JSON.stringify(body);
			}

			const res = await fetch(url, options);
			const data = await res.json();

			if (res.status === 404) {
				window.location.href = "/404";
			}

			return {
				response: res,
				data: data,
			};
		},

		get: function (url, params = {}, token = null) {
			return this.callApi(url, "GET", params, {}, token);
		},

		post: function (url, body, params, token = null) {
			return this.callApi(url, "POST", params, body, token);
		},

		put: function (url, body, params, token = null) {
			return this.callApi(url, "PUT", params, body, token);
		},

		patch: function (url, body, params, token = null) {
			return this.callApi(url, "PATCH", params, body, token);
		},

		delete: function (url, params, token = null) {
			return this.callApi(url, "DELETE", params, {}, token);
		},
	};

	return client;
}
