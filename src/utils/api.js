const BASE_URL = `${process.env.REACT_APP_API_URL}/api`

export async function apiFetch(endpoint, options = {}) {
	const token = localStorage.getItem("token")

	const res = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			...options.headers
		}
	})

	if (res.status === 401) {
		localStorage.removeItem("token")
		localStorage.removeItem("usuario")
		window.location.href = "/login"
		return
	}

	return res
}