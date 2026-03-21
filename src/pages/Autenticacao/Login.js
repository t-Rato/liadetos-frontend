import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
	const [usuario, setUsuario] = useState("")
	const [senha, setSenha] = useState("")
	const [erro, setErro] = useState("")
	const [loading, setLoading] = useState(false)
	const [verSenha, setVerSenha] = useState(false)
	const navigate = useNavigate()

	const handleLogin = async () => {
		setErro("")
		if (!usuario || !senha) {
			setErro("Preenche todos os campos.")
			return
		}
		setLoading(true)
		try {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nome: usuario, senha })
			})
			const data = await res.json()
			if (!res.ok) {
				setErro(data.erro || "Erro ao fazer login.")
				return
			}
			localStorage.setItem("token", data.token)
			localStorage.setItem("usuario", JSON.stringify({ nome: usuario }))
			if (data.primeiroLogin) {
				navigate("/alterarsenha", { state: { nome: usuario } })
				return
			}
			navigate("/")
		} catch {
			setErro("Erro de ligação ao servidor.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className="flex flex-col justify-center items-center min-h-screen gap-8 px-4 lg:px-0"
			style={{ background: 'linear-gradient(to top, #f87171, #fb923c, #facc15)' }}
		>
			<div className="flex flex-col items-center gap-2">
				<p className="text-white text-[50px] lg:text-[80px] font-extrabold">
					LIADETOS
				</p>
			</div>
			<div className="bg-stone-50 rounded-3xl p-6 lg:p-10 shadow-xl flex flex-col gap-6 w-full max-w-md">
				<div className="flex flex-col gap-2">
					<p className="text-black font-semibold text-lg">Utilizador</p>
					<input
						value={usuario}
						onChange={(e) => setUsuario(e.target.value)}
						placeholder="O teu utilizador..."
						type="text"
						className="w-full p-4 rounded-3xl border-2 border-black text-black text-lg focus:outline-none focus:ring-1 focus:ring-black"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-black font-semibold text-lg">Senha</p>
					<div className="relative">
						<input
							value={senha}
							onChange={(e) => setSenha(e.target.value)}
							placeholder="A tua senha..."
							type={verSenha ? "text" : "password"}
							className="w-full p-4 pr-12 rounded-3xl border-2 border-black text-black text-lg focus:outline-none focus:ring-1 focus:ring-black"
						/>
						<button
							onClick={() => setVerSenha(!verSenha)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-all"
						>
							{verSenha ? <EyeOff size={22} /> : <Eye size={22} />}
						</button>
					</div>
				</div>
				{erro && (
					<p className="text-red-500 font-semibold text-center">{erro}</p>
				)}
				<button
					onClick={handleLogin}
					disabled={loading}
					className="w-full py-4 rounded-full font-bold text-xl transition-all duration-300 bg-black text-white hover:translate-y-[-5px] hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
				>
					{loading ? "A entrar..." : "ENTRAR"}
				</button>
			</div>
		</div>
	)
}