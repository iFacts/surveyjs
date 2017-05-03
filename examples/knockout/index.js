function init() {
    var consoleLogCallback =
        (survey, options) => {
            console.log(survey);
            console.log(options);
        }

    var json = {
        title: "Product Feedback Survey Example", showProgressBar: "top", pages: [
            {
                questions: [
                    {
                        type: "matrix", name: "Quality", title: "Please indicate if you agree or disagree with the following statements", description: "Test desc",
                        columns: [{ value: 1, text: "Strongly Disagree" },
                        { value: 2, text: "Disagree" },
                        { value: 3, text: "Neutral" },
                        { value: 4, text: "Agree" },
                        { value: 5, text: "Strongly Agree" }],
                        rows: [{ value: "affordable", text: "Product is affordable" },
                        { value: "does what it claims", text: "Product does what it claims" },
                        { value: "better then others", text: "Product is better than other products on the market" },
                        { value: "easy to use", text: "Product is easy to use" }], recommendationsButtonClickCallback: consoleLogCallback
                    },
                    {
                        type: "rating", name: "satisfaction", title: "How satisfied are you with the Product?", description: "Test desc",
                        mininumRateDescription: "Not Satisfied", maximumRateDescription: "Completely satisfied", recommendationsButtonClickCallback: consoleLogCallback
                    },
                    {
                        type: "rating", name: "recommend friends", visibleIf: "{satisfaction} > 3",
                        title: "How likely are you to recommend the Product to a friend or co-worker?", description: "Test desc",
                        mininumRateDescription: "Will not recommend", maximumRateDescription: "I will recommend", recommendationsButtonClickCallback: consoleLogCallback
                    },
                    { type: "comment", name: "suggestions", title: "What would make you more satisfied with the Product?" }
                ]
            },
            {
                questions: [
                    {
                        type: "radiogroup", name: "price to competitors",
                        title: "Compared to our competitors, do you feel the Product is", description: "Test desc",
                        choices: ["Less expensive", "Priced about the same", "More expensive", "Not sure"], recommendationsButtonClickCallback: consoleLogCallback
                    },
                    {
                        type: "radiogroup", name: "price", title: "Do you feel our current price is merited by our product?", description: "Test desc",
                        choices: ["correct|Yes, the price is about right",
                            "low|No, the price is too low for your product",
                            "high|No, the price is too high for your product"], recommendationsButtonClickCallback: consoleLogCallback
                    },
                    {
                        type: "multipletext", name: "pricelimit", title: "What is the... ", description: "Test desc",
                        items: [{ name: "mostamount", title: "Most amount you would every pay for a product like ours" },
                        { name: "leastamount", title: "The least amount you would feel comfortable paying" }], recommendationsButtonClickCallback: consoleLogCallback
                    }
                ]
            },
            {
                questions: [
                    {
                        type: "text", name: "email", description: "Test desc",
                        title: "Thank you for taking our survey. Your survey is almost complete, please enter your email address in the box below if you wish to participate in our drawing, then press the 'Submit' button.", recommendationsButtonClickCallback: consoleLogCallback
                    }
                ]
            }
        ]
    };

    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    Survey.Survey.cssType = "bootstrap";    

    var model = new Survey.Model(json);
	model.recommendationsButtonLabelText = "Test";
    model.onRecommendationsButtonClicked.add(consoleLogCallback);
    model.render("surveyElement");
}

if (!window["%hammerhead%"]) {
    init();
}