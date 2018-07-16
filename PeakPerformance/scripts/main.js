$(document).ready(function(){
	var activePage = "start";

	// category and subcat slides
	var categorySlides =  $('span.cat-slide').toArray();
	var subcategorySlides =  $('span.subcat-slide').toArray();

	// currentslide was renamed to currentCatSlide for different sliders between cats and subcats
	var currentCatSlide = 0;
	var nextCatSlide = 1;
	var previousCatSlide = 1;

	// subcat version of above
	var currentSubcatSlide = 0;
	var nextSubcatSlide = 1;
	var previousSubcatSlide = 1;

	var category;

	var timerSecond = 10;
	var timerInterval;
	var timerOutput = "10";

	// duh
	var difficulty = "intermediate";
	// these two are just for names sake
	var currentCategory = "";
	var currentSubcategory = "";

	// this represents the subcat chosen by the user
	var currentSubindex;

	// duh
	var currentQuestion, currentQuestionIndex, currentQuestionNumber;

	// this is the list of all subcategories given the category chosen
	var subcategories;

	// all the questions, duh
	var questions =[];
	var questionsBackup = [];
	var backupStored = false;

	var dataList = {
		"History-intermediate": "json/history-intermediate.json",
		"History-senior": "json/history-intermediate.json",
		//"Geography-intermediate": "bruh that don't exist yet lol",
	//	"Geography-senior": "bruh that don't exist yet lol",
		//"Literature-intermediate": "bruh that don't exist yet lol",
		//"Literature-senior": "bruh that don't exist yet lol",
		// uploaded the music intermediate with proper subcategory format right here
		"Music-intermediate": "json/music-intermediate.json",
		"Music-senior": "json/music-senior.json" //Put same file just to test
	};
	var userInput = "";
	var answers;
	var textToDisplay;
	var displayTextInterval;

	// more NEW STUFF
	var questionFinished = false;
	var questionFinishedDisplaying = false;

	// stuff for results screen later
	var correctAnswers = 0;
	var wrongAnswers = 0;
	var outOfTimeAnswers = 0; //This variable wansn't in camelCase (was outofTimeAnswers) SO REPLACE THIS BOI WHERE IT SHOWS UPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

	var toggleContainer = document.getElementById('toggle-container');
	var toggleNumber;

	var timerInterval;

	var prompted = false;
	var guessNumber = 0;

	startAnimation();


	//THIS IS THE TOGGLE BOIZ
	$('.difficulty-select-box').on('click', function(){
		toggleNumber = !toggleNumber;
		if (toggleNumber) {
		    $('.toggle-container').css('clip-path', 'inset(0 0 0 50%)')
		    $('.toggle-container').css('backgroundColor', '#D74046');
		    difficulty = "senior";
		} else {
		    $('.toggle-container').css('clip-path', 'inset(0 50% 0 0)')
		    $('.toggle-container').css('backgroundColor', 'dodgerblue');
		    difficulty = "intermediate";
		}
	})

	$('#about-button').on('click',function(){
		$('#about-button').prop('disabled', true);
		$('#play-button').prop('disabled', true);
		$('#instructions-button').prop('disabled', true);

		$('#start-page').slideUp(700);
		$('#about-page').stop().delay(700).slideDown(700);
		activePage = "about";
	});

	$('#instructions-button').on('click',function(){
		$('#about-button').prop('disabled', true);
		$('#play-button').prop('disabled', true);
		$('#instructions-button').prop('disabled', true);

		$('#start-page').slideUp(700);
		$('#instructions-page').stop().delay(700).slideDown(700);
		activePage = "instructions";
	});

	$('#play-button').on('click',function(){
		$('#about-button').prop('disabled', true);
		$('#play-button').prop('disabled', true);
		$('#instructions-button').prop('disabled', true);

		$('#start-page').slideUp(700);
		$('#category-page').stop().delay(700).slideDown(700);
		activePage = "category";
	});

	$('.back-button').on('click',function(){
		$('#about-button').prop('disabled', false);
		$('#play-button').prop('disabled', false);
		$('#instructions-button').prop('disabled', false);

		switch(activePage){
			case "about":
				$('#about-page').slideUp(700);
				break;
			case "instructions":
				$('#instructions-page').slideUp(700);
				break;
		}
		$('#start-page').stop().delay(700).slideDown(700);
		activePage = "start";
	});

	// renamed variables
	$('#right-cat-arrow').on('click',function(){
		$('#right-cat-arrow').prop('disabled', true);
		$('#left-cat-arrow').prop('disabled', true);

		$(categorySlides[currentCatSlide]).animate({width : 'toggle'}, 700, "easeOutQuart");
		$(categorySlides[nextCatSlide]).stop().delay(700).animate({width : 'toggle'}, 700, "easeOutQuart", function(){
			$('#right-cat-arrow').prop('disabled', false);
			$('#left-cat-arrow').prop('disabled', false);
		});
		currentCatSlide++;
		nextCatSlide++;
		previousCatSlide++;

		catSlideCheck();
	});

	// more renamed variables
	$('#left-cat-arrow').on('click',function(){
		$('#right-cat-arrow').prop('disabled', true);
		$('#left-cat-arrow').prop('disabled', true);

		$(categorySlides[currentCatSlide]).animate({width : 'toggle'}, 700, "easeOutQuart");
		$(categorySlides[previousCatSlide]).stop().delay(700).animate({width : 'toggle'}, 700, "easeOutQuart", function(){
			$('#right-cat-arrow').prop('disabled', false);
			$('#left-cat-arrow').prop('disabled', false);
		});
		currentCatSlide--;
		nextCatSlide--;
		previousCatSlide--;

		catSlideCheck();
	});

	// versions of the above code but for the subcats
	$('#right-subcat-arrow').on('click',function(){
		$('#right-subcat-arrow').prop('disabled', true);
		$('#left-subcat-arrow').prop('disabled', true);

		$(subcategorySlides[currentSubcatSlide]).animate({width : 'toggle'}, 700, "easeOutQuart");
		$(subcategorySlides[nextSubcatSlide]).stop().delay(700).animate({width : 'toggle'}, 700, "easeOutQuart", function(){
			$('#right-subcat-arrow').prop('disabled', false);
			$('#left-subcat-arrow').prop('disabled', false);
		});
		currentSubcatSlide++;
		nextSubcatSlide++;
		previousSubcatSlide++;

		subcatSlideCheck();
	});

	// more of the same
	$('#left-subcat-arrow').on('click',function(){
		$('#right-subcat-arrow').prop('disabled', true);
		$('#left-subcat-arrow').prop('disabled', true);

		$(subcategorySlides[currentSubcatSlide]).animate({width : 'toggle'}, 700, "easeOutQuart");
		$(subcategorySlides[previousSubcatSlide]).stop().delay(700).animate({width : 'toggle'}, 700, "easeOutQuart", function(){
			$('#right-subcat-arrow').prop('disabled', false);
			$('#left-subcat-arrow').prop('disabled', false);
		});
		currentSubcatSlide--;
		nextSubcatSlide--;
		previousSubcatSlide--;

		subcatSlideCheck();
	});

	// When click the all in category button
		$("#every-cat-button").on('click', function() {
			// Go through each subcategory
			subcategories.forEach(function(a) {
				// Add all questions in subcategory to main questions variable
				questions.push.apply(questions, a.questions);
			});

			// Update the category title accordingly
			$("#category-title").append("<strong>");
			$("#category-title").append(currentCategory);
			$("#category-title").append("</strong>");

			// Boot up that question
			loadQuestion();

			// Change to appropriate page
			$('#subcategory-page').slideUp(700);
			//$('#loading-page').slideUp(100);
			$('#game-page').stop().delay(400).slideDown(700, shrinkLogo());
			activePage = "game";
		});

		// When click the main everything button
		$("#every-button").on('click', function() {
			$('#category-page').slideUp(700);
			//$('#loading-page').stop().delay(400).slideDown(700, shrinkLogo());
			//activePage = "loading";

			// Set up counter variable to make sure everything is good
			var itemsProcessed = 0;

			// Go through all the keys in the data list
			Object.keys(dataList).forEach(function(a) {
				// Check that the pack in the datalist is of the selected difficulty
				if (a.slice(a.indexOf('-') + 1) === difficulty) {

					// Fetch the pack
					$.getJSON(dataList[a], function(data) {

						// Add to items processed variable
						itemsProcessed++;

						// Go through all the subcategories in the pack
						data.subcategories.forEach(function(a) {
							// Add all the questions from the subcategory to the main question
							questions.push.apply(questions, a.questions);
						});

						// This if statement will only run if all the all the items that need to be processed have been processed
						// (Note: If we want to a put a loading screen, we can have it so that it loads a screen before the
						// Object.keys(dataList).forEach line and then disable the screen in this if statement
						if (itemsProcessed === Object.keys(dataList).length) {

						// Change category title
						$("#category-title").append("<strong>Everything</strong>");

						// Boot up that question
						loadQuestion();

						// Change pages
						//$('#loading-page').slideUp(50);
						$('#game-page').stop().delay(700).slideDown(700, shrinkLogo());
						activePage = "game";
						}

					});
				// Add one to the items processed anyway
				} else {
					itemsProcessed++;
				}
			});
		});

	// NEW END BUTTON BOIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
	$('#end-button').on('click', function(){
		endGame();
		freeButtons();
		activePage = "results";
	})

	//Currently working on this nono touchy
	$('#again-same-button').on('click', function(){
		$('#again-same-button').prop('disabled', true);
		$('#again-different-button').prop('disabled', true);
		$('#quit-menu-button').prop('disabled', true)
		correctAnswers = 0;
		wrongAnswers = 0;
		outOfTimeAnswers = 0;

		$("#points").text(correctAnswers);


		for (var i = 0; i < questionsBackup.length; i++) {
			questions.push.apply(questions, questionsBackup[i]);
		}
		questionsBackup = [];

		$('#question-text').text("");
		loadQuestion();

		$('#results-page').slideUp(700);
		$('#game-page').stop().delay(700).slideDown(700);

		activePage = "game";
	})

	$('#again-different-button').on('click', function(){
		$('#again-different-button').prop('disabled', true);
		$('#again-same-button').prop('disabled', true)
		$('#quit-menu-button').prop('disabled', true)
		correctAnswers = 0;
		wrongAnswers = 0;
		outOfTimeAnswers = 0;

		$("#points").text(correctAnswers);

		//Reset some stuff for the replay
		$('#category-title').text("");
		$('#subcategory-gallery').empty();
		questions = [];
		questionsBackup = [];

		growLogo();

		$('#results-page').slideUp(700);
		$('#category-page').stop().delay(700).slideDown(700);

		activePage = "category"
	})

	$('#quit-menu-button').on('click', function(){
		$('#again-different-button').prop('disabled', true);
		$('#again-same-button').prop('disabled', true)
		$('#quit-menu-button').prop('disabled', true)
		correctAnswers = 0;
		wrongAnswers = 0;
		outOfTimeAnswers = 0;

		$("#points").text(correctAnswers);

		//Reset some stuff for the replay
		$('#category-title').text("");
		$('#subcategory-gallery').empty();
		questions = [];
		questionsBackup = [];

		growLogo(); 

		$('#results-page').slideUp(700);
		$('#start-page').stop().delay(700).slideDown(700);

		activePage = "start"
	})

	// NEW STUFF
	function loadCategory(cat) {
		// loads the appropriate JSON file according to the datalist and the category
		$.getJSON(dataList[cat]).then(function(data) {
			// makes sure everything works out in console
			console.log(cat + " loaded successfully");

			// makes the subcategories global for later
			subcategories = data.subcategories;

			// don't show the arrows if there aren't more than 4 subcats
			if (subcategories.length < 5) {
				$("#left-subcat-arrow").css("display", "none");
				$("#right-subcat-arrow").css("display", "none");
			}

			$("#everything-subcat-text").text("All in " + currentCategory);

			var appendText = "";

			// for each subcategory...
			subcategories.forEach(function(subcat, subIndex) {
				// set initial slide counter to 1 and text to be appended as an empty string
				var slideCounter = 1;
				
				// at the very beginning always add this
				if (subIndex === 0) {
					appendText += "<span id = 'slide-1' class = 'slide subcat-slide'><span class = 'two-button-group'>";
				}

				// IMPORTANT NOTE: I haven't actually tested it out with more than 2 categories so I don't know if this works, but it should?
				// add the two button group with every 2 buttons
				if (subIndex % 2 === 0 && subIndex !== 0) {
					appendText += "</span><span class = 'two-button-group'>";
				}

				// IMPORTANT NOTE: same here lol
				// add a new slide with every 4 buttons
				if (subIndex % 4 === 0 && subIndex !== 0) {
					// increase slide counter and set up new slide
					slideCounter++;
					appendText += "</span></span><span id = 'slide-";
					appendText += slideCounter.toString();
					appendText += "' class = 'slide subcat-slide'><span class = 'two-button-group'>";
				}

				// add new button...
				appendText += "<button class='button half-button subcat-button' id='sc-";
				// with specific index to be tracked later...
				appendText += subIndex ;
				appendText += "'><h6>";
				// and proper subcat name
				appendText += subcat.subcategory;
				appendText += "</h6></button>";

				if (subIndex % 2 !== 0) {
					appendText += "<div></div>";
				}

				// if it's the last one, wrap it all up
				if (subIndex === subcategories.length-1) {
					appendText += "</span></span>";
				}

				// add everything
				
			});

			$('#subcategory-gallery').append(appendText);
			

			// now that everything's loaded (i think), reset the subcat slide array
			subcategorySlides =  $('span.subcat-slide').toArray();

			// away goes category page, here comes subcat page
			//$('#loading-page').slideUp(100);
			$('#subcategory-page').stop().slideDown(700);
			activePage = "subcategory";

			// finally, allow the subcats to be clicked
			// (NOTE: this is wrapped in a function and placed here because if it wasn't,
			//  the subcats wouldn't have been loaded yet and the jquery selectors would get confused)
			subcat();

		// let person known if it messed up
		}).fail(function(jqxhr, textstatus, error) {
			// Tell the person to try something else
			alert("Sorry! The '" + currentCategory + "' category does not exist yet. PeakPerformance is a work in progress.\n\nMaybe try another category?");

			// Go back to category page
			//$('#loading-page').slideUp(50);
			$('#category-page').stop().slideDown(100);
			activePage = "category";

			// Reenable the category buttons
			$(".cat-button").prop('disabled', false);

			// Log that stuff to the console
			console.log(cat + " failed to load properly");
			console.log(error);
		});
	}

	// surprisingly no changes here
	function loadQuestion() {
		if(questions.length != 0){
		// reset timer
		timerOutput = 10;
		timerSecond = 10;

		//reset prompt variable
		prompted = false;
		guessNumber = 0;

		$('#timer').text(timerSecond);
		$("#timer-bar").css("width", "0px");

		// reset the stuff in the input box
		$("#answer-input").val("");

		// go back to false
		questionFinished = false;
		questionFinishedDisplaying = false;

		// updates question number
		currentQuestionNumber++;
		//$("#actual-question-number").text(currentQuestionNumber);

		// reset the question text
		$("#question-text").text("");

		// selects and displays random question, saving answers variable
		currentQuestionIndex = Math.floor(Math.random() * questions.length);
		currentQuestion = questions[currentQuestionIndex].question;
		answers = questions[currentQuestionIndex].answer;

		displayText(currentQuestion, 250);

		// remove current question from list of viable questions
		questionsBackup.push(questions.splice(currentQuestionIndex, 1));

		// make user input disabled at beginning
		$("#answer-input").attr("disabled", "disabled");
		$("#answer-input").css("user-select", "none");


		$('#rw-text').text("...");
		}else{
			$('#question-text').text("Out Of Questions! Click The 'End Game' Button To See Your Results!")
		}
	}

	function checkAnswer(guess){ 
		var right = false;

		//removes unnecessary characters from guess
		var cleanGuess = guess
			.toLowerCase()
			.replace(/([\{\}\[\]\;\-\:\,\&\(\)\/])/g, " $1 ") // wrap all the special delimiting symbols		
			.replace(/'|"/g, '') // the apostrophes and quotes are useless
			.replace(/\./g, ' ') // remove periods because they're kind of useless
			.replace(/\ +/g, ' ') // condense multiple spaces
			.trim(); // removing leading and trailing spaces

		// use library to create FuzzySet data-structure of answers
		var fuzzAnswers = FuzzySet(answers);

		if (/^\d+$/.test(cleanGuess)) {
			if (cleanGuess !== answers[0]) {
				right = false;
			}
		} else {
			if(fuzzAnswers.get(cleanGuess)){
				
				// Check that the similarity between the cleaned guess and the closest possible answer is more than 85%
				if (fuzzAnswers.get(cleanGuess)[0][0] >= 0.85) {
					right = true;
				} else if (fuzzAnswers.get(cleanGuess)[0][0] >= 0.6 && fuzzAnswers.get(cleanGuess)[0][0] < 0.85 && prompted === false){
					questionFinished = false;
					prompt();
				}
			}
		}

		return right;
	}

	function prompt(){
		prompted = true;
		timerOutput = 10;
		timerSecond = 10;

		clearInterval(timerInterval);
		clearInterval(displayTextInterval);

		$("#answer-input").removeAttr("disabled");
		$("#answer-input").css("user-select", "auto");
		$("#answer-input").focus();

		$('#timer').text(timerSecond);
		$("#timer-bar").stop();
		$("#timer-bar").css("width", "0px");

		startTimer();
	}

	// copy-pasted with very few changes
	function displayText(text, time) {
		textToDisplay = text.split(' ');
		displayTextInterval = setInterval(function() {
			var word = textToDisplay.shift();
			if (word === undefined || word == '') {
				// change question finished variable
				questionFinishedDisplaying = true;
				startTimer();

				// reenable the input and focus that stuff
				$("#answer-input").removeAttr("disabled");
				$("#answer-input").removeAttr("style");
				$("#answer-input").focus();

				return clearInterval(displayTextInterval);
			} else {
				var timeAmount = 0;

				if (word[0] == '"' || word[0] == "'") {
					timeAmount += 150;
				}

				if (word[word.length-1] == ',') {
					timeAmount += 150;
				} else if (word[word.length-1] == '.') {
					timeAmount += 250;
				}

				if (!isNaN(parseInt(word))) {
					if (parseInt(word) >= 1000) {
						timeAmount += 800;
					} else if (parseInt(word) >= 100) {
						timeAmount += 600;
					}
				}

				if (word.length >= 13) {
					timeAmount += 500;
				} else if (word.length >= 10) {
					timeAmount += 400;
				} else if (word.length >= 7) {
					timeAmount += 300;
				} else if (word.length >= 5) {
					timeAmount += 200;
				} else {
					timeAmount += 100;
				}


				clearInterval(displayTextInterval);
				displayText(textToDisplay.join(' '), timeAmount);
			}

			$("#question-text").append(word + ' ');
		}, time);
	}

	$('.cat-button').on('click',function(){
		$(".cat-button").prop('disabled', true);

		// show loading screen (note: changed to 100 because loading stays on too long otherwise)
		$('#category-page').slideUp(700);
		//$('#loading-page').stop().delay(300).slideDown(100);
		//activePage = "loading";

		currentCategory = $(this).text().trim();
		loadCategory(currentCategory + "-" + difficulty);
	});

	// handling subcategory
	function subcat() {
		$('.subcat-button').on('click',function(){
			$('.subcat-button').prop('disabled', true);
			// Get the subcat id from the button
			currentSubIndex = parseInt(($(this).attr("id")).substring(3));

			// Set down the right questions
			questions = subcategories[currentSubIndex].questions;

			// Update the category / subcat title
			$("#category-title").append("<strong>");
			$("#category-title").append(currentCategory);
			$("#category-title").append("</strong>: ");
			$("#category-title").append(subcategories[currentSubIndex].subcategory);

			// Boot up that question
			loadQuestion();

			$('#subcategory-page').slideUp(700);
			$('#game-page').stop().delay(700).slideDown(700, shrinkLogo());
			activePage = "game";
		});
	}

	// check when stuff happens to the body
	$("body").on("keyup", function(e) {

		// if the user hits the "n" button when it's finished, it goes to the "n"ext question
		if (e.keyCode == 78 && questionFinished) {
			loadQuestion();
		// if the user hits the spacebar before it's finished displaying
		} else if (e.keyCode == 32 && !questionFinishedDisplaying) {
			// stop from displaying any more text
			clearInterval(displayTextInterval);
			questionFinishedDisplaying = true;

			// start timer early
			startTimer();

			// reenable input and focus that stuff
			$("#answer-input").removeAttr("disabled");
			$("#answer-input").css("user-select", "auto");
			$("#answer-input").focus();

		}
	});

	// when the user anything in the user input...
	$("#answer-input").on('keyup', function (e) {
		// if the thing they pressed was the enter button...
	    if (e.keyCode == 13) {
	    	guessNumber++;

	    	// stop the timer
	   		clearInterval(timerInterval);
	   		$('#timer-bar').stop();

	   		$("#answer-input").attr("disabled", "disabled");
			$("#answer-input").css("user-select", "none");
			
			if(prompted == true){
	   			questionFinished = true;
	   		}

	   		var right = checkAnswer($("#answer-input").val());
	   		outputVerdict();
	    }
	});

	function outputVerdict(){
		if (prompted == false){
			questionFinished = true;
		}

		if(guessNumber == 1 && prompted == true){
			$('#rw-text').text("PROMPT!")
		}else{
			//Output whole question in case they buzzed early
			$('#question-text').text(currentQuestion);

			if(checkAnswer($("#answer-input").val())) {
		   			correctAnswers++;
		   			// NEW STUFF: Update points
		   			$("#points").text(correctAnswers*10);
		   			$("#rw-text").text("Correct!");
		   		} else {
		   			wrongAnswers++;
		   			$("#rw-text").text("Wrong!");
		   		}

		   	$('#rw-text').append(" Answer: " + answers[0]);
	   }
	}

	// More renamed stuff
	function catSlideCheck(){
		if(previousCatSlide >= categorySlides.length){
			previousCatSlide = 0;
		} else if(previousCatSlide < 0){
			previousCatSlide = categorySlides.length - 1;
		}

		if(nextCatSlide >= categorySlides.length){
			nextCatSlide = 0;
		} else if(nextCatSlide < 0){
			nextCatSlide = categorySlides.length - 1;
		}

		if(currentCatSlide >= categorySlides.length){
			currentCatSlide = 0;
		} else if(currentCatSlide < 0){
			currentCatSlide = categorySlides.length - 1;
		}
	}

	// Even more renamed stuff
	function subcatSlideCheck(){
		if(previousSubcatSlide >= subcategorySlides.length){
			previousSubcatSlide = 0;
		} else if(previousSubcatSlide < 0){
			previousCatSlide = subcategorySlides.length - 1;
		}

		if(nextSubcatSlide >= subcategorySlides.length){
			nextSubcatSlide = 0;
		} else if(nextSubcatSlide < 0){
			nextSubcatSlide = subcategorySlides.length - 1;
		}

		if(currentSubcatSlide >= subcategorySlides.length){
			currentSubcatSlide = 0;
		} else if(currentSubcatSlide < 0){
			currentSubcatSlide = subcategorySlides.length - 1;
		}
	}

	function startAnimation(){
		$('#main-logo').animate({bottom: '130px'}, 1500, "easeOutExpo");

		$('#play-button').stop().delay(500).animate({opacity: '1'},1000);
		$('#instructions-button').stop().delay(1000).animate({opacity: '1'},1000);
		$('#about-button').stop().delay(1500).animate({opacity: '1'},1000);

		$('#tagline').stop().delay(2000).animate({left: '0px'},1000, "easeOutQuart");
	}

	function shrinkLogo(){
		$('#main-logo').animate({'max-height': '200px', bottom: '70px', 'margin-bottom': '-40px' }, 1000);
	}

	//THIS IS NEW, DON'T THINK IT'S IN USE YET BUT WILL BE LATER BOIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
	function growLogo(){
		$('#main-logo').animate({'max-height': '375px', bottom: '130px', 'margin-bottom': '-130px' }, 1000);
	}

	function timerRun(){
		timerSecond--;
		timerOutput = timerSecond;
		$('#timer').text(timerOutput);

		if(timerSecond <= 0){
			clearInterval(timerInterval);

			timerOutput = 10;
			timerSecond = 10;
			guessNumber++;

			// NEW STUFF
			// set the question finished variables to true
			questionFinished = true;

			$("#answer-input").attr("disabled", "disabled");
			$("#answer-input").css("user-select", "none");

			if(checkAnswer($("#answer-input").val()) == false){
				outOfTimeAnswers++;
			}

			outputVerdict();
		}
	}

	function startTimer(){
		$('#timer-bar').animate({'width' : '150px'}, 10000, "linear");
		timerInterval = setInterval(timerRun, 1000);
	}

	function endGame(){
		$('#game-page').slideUp(700);
		$('#results-page').stop().delay(700).slideDown(700);

		//Output results
		$('#results-right h2').text("Right: " + correctAnswers);
		$('#results-wrong h2').text("Wrong: " + wrongAnswers);
		$('#results-late h2').text("Out of Time: " + outOfTimeAnswers);
		$('#results-points h1').text("Points: " + (correctAnswers*10));

		//Reset timer in case it hasn't already
		clearInterval(timerInterval);
		timerInterval = 0;
		clearInterval(0);
	   	$('#timer-bar').stop();

	   	clearInterval(displayTextInterval);
		questionFinishedDisplaying = true;

	   	questionFinished = true;

		activePage = "results";
	}


	//Real name is freeBobby()
	function freeButtons(){
		$('.cat-button').prop('disabled', false);
		$('.subcat-button').prop('disabled', false);
		$('#again-same-button').prop('disabled', false);
		$('#again-different-button').prop('disabled', false);
		$('#quit-menu-button').prop('disabled', false);
		$('#instructions-button').prop('disabled', false);
		$('#about-button').prop('disabled', false);
		$('#play-button').prop('disabled', false);
	}
});