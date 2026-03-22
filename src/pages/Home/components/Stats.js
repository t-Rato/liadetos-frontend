import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { apiFetch } from "../../../utils/api"

export default function Stats() {
	const [usuario, setUsuario] = useState(null)
	const [ultimaAldrabice, setUltimaAldrabice] = useState(null)
	const [loading, setLoading] = useState(true)

	const statsCard = "col-span-1 flex flex-col justify-start lg:justify-between items-center lg:h-full"
	const titleStatsCard = "text-sm lg:text-3xl font-semibold text-black text-center lg:h-20 flex items-center justify-center"
	const statsStatsCard = "text-[60px] lg:text-[180px] text-black leading-none"

	useEffect(() => {
		const fetchDados = async () => {
			try {
				const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"))
				const [usuariosRes, liadetosRes] = await Promise.all([
					apiFetch("/usuarios"),
					apiFetch("/liadetos")
				])
				const usuarios = await usuariosRes.json()
				const liadetos = await liadetosRes.json()

				const eu = Array.isArray(usuarios)
					? usuarios.filter((u) => !u.dadosUsuario?.isOther).find((u) => u.nome === usuarioGuardado?.nome)
					: null

				if (eu) {
				const ranking = [...usuarios]
					.filter((u) => !u.dadosUsuario?.isOther)
					.sort((a, b) => (b.dadosUsuario?.aldrabicesDitas || 0) - (a.dadosUsuario?.aldrabicesDitas || 0))
					.findIndex((u) => u.id === eu.id) + 1
				setUsuario({ ...eu, ranking })
			}

				const minhasAldrabices = Array.isArray(liadetos)
					? liadetos.filter((l) => l.autorId === eu?.id)
					: []

				if (minhasAldrabices.length > 0) {
					setUltimaAldrabice(minhasAldrabices[0])
				}
			} catch {
				console.error("Erro ao carregar stats.")
			} finally {
				setLoading(false)
			}
		}
		fetchDados()
	}, [])

	return (
		<div className="bg-gradient-to-t from-red-400 via-orange-400 to-yellow-400 h-auto p-4 lg:p-10 pt-[200px] lg:pt-[270px] pb-10 flex flex-col gap-6">
			<div className="flex flex-row justify-start items-center gap-3">
				<User className="text-white" size={32} />
				<p className="text-2xl lg:text-4xl font-semibold">Stats Individuais</p>
			</div>

			<div className="flex flex-col xl:grid xl:grid-cols-4 gap-4 xl:gap-10">
				<div className="bg-stone-50 xl:col-span-1 rounded-3xl p-5 lg:p-7 shadow-lg flex flex-col items-center gap-2">
					{usuario?.dadosUsuario?.imagemUrl ? (
						<img
							src={`${process.env.REACT_APP_API_URL}${usuario.dadosUsuario.imagemUrl}`}
							alt={usuario.dadosUsuario?.alcunha || usuario.nome}
							className="h-40 w-40 lg:h-80 lg:w-80 rounded-full object-cover object-center"
						/>
					) : (
						<div className="h-40 w-40 lg:h-60 lg:w-60 xl:h-80 xl:w-80 bg-black rounded-full" />
					)}
					<p className="text-black font-bold text-xl lg:text-2xl">
						{loading ? "..." : usuario?.dadosUsuario?.alcunha || "—"}
					</p>
					<p className="text-gray-400 font-semibold text-base lg:text-lg">
						{loading ? "..." : usuario?.nome || "—"}
					</p>
				</div>

				<div className="bg-stone-50 lg:col-span-3 flex flex-col gap-4 rounded-3xl p-5 lg:p-7 shadow-lg text-black justify-center">
					<div className="grid grid-cols-3 lg:h-64">
						<div className={statsCard}>
							<p className={titleStatsCard}>Aldrabices Ditas</p>
							<p className={statsStatsCard}>
								{loading ? "..." : usuario?.dadosUsuario?.aldrabicesDitas ?? 0}
							</p>
						</div>
						<div className={statsCard}>
							<p className={titleStatsCard}>Aldrabices Registadas</p>
							<p className={statsStatsCard}>
								{loading ? "..." : usuario?.dadosUsuario?.aldrabicesRegistadas ?? 0}
							</p>
						</div>
						<div className={statsCard}>
							<p className={titleStatsCard}>Classificação</p>
							<p className={statsStatsCard}>
								{loading ? "..." : `${usuario?.ranking ?? "—"}º`}
							</p>
						</div>
					</div>
					<p className="ml-2 lg:ml-5 font-semibold">Última aldrabice dita:</p>
					<div className="bg-slate-200 shadow-md w-full py-3 px-4 lg:px-5 rounded-3xl">
						{loading ? "..." : ultimaAldrabice ? `"${ultimaAldrabice.nome}"` : "Ainda sem aldrabices registadas."}
					</div>
				</div>
			</div>
		</div>
	)
}