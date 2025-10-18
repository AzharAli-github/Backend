import express from "express"
import path from "path"
import fetch from "node-fetch"
import dotenv from "dotenv"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5500

const OPENWEATHER_API_KEY = "c66f4863eb75da25237fa9b61dc385cf"

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.sendStatus(200)
})

// Serve static files
app.use(express.static("public"))
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// API endpoint for current weather
app.get("/api/weather/current", async (req, res) => {
  try {
    const { city } = req.query
    const apiKey = OPENWEATHER_API_KEY

    console.log(`[Weather API] Fetching current weather for: ${city || "Gilgit,PK"}`)

    if (!apiKey) {
      console.error("[Weather API] API key not configured")
      return res.status(500).json({ error: "API key not configured" })
    }

    const cityQuery = city || "Gilgit,PK"
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${apiKey}&units=metric`
    console.log(`[Weather API] Calling: ${apiUrl.replace(apiKey, "***")}`)

    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error(`[Weather API] OpenWeatherMap API error: ${response.status} ${response.statusText}`)
      throw new Error("Weather data not found")
    }

    const data = await response.json()
    console.log(`[Weather API] Successfully fetched current weather for ${data.name}`)
    res.json(data)
  } catch (error) {
    console.error(`[Weather API] Error fetching current weather:`, error.message)
    res.status(500).json({ error: error.message })
  }
})

// API endpoint for 5-day forecast
app.get("/api/weather/forecast", async (req, res) => {
  try {
    const { city } = req.query
    const apiKey = OPENWEATHER_API_KEY

    console.log(`[Forecast API] Fetching forecast for: ${city || "Gilgit,PK"}`)

    if (!apiKey) {
      console.error("[Forecast API] API key not configured")
      return res.status(500).json({ error: "API key not configured" })
    }

    const cityQuery = city || "Gilgit,PK"
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityQuery}&appid=${apiKey}&units=metric`
    console.log(`[Forecast API] Calling: ${apiUrl.replace(apiKey, "***")}`)

    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error(`[Forecast API] OpenWeatherMap API error: ${response.status} ${response.statusText}`)
      throw new Error("Forecast data not found")
    }

    const data = await response.json()
    console.log(`[Forecast API] Successfully fetched forecast for ${data.city.name}`)
    res.json(data)
  } catch (error) {
    console.error(`[Forecast API] Error fetching forecast:`, error.message)
    res.status(500).json({ error: error.message })
  }
})

// Serve main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Weather app running on http://localhost:${PORT}`)
  console.log(`API Key configured: ${OPENWEATHER_API_KEY ? "Yes" : "No"}`)
})
