class WeatherApp {
  constructor() {
    this.initializeElements()
    this.bindEvents()
    this.loadWeather()
  }

  initializeElements() {
    this.cityInput = document.getElementById("cityInput")
    this.searchBtn = document.getElementById("searchBtn")
    this.loading = document.getElementById("loading")
    this.errorMessage = document.getElementById("errorMessage")
    this.currentWeather = document.getElementById("currentWeather")
    this.forecastSection = document.getElementById("forecastSection")
    this.forecastContainer = document.getElementById("forecastContainer")
  }

  bindEvents() {
    this.searchBtn.addEventListener("click", () => this.loadWeather())
    this.cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.loadWeather()
      }
    })
  }

  showLoading() {
    this.loading.style.display = "block"
    this.errorMessage.style.display = "none"
    this.currentWeather.style.display = "none"
    this.forecastSection.style.display = "none"
  }

  hideLoading() {
    this.loading.style.display = "none"
  }

  showError(message) {
    this.errorMessage.textContent = message
    this.errorMessage.style.display = "block"
    this.hideLoading()
  }

  async loadWeather() {
    const city = this.cityInput.value.trim()
    if (!city) {
      this.showError("Please enter a city name")
      return
    }

    this.showLoading()

    try {
      console.log(`[Frontend] Loading weather for: ${city}`)

      const baseUrl = window.location.origin
      console.log(`[Frontend] Making requests to: ${baseUrl}`)

      // Load current weather and forecast in parallel
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${baseUrl}/api/weather/current?city=${encodeURIComponent(city)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        fetch(`${baseUrl}/api/weather/forecast?city=${encodeURIComponent(city)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ])

      console.log(`[Frontend] Current weather response status: ${currentResponse.status}`)
      console.log(`[Frontend] Forecast response status: ${forecastResponse.status}`)

      if (!currentResponse.ok) {
        const errorData = await currentResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Current weather API error: ${currentResponse.status}`)
      }

      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Forecast API error: ${forecastResponse.status}`)
      }
      console.log('currentResponse', currentResponse)

      const currentData = await currentResponse.json()
      const forecastData = await forecastResponse.json()

      console.log(`[Frontend] Successfully loaded weather data for ${currentData.name}`)

      this.displayCurrentWeather(currentData)
      this.displayForecast(forecastData)

      this.hideLoading()
      this.currentWeather.style.display = "block"
      this.forecastSection.style.display = "block"
    } catch (error) {
      console.error(`[Frontend] Error loading weather:`, error)
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        this.showError("Network error: Please make sure the server is running on localhost:5500")
      } else {
        this.showError(error.message || "Failed to load weather data")
      }
    }
  }

  displayCurrentWeather(data) {
    document.getElementById("currentLocation").textContent = `${data.name}, ${data.sys.country}`
    document.getElementById("currentTemp").textContent = `${Math.round(data.main.temp)}°C`
    document.getElementById("currentIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    document.getElementById("currentDescription").textContent = data.weather[0].description
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`
    document.getElementById("humidity").textContent = `${data.main.humidity}%`
    document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`
    document.getElementById("visibility").textContent = `${(data.visibility / 1000).toFixed(1)} km`
    document.getElementById("sunrise").textContent = this.formatTime(data.sys.sunrise)
    document.getElementById("sunset").textContent = this.formatTime(data.sys.sunset)
  }

  displayForecast(data) {
    this.forecastContainer.innerHTML = ""

    // Group forecast data by day (take one forecast per day)
    const dailyForecasts = this.groupForecastByDay(data.list)

    dailyForecasts.slice(0, 5).forEach((forecast) => {
      const forecastCard = this.createForecastCard(forecast)
      this.forecastContainer.appendChild(forecastCard)
    })
  }

  groupForecastByDay(forecasts) {
    const grouped = {}

    forecasts.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000)
      const dateKey = date.toDateString()

      if (!grouped[dateKey]) {
        grouped[dateKey] = forecast
      }
    })

    return Object.values(grouped)
  }

  createForecastCard(forecast) {
    const card = document.createElement("div")
    card.className = "forecast-card"

    const date = new Date(forecast.dt * 1000)
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    card.innerHTML = `
            <div class="forecast-date">${dayName}<br>${dateStr}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
            </div>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-description">${forecast.weather[0].description}</div>
            <div class="forecast-details">
                Humidity: ${forecast.main.humidity}%<br>
                Wind: ${forecast.wind.speed} m/s
            </div>
        `

    return card
  }

  formatTime(timestamp) {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp()
})
