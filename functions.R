#Convert data to JSON format
data_to_json <- function(data) {
  jsonlite::toJSON(
    data,
    dataframe = "rows",
    auto_unbox = FALSE,
    rownames = TRUE
  )
}

#Covid data

#countryNames for Id matching
covidDataAll <- covid19()
countryNames <- data.frame(
  id = covidDataAll$iso_alpha_3,
  iso_alpha_2 = covidDataAll$iso_alpha_2,
  country = covidDataAll$administrative_area_level_1,
  stringsAsFactors = FALSE
) %>% unique() 

covidData <- function(selection, rank){
  covidData <- covid19(selection, raw=FALSE, cache = TRUE)
  #Match Country names by ID
  covidData <- left_join(covidData, countryNames) %>% select(., iso_alpha_2, country, date, tests, confirmed, recovered, deaths, population)
  #fill missing values
  covidData <- covidData %>% group_by(country) %>% fill(c(tests, confirmed, recovered, deaths, population))
  
  covidData <- covidData %>% group_by(country) %>% mutate(
    tests_new = tests - lag(tests, default = 0),
    confirmed_new = confirmed - lag(confirmed, default = 0),
    deaths_new = deaths - lag(deaths, default = 0))
  #7 day roling average
  covidData <- covidData %>% arrange(., country, date) %>% group_by(country) %>% 
    mutate(deaths_new_07da = round(rollmean(deaths_new, k = 7, align = "center", fill = NA)),
           confirmed_new_07da = round(rollmean(confirmed_new, k = 7, align = "center", fill = NA)),
           tests_new_07da = round(rollmean(tests_new, k = 7, align = "center", fill = NA)))
  #Filter days where first reported death across selected countries
  firstDeaths <- covidData %>% group_by(country) %>% filter(., !!sym(rank) >= 1) %>% slice(which.min(!!sym(rank)))
  covidData <- covidData %>% filter(., date >= min(firstDeaths$date))
  #Arrange by date and deaths
  covidData <- covidData %>% arrange(., date, desc(!!sym(rank))) %>% ungroup()
  #Add country rank per date
  covidData <- covidData %>% group_by(date) %>% mutate(rank = row_number())
  #Add country flag link
  covidData <- covidData %>% mutate(iso_alpha_2 = sprintf('<img class="countryflag" src="https://www.countryflags.io/%s/flat/16.png">', iso_alpha_2))
  
  #Replace all NA values with 0
  covidData <- covidData %>% replace(is.na(.), 0)
  return(covidData)
}

covidDates <- covidData(c("Switserland", "Belgium", "Netherlands", "USA", "Denmark", "UK"), rank = "deaths") %>% 
  select(., date) %>% unique()
