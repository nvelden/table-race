library(dplyr)

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
  country = covidDataAll$administrative_area_level_1,
  stringsAsFactors = FALSE
) %>% unique() 


covidData <- function(selection){
  
  covidData <- covid19(selection, raw=FALSE)
  #Match Country names by ID
  covidData <- left_join(covidData, countryNames) %>% select(., country, id, date, tests, confirmed, recovered, deaths, population)
  #Filter days where first reported death across selected countries
  firstDeaths <- covidData %>% group_by(country) %>% filter(., deaths == 1) %>% slice(which.min(deaths))
  covidData <- covidData %>% filter(., date >= min(firstDeaths$date))
  #fill missing values
  covidData <- covidData %>% group_by(country) %>% fill(c(tests, confirmed, recovered, deaths, population))
  
  
  #population, recovered cases and deaths per million
  covidData <- covidData %>% mutate(population = round((population / 1000000),2))
  covidData <- covidData %>% mutate(tests_mil = round((tests / population)),
                                    deaths_mil = round((deaths / population)),
                                    confirmed_mil = round((confirmed / population)),
                                    recovered_mil = round((recovered / population))
                                    )
  #new cases, tests, confirmed and deaths per million
  covidData <- covidData %>% mutate(
    tests_new = tests_mil - lag(tests_mil, default = 0),
    confirmed_new = confirmed_mil - lag(confirmed_mil, default = 0),
    deaths_new = deaths_mil - lag(deaths_mil, default = 0))
  #Arrange by date and deaths
  covidData <- covidData %>% arrange(., date, desc(deaths_mil)) %>% ungroup()
  #Add country rank per date
  covidData <- covidData %>% group_by(date) %>% mutate(rank = row_number())
  #Replace all NA values with 0
  covidData <- covidData %>% replace(is.na(.), 0)
  return(covidData)
}
data <- covidData(c("USA", "Switserland"))
data$date[nrow(data)]
covidDates <- covidData(c("Switserland", "Belgium", "Netherlands", "USA", "Denmark", "UK")) %>% 
  select(., date) %>% unique()


