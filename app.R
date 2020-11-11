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
     fluidRow(width=12, id="headerContainer", style="display: flex; margin: 0; padding-left: 19px; padding-right: 19px;",
              div(id="titleIcon", style="padding-top: 10px; padding-right: 10px; margin-bottom: 20px;",
                  icon("fas fa-virus", "fa-6x")),
              div(id="title",
                  "Covid-19 Table Race", style="margin-bottom: 0px; font-size: 48px;",
                  h4("Last Updated:", style="margin-top: 0px; font-style: italic;")),
              ),
     fluidRow(width=12, class="inputContainer",
                  div(id="countryInputContainer", style="width: 100%;",
                      selectizeInput("countrySelection", "Country", choices = c(countryNames$country), width="100%",
                                     selected = c("United States", "China", 
                                                  "Germany", "Iran", "Netherlands", 
                                                  "France", "Italy", "United Kingdom", 
                                                  "Switzerland"), multiple = TRUE, 
                                     options = list(maxItems = 20)),
                      actionButton("submitCountry", "Submit", class = "btn-success"))
              ),
     fluidRow(width=12, class="inputContainer",
              div(id="dateRange", style="width: 80%; margin-left: 40px;",
              uiOutput("dateRange"),     
              )
             
     ),
     fluidRow(width=12, class="inputContainer",
              div(id="tableOutput", style="width: 100%;",
                  d3Output("table"),     
              ))
     
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
