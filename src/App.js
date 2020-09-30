import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 3480746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
      .then(res => res.json())
      .then(data => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data)
      })
    }
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' 
      ? `https://disease.sh/v3/covid-19/all` 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

      fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4);
      });
  };

  console.log(countryInfo);

  // https://disease.sh/v3/covid-19/all
  // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

  return (
    <>
      <div className="app">
        <div className="app_left">

          <div className="app_header">
            <h1>COVID-19 TRACKER</h1>
            {/* <img src={logo} alt="Logo" /> */}
            <FormControl className="app_dropdown">
              <Select variant="outlined" onChange={onCountryChange} value={country}>
                <MenuItem value="worldwide">WorldWide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="app_stats">
            <InfoBox 
              isRed
              active={casesType === 'cases'}
              onClick={(e) => setCasesType('cases')}
              title="Coronavirus Cases" 
              total={prettyPrintStat(countryInfo.cases)} 
              cases={prettyPrintStat(countryInfo.todayCases)} 
            />
            <InfoBox 
              active={casesType === 'recovered'}
              onClick={(e) => setCasesType('recovered')}
              title="Recovered" 
              total={prettyPrintStat(countryInfo.recovered)} 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
            />
            <InfoBox 
              isRed
              active={casesType === 'deaths'}
              onClick={(e) => setCasesType('deaths')}
              title="Deaths" 
              total={prettyPrintStat(countryInfo.deaths)} 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
            />
          </div>
      
          <Map 
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
            />

      </div>
       
       
        <Card className="app_right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table 
              countries = {tableData}
            /><br/>
            <h3>WorldWide new {casesType}</h3>
            <br/>
            <LineGraph 
              casesType={casesType}
            />
          </CardContent>
        </Card>
      </div>

    </>
  );
}

export default App;


// USEEFFECT : Runs a piece 
// of code based on a given condition

// async -> send a request, wait for it, do something with it