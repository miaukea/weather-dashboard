// imports
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  timeStamp: Date;

  constructor(
    temperature: number,
    humidity: number,
    description: string,
    windSpeed: number,
    timeStamp: Date
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windSpeed = windSpeed;
    this.timeStamp = timeStamp;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private city: string = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response: Coordinates[] = await fetch(query).then(res => res.json());
      return response[0];
    } catch(error) {
      throw error;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const coordinates: Coordinates = {
      lat: locationData.lat,
      lon: locationData.lon
    }
    return coordinates;
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.city}&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    return await this.fetchLocationData(this.buildGeocodeQuery()).then(data => this.destructureLocationData(data));
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates)).then(res => res.json());
      if (!response || !response.list) {
        throw new Error('Weather data not found.');
      }

      const currentWeather: Weather = this.parseCurrentWeather(response.list[0]);
      const forecast: Weather[] = this.buildForecastArray(currentWeather, response.list);
      return forecast;
    } catch(error) {
      throw error;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.main.humidity,
      response.weather[0].description,
      response.wind.speed,
      new Date(response.dt * 1000)
    );
  }
  // TODO: Complete buildForecastArray method

  private buildForecastArray(currentWeather: Weather, weatherList: any[]) : Weather[] {
    const weatherForecast: Weather[] = [currentWeather];
    const filteredWeatherData = weatherList.filter((data: any) => data.dt_txt.includes('12:00:00'));

    console.log("Weather Data Response:", weatherList);
    console.log("First Entry:", weatherList?.[0]); // Check if it has `dt_txt`

    for (let day of filteredWeatherData) {
      weatherForecast.push(new Weather(
        day.main.temp,
        day.main.humidity,
        day.weather[0].description,
        day.wind.speed,
        new Date(day.dt * 1000)
      ));
    }
    return weatherForecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weather = await this.fetchWeatherData(coordinates);
      return weather;
    } catch(error) {
      throw error;
    }
  }
}

export default new WeatherService();
