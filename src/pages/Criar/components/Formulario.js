import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "../../../utils/api"

export default function Formulario() {
	const [selecionado, setSelecionado] = useState('outro')
	const [aldrabice, setAldrabice] = useState("")
	const [descricao, setDescricao] = useState("")
	const [pessoas, setPessoas] = useState([])
	const [erro, setErro] = useState("")
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchPessoas = async () => {
			try {
				const res = await apiFetch("/usuarios")
				const data = await res.json()
				setPessoas(Array.isArray(data) ? data.filter((p) => !p.dadosUsuario?.isOther) : [])
			} catch {
				setErro("Erro ao carregar utilizadores.")
			}
		}
		fetchPessoas()
	}, [])

	const handleCriar = async () => {
		setErro("")

		if (!selecionado) {
			setErro("Seleciona quem disse a aldrabice.")
			return
		}

		if (!aldrabice) {
			setErro("Escreve a aldrabice.")
			return
		}

		if (!descricao) {
			setErro("Escreve a descrição.")
			return
		}

		setLoading(true)

		try {
			let autorId

			if (selecionado === 'outro') {
				autorId = 9
			} else if (selecionado === 'namelembro') {
				autorId = 10
			} else {
				autorId = selecionado
			}

			const res = await apiFetch("/liadetos", {
				method: "POST",
				body: JSON.stringify({ nome: aldrabice, descricao, autorId: autorId })
			})

			const data = await res.json()

			if (!res.ok) {
				setErro(data.erro || "Erro ao criar liadeto.")
				return
			}

			navigate("/lista")
		} catch {
			setErro("Erro de ligação ao servidor.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col justify-center items-center mt-10 gap-10 lg:gap-16 px-4 lg:px-0">
			<p className="text-2xl lg:text-[40px] text-black font-semibold text-center">QUEM É QUE FOI O ACÉFALO DESTA VEZ?</p>

			<div className="flex flex-row flex-wrap justify-center gap-3 lg:gap-24 items-end w-full">
				{pessoas.map((pessoa) => (
					<div
						key={pessoa.id}
						onClick={() => setSelecionado(pessoa.id)}
						className="flex flex-col items-center cursor-pointer justify-start w-16 lg:w-40 h-24 lg:h-48"
					>
						{pessoa.dadosUsuario?.imagemUrl ? (
							<img
								src={`${process.env.REACT_APP_API_URL}${pessoa.dadosUsuario.imagemUrl}`}
								alt={pessoa.dadosUsuario?.alcunha || pessoa.nome}
								className={`rounded-full object-cover object-center transition-all duration-300 ${selecionado === pessoa.id ? 'w-16 h-16 lg:w-32 lg:h-32 opacity-100 ring-4 ring-offset-2 ring-black mb-3' : 'w-12 h-12 lg:w-24 lg:h-24 opacity-40 hover:opacity-70 mb-2'}`}
							/>
						) : (
							<div className={`rounded-full bg-black transition-all duration-300 ${selecionado === pessoa.id ? 'w-16 h-16 lg:w-32 lg:h-32 opacity-100 ring-4 ring-offset-2 ring-black mb-3' : 'w-12 h-12 lg:w-24 lg:h-24 opacity-40 hover:opacity-70 mb-2'}`} />
						)}
						<p className={`font-semibold transition-all duration-300 text-center text-xs lg:text-base ${selecionado === pessoa.id ? 'text-black' : 'text-gray-400'}`}>
							{pessoa.dadosUsuario?.alcunha || pessoa.nome}
						</p>
					</div>
				))}
			</div>

			<button
				onClick={() => setSelecionado('namelembro')}
				className={`mt-[-20px] px-6 lg:px-8 py-3 rounded-full font-semibold text-base lg:text-lg transition-all duration-300 border-2 ${selecionado === 'namelembro' ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black hover:bg-black hover:text-white hover:translate-y-[-5px] hover:shadow-lg'}`}
			>
				Nam lembro
			</button>

			<button
				onClick={() => setSelecionado('outro')}
				className={`px-6 lg:px-8 py-3 rounded-full font-semibold text-base lg:text-lg transition-all duration-300 border-2 ${selecionado === 'outro' ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black hover:bg-black hover:text-white hover:translate-y-[-5px] hover:shadow-lg'}`}
			>
				Outro indivíduo
			</button>

			<div className="flex flex-col items-center gap-4 w-full">
				<p className="text-2xl lg:text-[40px] text-black font-semibold text-center">QUE ALDRABICE É QUE O INDIVÍDUO DISSE?</p>
				<input
					value={aldrabice}
					onChange={(e) => setAldrabice(e.target.value)}
					placeholder="Escreve aqui a aldrabice..."
					className="w-full p-4 rounded-3xl border-2 border-black text-black text-lg focus:outline-none focus:ring-1 focus:ring-black max-w-2xl"
				/>
			</div>

			<div className="flex flex-col items-center gap-4 w-full">
				<p className="text-2xl lg:text-[40px] text-black font-semibold text-center">O QUE É QUE ESSA ALDRABICE SIGNIFICA?</p>
				<input
					value={descricao}
					onChange={(e) => setDescricao(e.target.value)}
					placeholder="Escreve aqui a descrição..."
					className="w-full p-4 rounded-3xl border-2 border-black text-black text-lg focus:outline-none focus:ring-1 focus:ring-black max-w-2xl"
				/>
			</div>

			{erro && (
				<p className="text-red-500 font-semibold text-center">{erro}</p>
			)}

			<button
				onClick={handleCriar}
				disabled={loading}
				className="px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 bg-black text-white hover:translate-y-[-5px] hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 mb-10"
			>
				{loading ? "A criar..." : "CRIAR LIADETO"}
			</button>
		</div>
	)
}