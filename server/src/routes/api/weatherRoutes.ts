import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  try {
    const cityName = req.body.cityName;
    WeatherService.getWeatherForCity(cityName).then(data => {
        HistoryService.addCity(cityName);
        res.json(data);
    });
  } catch (error) {
    res.status(500).json(error);
  } 
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    HistoryService.getCities().then(data => res.json(data));
  } catch (error) {
    res.status(500).json(error);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, _res) => {});

export default router;
