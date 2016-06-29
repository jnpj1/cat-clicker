$(function() {

	var model = {
		init: function() {
			localStorage.cats = JSON.stringify([]);
			var catNames = ["Fluffy", "Mr. Tiddlewinks", "Catimus Maximus", "Bartholomew", "Soul Annihilator"];
			var Cat = function(num) {
				this.clickCounter = 0;
				this.name = catNames[(num - 1)];
				this.img = "images/cutekitten" + num + ".jpg";
			};

			var cat1 = new Cat(1);
			var cat2 = new Cat(2);
			var cat3 = new Cat(3);
			var cat4 = new Cat(4);
			var cat5 = new Cat(5);

			var catArray = [cat1, cat2, cat3, cat4, cat5];

			var data = JSON.parse(localStorage.cats);
			for (var i=0; i < catArray.length; i++) {
				data.push(catArray[i]);
			}
			localStorage.cats = JSON.stringify(data);
			localStorage.currentCat;
		},
		getAllCats: function() {
			return JSON.parse(localStorage.cats);
		},
		clickIncrementor: function(index) {
			var data = JSON.parse(localStorage.cats);
			data[index].clickCounter += 1;
			localStorage.cats = JSON.stringify(data);
		},
		changeCurrentCat: function(number) {
			localStorage.currentCat = number;
		},
		getCurrentCat: function() {
			var currentCat = localStorage.currentCat;
			return currentCat;
		},
		infoUpdater: function(name, image, click) {
			var data = JSON.parse(localStorage.cats);
			data[localStorage.currentCat].name = name;
			data[localStorage.currentCat].img = image;
			data[localStorage.currentCat].clickCounter = click;
			localStorage.cats = JSON.stringify(data);
		}
	};

	var octopus = {
		init: function() {
			model.init();
			view2.init();
			view1.init();
			view3.init();
		},
		getCats: function() {
			return model.getAllCats();
		},
		getSpecificCat: function(index) {
			return model.getAllCats()[index];
		},
		addClick: function(index) {
			model.clickIncrementor(index);
		},
		changeCurrentCat: function(index) {
			model.changeCurrentCat(index);
		},
		getCurrentCat: function() {
			return model.getCurrentCat();
		},
		updateCatInfo: function(name, image, click) {
			model.infoUpdater(name, image, click, localStorage.currentCat);
		}
	};

	var view1 = {
		init: function() {
			this.catList = $(".cats");
			view1.render();
		},
		render: function() {
			this.catList.empty();
			var catListHTML = "";
			octopus.getCats().forEach(function(cat) {
				catListHTML += "<li>" + cat.name + "</li>"
			});
			this.catList.html(catListHTML);

			$("li").click(function() {
				var catIndex = $(this).index();
				octopus.changeCurrentCat(catIndex);
				view2.render();
				view3.render();
			});
		}
	};

	var view2 = {
		init: function() {
			this.catProfile = $(".catProfile");
		},
		render: function() {
			this.catProfile.empty();
			var catProfileHTML = "";
			var currentCatIndex = octopus.getCurrentCat();
			var currentCat = octopus.getSpecificCat(currentCatIndex);
			catProfileHTML = "<h1>" + currentCat.name + "</h1><img src='" +
				currentCat.img + "'>" + "<p>Click Counter: " + currentCat.clickCounter
				+ "</p>";
			this.catProfile.html(catProfileHTML);

			$("img").click(function() {
				var catCounter = $("p");
				octopus.addClick(currentCatIndex);
				var currentCount = octopus.getSpecificCat(currentCatIndex).clickCounter;
				catCounter.text("Click Counter: " + currentCount);
				view3.render();
			});
		}
	};

	// admin component
	var view3 = {
		init: function() {
			this.newInfoForm = $("#newInfo");
			this.adminButton = $("#adminButton");
		},
		render: function() {

			this.adminButton.css({"visibility": "visible"});
			var infoForm = this.newInfoForm;
			var newNameInput = $("#catName");
			var newImageInput = $("#catImage");
			var newCountInput = $("#catCount");

			var currentCatIndex = octopus.getCurrentCat();
			var currentClicks = octopus.getSpecificCat(currentCatIndex).clickCounter;
			var currentName = octopus.getSpecificCat(currentCatIndex).name;
			var currentImageRef = octopus.getSpecificCat(currentCatIndex).img;

			// index of file number in string
			var currentNumberIndex = currentImageRef.search("n");
			var currentImageNumber = Number(currentImageRef.slice((currentNumberIndex + 1), -4));

			newNameInput.val(currentName);
			newImageInput.val(currentImageNumber);
			newCountInput.val(currentClicks);

			this.adminButton.off("click");
			this.adminButton.click(function() {
				infoForm.toggleClass("hidden");
			});

			infoForm.off("click");
			infoForm.submit(function(e) {
				e.preventDefault();
				var updatedClicks = Number(newCountInput.val());
				var updatedName = newNameInput.val();
				var updatedImage = "images/cutekitten" + newImageInput.val() + ".jpg";

				octopus.updateCatInfo(updatedName, updatedImage, updatedClicks);

				infoForm.addClass("hidden");
				view1.render();
				view2.render();
				view3.render();
			});

			var cancelButton = $("#cancel");
			cancelButton.click(function() {
				infoForm.addClass("hidden");
			});
		}
	};

	octopus.init();
});