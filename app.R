library(shiny)
#devtools::install_github("rstudio/r2d3")
# install latest version from Github for join() function
library(r2d3)
library(COVID19)
library(tidyr)
library(plyr)
library(dplyr)
library(shinythemes)
options(r2d3.shadow = FALSE)

source("functions.R", local = TRUE)

 ui <- fluidPage(
     #Theme
     theme = shinytheme("superhero"),          
     #Stylesheet         
         tags$head(
                 tags$link(rel = "stylesheet", type = "text/css", href = "styles.css")
                 ),
     # Application title
     titlePanel("COVID-19 TableRace"),
 
     # Sidebar with a slider input for number of bins 
     sidebarLayout(
         sidebarPanel(
                 selectizeInput("countrySelection", "Country", choices = c(countryNames$country), 
                                selected = c("United States", "China", 
                                             "Germany", "Iran", "Netherlands", 
                                             "France", "Italy", "United Kingdom", 
                                             "Switzerland"), multiple = TRUE, 
                                options = list(maxItems = 20))
         ),
 
         # Show a plot of the generated distribution
         mainPanel(
                uiOutput("dateRange"),
        
             d3Output("table")
         )
     )
 )
 
 # Define server logic required to draw a histogram
 server <- function(input, output) {
         
     dataInput <- reactive({
           req(input$countrySelection)
           data <- covidData(input$countrySelection)
           return(data)
     })          
 
     output$dateRange <- renderUI({
         sliderInput("dateSlider", 
                     label = NULL, 
                     min=as.Date(dataInput()$date[1]), 
                     max=as.Date(dataInput()$date[nrow(dataInput())]),
                     value=as.Date(dataInput()$date[1]),
                     animate = animationOptions(interval = 100, loop = FALSE),
                     timeFormat="%b %Y"
         )
     })
 
     output$table <- renderD3({
         
         if(is.null(dataInput()))
                 return(NULL)
         r2d3(
             data = dataInput(),
             options = list(
                     colNames = c("country", "tests", "confirmed", "deaths"),
                     dateInput = input$dateSlider 
             ),
             d3_version = c("5"),
             container = 'div',
             css = "www/chartstyles.css",
             script = "www/tableD3.js",
             dependencies = c(
             )
         )
     })
 }
 
# # Run the application 
shinyApp(ui = ui, server = server)
