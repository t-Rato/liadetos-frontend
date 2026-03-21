import { useState, useEffect } from "react"
import { Trophy } from "lucide-react"
import { apiFetch } from "../../../utils/api"

export default function Ranking() {
	const [ranking, setRanking] = useState([])
	const [outrosCount, setOutrosCount] = useState(0)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchRanking = async () => {
			try {
				const [usuariosRes, liadetosRes] = await Promise.all([
					apiFetch("/usuarios"),
					apiFetch("/liadetos")
				])
				const data = await usuariosRes.json()
				const liadetos = await liadetosRes.json()

				const ordenado = Array.isArray(data)
					? [...data].sort((a, b) => (b.dadosUsuario?.aldrabicesDitas || 0) - (a.dadosUsuario?.aldrabicesDitas || 0))
					: []

				setRanking(ordenado)
				setOutrosCount(Array.isArray(liadetos) ? liadetos.filter((l) => l.autorId === null).length : 0)
			} catch {
				console.error("Erro ao carregar ranking.")
			} finally {
				setLoading(false)
			}
		}
		fetchRanking()
	}, [])

	const cores = [
		"bg-yellow-400",
		"bg-gray-400",
		"bg-amber-500",
		"bg-slate-200",
		"bg-slate-200",
		"bg-slate-200",
	]

	const primeiro = ranking[0]
	const segundo = ranking[1]
	const terceiro = ranking[2]

	const podioVisual = [
		segundo ? { ...segundo, posicao: "2º", altura: "h-[175px]", gradiente: "bg-gradient-to-t from-gray-200 to-gray-400", cor: "text-gray-700" } : null,
		primeiro ? { ...primeiro, posicao: "1º", altura: "h-[250px]", gradiente: "bg-gradient-to-t from-yellow-200 to-yellow-400", cor: "text-yellow-700" } : null,
		terceiro ? { ...terceiro, posicao: "3º", altura: "h-[125px]", gradiente: "bg-gradient-to-t from-amber-300 to-amber-500", cor: "text-amber-700" } : null,
	].filter(Boolean)

	return (
		<div className="bg-transparent p-6 lg:p-10 pt-[60px] lg:pt-[100px] flex flex-col gap-6">
			<div className="flex flex-row justify-center items-center gap-3 text-amber-300 mb-4">
				<Trophy className="text-amber-300" size={40} />
				<p className="text-2xl lg:text-4xl font-semibold text-center">Ranking - Mais Aldrabices Ditas</p>
				<Trophy className="text-amber-300" size={40} />
			</div>
			<div className="flex flex-col lg:grid lg:grid-cols-3 lg:px-20 gap-8">
				{/* Tabela */}
				<div className="flex flex-col lg:col-span-1 justify-start items-start gap-2">
					<p className="text-black text-xl font-semibold ml-2 lg:ml-5">Tabela de Classificação</p>
					<div className="flex flex-col w-full gap-2">
						{loading ? (
							<p className="text-gray-400 px-5">A carregar...</p>
						) : (
							<>
								{ranking.map((u, i) => (
									<div key={u.id} className={`${cores[i] || "bg-slate-200"} text-black p-3 px-5 rounded-3xl w-full flex flex-row justify-between items-center`}>
										<span>{i + 1}º - {u.dadosUsuario?.alcunha || u.nome}</span>
										<span className="font-bold">{u.dadosUsuario?.aldrabicesDitas ?? 0}</span>
									</div>
								))}
								<div className="bg-slate-50 text-gray-500 p-3 px-5 rounded-3xl w-full flex flex-row justify-between items-center">
									<span>Outros indivíduos</span>
									<span className="font-bold">{outrosCount}</span>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Pódio */}
				<div className="flex flex-row justify-center items-end lg:col-span-2 mb-10 gap-2 lg:gap-0">
					{loading ? (
						<p className="text-gray-400">A carregar...</p>
					) : (
						podioVisual.map((u) => (
							<div key={u.id} className="flex flex-col items-center lg:flex-none">
								{u.dadosUsuario?.imagemUrl ? (
									<img
										src={`${process.env.REACT_APP_API_URL}${u.dadosUsuario.imagemUrl}`}
										alt={u.dadosUsuario?.alcunha || u.nome}
										className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full object-cover object-center mb-2"
									/>
								) : (
									<div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full bg-black mb-2" />
								)}
								<div className={`${u.gradiente} w-full lg:w-[240px] ${u.altura} flex flex-col text-center justify-start shadow-lg pt-4`}>
									<p className={`${u.cor} text-xl lg:text-2xl font-bold`}>{u.posicao}</p>
									<p className={`${u.cor} text-sm lg:text-xl font-semibold`}>
										{u.dadosUsuario?.alcunha || u.nome}
									</p>
									<p className={`${u.cor} text-xs lg:text-base font-semibold mt-1`}>
										{u.dadosUsuario?.aldrabicesDitas ?? 0}
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}