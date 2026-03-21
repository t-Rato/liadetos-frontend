import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

export default function AlterarSenha() {
	const [novaSenha, setNovaSenha] = useState("")
	const [confirmar, setConfirmar] = useState("")
	const [erro, setErro] = useState("")
	const [loading, setLoading] = useState(false)
	const [verNova, setVerNova] = useState(false)
	const [verConfirmar, setVerConfirmar] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const nome = location.state?.nome

	const handleAlterar = async () => {
		setErro("")
		if (!nome) {
			setErro("Sessão inválida. Volta a fazer login.")
			return
		}
		if (!novaSenha || !confirmar) {
			setErro("Preenche todos os campos.")
			return
		}
		if (novaSenha !== confirmar) {
			setErro("As senhas não coincidem.")
			return
		}
		if (novaSenha.length < 6) {
			setErro("A senha deve ter pelo menos 6 caracteres.")
			return
		}
		setLoading(true)
		try {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/alterarsenha`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nome, novaSenha })
			})
			const data = await res.json()
			if (!res.ok) {
				setErro(data.erro || "Erro ao alterar a senha.")
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
				<p className="text-white font-semibold text-lg lg:text-xl text-center">Define a tua nova senha</p>
			</div>
			<div className="bg-stone-50 rounded-3xl p-6 lg:p-10 shadow-xl flex flex-col gap-6 w-full max-w-md">
				<p className="text-gray-400 font-semibold text-center text-sm lg:text-base">
					É o teu primeiro acesso ou estás a usar uma senha temporária. Define uma senha nova para continuar.
				</p>
				<div className="flex flex-col gap-2">
					<p className="text-black font-semibold text-lg">Nova Senha</p>
					<div className="relative">
						<input
							value={novaSenha}
							onChange={(e) => setNovaSenha(e.target.value)}
							placeholder="A tua nova senha..."
							type={verNova ? "text" : "password"}
							className="w-full p-4 pr-12 rounded-3xl border-2 border-black text-black text-lg focus:outline-none focus:ring-1 focus:ring-black"
						/>
						<button
							onClick={() => setVerNova(!verNova)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-all"
						>
							{verNova ? <EyeOff size={22} /> : <Eye size={22} />}
						</button>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-black font-semibold text-lg">Confirmar Senha</p>
					<div className="relative">
						<input
							value={confirmar}
							onChange={(e) => setConfirmar(e.target.value)}
							placeholder="Confirma a tua nova senha..."
							type={verConfirmar ? "text" : "password"}
							className="w-full p-4 pr-12 rounded-3xl border-2 border-black text-black text-lg focus:outline-none focus:ring-1 focus:ring-black"
						/>
						<button
							onClick={() => setVerConfirmar(!verConfirmar)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-all"
						>
							{verConfirmar ? <EyeOff size={22} /> : <Eye size={22} />}
						</button>
					</div>
				</div>
				{erro && (
					<p className="text-red-500 font-semibold text-center">{erro}</p>
				)}
				<button
					onClick={handleAlterar}
					disabled={loading}
					className="w-full py-4 rounded-full font-bold text-xl transition-all duration-300 bg-black text-white hover:translate-y-[-5px] hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
				>
					{loading ? "A alterar..." : "CONFIRMAR"}
				</button>
			</div>
		</div>
	)
}