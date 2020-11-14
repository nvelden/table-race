library(shiny)
#devtools::install_github("rstudio/r2d3")
# install latest version from Github for join() function
library(r2d3)
library(COVID19)
library(tidyr)
library(plyr)
library(dplyr)
library(shinythemes)
library(zoo)

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
              div(id="titleContainer",
              div(id="title",
                  "Covid-19 Table Race", style="margin-bottom: 0px; font-size: 48px;"),
              div(id="iconContainer",
                  actionLink('GitHub', label=NULL, icon = icon("github-square", "fa-2x"), onclick="window.open('https://github.com/nvelden', '_blank')"),
                  actionLink('LinkedIN', label=NULL, icon = icon("linkedin-square","fa-2x"), onclick="window.open('https://linkedin.com/in/nielsva', '_blank')")),
              )),
     fluidRow(width=12, class="inputContainer",
                  div(id="countryInputContainer", style="width: 100%;",
                      selectizeInput("countrySelection", "Country", choices = c(countryNames$country), width="100%",
                                     selected = c("United States", "China", 
                                                  "Germany", "Iran", "Netherlands", 
                                                  "France", "Italy", "Spain", "United Kingdom", 
                                                  "Switzerland"), multiple = TRUE, 
                                     options = list(maxItems = 30)),
                      selectInput("SortSelection", "Sort by", choices = c("Deaths" = "deaths", 
                                                                          "Deaths [7 day]" = "deaths_new_07da", 
                                                                          "Confirmed" = "confirmed", 
                                                                          "Confirmed [7 day]" = "confirmed_new_07da",
                                                                          "Tests" = "tests", 
                                                                          "Tests [7 day]" = "tests_new_07da"), width="20%",
                                    multiple = FALSE, 
                                  ),
                      actionButton("submit", "Submit", class = "btn-success"))
              ),
     fluidRow(width=12, class="inputContainer", style="justify-content: space-between;",
              div(id="dateRange", style="flex-grow: 1; margin-left: 40px;",
              uiOutput("dateRange")),
              uiOutput("dayOutput")
             
     ),
     fluidRow(width=12, class="inputContainer", style="display: flex; flex-direction: column;",
              div(id="tableOutput", style="width: 100%;",
                  d3Output("table"),
              ),
              div(id="citation", 'Source: Guidotti E, Ardia D (2020). COVID-19 Data Hub.', style="color: #ebebeb; font-size: 12px;"),
              div(id="citation", '7 day: Rolling 7-day average.', style="color: #ebebeb; font-size: 12px;")
              )
     )
 
 server <- function(input, output) {
         
     dataInput <- reactive({
           input$submit 
           req(isolate(input$countrySelection))
           data <- covidData(isolate(input$countrySelection), isolate(input$SortSelection))
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
     
     output$dayOutput <- renderUI({
         div(id="dayOutput", style="text-align: center; padding-left: 25px;", h3(format(input$dateSlider, "%d %b"))
         )    
     })
     
     output$table <- renderD3({
         
         if(is.null(dataInput()))
                 return(NULL)
         r2d3(
             data = dataInput(),
             options = list(
                     selColumns = c("rank", "iso_alpha_2", "country", "population", "confirmed", "confirmed_new_07da", "deaths", "deaths_new_07da", "tests", "tests_new_07da"),
                     colNames = c("#", "Flag", "Country", "Population", "Confirmed", "Confirmed [7 Day]", "Deaths", "Deaths [7 day]", "Tests", "Tests [7 day]"),
                     colType = c("text", "text", "text", "text", "bar", "bar", "bar", "bar", "bar"),
                     dateInput = input$dateSlider,
                     sortSel = input$SortSelection
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
