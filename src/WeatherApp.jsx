import { useState, useEffect } from "react"

export const WeatherApp = () => {
    
    const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = '89e9b54b8d2445792128de8c4c53d9bd'
    const difKelvin = 273.15

    const [ciudad, setCiudad] = useState('')
    const [dataClima, setDataClima] = useState(null)
    const [loading, setLoading] = useState(false) // Nuevo estado para la carga
    const [error, setError] = useState(null) // Nuevo estado para los errores
    const [backgroundClass, setBackgroundClass] = useState('default-background') // Nuevo estado para la clase de fondo

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
    // Efecto para cambiar el fondo según el clima
    useEffect(() => {
        if (dataClima) {
            const weatherMain = dataClima.weather[0]?.main.toLowerCase();
            const tempCelsius = parseInt(dataClima.main.temp - difKelvin);

            let newBackgroundClass = 'default-background';

            if (weatherMain.includes('clear')) {
                newBackgroundClass = 'clear-sky-background';
            } else if (weatherMain.includes('clouds')) {
                newBackgroundClass = 'cloudy-background';
            } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
                newBackgroundClass = 'rainy-background';
            } else if (weatherMain.includes('thunderstorm')) {
                newBackgroundClass = 'thunderstorm-background';
            } else if (weatherMain.includes('snow')) {
                newBackgroundClass = 'snowy-background';
            } else if (weatherMain.includes('mist') || weatherMain.includes('haze') || weatherMain.includes('fog')) {
                newBackgroundClass = 'misty-background';
            }

            // También podemos considerar la temperatura para fondos adicionales
            if (tempCelsius > 30) {
                newBackgroundClass = 'hot-background';
            } else if (tempCelsius < 0) {
                newBackgroundClass = 'cold-background';
            }

            setBackgroundClass(newBackgroundClass);
        } else {
            setBackgroundClass('default-background'); // Vuelve al fondo por defecto si no hay datos
        }
    }, [dataClima, difKelvin]);
    return (
        <div className={`container ${backgroundClass}`}> {/* Aplica la clase de fondo aquí */}
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

            {loading && <p>Cargando datos del clima...</p>} {/* Muestra mensaje de carga */}

            {error && <p className="error-message">{error}</p>} {/* Muestra mensaje de error */}
            {
                dataClima && (
                    <div>
                        <h2>
                            {dataClima.name}
                        </h2>
                            <p>Temperatura: {
                            parseInt(dataClima?.main?.temp - difKelvin)}°C 
                            </p>
                            <p>Condicion Meteorologica: {
                            dataClima.weather && dataClima.weather.length > 0 
                                ? dataClima.weather[0].description 
                                : 'No disponible'} {/* Manejo defensivo */} 
                                
                            </p>
                        
                    </div>
                )
            }
        </div>
    )
}


