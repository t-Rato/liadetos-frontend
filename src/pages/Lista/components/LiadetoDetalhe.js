export default function LiadetoDetalhe({ liadeto, onClose }) {
	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 lg:px-0"
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-white rounded-3xl p-6 lg:p-10 shadow-2xl max-w-lg w-full flex flex-col gap-4"
			>
				<div className="flex flex-row justify-between items-start gap-4">
					<p className="text-xl lg:text-3xl font-bold text-black">{liadeto.nome}</p>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-black transition-all duration-200 text-2xl font-bold shrink-0"
					>
						✕
					</button>
				</div>
				<div className="flex flex-col gap-2 text-gray-600 text-sm lg:text-base">
					<p><span className="font-semibold text-black">Autor:</span> {liadeto.autor?.dadosUsuario?.isOther ? liadeto.autorId === 10 ? "Na me lembro" : "Outro indivíduo" : liadeto.autor?.dadosUsuario?.alcunha || "Outro indivíduo"}</p>
					<p><span className="font-semibold text-black">Criador:</span> {liadeto.criador?.dadosUsuario?.alcunha || liadeto.criador?.nome}</p>
					<p><span className="font-semibold text-black">Data:</span> {new Date(liadeto.criadoEm).toLocaleDateString('pt-PT')}</p>
				</div>
				<div className="bg-stone-50 rounded-2xl p-4 lg:p-5 border-2 border-stone-200">
					<p className="text-gray-700 text-sm lg:text-base">{liadeto.descricao}</p>
				</div>
			</div>
		</div>
	)
}