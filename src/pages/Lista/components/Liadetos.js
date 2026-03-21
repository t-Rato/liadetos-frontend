import { useState, useEffect } from "react"
import LiadetoDetalhe from "../components/LiadetoDetalhe"
import { apiFetch } from "../../../utils/api"

export default function Liadetos() {
	const [liadetos, setLiadetos] = useState([])
	const [individuos, setIndividuos] = useState([])
	const [pesquisa, setPesquisa] = useState("")
	const [filtroIndividuo, setFiltroIndividuo] = useState("Todos")
	const [porPagina, setPorPagina] = useState(5)
	const [pagina, setPagina] = useState(1)
	const [selecionado, setSelecionado] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchDados = async () => {
			try {
				const [usuariosRes, liadetosRes] = await Promise.all([
					apiFetch("/usuarios"),
					apiFetch("/liadetos")
				])

				const liadetosData = await liadetosRes.json()
				const usuariosData = await usuariosRes.json()

				setLiadetos(Array.isArray(liadetosData) ? liadetosData : [])
				setIndividuos([
					{ id: "Todos", alcunha: "Todos" },
					...(Array.isArray(usuariosData) 
						? usuariosData
							.filter((u) => !u.dadosUsuario?.isOther)
							.map((u) => ({ id: u.id, alcunha: u.dadosUsuario?.alcunha || u.nome })) 
						: []),
					{ id: "Outros", alcunha: "Outros" }
				])
			} catch {
				console.error("Erro ao carregar dados.")
			} finally {
				setLoading(false)
			}
		}
		fetchDados()
	}, [])

	const filtrados = liadetos.filter((l) => {
		const matchPesquisa = l.nome.toLowerCase().includes(pesquisa.toLowerCase())
		const matchIndividuo = 
    		filtroIndividuo === "Todos" || 
    		(filtroIndividuo === "Outros" ? l.autorId === 7 : l.autorId === filtroIndividuo)
		return matchPesquisa && matchIndividuo
	})

	const totalPaginas = Math.ceil(filtrados.length / porPagina)
	const paginados = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina)

	const getPaginas = () => {
		if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1)
		if (pagina <= 4) return [1, 2, 3, 4, 5, '...', totalPaginas]
		if (pagina >= totalPaginas - 3) return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas]
		return [1, '...', pagina - 1, pagina, pagina + 1, '...', totalPaginas]
	}

	const handleFiltro = (valor, setter) => {
		setter(valor)
		setPagina(1)
	}

	return (
		<div className="flex flex-col items-center mt-10 gap-6 px-4 lg:px-20 mb-20">

			{/* Filtros */}
			<div className="flex flex-col lg:flex-row gap-4 w-full items-start lg:items-center lg:justify-between">
				<input
					value={pesquisa}
					onChange={(e) => handleFiltro(e.target.value, setPesquisa)}
					placeholder="Pesquisar liadeto..."
					className="p-3 rounded-2xl border-2 border-black text-black text-base focus:outline-none focus:ring-2 focus:ring-black w-full lg:w-80"
				/>
				<div className="flex flex-row gap-3 items-center w-full lg:w-auto">
					<select
						value={filtroIndividuo}
						onChange={(e) => handleFiltro(e.target.value, setFiltroIndividuo)}
						className="p-3 rounded-2xl border-2 border-black text-black text-base focus:outline-none focus:ring-1 focus:ring-black cursor-pointer flex-1 lg:flex-none"
					>
						{individuos.map((i) => (
							<option key={i.id} value={i.id}>{i.alcunha}</option>
						))}
					</select>
					<select
						value={porPagina}
						onChange={(e) => handleFiltro(Number(e.target.value), setPorPagina)}
						className="p-3 rounded-2xl border-2 border-black text-black text-base focus:outline-none focus:ring-2 focus:ring-black cursor-pointer flex-1 lg:flex-none"
					>
						{[5, 10, 20].map((n) => (
							<option key={n} value={n}>{n} por página</option>
						))}
					</select>
				</div>
			</div>

			<div className="w-full flex flex-col gap-3">

				{/* Cabeçalho — esconde Criador no mobile */}
				<div className="grid grid-cols-3 lg:grid-cols-4 px-4 lg:px-6 text-gray-400 font-semibold text-sm uppercase">
					<p>Nome</p>
					<p>Autor</p>
					<p className="hidden lg:block">Criador</p>
					<p>Data</p>
				</div>

				{loading ? (
					<p className="text-gray-400 text-center py-10">A carregar...</p>
				) : paginados.length === 0 ? (
					<p className="text-gray-400 text-center py-10">Nenhum liadeto encontrado.</p>
				) : (
					paginados.map((l) => (
						<div
							key={l.id}
							onClick={() => setSelecionado(l)}
							className="grid grid-cols-3 lg:grid-cols-4 px-4 lg:px-6 py-4 bg-stone-50 rounded-2xl border-2 border-transparent hover:border-black transition-all duration-200 cursor-pointer shadow-sm items-center"
						>
							<p className="font-semibold text-black text-sm lg:text-base truncate">{l.nome}</p>
							<p className="text-gray-600 text-sm lg:text-base truncate">
								{l.autor?.dadosUsuario?.isOther ? "Outro indivíduo" : l.autor?.dadosUsuario?.alcunha || "Outro indivíduo"}
							</p>
							<p className="text-gray-600 text-sm lg:text-base truncate hidden lg:block">{l.criador?.dadosUsuario?.alcunha || l.criador?.nome}</p>
							<p className="text-gray-400 text-xs lg:text-sm">{new Date(l.criadoEm).toLocaleDateString('pt-PT')}</p>
						</div>
					))
				)}
			</div>

			<div className="flex flex-row gap-2 lg:gap-3 items-center mt-2 text-black flex-wrap justify-center">
				<button
					onClick={() => setPagina((p) => Math.max(p - 1, 1))}
					disabled={pagina === 1}
					className="px-4 lg:px-5 py-2 rounded-full border-2 border-black font-semibold transition-all duration-200 disabled:opacity-30 hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-black"
				>
					←
				</button>
				{getPaginas().map((n, i) => (
					n === '...' ? (
						<p key={`ellipsis-${i}`} className="px-1 lg:px-2 text-gray-400 font-semibold">...</p>
					) : (
						<button
							key={n}
							onClick={() => setPagina(n)}
							className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full font-semibold transition-all duration-200 border-2 text-sm lg:text-base ${pagina === n ? 'bg-black text-white border-black' : 'border-black hover:bg-black hover:text-white'}`}
						>
							{n}
						</button>
					)
				))}
				<button
					onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
					disabled={pagina === totalPaginas || totalPaginas === 0}
					className="px-4 lg:px-5 py-2 rounded-full border-2 border-black font-semibold transition-all duration-200 disabled:opacity-30 hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-black"
				>
					→
				</button>
			</div>

			{selecionado && (
				<LiadetoDetalhe liadeto={selecionado} onClose={() => setSelecionado(null)} />
			)}
		</div>
	)
}