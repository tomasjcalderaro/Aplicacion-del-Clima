import { useState } from "react"

export const WheatherApp = () => {
    
    const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = '89e9b54b8d2445792128de8c4c53d9bd'
    const difKelvin = 273.15

    const [ciudad, setCiudad] = useState('')
    const [dataClima, setDataClima] = useState(null)
    const [loading, setLoading] = useState(false) // Nuevo estado para la carga
    const [error, setError] = useState(null) // Nuevo estado para los errores

    const handleCambioCiudad = (e) => {
        setCiudad(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if(ciudad.length === 0){
            setError('Por favor, ingresa una ciudad.')
            setDataClima(null)
            return
            } 
            setError(null)
            fetchClima()
        }
    const fetchClima = async () => {
        setLoading(true) // Iniciar carga
        setError(null) // Limpiar errores previos
        setDataClima(null) // Limpiar datos previos
        try{
            const response = await fetch(`${urlBase}?q=${ciudad}&appid=${API_KEY}`) 
            const data = await response.json()

            if (response.ok) {
                if (data.cod === '404') { // Manejar ciudad no encontrada
                    setError('Ciudad no encontrada. Por favor, verifica el nombre.')
                } else {
                    setDataClima(data)
                }
            } else {
                // Manejar otros errores de respuesta HTTP (ej. 401, 500)
                setError(`Error al obtener datos: ${data.message || response.statusText}`)
            }
            
        }catch(error){ // Manejar errores de red
            console.error('Ocurrio el siguiente error: ', error)
            setError('Ocurrió un error de red. Inténtalo de nuevo más tarde.')
        }finally{
            setLoading(false) // Finalizar carga
        }
    }
    return (
        <div className="container">
            <h1>Aplicacion De Clima</h1>
            <form onSubmit={handleSubmit}>
                <input 
                type="text"
                placeholder="Escriba Aqui"
                value={ciudad}
                onChange={handleCambioCiudad}
                />
                <button type="submit">Buscar</button>
            </form>
            {
                dataClima && (
                    <div>
                        <h2>
                            {dataClima.name}
                            <p>Temperatura: {parseInt(dataClima?.main?.temp - difKelvin)}°C </p>
                            <p>Condicion Meteorologica: {dataClima.weather[0].description} </p>
                        </h2>
                    </div>
                )
            }
        </div>
    )
}


