export default interface HttpObjectModel<T> {
    codprocesso: string
    ismark: boolean
    totalreg: number
    query: string
    itensperpage: number
    codusuario: string
    consulta: Array<T>
}